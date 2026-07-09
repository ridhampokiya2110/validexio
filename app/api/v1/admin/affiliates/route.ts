import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/guards/admin.guard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const isSuperAdmin = await requireSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminEmails = process.env.ADMIN_EMAILS 
      ? process.env.ADMIN_EMAILS.split(",").map(e => e.trim().toLowerCase()) 
      : [];

    const rawAffiliates = await prisma.affiliateProfile.findMany({
      include: {
        user: {
          select: { email: true, name: true, tier: true, role: true }
        }
      },
      orderBy: { totalEarned: 'desc' }
    });

    const affiliates = rawAffiliates.filter(aff => {
      const email = aff.user.email.toLowerCase();
      const role = aff.user.role as string;
      return role !== 'ADMIN' && role !== 'SUPERADMIN' && !adminEmails.includes(email);
    });

    const rawPayoutRequests = await prisma.payoutRequest.findMany({
      include: {
        user: {
          select: { email: true, name: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const payoutRequests = rawPayoutRequests.filter(req => {
      const email = req.user.email.toLowerCase();
      const role = req.user.role as string;
      return role !== 'ADMIN' && role !== 'SUPERADMIN' && !adminEmails.includes(email);
    });

    return NextResponse.json({ affiliates, payoutRequests });
  } catch (error: any) {
    console.error("Admin affiliates fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
