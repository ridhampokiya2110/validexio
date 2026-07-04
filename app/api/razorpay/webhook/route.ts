import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") as string;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Razorpay] Webhook secret not configured");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    // Verify Razorpay signature
    const hmac = crypto.createHmac("sha256", webhookSecret);
    const digest = hmac.update(rawBody).digest("hex");

    if (digest !== signature) {
      console.error("[Razorpay] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.event;
    
    // We handle payment.captured which means the payment was successful
    if (eventName === "payment.captured") {
      const paymentEntity = payload.payload.payment.entity;
      
      // We stored userId and tier in the order notes
      // Razorpay copies order notes to payment entity
      const userId = paymentEntity.notes?.userId;
      const tier = paymentEntity.notes?.tier;
      
      if (!userId || !tier) {
        console.error("[Razorpay] Missing userId or tier in payment notes");
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
      }

      let creditsToAdd = 0;
      if (tier === "STARTER") creditsToAdd = 1;
      else if (tier === "PRO") creditsToAdd = 1;
      else if (tier === "TEAM") creditsToAdd = 3;
      else if (tier === "ENTERPRISE") creditsToAdd = 15;

      const latestLiteIdea = await prisma.idea.findFirst({
        where: { userId, isLite: true },
        orderBy: { createdAt: "desc" },
      });

      let finalCreditsToAdd = creditsToAdd;
      if (latestLiteIdea && creditsToAdd > 0) {
        finalCreditsToAdd -= 1; // Consume 1 credit for the auto-upgrade
      }

      // Upgrade user in Database
      await prisma.user.update({
        where: { id: userId },
        data: {
          tier: tier as any,
          // We don't have a razorpayCustomerId if we just use one-time payments without creating a customer,
          // but we added it to schema. We can just leave it null for now or store payment ID somewhere if needed.
          availableCredits: { increment: finalCreditsToAdd }
        }
      });

      console.log(`[Razorpay] Successfully upgraded user ${userId} to ${tier}`);

      if (latestLiteIdea) {
        await prisma.idea.update({
          where: { id: latestLiteIdea.id },
          data: { isLite: false, status: "PROCESSING" }
        });

        await prisma.validationReport.deleteMany({
          where: { ideaId: latestLiteIdea.id }
        });

        const { dispatchValidationJob } = await import("@/lib/queue/validation.producer");
        await dispatchValidationJob({
          industry: latestLiteIdea.industry,
          businessIdea: latestLiteIdea.title,
          pricingModel: latestLiteIdea.pricingModel || "",
          ideaId: latestLiteIdea.id,
          userId: userId
        } as any);

        console.log(`[Razorpay] Auto-upgraded Lite idea ${latestLiteIdea.id} for user ${userId}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Razorpay Webhook Error]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
