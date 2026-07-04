import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.affiliateProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ registered: false });
    }

    const totalReferrals = 0;
    
    const ledger: any[] = [];

    return NextResponse.json({
      registered: true,
      profile: {
        couponCode: profile.couponCode,
        pendingBalance: profile.pendingBalance,
        totalEarned: profile.totalEarned,
      },
      kpis: {
        totalReferrals,
        pendingBalance: profile.pendingBalance,
        totalEarned: profile.totalEarned,
      },
      ledger,
    });
  } catch (error: any) {
    console.error("[AFFILIATE_DASHBOARD]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
