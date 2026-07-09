import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const normalizedCode = code.trim();

    // 1. Check PromoCode first
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: normalizedCode }
    });

    if (promoCode && promoCode.isActive) {
      return NextResponse.json({ 
        valid: true, 
        discountPercentage: promoCode.discountPercentage,
        type: "PROMO"
      }, { status: 200 });
    }

    // 2. Fallback to Affiliate Profile
    const affiliateProfile = await prisma.affiliateProfile.findUnique({
      where: { couponCode: normalizedCode }
    });

    if (affiliateProfile) {
      return NextResponse.json({ 
        valid: true,
        discountPercentage: 10,
        type: "AFFILIATE"
      }, { status: 200 });
    }

    return NextResponse.json({ valid: false }, { status: 200 });
  } catch (error) {
    console.error("Verify Affiliate Code Error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
