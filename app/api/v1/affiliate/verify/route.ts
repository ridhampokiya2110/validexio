import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const affiliateProfile = await prisma.affiliateProfile.findUnique({
      where: { couponCode: code.trim() }
    });

    if (affiliateProfile) {
      return NextResponse.json({ valid: true }, { status: 200 });
    }

    return NextResponse.json({ valid: false }, { status: 200 });
  } catch (error) {
    console.error("Verify Affiliate Code Error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
