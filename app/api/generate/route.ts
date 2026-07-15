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
    limiter: Ratelimit.slidingWindow(500, "1 h"), // Massively increased to support >100 validations rapidly
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

    if (idea.status === "PROCESSING") {
      return NextResponse.json({
        success: true,
        ideaId: idea.id,
        status: "QUEUED",
        jobId: idea.id
      }, { status: 202 });
    }

    if (idea.status !== "PENDING" && idea.status !== "FAILED") {
      return NextResponse.json(
        { error: "Idea is already completed" },
        { status: 400 }
      );
    }

    // (Caching layer intentionally removed: users want fresh, unique reports based on their exact geography/deck context)

    // === 2. QUEUE LAYER (OR LOCAL FALLBACK) ===
    // If no cache, dispatch to BullMQ background worker (or local background execution)
    
    // Set status to PROCESSING
    await prisma.idea.update({
      where: { id: idea.id },
      data: { status: "PROCESSING" },
    });

    if (!process.env.REDIS_HOST) {
      console.log("No REDIS_HOST found. Bypassing BullMQ and processing directly in background...");
      
      try {
        await processValidationJob({
          ideaId: idea.id,
          userId: userId,
          industry: idea.industry,
          businessIdea: idea.title,
          pricingModel: idea.pricingModel || "",
          isPriority: !idea.isLite
        } as any);
        
        return NextResponse.json({ success: true, status: "COMPLETED", ideaId: idea.id });
      } catch (err) {
        console.error("Background validation error:", err);
        return NextResponse.json({ success: false, status: "FAILED", error: "algorithmic analysis failed" }, { status: 500 });
      }
    } else {
      console.log("Dispatching validation job to BullMQ queue...");
      const { dispatchValidationJob } = await import("@/lib/queue/validation.producer");
      
      await dispatchValidationJob({
        sessionId: "system", // Legacy field
        industry: idea.industry,
        businessIdea: idea.title,
        pricingModel: idea.pricingModel || "",
        ideaId: idea.id,
        userId: userId,
        isPriority: !idea.isLite
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
