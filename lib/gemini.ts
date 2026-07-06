import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : (null as unknown as GoogleGenerativeAI);

// Safety settings for business use
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// --- 1. Market Analysis Schema ---
export const MarketAnalysisSchema = z.object({
  validationScore: z.number().min(0).max(100),
  marketOpportunity: z.number().min(0).max(100),
  productMarketFit: z.number().min(0).max(100),
  riskScore: z.number().min(0).max(100),

  marketSaturation: z.object({
    score: z.number(),
    reasoning: z.string(),
    sourceUrl: z.string(),
    summary: z.string(),
    tam: z.string(),
    sam: z.string(),
    som: z.string(),
    growth: z.string(),
    trends: z.array(z.string()).max(3),
  }),

  swotAnalysis: z.object({
    strengths: z.array(z.string()).max(3),
    weaknesses: z.array(z.string()).max(3),
    opportunities: z.array(z.string()).max(3),
    threats: z.array(z.string()).max(3),
  }),

  competitorIntelligence: z.array(
    z.object({
      name: z.string(),
      weakness: z.string(),
      sourceUrl: z.string(),
      website: z.string().optional(),
      description: z.string(),
      strengths: z.array(z.string()).max(3),
      weaknesses: z.array(z.string()).max(3).optional(),
      pricing: z.string(),
      differentiator: z.string(),
    })
  ).max(2),

  customerPersonas: z.array(
    z.object({
      name: z.string(),
      age: z.string(),
      title: z.string(),
      painPoints: z.array(z.string()).max(2),
      goals: z.array(z.string()).max(2),
      buyingBehavior: z.string(),
      channels: z.array(z.string()).max(2),
      willingnessToPay: z.string(),
    })
  ).max(2),

  revenuePotential: z.object({
    year1: z.string(),
    year2: z.string(),
    year3: z.string(),
    assumptions: z.array(z.string()).max(3),
    revenueStreams: z.array(z.string()).max(2),
    unitEconomics: z.object({
      competitorPricingTiers: z.array(
        z.object({
          competitorName: z.string(),
          price: z.string(),
          billingModel: z.string(),
        })
      ).max(2),
      suggestedPricingStrategy: z.object({
        recommendedPrice: z.string(),
        justification: z.string(),
      }),
      projectedMargins: z.string(),
    }).optional(),
  }),

  riskAnalysis: z.array(
    z.object({
      risk: z.string(),
      probability: z.enum(["LOW", "MEDIUM", "HIGH"]),
      impact: z.enum(["LOW", "MEDIUM", "HIGH"]),
      mitigation: z.string(),
    })
  ).max(3),

  pricingRecommendation: z.object({
    strategy: z.string(),
    tiers: z.array(
      z.object({
        name: z.string(),
        price: z.string(),
        features: z.array(z.string()).max(3),
        target: z.string(),
      })
    ).max(3),
    rationale: z.string(),
  }),

  growthOpportunities: z.array(
    z.object({
      tactic: z.string(),
      description: z.string(),
      effort: z.enum(["LOW", "MEDIUM", "HIGH"]),
      impact: z.enum(["LOW", "MEDIUM", "HIGH"]),
      timeframe: z.string(),
    })
  ).max(2),

  acquisitionStrategy: z.object({
    primaryChannels: z.array(z.string()).max(2),
    firstCustomerTactics: z.array(z.string()).max(2),
    communityBuilding: z.string(),
    contentStrategy: z.string(),
    partnershipOpportunities: z.array(z.string()).max(2),
  }),

  actionPlan: z.object({
    day30: z.array(z.string()).max(3),
    day60: z.array(z.string()).max(3),
    day90: z.array(z.string()).max(3),
  }),

  launchPlatforms: z.array(
    z.object({
      platform: z.string(),
      reason: z.string(),
      url: z.string().optional(),
    })
  ).max(2),

  mvpPrioritization: z.object({
    mustHave: z.array(z.string()).max(3),
    shouldHave: z.array(z.string()).max(3),
    couldHave: z.array(z.string()).max(3),
    wontHave: z.array(z.string()).max(2),
  }),

  complianceCheck: z.array(
    z.object({
      requirement: z.string(),
      description: z.string(),
      riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    })
  ).max(2),

  salesFunnel: z.object({
    awareness: z.object({
      channels: z.array(z.string()).max(2),
      content: z.array(z.string()).max(2),
    }),
    consideration: z.object({
      touchpoints: z.array(z.string()).max(2),
      objections: z.array(z.string()).max(2),
    }),
    conversion: z.object({
      triggers: z.array(z.string()).max(2),
      incentives: z.array(z.string()).max(2),
    }),
    retention: z.object({
      strategies: z.array(z.string()).max(2),
      metrics: z.array(z.string()).max(2),
    }),
  }),
  market_sizing_and_pricing: z.object({
    tam_sam_som_values: z.string(),
    calculated_entry_price_strategy: z.string()
  }).optional(),
  signal_to_sales_mapping: z.array(
    z.object({
      reddit_complaint: z.string(),
      email_hook: z.string()
    })
  ).optional(),
});

// --- 2. Product Strategy Schema ---
export const ProductStrategySchema = z.object({
  uiMockupDescriptions: z.array(
    z.object({
      screen: z.string(),
      description: z.string(),
      keyElements: z.array(z.string()).max(3),
      userFlow: z.string(),
    })
  ).max(2),
  landingPageCopy: z.object({
    headline: z.string(),
    subheadline: z.string(),
    valueProp: z.string(),
    cta: z.string(),
    socialProof: z.string(),
    features: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ).max(3),
  }),
  adaptive_tech_stack: z.object({
    database_schema: z.string(),
    cloud_blueprint: z.string()
  }).optional(),
  codeBoilerplate: z.string(),
});

export type MarketAnalysisReport = z.infer<typeof MarketAnalysisSchema>;
export type ProductStrategyReport = z.infer<typeof ProductStrategySchema>;

// Combine them to form the full report needed by the database
export type ValidationReport = MarketAnalysisReport & ProductStrategyReport & {
  lead_generation_contacts?: any[]; // Now fetched via Apollo
};

export interface DocumentContext {
  documentTypeLabel: string;
  extractedText: string;
}

export interface IdeaInput {
  title: string;
  description: string;
  industry: string;
  targetMarket?: string;
  location?: string;
  pricingModel?: string;
  priceTarget?: string;
  billingFrequency?: string;
  marketContext?: string; // Tavily/SerpApi
  competitorContext?: string; // SerpAPI
  socialProofContext?: string; // Reddit & HackerNews
  documentContext?: DocumentContext; // Uploaded PDF/PPT
  maxPersonas?: number;
}

const COMMON_SYSTEM_PROMPT = `You are a startup advisor. 
CRITICAL RULE: Write EVERYTHING in very simple, easy-to-understand English. Use an 8th-grade reading level.
Founders must understand your advice instantly. Do not use tough corporate jargon, buzzwords, or complicated terms.
Be honest but encouraging. Break down complex things into simple ideas.
NO emojis. Respond ONLY with valid JSON.`;

const MARKET_PROMPT = `${COMMON_SYSTEM_PROMPT}
You are analyzing the market for a startup idea.
TOKEN LIMIT RULE (CRITICAL): You MUST be extremely concise to avoid output token limits. Keep all text strings very short (1-2 sentences maximum). Limit ALL arrays (like competitors, personas, risks, action plans) to a MAXIMUM of 3 items. DO NOT exceed this.
RUTHLESS SCORING: Most ideas need a pivot. Give a score from 10 to 100. Provide a simple, profitable pivot if the score is low.
COMPETITORS (CRITICAL RULE): Read the provided real-world competitor data carefully. You MUST ONLY use the exact competitors provided in the JSON/text. DO NOT invent, guess, or hallucinate competitors. If the provided competitor list is empty or says 'No competitors found', you MUST state 'No verified competitors exist in this area yet' and treat it as a massive market opportunity. Do not make up fake businesses under any circumstances.
FINANCIALS & METRICS (CRITICAL RULE): Do not invent fake statistics, market sizes, or numbers. If you do not have exact data from the provided context, you MUST use a logical, bottom-up estimation based on the provided Pricing, Target Market, and Competitors, and explain the math briefly (e.g., "Assuming 100 local businesses paying $50/mo = $5k/mo"). Do not output generic $1B TAMs. Everything must be grounded in reality and explicitly marked as an estimation if calculated.
SOCIAL PROOF (CRITICAL RULE): You have been provided with real Reddit and HackerNews data in the context. YOU MUST use actual quotes, upvotes, and frustrations from this data to build the customer personas, market saturation reasoning, and signal-to-sales mapping. DO NOT invent generic pain points if real social proof is provided. Quote the real frustrations exactly.
LAUNCH PLATFORMS (CRITICAL RULE): Provide highly specific, niche platforms (e.g., specific subreddits, specialized Slack communities, local physical hubs). DO NOT say generic things like "Google Ads", "Facebook Ads", "Product Hunt", or "Twitter". Be creative and laser-focused on where these exact personas hang out.
90-DAY ACTION PLAN (CRITICAL RULE): Provide a highly actionable, technical, and marketing week-by-week breakdown tailored EXACTLY to this specific idea. Do NOT output generic business advice like "Build MVP" or "Talk to customers". Be hyper-specific.
MVP PRIORITIZATION: Provide a MoSCoW matrix (Must, Should, Could, Won't) to prevent founders from overbuilding.
COMPLIANCE: Briefly check for obvious regulatory/legal requirements (e.g., GDPR, FDA, Local Permits).`;

const PRODUCT_PROMPT = `${COMMON_SYSTEM_PROMPT}
You are generating the product blueprint and landing page copy for a startup idea.
TOKEN LIMIT RULE (CRITICAL): Keep all descriptions and copy extremely concise. Do not write long paragraphs. Limit all arrays to a MAXIMUM of 3 items.
Keep the landing page words very catchy, simple, and clear. Focus on user benefits.
For the \`codeBoilerplate\`, write a complete, beautiful React component using Tailwind CSS and lucide-react. Keep the code under 150 lines to prevent truncation. Do not include large SVG strings.`;

// Helper for Gemini calls with retry
async function callGemini(prompt: string, systemInstruction: string, schema: any): Promise<any> {
  const schemaString = JSON.stringify(zodToJsonSchema(schema), null, 2);
  const fullPrompt = `${prompt}\n\nREQUIRED JSON SCHEMA:\nYou MUST return your answer as a raw JSON object that perfectly matches the following JSON Schema:\n${schemaString}\n\nDo not wrap it in any top-level key that is not in the schema. Do not return an array if the schema is an object. DO NOT include markdown \`\`\`json wrappers.`;

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction,
    safetySettings,
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });

  let text = "";
  let retries = 2; // Reduced from 3 to 2 because smaller JSON calls are more reliable

  while (retries > 0) {
    try {
      const result = await model.generateContent(fullPrompt);
      text = result.response.text();
      console.log("Finish Reason:", result.response.candidates?.[0]?.finishReason);
      break;
    } catch (error: any) {
      console.error(`Gemini API error (Retries left: ${retries - 1}):`, error.message || error);
      retries--;
      if (retries === 0) {
        if (error.status === 503 || (error.message && error.message.includes("503"))) {
          throw new Error("Google's Gemini Data Engine is currently overloaded. Please wait a minute and try again.");
        }
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
  console.log("Raw Gemini Text:", text.substring(0, 500) + '...');

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (parseError: any) {
    console.error("JSON Parse Error:", parseError.message);
    console.log("Attempting to repair truncated/invalid JSON with jsonrepair...");
    try {
      const { jsonrepair } = require('jsonrepair');
      const repaired = jsonrepair(text);
      parsed = JSON.parse(repaired);
      console.log("JSON successfully repaired!");
    } catch (repairError) {
      console.error("JSON Repair Error:", repairError);
      throw new Error("Data Engine generated incomplete response. Try a shorter description.");
    }
  }

  return schema.parse(parsed);
}

export async function analyzeStartupMarket(idea: IdeaInput): Promise<MarketAnalysisReport> {
  const marketContextString = idea.marketContext 
    ? `\nGENERAL MARKET RESEARCH (TAVILY):\n${idea.marketContext}`
    : "";
    
  const competitorContextString = idea.competitorContext
    ? `\nREAL LOCAL/GLOBAL COMPETITORS (SERPAPI - USE THESE EXACTLY):\n${idea.competitorContext}`
    : "";

  const pricingContext = (idea.priceTarget || idea.billingFrequency) 
    ? `\n- Target Price: ${idea.priceTarget ? '$' + idea.priceTarget : "Let Data Decide"}\n- Billing Frequency: ${idea.billingFrequency || "Let Data Decide"}`
    : "";

  const socialProofString = idea.socialProofContext
    ? `\nREAL SOCIAL PROOF & FRUSTRATIONS (REDDIT & HACKERNEWS):\n${idea.socialProofContext}`
    : "";

  // Build document context string if a PDF/PPT was uploaded
  let documentContextString = "";
  if (idea.documentContext && idea.documentContext.extractedText) {
    const docCtx = idea.documentContext;
    documentContextString = `\n\nFOUNDER'S UPLOADED ${docCtx.documentTypeLabel.toUpperCase()} (READ THIS CAREFULLY - USE THIS AS PRIMARY CONTEXT):\n\nFull Document Content:\n${docCtx.extractedText.slice(0, 5000)}\n\nINSTRUCTION: The founder has uploaded a ${docCtx.documentTypeLabel}. Use the document content above as the PRIMARY source of truth for the idea description, financial figures, market claims, and business model. Cross-reference any numbers against real market benchmarks. Point out any inconsistencies between their claims and market reality in your analysis (e.g. unrealistic $500M Year 1 revenue). Include these red flags explicitly in your risk analysis and swot analysis.`;
  }

  const prompt = `Analyze this startup market and business model:

STARTUP IDEA:
- Title: ${idea.title}
- Description: ${idea.description}
- Industry: ${idea.industry}
- Target Market: ${idea.targetMarket || "Not specified"}
- Location/Geography: ${idea.location || "Global"}
- Pricing Model: ${idea.pricingModel || "Not specified"}${pricingContext}${marketContextString}${competitorContextString}${socialProofString}${documentContextString}

PERSONAS: You MUST generate EXACTLY ${idea.maxPersonas || 3} distinct customer personas based on the data. Do not generate more or less than ${idea.maxPersonas || 3}.

Return the exact JSON structure required. Use real competitors from the SerpAPI data if provided.`;

  return callGemini(prompt, MARKET_PROMPT, MarketAnalysisSchema);
}

export async function generateStartupProduct(idea: IdeaInput): Promise<ProductStrategyReport> {
  const marketContextString = idea.marketContext 
    ? `\nGENERAL MARKET RESEARCH:\n${idea.marketContext}`
    : "";
    
  const competitorContextString = idea.competitorContext
    ? `\nREAL LOCAL/GLOBAL COMPETITORS:\n${idea.competitorContext}`
    : "";

  const socialProofString = idea.socialProofContext
    ? `\nREAL SOCIAL PROOF & FRUSTRATIONS:\n${idea.socialProofContext}`
    : "";

  let documentContextString = "";
  if (idea.documentContext && idea.documentContext.extractedText) {
    documentContextString = `\n\nFOUNDER'S UPLOADED DOCUMENT:\n${idea.documentContext.extractedText.slice(0, 5000)}`;
  }

  const prompt = `Generate the product strategy and landing page for this startup:

STARTUP IDEA:
- Title: ${idea.title}
- Description: ${idea.description}
- Industry: ${idea.industry}${marketContextString}${competitorContextString}${socialProofString}${documentContextString}

Return the exact JSON structure required, including the React landing page code boilerplate.`;

  return callGemini(prompt, PRODUCT_PROMPT, ProductStrategySchema);
}

// FREE TIER: Generates a very lightweight report to save on token costs.
export async function generateFreeStartupMarket(idea: IdeaInput): Promise<MarketAnalysisReport> {
  const FREE_PROMPT = `${COMMON_SYSTEM_PROMPT}
You are analyzing the market for a startup idea for a FREE user. 
Provide a Validation Score (0-100), a short 2-sentence market opportunity, a risk score (0-100), product-market fit score (0-100), and a brief SWOT analysis. Do not hallucinate.`;

  const FreeSchema = z.object({
    validationScore: z.number(),
    marketOpportunity: z.number(),
    productMarketFit: z.number(),
    riskScore: z.number(),
    swotAnalysis: z.object({
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      opportunities: z.array(z.string()),
      threats: z.array(z.string()),
    })
  });

  const prompt = `Analyze this startup idea briefly:
- Title: ${idea.title}
- Description: ${idea.description}
- Industry: ${idea.industry}`;

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: {
      temperature: 0.5,
      responseMimeType: "application/json",
      responseSchema: FreeSchema as any,
    },
    safetySettings,
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    systemInstruction: FREE_PROMPT,
  });

  const text = result.response.text();
  const parsed = JSON.parse(text);

  // Pad the rest of the MarketAnalysisReport with "Locked" states
  return {
    ...parsed,
    marketSaturation: {
      score: 0,
      reasoning: "Locked - Upgrade to Premium",
      summary: "Locked - Upgrade to Premium",
      tam: "Locked", sam: "Locked", som: "Locked", growth: "Locked", trends: [], sourceUrl: ""
    },
    competitorIntelligence: [],
    customerPersonas: [],
    revenuePotential: {
      year1: "Locked", year2: "Locked", year3: "Locked", assumptions: [], revenueStreams: [],
      unitEconomics: {
        competitorPricingTiers: [],
        suggestedPricingStrategy: { recommendedPrice: "Locked", justification: "Upgrade to unlock" },
        projectedMargins: "Locked"
      }
    },
    riskAnalysis: [],
    pricingRecommendation: {
      strategy: "Locked - Upgrade to Premium", tiers: [], rationale: "Upgrade to unlock pricing intelligence."
    },
    growthOpportunities: [],
    acquisitionStrategy: { primaryChannels: [], firstCustomerTactics: [], communityBuilding: "", contentStrategy: "", partnershipOpportunities: [] },
    actionPlan: { day30: [], day60: [], day90: [] },
    launchPlatforms: [],
    mvpPrioritization: { mustHave: [], shouldHave: [], couldHave: [], wontHave: [] },
    complianceCheck: []
  };
}

export default genAI;

