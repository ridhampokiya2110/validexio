import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { processValidationJob } from "@/lib/queue/processJob";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const generateSchema = z.object({
  ideaId: z.string().cuid(),
});

let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
  });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    if (ratelimit) {
      const { success } = await ratelimit.limit(`generate_${ip}`);
      if (!success) {
        return NextResponse.json({ error: "Generation rate limit exceeded. Please try again later." }, { status: 429 });
      }
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await req.json();
    const parsed = generateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { ideaId } = parsed.data;

    // Fetch the idea
    const idea = await prisma.idea.findFirst({
      where: { id: ideaId, userId },
    });

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    if (idea.status !== "PENDING" && idea.status !== "FAILED") {
      return NextResponse.json(
        { error: "Idea is already being processed or is completed" },
        { status: 400 }
      );
    }

    // === 1. CACHING LAYER ===
    // Check if an identical idea was already generated successfully
    const cachedIdea = await prisma.idea.findFirst({
      where: {
        title: { equals: idea.title, mode: "insensitive" },
        industry: { equals: idea.industry, mode: "insensitive" },
        status: "COMPLETED",
      },
      orderBy: { createdAt: "desc" },
      include: { reports: true },
    });

    if (cachedIdea && cachedIdea.reports.length > 0) {
      const existingReport = cachedIdea.reports[0];

      // Clone the report for this user
      const clonedReport = await prisma.validationReport.create({
        data: {
          ideaId: idea.id,
          userId,
          validationScore: existingReport.validationScore,
          marketOpportunity: existingReport.marketOpportunity,
          productMarketFit: existingReport.productMarketFit,
          riskScore: existingReport.riskScore,
          marketAnalysis: existingReport.marketAnalysis as any,
          swotAnalysis: existingReport.swotAnalysis as any,
          competitors: existingReport.competitors as any,
          customerPersonas: existingReport.customerPersonas as any,
          revenuePotential: existingReport.revenuePotential as any,
          riskAnalysis: existingReport.riskAnalysis as any,
          pricingRecommendation: existingReport.pricingRecommendation as any,
          growthOpportunities: existingReport.growthOpportunities as any,
          acquisitionStrategy: existingReport.acquisitionStrategy as any,
          actionPlan: existingReport.actionPlan as any,
          uiMockupDescriptions: existingReport.uiMockupDescriptions as any,
          uiMockupImages: existingReport.uiMockupImages as any,
          landingPageCopy: existingReport.landingPageCopy as any,
          salesFunnel: existingReport.salesFunnel as any,
          codeBoilerplate: existingReport.codeBoilerplate as any,
          processingTime: 0, // 0 indicates it was cached
          geminiModel: existingReport.geminiModel,
        },
      });

      // Update idea status to COMPLETED
      await prisma.idea.update({
        where: { id: idea.id },
        data: { status: "COMPLETED" },
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          userId,
          action: "IDEA_VALIDATED",
          resource: "idea",
          resourceId: idea.id,
          details: {
            score: existingReport.validationScore,
            industry: idea.industry,
            processingTime: 0,
            cached: true,
          },
        },
      }).catch(() => {});

      // Return INSTANTLY!
      return NextResponse.json({
        success: true,
        reportId: clonedReport.id,
        ideaId: idea.id,
        score: clonedReport.validationScore,
        cached: true,
      });
    }

    // === 2. QUEUE LAYER (OR LOCAL FALLBACK) ===
    // If no cache, dispatch to BullMQ background worker (or local background execution)
    
    // Set status to PROCESSING
    await prisma.idea.update({
      where: { id: idea.id },
      data: { status: "PROCESSING" },
    });

    if (!process.env.REDIS_HOST) {
      console.log("No REDIS_HOST found. Bypassing BullMQ and processing directly in background...");
      // Fire and forget (it will run in the background)
      processValidationJob({
        ideaId: idea.id,
        userId: userId,
        industry: idea.industry,
        businessIdea: idea.title,
        pricingModel: idea.pricingModel || ""
      } as any).catch(err => console.error("Background validation error:", err));
    } else {
      console.log("Dispatching validation job to BullMQ queue...");
      const { dispatchValidationJob } = await import("@/lib/queue/validation.producer");
      
      await dispatchValidationJob({
        sessionId: "system", // Legacy field
        industry: idea.industry,
        businessIdea: idea.title,
        pricingModel: idea.pricingModel || "",
        ideaId: idea.id,
        userId: userId
      } as any);
    }

    return NextResponse.json({
      success: true,
      ideaId: idea.id,
      status: "QUEUED",
      jobId: idea.id
    }, { status: 202 });

  } catch (error) {
    console.error("Generation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
