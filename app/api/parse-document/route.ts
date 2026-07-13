export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import PDFParser from "pdf2json";

let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(20, "1 h"),
    analytics: true,
  });
}

export interface ParsedDocumentResult {
  documentTypeLabel: string;
  pageCount: number;
  fileName: string;
  fileSizeMB: string;
  _internal: {
    extractedText: string;
  };
}

// ─────────────────────────────────────────────────────────────
// FAST PDF EXTRACTION via pdf2json
// ─────────────────────────────────────────────────────────────
async function extractPdfTextFast(buffer: Buffer): Promise<{ text: string; pageCount: number }> {
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new (PDFParser as any)(null, 1); // 1 indicates text extraction mode
      
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        reject(new Error(errData?.parserError || "Failed to parse PDF"));
      });
      
      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        try {
          const text = (pdfParser as any).getRawTextContent();
          const pageCount = pdfData?.Pages?.length || 1;
          resolve({ text, pageCount });
        } catch (e) {
          reject(e);
        }
      });

      pdfParser.parseBuffer(buffer);
    } catch (error) {
      reject(error);
    }
  });
}

// ─────────────────────────────────────────────────────────────
// FAST PPTX EXTRACTION via jszip
// ─────────────────────────────────────────────────────────────
async function extractPptxTextFast(buffer: Buffer): Promise<{ text: string; pageCount: number }> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const JSZip = require("jszip");

  let zip: any;
  try {
    zip = await JSZip.loadAsync(buffer);
  } catch {
    throw new Error("Could not open the PowerPoint file. Make sure it is a valid .pptx file.");
  }

  const slideKeys: string[] = Object.keys(zip.files).filter((name: string) =>
    /^ppt\/slides\/slide\d+\.xml$/i.test(name)
  );

  if (slideKeys.length === 0) {
    throw new Error(
      "This appears to be an older .ppt file (PowerPoint 97-2003 format). Please save it as .pptx (PowerPoint 2007+) and upload again."
    );
  }

  // Sort slides in order
  slideKeys.sort((a: string, b: string) => {
    const numA = parseInt(a.match(/slide(\d+)/i)?.[1] ?? "0", 10);
    const numB = parseInt(b.match(/slide(\d+)/i)?.[1] ?? "0", 10);
    return numA - numB;
  });

  const slideTexts: string[] = await Promise.all(
    slideKeys.map(async (name: string) => {
      const content: string = await zip.files[name].async("string");
      return content
        .replace(/<a:t\b[^>]*>/gi, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#\d+;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    })
  );

  const fullText = slideTexts.filter((t: string) => t.length > 0).join("\n\n");
  return { text: fullText, pageCount: slideKeys.length };
}

// ─────────────────────────────────────────────────────────────
// POST handler
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    if (ratelimit) {
      const { success } = await ratelimit.limit(`parse_${ip}`);
      if (!success) {
        return NextResponse.json({ error: "Too many document uploads. Please try again later." }, { status: 429 });
      }
    }
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const isPdf =
      file.type === "application/pdf" || fileName.endsWith(".pdf");
    const isPptx =
      file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      file.type === "application/vnd.ms-powerpoint" ||
      fileName.endsWith(".pptx") ||
      fileName.endsWith(".ppt");

    if (!isPdf && !isPptx) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF or PowerPoint (.pptx) file." },
        { status: 400 }
      );
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 15MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";
    let pageCount = 0;

    try {
      if (isPdf) {
        const result = await extractPdfTextFast(buffer);
        extractedText = result.text;
        pageCount = result.pageCount;
      } else {
        const result = await extractPptxTextFast(buffer);
        extractedText = result.text;
        pageCount = result.pageCount;
      }
    } catch (parseError: any) {
      console.error("File processing error:", parseError);
      return NextResponse.json(
        {
          error:
            parseError.message ||
            "Failed to read the file. Make sure it is a valid PDF or PowerPoint (.pptx).",
        },
        { status: 422 }
      );
    }

    // Clean text
    extractedText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!extractedText || extractedText.length < 20) {
      return NextResponse.json(
        {
          error:
            "Could not extract readable text from this file. It may be image-based or scanned. Please use a text-based PDF or .pptx with typed text.",
        },
        { status: 422 }
      );
    }

    // Simple heuristic for document type
    let documentTypeLabel = "Document";
    const lowercaseText = extractedText.toLowerCase().slice(0, 1000); // Check beginning
    if (lowercaseText.includes("pitch") || lowercaseText.includes("deck") || fileName.includes("pitch")) {
      documentTypeLabel = "Pitch Deck";
    } else if (lowercaseText.includes("business plan") || fileName.includes("plan")) {
      documentTypeLabel = "Business Plan";
    }

    // Truncate stored text to stay within limits
    const truncatedForStorage =
      extractedText.length > 7500 ? extractedText.slice(0, 7500) : extractedText;

    const result: ParsedDocumentResult = {
      documentTypeLabel,
      pageCount,
      fileName: file.name,
      fileSizeMB: (file.size / 1024 / 1024).toFixed(1),
      _internal: {
        extractedText: truncatedForStorage,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Parse document API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
