import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { email, saas_idea } = await req.json();

    if (!email || !saas_idea) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Initialize Gemini 1.5 Flash
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set.");
      return NextResponse.json({ error: "Configuration error." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prompt for exactly 50 lines of functional Next.js/Tailwind code
    const prompt = `
      Act as an Elite Next.js Developer.
      Write exactly 50 lines of functional Next.js App Router code using Tailwind CSS.
      The code must be a waitlist landing page for the following SaaS idea:
      "${saas_idea}"
      
      Constraints:
      - Return ONLY raw text representing the code.
      - DO NOT wrap the response in markdown blocks (no \`\`\`tsx).
      - NO emojis.
      - Use light theme styling (glass-cards, white, black text).
      - Limit to exactly 50 lines.
    `;

    const result = await model.generateContent(prompt);
    const generatedCode = result.response.text().trim();

    // Store in Supabase via Prisma
    const lead = await prisma.freeToolLead.upsert({
      where: { email },
      update: {
        saasIdea: saas_idea,
        generatedCodeSnippet: generatedCode,
        sourceUrl: req.headers.get("referer") || null,
      },
      create: {
        email,
        saasIdea: saas_idea,
        generatedCodeSnippet: generatedCode,
        sourceUrl: req.headers.get("referer") || null,
      },
    });

    // Mock Email Dispatch (Integrate Resend/Sendgrid here)
    console.log(`[EMAIL DISPATCH] To: ${email}`);
    console.log(`Subject: Your Code Asset is Ready.`);
    console.log(`Body: Here is your Waitlist code for ${saas_idea}... Want the full architecture and leads? Upgrade for INR 1499.`);

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      codeSnippet: generatedCode,
    });
  } catch (error: any) {
    console.error("Error generating free asset:", error);
    return NextResponse.json(
      { error: "Failed to generate asset. Please try again." },
      { status: 500 }
    );
  }
}
