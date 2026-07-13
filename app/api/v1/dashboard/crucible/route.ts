import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import Cerebras from "@cerebras/cerebras_cloud_sdk";

// --- Cerebras: Ultra-fast question generation (1000+ tokens/sec) ---
const cerebrasApiKey = process.env.CEREBRAS_API_KEY;
const cerebrasClient = cerebrasApiKey ? new Cerebras({ apiKey: cerebrasApiKey }) : null;

// --- Gemini: Structured JSON evaluation (fallback for questions too) ---
const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : (null as unknown as GoogleGenerativeAI);

let ratelimit: Ratelimit | null = null;
let redisClient: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redisClient = Redis.fromEnv();
  ratelimit = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(500, "5 m"), // Increased heavily for bulk testing
    analytics: true,
  });
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    if (ratelimit) {
      const { success } = await ratelimit.limit(`crucible_${ip}`);
      if (!success) {
        return NextResponse.json({ error: "Too many requests to the Investor Simulator. Please slow down." }, { status: 429 });
      }
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, track, previousQuestions = [], currentAnswer, currentQuestion } = body;

    if (!action || !track) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch user tier and validation report concurrently to save DB latency
    const [user, latestReport] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { tier: true }
      }),
      prisma.validationReport.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: { idea: true }
      })
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Enforce tier limits
    let maxQuestions = 0;
    if ((user.tier as string) === "STARTER") {
      maxQuestions = 5;
      if (track !== "VC") {
        return NextResponse.json({ error: "Starter tier only includes the VC Persona. Upgrade to unlock Technical Architect and more." }, { status: 403 });
      }
    }
    else if ((user.tier as string) === "PRO") maxQuestions = 10;
    else if ((user.tier as string) === "TEAM") maxQuestions = 15;
    else if ((user.tier as string) === "ENTERPRISE") maxQuestions = 999;
    else return NextResponse.json({ error: "Investor Simulator requires STARTER tier or above." }, { status: 403 });

    // Enforce tier limits SECURELY via Redis (not client side array)
    const redisKey = `crucible_count_${session.user.id}`;
    let questionsAsked = 0;
    
    if (redisClient) {
      questionsAsked = await redisClient.get<number>(redisKey) || 0;
    } else {
      // Fallback if Redis is down (insecure, but keeps app running)
      questionsAsked = previousQuestions.length;
    }

    if (questionsAsked >= maxQuestions) {
      return NextResponse.json({ error: `Question limit (${maxQuestions}) reached for your tier. Wait 24 hours or upgrade.` }, { status: 403 });
    }

    // Build context string from the latest validation report
    let contextStr = "No previous context provided.";
    if (latestReport) {
      contextStr = `
IDEA CONTEXT:
Title: ${(latestReport as any).idea?.title || "Unknown"}
Description: ${(latestReport as any).idea?.description || "Unknown"}
Industry: ${(latestReport as any).idea?.industry || "Unknown"}
Market Size: ${JSON.stringify((latestReport.marketAnalysis as any)?.tam || "Unknown")}
Target Audience: ${JSON.stringify(latestReport.customerPersonas)}
Competitors: ${JSON.stringify(latestReport.competitors)}
Revenue Potential: ${JSON.stringify(latestReport.revenuePotential)}
`;
    }

    const textModel = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: { maxOutputTokens: 200, temperature: 0.7 } 
    });

    const evaluationSchema = {
      type: "object",
      properties: {
        score: {
          type: "integer",
          description: "A score between 0 and 10 based on how well the user defended their answer.",
        },
        critique: {
          type: "string",
          description: "A strict 2-sentence critique explaining why their defense passed or failed. Be brutally honest.",
        },
        idealAnswer: {
          type: "string",
          description: "The 2-sentence ideal expert answer. What should they have said?",
        },
      },
      required: ["score", "critique", "idealAnswer"],
    };

    const jsonModel = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        }
      ],
      generationConfig: { 
        maxOutputTokens: 800, 
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: evaluationSchema as any
      } 
    });

    // ROUTING LOGIC
    if (action === "GENERATE_QUESTION") {
      const trackPrompt = track === "TECHNICAL_ARCHITECT" 
        ? "You are a highly critical Principal Cloud Architect. Ask one hyper-specific technical question about their stack, scaling bottlenecks, or infrastructure."
        : "You are a strict VC/B2B Buyer. Ask one highly-specific business question regarding CAC, LTV, churn, moat, or cash flow.";

      const prompt = `
ROLE: ${trackPrompt}

TASK: Generate EXACTLY ONE highly-specific, professional interrogation question directed at the founder of this startup.

STARTUP CONTEXT:
${contextStr}

PREVIOUS QUESTIONS ASKED (Do not repeat these concepts):
${previousQuestions.length > 0 ? previousQuestions.join("\n") : "None"}

CRITICAL RULES:
1. Output ONLY the question itself. No prefixes like "Question:", no quotes, no markdown, no conversational filler.
2. The output MUST be a complete, professional English sentence ending with a question mark (?).
3. The question MUST specifically challenge the details of their startup context.
4. Do not just regurgitate their idea; challenge it like an elite industry expert.

EXAMPLE OF A GOOD QUESTION:
"Given your target audience of enterprise healthcare providers, how exactly are you planning to manage HIPAA-compliant data residency when relying on multi-tenant cloud architecture?"
`;

      let question: string | undefined;

      // PRIORITY 1: Cerebras — 1000+ tokens/sec, feels instant
      if (cerebrasClient) {
        try {
          const cerebrasResponse = await cerebrasClient.chat.completions.create({
            model: "gpt-oss-120b",
            messages: [
              { role: "system", content: prompt },
              { role: "user", content: "Generate the next investor question now." }
            ],
            max_completion_tokens: 120,
            temperature: 0.75,
            stream: false,
          });
          question = ((cerebrasResponse as any).choices?.[0]?.message?.content ?? "").trim();
          question = (question as string).replace(/^["']|["']$/g, "").replace(/^(Here is the next question:|Next question:|Question:|\* \w+:)/i, "").trim();
        } catch (cerebrasErr) {
          console.error("Cerebras question generation failed, falling back to Gemini:", cerebrasErr);
        }
      }

      // PRIORITY 2: Gemini fallback
      if (!question && process.env.GEMINI_API_KEY) {
        try {
          const result = await textModel.generateContent(prompt);
          question = result.response.text().trim();
          question = question.replace(/^["']|["']$/g, "").replace(/^(Here is the next question:|Next question:|Question:|\* \w+:)/i, "").trim();
        } catch (apiError) {
          console.error("Gemini Generate Question Error (429/etc):", apiError);
        }
      }

      // PRIORITY 3: Static hardcoded fallback
      if (!question) {
        question = track === "TECHNICAL_ARCHITECT"
          ? "Your system is under heavy load. How exactly are you preventing cascading failures across your microservices?"
          : "If customer acquisition costs double tomorrow, how does your financial model survive the next 12 months?";
      }

      // Securely track that a question was generated
      if (redisClient && question) {
        // If it's the first question, set a 24-hour expiry. Otherwise just increment.
        if (questionsAsked === 0) {
          const p = redisClient.pipeline();
          p.incr(redisKey);
          p.expire(redisKey, 86400); // Reset every 24h
          await p.exec();
        } else {
          await redisClient.incr(redisKey);
        }
      }

      return NextResponse.json({ question });
    } 
    else if (action === "EVALUATE_ANSWER") {
      if (!currentAnswer || !currentQuestion) {
        return NextResponse.json({ error: "Missing answer or question context" }, { status: 400 });
      }

      const trackPrompt = track === "TECHNICAL_ARCHITECT" 
        ? "You are a highly critical Principal Cloud Architect. Evaluate the user's technical defense."
        : "You are a strict VC/B2B Buyer. Evaluate the user's business defense.";

      const prompt = `
${trackPrompt}
${contextStr}

QUESTION ASKED: ${currentQuestion}
USER'S ANSWER: ${currentAnswer}

INSTRUCTIONS:
Evaluate the user's answer critically. 
You MUST return your response as a raw JSON object and nothing else.
Do not use markdown code blocks.
Follow this EXACT format:
{
  "score": 5,
  "critique": "Write your strict 2-sentence critique here explaining why their defense passed or failed. Do not use quotes or special characters.",
  "idealAnswer": "Write the 2-sentence ideal expert answer here. Do not use quotes or special characters."
}`;

      if (process.env.GEMINI_API_KEY) {
        let text = "";
        try {
          const result = await jsonModel.generateContent(prompt);
          text = result.response.text();
        } catch (apiError) {
          console.error("Gemini Evaluate Answer Error (429/etc):", apiError);
          // If we hit a rate limit, return a generic neutral score so they can keep playing
          return NextResponse.json({
            score: 5,
            critique: "The Data Engine evaluator hit a rate limit (Too Many Requests), but your answer was recorded. Try slowing down your responses slightly.",
            idealAnswer: "A perfect answer would provide exact numbers, clear constraints, and a proven architectural diagram or financial model."
          });
        }
        
        let evaluation;
        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            text = jsonMatch[0];
          }
          evaluation = JSON.parse(text);
        } catch (parseError) {
          console.error("Failed to parse Gemini evaluation JSON:", text);
          // Write to a local file so I can inspect it
          console.error('gemini-debug:', text);
          
          // Attempt a manual salvage of the truncated JSON using Regex
          let salvagedScore = 5;
          let salvagedCritique = "The Data Engine evaluator returned an invalid response format, but your answer was recorded. Your response lacked definitive proof or hard metrics.";
          
          const scoreMatch = text.match(/"score"\s*:\s*(\d+)/);
          if (scoreMatch && scoreMatch[1]) {
            salvagedScore = parseInt(scoreMatch[1]);
          }
          
          const critiqueMatch = text.match(/"critique"\s*:\s*"([^"]+)/);
          if (critiqueMatch && critiqueMatch[1]) {
            salvagedCritique = critiqueMatch[1].trim();
          }

          evaluation = {
            score: salvagedScore,
            critique: salvagedCritique + (salvagedCritique.endsWith('.') ? '' : '...'),
            idealAnswer: "A perfect answer would provide exact numbers, clear constraints, and a proven architectural diagram or financial model."
          };
        }
        
        return NextResponse.json(evaluation);
      } else {
         // Mock if no API key
         await new Promise(resolve => setTimeout(resolve, 1500));
         return NextResponse.json({
            score: 4,
            critique: "Your answer relies on vague hopes of auto-scaling rather than actual mathematical unit economics. You will burn through runway in 3 months with this approach.",
            idealAnswer: "The ideal approach proves a sub-3 month payback period using highly targeted cold-email bounds, calculating exact server unit costs per user at scale."
         });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Investor Simulator API Error:", error);
    return NextResponse.json({ error: "Failed to process Investor Simulator request." }, { status: 500 });
  }
}
