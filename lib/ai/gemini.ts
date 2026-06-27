import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export interface RealityCheckResponse {
  viabilityScore: number;
  antiRoadmap: string[];
  unitEconomics: string;
  pivotStrategy: {
    recommendedAngle: string;
    whyItWorks: string;
    newTargetAudience: string;
  } | null;
  techArchitecture: {
    recommendedStack: {
      frontend: string;
      backend: string;
      database: string;
    };
    cloudHostingStrategy: {
      recommendedPlatform: string;
      deploymentApproach: string;
    };
    whyThisArchitecture: string;
  };
  gtmBrandingKit: {
    linkedinAnnouncement: string;
    productHuntPitch: string;
    githubReadmeIntro: string;
  };
  fakeDoorCode: {
    reactComponent: string;
    sqlSchema: string;
  };
  earlyAdopterPsychology: {
    coreFrustration: string;
    coldEmailHook: string;
    commonObjection: string;
    howToOvercomeObjection: string;
  };
}

export async function generateRealityCheck(
  idea: string,
  industry: string,
  location: string
): Promise<RealityCheckResponse> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
      systemInstruction: `You are a ruthless, highly experienced startup incubator and investor. Your job is to aggressively validate and critically analyze startup ideas. You do not sugarcoat your feedback. You focus on brutal market realities, severe unit economics, and avoiding common pitfalls. 
If an idea shows high market saturation or low viability, you MUST generate a specific, highly niche "Pivot Recommendation" in the pivotStrategy field. If the idea is 100% perfect, pivotStrategy can be null.
You must respond STRICTLY with a valid JSON object matching the requested schema. Do not include any markdown formatting, conversational text, or emojis outside of the JSON structure.

The schema MUST exactly match:
{
  "viabilityScore": <number between 0 and 100 representing market viability>,
  "antiRoadmap": [
    "<string: point 1 detailing what NOT to build>",
    "<string: point 2 detailing what NOT to build>",
    "<string: point 3 detailing what NOT to build>"
  ],
  "unitEconomics": "<string: brief, brutal text about projected margins, acquisition costs, and hidden expenses>",
  "pivotStrategy": {
    "recommendedAngle": "<string: e.g., Instead of a generic CRM, build a CRM specifically for high-ticket roofing contractors>",
    "whyItWorks": "<string: Explaining the gap in the market>",
    "newTargetAudience": "<string: specific target audience>"
  },
  "techArchitecture": {
    "recommendedStack": {
      "frontend": "<string: e.g., Next.js, React>",
      "backend": "<string: e.g., Node.js, Python FastAPI, Serverless Functions>",
      "database": "<string: e.g., PostgreSQL, MongoDB, DynamoDB>"
    },
    "cloudHostingStrategy": {
      "recommendedPlatform": "<string: e.g., Vercel + Supabase, AWS ECS, or Railway. Do NOT default to AWS unless heavy enterprise infrastructure is needed.>",
      "deploymentApproach": "<string: e.g., Deploy frontend on Vercel for edge caching, backend on Railway for easy Docker containerization.>"
    },
    "whyThisArchitecture": "<string: Brief justification for why this specific stack and cloud combo is perfect for the user's specific idea>"
  },
  "gtmBrandingKit": {
    "linkedinAnnouncement": "<string: A high-engagement, professional LinkedIn post announcing the concept, focused on the problem it solves>",
    "productHuntPitch": "<string: A punchy 2-3 sentence elevator pitch designed for a Product Hunt launch>",
    "githubReadmeIntro": "<string: A clean, professional introductory paragraph for their project's GitHub README>"
  },
  "fakeDoorCode": {
    "reactComponent": "<string: Raw React/Next.js component code string using Tailwind CSS classes. Must include a stylish email input and submit button.>",
    "sqlSchema": "<string: Raw PostgreSQL code string to create a table for storing waitlist signups>"
  },
  "earlyAdopterPsychology": {
    "coreFrustration": "<string: The deepest pain point of the target audience, e.g., 'Real estate agents hate wasting weekends managing paperwork.'>",
    "coldEmailHook": "<string: A high-converting, 1-2 sentence opening hook for a cold email to the B2B leads>",
    "commonObjection": "<string: The primary reason they might say 'No' to buying the product>",
    "howToOvercomeObjection": "<string: A direct counter-argument the founder can use>"
  }
}`,
    });

    const prompt = `Please provide a ruthless reality check for the following startup idea:
Idea: ${idea}
Industry: ${industry}
Target Location: ${location}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (!text) {
      throw new Error("Received empty response from the AI model.");
    }

    const parsedData = JSON.parse(text) as RealityCheckResponse;

    // Validate the parsed structure
    if (
      typeof parsedData.viabilityScore !== "number" ||
      !Array.isArray(parsedData.antiRoadmap) ||
      typeof parsedData.unitEconomics !== "string" ||
      (parsedData.pivotStrategy !== null && typeof parsedData.pivotStrategy !== "object") ||
      typeof parsedData.techArchitecture !== "object" ||
      typeof parsedData.gtmBrandingKit !== "object" ||
      typeof parsedData.fakeDoorCode !== "object" ||
      typeof parsedData.earlyAdopterPsychology !== "object"
    ) {
      throw new Error("AI response did not match the expected JSON schema.");
    }

    return parsedData;
  } catch (error) {
    console.error("Error generating reality check:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("429") || error.message.includes("rate limit")) {
        throw new Error("Rate limit exceeded. Please try again in a few minutes.");
      }
    }
    
    throw new Error("Failed to generate reality check. Please try again later.");
  }
}
