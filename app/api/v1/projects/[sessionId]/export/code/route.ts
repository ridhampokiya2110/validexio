import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPaywallGuard } from "@/lib/guards/auth.guard";
import { getSignedUrl } from "@/lib/supabase";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { auth as getSessionAuth } from "@/lib/auth";
import { z } from "zod";
import JSZip from "jszip";

// Export endpoints require strict ratelimiting (5 per hour)
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    analytics: true,
  });
}

const uuidSchema = z.string().uuid();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

    if (ratelimit) {
      const { success } = await ratelimit.limit(`export_code_${ip}_${sessionId}`);
      if (!success) {
        return NextResponse.json({ error: "Export rate limit exceeded. Try again later." }, { status: 429 });
      }
    }

    const sessionAuth = await getSessionAuth();
    if (!sessionAuth?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the passed ID is a ValidationSession (UUID) or a ValidationReport (CUID)
    const isValidationSession = uuidSchema.safeParse(sessionId).success;

    if (isValidationSession) {
      // Must be PRO tier to export code
      const authGuard = await verifyPaywallGuard(sessionId, sessionAuth.user.id, true);
      if (authGuard.error) return authGuard.error;

      const session = await prisma.validationSession.findUnique({
        where: { id: sessionId },
        select: { codeAssetKey: true },
      });

      if (!session || !session.codeAssetKey) {
        return NextResponse.json({ error: "Code asset not found or not generated yet." }, { status: 404 });
      }

      const downloadUrl = await getSignedUrl("validexio-assets", session.codeAssetKey, 300); // 5 mins
      if (!downloadUrl) {
        return NextResponse.json({ error: "Failed to generate download link." }, { status: 500 });
      }

      // Secure Redirect to the signed URL
      return NextResponse.redirect(downloadUrl, 302);
    } else {
      // It's a ValidationReport ID (passed by dashboard boilerplate page)
      const report = await prisma.validationReport.findUnique({
        where: { id: sessionId },
        select: { userId: true, codeBoilerplate: true, idea: { select: { title: true } } }
      });

      if (!report || report.userId !== sessionAuth.user.id) {
        return NextResponse.json({ error: "Report not found or unauthorized" }, { status: 404 });
      }

      const userTier = (sessionAuth.user as any).tier || "FREE";
      if (userTier === "FREE") {
        return NextResponse.json({ error: "Premium subscription required to download boilerplate." }, { status: 403 });
      }

      if (!report.codeBoilerplate) {
        return NextResponse.json({ error: "Code boilerplate not generated yet." }, { status: 404 });
      }

      // Generate zip on the fly
      const zip = new JSZip();
      
      const boilerplate = typeof report.codeBoilerplate === "string" 
        ? report.codeBoilerplate 
        : JSON.stringify(report.codeBoilerplate, null, 2);
        
      zip.file("README.md", `# ${report.idea.title} - Boilerplate\n\nThis zip contains your generated boilerplate code.\n\n${boilerplate}`);
      zip.file("boilerplate_raw.md", boilerplate);
      
      // Attempt basic parsing to extract code blocks
      const codeBlockRegex = /```([\w-]*)\n([\s\S]*?)```/g;
      let match;
      let fileIndex = 1;
      let extractedFiles = 0;
      const srcFolder = zip.folder("src");
      
      while ((match = codeBlockRegex.exec(boilerplate)) !== null) {
        const language = match[1] || "txt";
        const code = match[2];
        
        let filename = `file_${fileIndex}.${language === 'typescript' ? 'ts' : language === 'javascript' ? 'js' : language === 'tsx' ? 'tsx' : language}`;
        
        // Try to guess a file name from the first line (e.g. // app/page.tsx)
        const firstLine = code.trim().split('\n')[0];
        if (firstLine && (firstLine.startsWith("//") || firstLine.startsWith("/*") || firstLine.startsWith("#"))) {
          const potentialName = firstLine.replace(/\/\/|\/\*|\*\/|#/g, "").trim();
          // basic validation that it looks like a filename
          if (potentialName.includes(".") && !potentialName.includes(" ")) {
            filename = potentialName;
          }
        }
        
        srcFolder?.file(filename, code);
        fileIndex++;
        extractedFiles++;
      }

      // If no code blocks were found, the AI probably returned raw React code directly
      if (extractedFiles === 0) {
        srcFolder?.file("App.tsx", boilerplate);
      }

      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

      return new NextResponse(zipBuffer as any, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${report.idea.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_boilerplate.zip"`,
        },
      });
    }
  } catch (error) {
    console.error("[Export Code API] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
