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

    // Generate unique coupon code
    const username = session.user.name?.replace(/\s+/g, '').toUpperCase().substring(0, 5) || "VAL";
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const couponCode = `${username}-${randomStr}`;

    const profile = await prisma.affiliateProfile.create({
      data: {
        userId: session.user.id,
        payoutEmail: paypalEmail || session.user.email,
        trafficSource: websiteUrl || null,
        couponCode,
      }
    });

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("[AFFILIATE_REGISTER]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
