import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

    if (digest.length !== signatureBuffer.length) {
      console.error("[Lemon Squeezy] Signature length mismatch");
      return NextResponse.json({ error: "Invalid signature length" }, { status: 400 });
    }

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

      const currentUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

      const TIER_WEIGHT = { FREE: 0, STARTER: 1, PRO: 2, TEAM: 3, ENTERPRISE: 4 };

      // Tier Hierarchy Logic
      let finalTier = tier;
      if (currentUser.availableCredits > 0) {
        const currentWeight = TIER_WEIGHT[currentUser.tier as keyof typeof TIER_WEIGHT] || 0;
        const purchasedWeight = TIER_WEIGHT[tier as keyof typeof TIER_WEIGHT] || 0;
        if (currentWeight > purchasedWeight) {
          finalTier = currentUser.tier; // Keep higher tier if credits remain
        }
      }

      // Upgrade user in Database
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          tier: finalTier as any,
          lemonSqueezyCustomerId: customerId,
          availableCredits: { increment: finalCreditsToAdd }
        }
      });

      if (resend && updatedUser.email) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "support@validexio.com",
            to: updatedUser.email,
            subject: `Welcome to Validexio ${tier} 🎉`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Thank you for upgrading, ${updatedUser.name || "Founder"}!</h2>
                <p>Your payment was successful and your account has been instantly upgraded to the <strong>${tier}</strong> plan.</p>
                <p>You can now generate B2B leads, download high-fidelity mockups, and export investor PDFs.</p>
                <p><a href="https://validexio.com/dashboard" style="display:inline-block; padding:10px 20px; background:#630102; color:#fff; text-decoration:none; border-radius:5px;">Go to Dashboard</a></p>
                <br/>
                <p>Happy validating,</p>
                <p>The Validexio Team</p>
              </div>
            `
          });
          console.log(`Sent upgrade email to ${updatedUser.email}`);
        } catch (emailErr) {
          console.error("Failed to send upgrade email:", emailErr);
        }
      }

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

      // Handle Affiliate Commission (20% of final paid amount)
      const affiliateCode = customData?.affiliate_code;
      if (affiliateCode) {
        // LS total is in cents (USD). E.g., 4900 = $49.00
        const totalCentsUSD = payload.data.attributes.total;
        const totalUSD = totalCentsUSD / 100;
        // Convert to INR roughly (83 INR per USD) to keep unified balance
        const totalINR = Math.round(totalUSD * 83);
        const commissionINR = Math.round(totalINR * 0.20);

        try {
          const affiliateProfile = await prisma.affiliateProfile.findUnique({
            where: { couponCode: affiliateCode.trim() }
          });
          
          if (affiliateProfile && affiliateProfile.userId !== userId) {
            await prisma.affiliateProfile.update({
              where: { userId: affiliateProfile.userId },
              data: {
                totalEarned: { increment: commissionINR },
                pendingBalance: { increment: commissionINR }
              }
            });

            // Log coupon usage
            const existing = await prisma.couponUsage.findFirst({
              where: { userId, couponCode: affiliateCode }
            });
            if (!existing) {
              await prisma.couponUsage.create({
                data: {
                  userId: userId,
                  couponCode: affiliateCode
                }
              });
            }
          }
        } catch (affiliateErr) {
          console.error("Failed to update LS affiliate commission:", affiliateErr);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Lemon Squeezy Webhook Error]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
