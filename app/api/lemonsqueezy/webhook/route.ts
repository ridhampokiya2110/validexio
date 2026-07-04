import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") as string;
    const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Lemon Squeezy] Webhook secret not configured");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    // Verify Lemon Squeezy signature
    const hmac = crypto.createHmac("sha256", webhookSecret);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");

    if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
      console.error("[Lemon Squeezy] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data;

    // Handle order creation (Successful payment)
    if (eventName === "order_created") {
      const userId = customData?.user_id;
      const tier = customData?.tier;
      const customerId = payload.data.attributes.customer_id.toString();
      
      if (!userId) {
        console.error("[Lemon Squeezy] No user_id in custom_data");
        return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
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
          lemonSqueezyCustomerId: customerId,
          availableCredits: { increment: finalCreditsToAdd }
        }
      });

      console.log(`[Lemon Squeezy] Successfully upgraded user ${userId} to ${tier}`);

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

        console.log(`[Lemon Squeezy] Auto-upgraded Lite idea ${latestLiteIdea.id} for user ${userId}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Lemon Squeezy Webhook Error]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
