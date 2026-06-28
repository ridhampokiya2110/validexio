import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { auth } from "@/lib/auth";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

// Initialize Upstash Redis & Rate Limiter (2 requests per day)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
    })
  : ({
      sadd: async () => 1,
      eval: async () => [0, 0],
    } as any);

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "1 d"),
});

// The Strict JSON Schema to force the Single-Pass output
const premiumReportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    business_sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
      },
      description: "Must contain exactly 15 sections including Executive Summary, Market Sizing Validation (TAM in ₹), Competitor Benchmarking, Financial Forecasting, and Strategic Pivot Vectors.",
    },
    local_market_overview: {
      type: Type.OBJECT,
      properties: {
        demandScore: { type: Type.STRING },
        competitionScore: { type: Type.STRING },
        marketSize: { type: Type.STRING },
        averageOrderValue: { type: Type.STRING },
        cac: { type: Type.STRING },
        profitMargin: { type: Type.STRING },
        growthTrend: { type: Type.STRING },
      },
    },
    opportunity_comparison: {
      type: Type.OBJECT,
      properties: {
        currentRegion: { type: Type.STRING },
        betterRegion: { type: Type.STRING },
        metrics: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              metricName: { type: Type.STRING },
              currentValue: { type: Type.STRING },
              betterValue: { type: Type.STRING },
            },
          },
        },
        reasoning: { type: Type.STRING },
      },
    },
    execution_assets: {
      type: Type.OBJECT,
      properties: {
        nextjs_waitlist_component: { type: Type.STRING },
        postgresql_ddl: { type: Type.STRING },
        aws_architecture_json: { type: Type.STRING },
      },
      description: "Raw code strings for the Builder tab.",
    },
    marketing_assets: {
      type: Type.OBJECT,
      properties: {
        apollo_search_logic: { type: Type.STRING },
        sample_leads: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              domain: { type: Type.STRING },
            },
          },
        },
        outbound_copy: { type: Type.STRING },
      },
    },
  },
  required: ["business_sections", "local_market_overview", "opportunity_comparison", "execution_assets", "marketing_assets"],
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";

    // Skip ratelimit locally if credentials aren't set, else enforce
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { success } = await ratelimit.limit(`premium_report_${ip}`);
      if (!success) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Maximum 2 free generations per day." },
          { status: 429 }
        );
      }
    }

    const body = await req.json();
    const { sessionId, businessIdea, targetAudience, scale, targetScope, targetCountry, targetState, targetCity } = body;

    if (!sessionId || !businessIdea) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sessionAuth = await auth();
    if (!sessionAuth?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionRecord = await prisma.validationSession.findUnique({
      where: { id: sessionId },
      select: { userId: true }
    });

    if (!sessionRecord || sessionRecord.userId !== sessionAuth.user.id) {
       return NextResponse.json({ error: "Unauthorized access to session" }, { status: 403 });
    }

    // Prepare geographical constraints
    let geoInstructions = "Evaluate the idea from a global perspective. Do not compare with specific local regions.";
    if (targetScope === "CITY" && targetCity && targetCity !== "All Cities") {
      geoInstructions = `STRICT REQUIREMENT: Analyze exclusively for the city of ${targetCity}, ${targetState}, ${targetCountry}. Generate Local Market Overview specifically for ${targetCity}. For Opportunity Comparison, compare ${targetCity} against another city in the same state or country that offers better profitability/demand, and explain WHY.`;
    } else if (targetScope === "STATE" && targetState && targetState !== "All States") {
      geoInstructions = `STRICT REQUIREMENT: Analyze exclusively for the state of ${targetState}, ${targetCountry}. Generate Local Market Overview specifically for ${targetState}. For Opportunity Comparison, compare ${targetState} against another state in ${targetCountry} that offers better profitability/demand, and explain WHY.`;
    } else if (targetScope === "COUNTRY" && targetCountry) {
      geoInstructions = `STRICT REQUIREMENT: Analyze exclusively for the country of ${targetCountry}. Generate Local Market Overview specifically for ${targetCountry}. For Opportunity Comparison, compare ${targetCountry} against another country that offers better profitability/demand, and explain WHY.`;
    }

    // Single-Pass Prompt
    const prompt = `You are a Principal Software Architect and VC Analyst.
Generate a comprehensive, highly technical business plan and execution repository for the following idea:
IDEA: ${businessIdea}
TARGET: ${targetAudience}
SCALE: ${scale || "Startup"}

${geoInstructions}

Return the data STRICTLY in the JSON format requested. Provide exactly 15 comprehensive narrative sections under business_sections. Write production-ready Next.js code, clean PostgreSQL DDL, and deep AWS architecture specs.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: premiumReportSchema,
        temperature: 0.2,
      },
    });

    const outputText = response.text;
    if (!outputText) throw new Error("Empty response from AI");

    const payload = JSON.parse(outputText);

    // Update the database session with the generated assets
    await prisma.validationSession.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        businessSections: payload.business_sections,
        executionAssets: payload.execution_assets,
        marketingAssets: payload.marketing_assets,
        localMarketOverview: payload.local_market_overview,
        opportunityComparison: payload.opportunity_comparison,
      },
    });

    return NextResponse.json(payload, { status: 200 });
  } catch (error: any) {
    console.error("Premium Report Generation Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error compiling the execution assets." },
      { status: 500 }
    );
  }
}
