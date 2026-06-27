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
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            createdAt: true,
            discountAmount: true,
            status: true,
          }
        }
      }
    });

    if (!profile) {
      return NextResponse.json({ registered: false });
    }

    const totalReferrals = profile.orders.length;
    
    const ledger = profile.orders.map(o => ({
      id: o.id,
      date: o.createdAt,
      discountApplied: o.discountAmount,
      commission: Math.floor(o.discountAmount * 2),
      status: o.status,
    }));

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
