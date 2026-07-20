import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import Cerebras from "@cerebras/cerebras_cloud_sdk";

const cerebrasApiKey = process.env.CEREBRAS_API_KEY;
const cerebrasClient = cerebrasApiKey ? new Cerebras({ apiKey: cerebrasApiKey }) : null;

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
  validationScore: z.number().min(0),
  marketOpportunity: z.number().min(0),
  productMarketFit: z.number().min(0),
  riskScore: z.number().min(0),

  marketSaturation: z.object({
    score: z.number(),
    reasoning: z.string(),
    sourceUrl: z.string(),
    summary: z.string(),
    tam: z.string(),
    sam: z.string(),
    som: z.string(),
    growth: z.string(),
    trends: z.array(z.string()),
  }),

  swotAnalysis: z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    opportunities: z.array(z.string()),
    threats: z.array(z.string()),
  }),

  competitorIntelligence: z.array(
    z.object({
      name: z.string(),
      weakness: z.string(),
      sourceUrl: z.string(),
      website: z.string().optional(),
      description: z.string(),
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()).optional(),
      pricing: z.string(),
      differentiator: z.string(),
    })
  ),

  customerPersonas: z.array(
    z.object({
      name: z.string(),
      age: z.string(),
      title: z.string(),
      painPoints: z.array(z.string()),
      goals: z.array(z.string()),
      buyingBehavior: z.string(),
      channels: z.array(z.string()),
      willingnessToPay: z.string(),
    })
  ),

  revenuePotential: z.object({
    year1: z.string(),
    year2: z.string(),
    year3: z.string(),
    assumptions: z.array(z.string()),
    revenueStreams: z.array(z.string()),
    unitEconomics: z.object({
      competitorPricingTiers: z.array(
        z.object({
          competitorName: z.string(),
          price: z.string(),
          billingModel: z.string(),
        })
      ),
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
  ),

  pricingRecommendation: z.object({
    strategy: z.string(),
    tiers: z.array(
      z.object({
        name: z.string(),
        price: z.string(),
        features: z.array(z.string()),
        target: z.string(),
      })
    ),
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
  ),

  acquisitionStrategy: z.object({
    primaryChannels: z.array(z.string()),
    firstCustomerTactics: z.array(z.string()),
    communityBuilding: z.string(),
    contentStrategy: z.string(),
    partnershipOpportunities: z.array(z.string()),
  }),

  actionPlan: z.object({
    day30: z.array(z.object({ title: z.string(), details: z.string(), metric: z.string() })),
    day60: z.array(z.object({ title: z.string(), details: z.string(), metric: z.string() })),
    day90: z.array(z.object({ title: z.string(), details: z.string(), metric: z.string() })),
  }),

  launchPlatforms: z.array(
    z.object({
      platform: z.string(),
      reason: z.string(),
      url: z.string().optional(),
    })
  ),

  mvpPrioritization: z.object({
    mustHave: z.array(z.string()),
    shouldHave: z.array(z.string()),
    couldHave: z.array(z.string()),
    wontHave: z.array(z.string()),
  }),

  complianceCheck: z.array(
    z.object({
      requirement: z.string(),
      description: z.string(),
      riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    })
  ),

  salesFunnel: z.object({
    awareness: z.object({
      channels: z.array(z.string()),
      content: z.array(z.string()),
    }),
    consideration: z.object({
      touchpoints: z.array(z.string()),
      objections: z.array(z.string()),
    }),
    conversion: z.object({
      triggers: z.array(z.string()),
      incentives: z.array(z.string()),
    }),
    retention: z.object({
      strategies: z.array(z.string()),
      metrics: z.array(z.string()),
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
      keyElements: z.array(z.string()),
      userFlow: z.string(),
    })
  ),
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
    ),
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
  wikiContext?: string; // Wikipedia
  documentContext?: DocumentContext; // Uploaded PDF/PPT
  maxPersonas?: number;
  maxCompetitors?: number;
}

const COMMON_SYSTEM_PROMPT = `You are a startup advisor. 
CRITICAL RULE: Write EVERYTHING in very simple, easy-to-understand English. Use an 8th-grade reading level.
Founders must understand your advice instantly. Do not use tough corporate jargon, buzzwords, or complicated terms.
Be honest but encouraging. Break down complex things into simple ideas.
NO emojis. Respond ONLY with valid JSON.`;

const MARKET_PROMPT = `${COMMON_SYSTEM_PROMPT}
You are analyzing the market for a startup idea.
TOKEN LIMIT RULE (CRITICAL): Your absolute hard limit is 8000 tokens. You MUST provide incredibly rich, premium, and highly detailed data. However, you MUST be completely fluff-free. Do not write repetitive paragraphs or corporate jargon. Provide dense, data-rich insights. The 90-DAY ACTION PLAN must be highly specific and deeply technical. If you write fluff, the JSON will truncate and the system will crash.
RUTHLESS SCORING: Most ideas need a pivot. Give a score from 10 to 100. Provide a simple, profitable pivot if the score is low.
COMPETITORS (CRITICAL RULE): Read the provided real-world competitor data carefully. You MUST ONLY use the exact competitors provided in the JSON/text. DO NOT invent, guess, or hallucinate competitors. If the provided competitor list is empty or says 'No competitors found', you MUST state 'No verified competitors exist in this area yet' and treat it as a massive market opportunity. Do not make up fake businesses under any circumstances.
FINANCIALS & METRICS (CRITICAL RULE): Do not invent fake statistics, market sizes, or numbers. If you do not have exact data from the provided context, you MUST use a logical, bottom-up estimation based on the provided Pricing, Target Market, and Competitors, and explain the math briefly (e.g., "Assuming 100 local businesses paying 50/mo = 5k/mo"). Do not output generic TAMs. Everything must be grounded in reality and explicitly marked as an estimation if calculated. IMPORTANT: You MUST format ALL financial figures, pricing, market sizes, and revenue in the native currency appropriate for the Location/Geography provided by the user (e.g., Indian Rupees (₹) for India, Euros (€) for Europe, British Pounds (£) for UK). DO NOT default to US Dollars ($) unless the location is USA or global.
SOCIAL PROOF (CRITICAL RULE): You have been provided with real Reddit and HackerNews data in the context. YOU MUST use actual quotes, upvotes, and frustrations from this data to build the customer personas, market saturation reasoning, and signal-to-sales mapping. DO NOT invent generic pain points if real social proof is provided. Quote the real frustrations exactly.
LAUNCH PLATFORMS (CRITICAL RULE): Provide highly specific, niche platforms (e.g., specific subreddits, specialized Slack communities, local physical hubs). DO NOT say generic things like "Google Ads", "Facebook Ads", "Product Hunt", or "Twitter". Be creative and laser-focused on where these exact personas hang out.
90-DAY ACTION PLAN (CRITICAL RULE): Provide a highly detailed, technical, and marketing week-by-week breakdown tailored EXACTLY to this idea. Keep details punchy and actionable.
MVP PRIORITIZATION: Provide a MoSCoW matrix (Must, Should, Could, Won't) to prevent founders from overbuilding.
COMPLIANCE: Briefly check for obvious regulatory/legal requirements (e.g., GDPR, FDA, Local Permits).`;

const PRODUCT_PROMPT = `${COMMON_SYSTEM_PROMPT}
You are generating the product blueprint and landing page copy for a startup idea.
Keep the landing page words very catchy, simple, and clear. Focus on user benefits.
For the \`codeBoilerplate\`, write a complete, beautiful React component using Tailwind CSS and lucide-react. Keep the code under 150 lines to prevent truncation. Do not include large SVG strings.`;

// Helper for Gemini calls with retry
// Uses gemini-2.0-flash — cheapest available model. Schema is passed natively
// (NOT embedded in prompt text) saving ~5000 tokens per call.
async function callGemini(prompt: string, systemInstruction: string, schema: any): Promise<any> {
  // DO NOT embed schema in prompt — use native responseSchema instead (free, no tokens used)
  const fullPrompt = prompt;

  const jsonSchema = zodToJsonSchema(schema, "Schema").definitions?.Schema as any;
  // Gemini API does not support additionalProperties in responseSchema
  const removeAdditionalProperties = (obj: any) => {
    if (Array.isArray(obj)) {
      obj.forEach(removeAdditionalProperties);
    } else if (typeof obj === "object" && obj !== null) {
      if ("additionalProperties" in obj) {
        delete obj.additionalProperties;
      }
      Object.values(obj).forEach(removeAdditionalProperties);
    }
  };
  removeAdditionalProperties(jsonSchema);

  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash", // Using 3.5-flash for paid tier
    systemInstruction,
    safetySettings,
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192, // Increased back to 8192 to prevent MAX_TOKENS truncation on detailed Pro reports
      responseMimeType: "application/json",
      responseSchema: jsonSchema, // Native schema enforcement — zero extra tokens
    },
  });

  let text = "";
  let retries = 4; // Increased for high-concurrency 
  let delayMs = 1500;

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
        if (error.status === 503 || error.status === 429 || (error.message && (error.message.includes("503") || error.message.includes("429")))) {
          throw new Error("Google's Gemini Data Engine is currently under heavy load. Please wait a minute and try again.");
        }
        throw error;
      }
      // Exponential backoff with jitter
      const jitter = Math.random() * 500;
      await new Promise((resolve) => setTimeout(resolve, delayMs + jitter));
      delayMs *= 2; // 1.5s -> 3s -> 6s
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
    ? `\n- Target Price: ${idea.priceTarget ? idea.priceTarget + " (in local currency)" : "Let Data Decide"}\n- Billing Frequency: ${idea.billingFrequency || "Let Data Decide"}`
    : "";

  const socialProofString = idea.socialProofContext
    ? `\nREAL SOCIAL PROOF & FRUSTRATIONS (REDDIT & HACKERNEWS):\n${idea.socialProofContext}`
    : "";

  const wikiContextString = idea.wikiContext
    ? `\nFACTUAL INDUSTRY BACKGROUND (WIKIPEDIA - USE FOR MARKET SIZING & HISTORY):\n${idea.wikiContext}`
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
- Pricing Model: ${idea.pricingModel || "Not specified"}${pricingContext}${marketContextString}${competitorContextString}${socialProofString}${wikiContextString}${documentContextString}

PERSONAS: You MUST generate EXACTLY ${idea.maxPersonas || 3} distinct customer personas based on the data. Do not generate more or less than ${idea.maxPersonas || 3}.
COMPETITORS: You MUST generate EXACTLY ${idea.maxCompetitors || 3} distinct competitors based on the provided SerpAPI data. Do not generate more or less.

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

  const wikiContextString = idea.wikiContext
    ? `\nFACTUAL INDUSTRY BACKGROUND:\n${idea.wikiContext}`
    : "";

  let documentContextString = "";
  if (idea.documentContext && idea.documentContext.extractedText) {
    documentContextString = `\n\nFOUNDER'S UPLOADED DOCUMENT:\n${idea.documentContext.extractedText.slice(0, 5000)}`;
  }

  const prompt = `Generate the product strategy and landing page for this startup:

STARTUP IDEA:
- Title: ${idea.title}
- Description: ${idea.description}
- Industry: ${idea.industry}${marketContextString}${competitorContextString}${socialProofString}${wikiContextString}${documentContextString}

Return the exact JSON structure required, including the React landing page code boilerplate.`;

  return callGemini(prompt, PRODUCT_PROMPT, ProductStrategySchema);
}

// ============================================================
// FREE TIER: Uses Pollinations AI (100% FREE, no API key needed)
// Cost to you: $0.00 per Lite validation, forever.
// Gemini is used as a fallback if Pollinations is unavailable.
// ============================================================
export async function generateFreeStartupMarket(idea: IdeaInput): Promise<MarketAnalysisReport> {
  const systemPrompt = `You are an elite startup market analyst. Respond ONLY with a raw JSON object — no markdown, no code fences.
Your JSON must EXACTLY match this structure:
{
  "validationScore": <number 0-100>,
  "marketOpportunity": <number 0-100>,
  "productMarketFit": <number 0-100>,
  "riskScore": <number 0-100>,
  "executiveSummary": "<A compelling, detailed 2-paragraph analysis of the startup idea, its potential, and why it matters>",
  "targetAudience": "<A detailed paragraph describing the ideal early adopters and their pain points>",
  "competitorLandscape": "<A paragraph describing the general competitive landscape and market saturation>",
  "marketSize": {
    "tam": "<string estimate of Total Addressable Market>",
    "sam": "<string estimate of Serviceable Addressable Market>",
    "som": "<string estimate of Serviceable Obtainable Market>",
    "cagr": "<string percentage estimate>"
  },
  "swotAnalysis": {
    "strengths": ["<string>", "<string>", "<string>"],
    "weaknesses": ["<string>", "<string>", "<string>"],
    "opportunities": ["<string>", "<string>", "<string>"],
    "threats": ["<string>", "<string>", "<string>"]
  }
}
Provide highly valuable, actionable, and specific insights to impress the user and convince them the AI is highly intelligent. Do not hallucinate real-time data. Provide realistic estimates for market sizes based on the industry.`;

  const userPrompt = `Analyze this startup idea:
- Title: ${idea.title}
- Description: ${idea.description}
- Industry: ${idea.industry}`;

  let parsed: any = null;

  // ── ATTEMPT 1: Cerebras (Ultra-fast, Free tier API) ──
  if (cerebrasClient) {
    try {
      console.log("[Free Tier] Calling Cerebras AI...");
      const cerebrasResponse = await cerebrasClient.chat.completions.create({
        model: "llama3.1-70b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_completion_tokens: 1500,
        temperature: 0.7,
        stream: false,
      });

      const rawText = ((cerebrasResponse as any).choices?.[0]?.message?.content ?? "").trim();
      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
      console.log("[Free Tier] ✅ Cerebras AI succeeded.");
    } catch (cerebrasError: any) {
      console.warn("[Free Tier] ⚠️ Cerebras AI failed, falling back to Gemini:", cerebrasError.message);
    }
  }

  // ── FALLBACK: Gemini Flash (cheap but costs a tiny bit) ──
  if (!parsed) {
    try {
      console.log("[Free Tier] Calling Gemini (Fallback)...");
      const FreeSchema = z.object({
        validationScore: z.number(),
        marketOpportunity: z.number(),
        productMarketFit: z.number(),
        riskScore: z.number(),
        executiveSummary: z.string(),
        targetAudience: z.string(),
        competitorLandscape: z.string(),
        marketSize: z.object({
          tam: z.string(),
          sam: z.string(),
          som: z.string(),
          cagr: z.string(),
        }),
        swotAnalysis: z.object({
          strengths: z.array(z.string()),
          weaknesses: z.array(z.string()),
          opportunities: z.array(z.string()),
          threats: z.array(z.string()),
        }),
      });

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.5,
          responseMimeType: "application/json",
          responseSchema: zodToJsonSchema(FreeSchema) as any, // Fix 400 Bad Request by stripping Zod metadata
        },
        safetySettings,
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: systemPrompt,
      });

      const text = result.response.text();
      parsed = JSON.parse(text);
      console.log("[Free Tier] ✅ Gemini fallback succeeded.");
    } catch (geminiError: any) {
      console.error("[Free Tier] ❌ Both Cerebras and Gemini failed:", geminiError.message);
      // Return a safe, minimal static response so the report page doesn't crash
      parsed = {
        validationScore: 50,
        marketOpportunity: 50,
        productMarketFit: 50,
        riskScore: 50,
        executiveSummary: "This idea targets a growing market but faces notable execution risks. A clear go-to-market strategy is essential to capture initial market share.",
        competitorLandscape: "The market features established players. Differentiation will rely on specific value propositions and niche targeting.",
        targetAudience: "Startups and SMEs looking for streamlined solutions in this space.",
        marketSize: {
          tam: "Significant ($1B+)",
          sam: "Moderate ($100M+)",
          som: "Obtainable ($1M - $10M)",
          cagr: "5-10%"
        },
        swotAnalysis: {
          strengths: ["Clear target audience definition", "Addresses a specific pain point"],
          weaknesses: ["Limited initial resources", "Requires strong technical execution"],
          opportunities: ["Growing market demand", "Potential for rapid niche adoption"],
          threats: ["Market competition", "Changing industry standards"],
        },
      };
    }
  }

  // Ensure we have a swotAnalysis even if the LLM failed to include it or provided an empty one
  if (!parsed?.swotAnalysis || !parsed?.swotAnalysis?.strengths || parsed.swotAnalysis.strengths.length === 0) {
    parsed = {
      ...parsed,
      swotAnalysis: {
        strengths: ["Clear target audience definition", "Addresses a specific pain point"],
        weaknesses: ["Limited data on free tier", "Requires Pro validation for deep insights"],
        opportunities: ["Upgrade to Pro for full market data", "Validate with real customers"],
        threats: ["Market competition (unverified)", "Execution risk without clear strategy"]
      }
    };
  }

  // Pad the rest of the full MarketAnalysisReport with locked states
  return {
    ...parsed,
    marketSaturation: {
      score: parsed?.marketOpportunity || 50,
      reasoning: parsed?.competitorLandscape || "Upgrade to unlock real-time market saturation data.",
      summary: parsed?.executiveSummary || "Upgrade to Premium to see full market analysis.",
      tam: parsed?.marketSize?.tam || "Upgrade to unlock",
      sam: parsed?.marketSize?.sam || "Upgrade to unlock",
      som: parsed?.marketSize?.som || "Upgrade to unlock",
      growth: parsed?.marketSize?.cagr || "Upgrade to unlock",
      trends: [], 
      sourceUrl: "",
    },
    competitorIntelligence: [],
    customerPersonas: [],
    revenuePotential: {
      year1: "Locked", year2: "Locked", year3: "Locked", assumptions: [], revenueStreams: [],
      unitEconomics: {
        competitorPricingTiers: [],
        suggestedPricingStrategy: { recommendedPrice: "Locked", justification: "Upgrade to unlock" },
        projectedMargins: "Locked",
      },
    },
    riskAnalysis: [],
    pricingRecommendation: {
      strategy: "Locked - Upgrade to Premium", tiers: [], rationale: "Upgrade to unlock pricing intelligence.",
    },
    growthOpportunities: [],
    acquisitionStrategy: {
      primaryChannels: [], firstCustomerTactics: [], communityBuilding: "", contentStrategy: "", partnershipOpportunities: [],
    },
    actionPlan: {
      day30: [
        { title: "Locked - Upgrade to Pro", details: "Upgrade to Pro to unlock 90-day actionable roadmap.", metric: "N/A" }
      ],
      day60: [
        { title: "Locked - Upgrade to Pro", details: "Upgrade to Pro to unlock.", metric: "N/A" }
      ],
      day90: [
        { title: "Locked - Upgrade to Pro", details: "Upgrade to Pro to unlock.", metric: "N/A" }
      ]
    },
    launchPlatforms: [],
    mvpPrioritization: { mustHave: [], shouldHave: [], couldHave: [], wontHave: [] },
    complianceCheck: [],
    salesFunnel: {
      awareness: { channels: ["Locked"], content: ["Locked"] },
      consideration: { touchpoints: ["Locked"], objections: ["Locked"] },
      conversion: { triggers: ["Locked"], incentives: ["Locked"] },
      retention: { strategies: ["Locked"], metrics: ["Locked"] }
    }
  };
}

export default genAI;

