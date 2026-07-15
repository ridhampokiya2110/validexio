import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, tier } = body;

    if (!razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    // Verify Signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Determine credits
    const TIER_WEIGHT = { FREE: 0, STARTER: 1, PRO: 2, TEAM: 3, ENTERPRISE: 4 };
    const CREDITS_PER_TIER = { FREE: 0, STARTER: 1, PRO: 1, TEAM: 3, ENTERPRISE: 15 };
    const creditsToAdd = CREDITS_PER_TIER[tier as keyof typeof CREDITS_PER_TIER] || 0;

    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const latestLiteIdea = await prisma.idea.findFirst({
      where: { userId, isLite: true },
      orderBy: { createdAt: "desc" },
    });

    let finalCreditsToAdd = creditsToAdd;
    if (latestLiteIdea && creditsToAdd > 0) {
      finalCreditsToAdd -= 1; // Consume 1 credit for auto-upgrade of the pending lite idea
    }

    let finalTier = tier;
    if (currentUser.availableCredits > 0) {
      const currentWeight = TIER_WEIGHT[currentUser.tier as keyof typeof TIER_WEIGHT] || 0;
      const purchasedWeight = TIER_WEIGHT[tier as keyof typeof TIER_WEIGHT] || 0;
      if (currentWeight > purchasedWeight) {
        finalTier = currentUser.tier; 
      }
    }

    // Calculate Revenue
    const INR_PRICES = { FREE: 0, STARTER: 499, PRO: 750, TEAM: 2999, ENTERPRISE: 14999 };
    const amountSpent = INR_PRICES[tier as keyof typeof INR_PRICES] || 0;

    // Upgrade User
    await prisma.user.update({
      where: { id: userId },
      data: {
        tier: finalTier as any,
        availableCredits: { increment: Math.max(0, finalCreditsToAdd) },
        totalSpent: { increment: amountSpent },
        razorpayCustomerId: razorpay_payment_id // Mark as Indian user for admin KPIs
      }
    });

    // Auto-upgrade pending lite idea if applicable
    if (latestLiteIdea) {
      await prisma.idea.update({
        where: { id: latestLiteIdea.id },
        data: { isLite: false, status: "PROCESSING" }
      });
      
      // Clear old lite reports
      await prisma.validationReport.deleteMany({
        where: { ideaId: latestLiteIdea.id }
      });

      if (!process.env.REDIS_HOST) {
        console.log("No REDIS_HOST found. Bypassing BullMQ and processing directly in background...");
        const { processValidationJob } = await import("@/lib/queue/processJob");
        processValidationJob({
          ideaId: latestLiteIdea.id,
          userId: userId,
          industry: latestLiteIdea.industry,
          businessIdea: latestLiteIdea.title,
          pricingModel: latestLiteIdea.pricingModel || "",
          isPriority: true
        } as any).catch(err => console.error("Background validation error:", err));
      } else {
        // Dispatch the real generation job
        const { dispatchValidationJob } = await import("@/lib/queue/validation.producer");
        await dispatchValidationJob({
          industry: latestLiteIdea.industry,
          businessIdea: latestLiteIdea.title,
          pricingModel: latestLiteIdea.pricingModel || "",
          ideaId: latestLiteIdea.id,
          userId: userId
        } as any);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[Razorpay Verify Error]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
