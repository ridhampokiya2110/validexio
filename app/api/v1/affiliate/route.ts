import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payoutEmail } = await req.json();

    const existing = await prisma.affiliateProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (existing) {
      return NextResponse.json({ profile: existing });
    }

    const couponCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    const profile = await prisma.affiliateProfile.create({
      data: {
        userId: session.user.id,
        payoutEmail: payoutEmail || session.user.email,
        couponCode
      }
    });

    // The couponCode is stored on AffiliateProfile, which is related to User.
    // We don't need to duplicate it on the User model.

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Affiliate creation error:", error);
    return NextResponse.json({ error: "Failed to join program" }, { status: 500 });
  }
}
