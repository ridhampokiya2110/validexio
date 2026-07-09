import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tier, affiliateCode } = await req.json();

    let basePriceINR = 0;
    switch (tier.toUpperCase()) {
      case "STARTER": basePriceINR = 499; break;
      case "PRO": basePriceINR = 1499; break;
      case "TEAM": basePriceINR = 2999; break;
      case "ENTERPRISE": basePriceINR = 14999; break;
      default: return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    let finalPrice = basePriceINR;
    let appliedAffiliateId: string | null = null;
    let discountPercentage = 0;

    if (affiliateCode) {
      const normalizedCode = affiliateCode.trim();
      
      const promoCode = await prisma.promoCode.findUnique({
        where: { code: normalizedCode }
      });
      
      if (promoCode && promoCode.isActive) {
        discountPercentage = promoCode.discountPercentage;
      } else {
        const affiliateProfile = await prisma.affiliateProfile.findUnique({
          where: { couponCode: normalizedCode }
        });
        if (affiliateProfile && affiliateProfile.userId !== session.user.id) {
          discountPercentage = 10;
          appliedAffiliateId = affiliateProfile.userId;
        }
      }
      
      if (discountPercentage > 0) {
        finalPrice = Math.round(basePriceINR * (1 - (discountPercentage / 100)));
      }
    }

    // Razorpay amount is in paisa (multiply by 100)
    const amountInPaisa = finalPrice * 100;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const options = {
      amount: amountInPaisa,
      currency: "INR",
      receipt: `rcpt_${Date.now().toString().slice(-6)}_${session.user.id.slice(0, 8)}`,
      notes: {
        userId: session.user.id,
        tier: tier.toUpperCase(),
        affiliateCode: affiliateCode || "",
        affiliateId: appliedAffiliateId || "",
        originalPrice: basePriceINR.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      finalPrice,
      discountApplied: finalPrice < basePriceINR
    });

  } catch (error: any) {
    console.error("Razorpay Order Creation Error:", error);
    return NextResponse.json({ error: "Failed to create Razorpay order: " + (error.message || error.toString()) }, { status: 500 });
  }
}
