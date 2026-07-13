import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) return NextResponse.json({ error: "No signature" }, { status: 400 });

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET as string)
      .update(bodyText)
      .digest("hex");

    const expectedSigBuffer = Buffer.from(expectedSignature, "utf8");
    const receivedSigBuffer = Buffer.from(signature, "utf8");

    // Use timingSafeEqual to prevent timing side-channel attacks
    if (
      expectedSigBuffer.length !== receivedSigBuffer.length ||
      !crypto.timingSafeEqual(expectedSigBuffer, receivedSigBuffer)
    ) {
      console.error("[Razorpay] Invalid or mismatched signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(bodyText);

    // Prefer order.paid or payment.captured
    if (event.event === "order.paid" || event.event === "payment.captured") {
      const entity = event.payload.payment ? event.payload.payment.entity : event.payload.order.entity;
      const { userId, tier, affiliateId, affiliateCode } = entity.notes || {};

      if (userId && tier) {
        const currentUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const TIER_WEIGHT = { FREE: 0, STARTER: 1, PRO: 2, TEAM: 3, ENTERPRISE: 4 };
        const CREDITS_PER_TIER = { FREE: 0, STARTER: 1, PRO: 1, TEAM: 3, ENTERPRISE: 15 };
        const creditsToAdd = CREDITS_PER_TIER[tier as keyof typeof CREDITS_PER_TIER] || 0;

        const latestLiteIdea = await prisma.idea.findFirst({
          where: { userId, isLite: true },
          orderBy: { createdAt: "desc" },
        });

        let finalCreditsToAdd = creditsToAdd;
        if (latestLiteIdea && creditsToAdd > 0) {
          finalCreditsToAdd -= 1; // Consume 1 credit for the auto-upgrade
        }

        // Tier Hierarchy Logic
        let finalTier = tier;
        if (currentUser.availableCredits > 0) {
          const currentWeight = TIER_WEIGHT[currentUser.tier as keyof typeof TIER_WEIGHT] || 0;
          const purchasedWeight = TIER_WEIGHT[tier as keyof typeof TIER_WEIGHT] || 0;
          if (currentWeight > purchasedWeight) {
            finalTier = currentUser.tier; // Keep higher tier if credits remain
          }
        }

        // Upgrade the user
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            tier: finalTier as any,
            availableCredits: { increment: finalCreditsToAdd }
          }
        });

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
        }

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

        // Handle Affiliate Commission (20% of final paid amount)
        if (affiliateId && affiliateCode) {
          // entity.amount is in paisa
          const finalPriceINR = entity.amount / 100;
          const commission = Math.round(finalPriceINR * 0.20);

          try {
            await prisma.affiliateProfile.update({
              where: { userId: affiliateId },
              data: {
                totalEarned: { increment: commission },
                pendingBalance: { increment: commission }
              }
            });

            // Log coupon usage (skip if already exists to avoid unique constraint error on multiple webhooks)
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
          } catch (affiliateErr) {
            console.error("Failed to update affiliate commission:", affiliateErr);
          }
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Razorpay Webhook Error:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}
