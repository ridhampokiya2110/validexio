import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { paypalEmail, websiteUrl } = body;

    // Check if already registered
    const existing = await prisma.affiliateProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (existing) {
      return NextResponse.json({ error: "Already registered" }, { status: 400 });
    }

    // Generate exactly 6 letter unique hex coupon code
    const { randomBytes } = require('crypto');
    const couponCode = randomBytes(3).toString("hex").toUpperCase();

    const profile = await prisma.affiliateProfile.create({
      data: {
        userId: session.user.id,
        payoutEmail: paypalEmail || session.user.email,
        trafficSource: websiteUrl || null,
        couponCode,
      }
    });

    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: "AFFILIATE_CODE",
        title: "Partner Program Joined",
        description: `Your partner code ${couponCode} is ready! You will now earn 20% on all sales.`,
        link: "/dashboard/affiliate",
      }
    });

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("[AFFILIATE_REGISTER]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
