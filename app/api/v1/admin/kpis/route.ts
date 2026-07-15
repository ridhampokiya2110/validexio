import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/guards/admin.guard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const isSuperAdmin = await requireSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const [
      totalFounders,
      starterReports,
      proReports,
      teamReports,
      enterpriseReports,
      freeReports,
      activeTickets,
      indianUsersSum,
      intlUsersSum
    ] = await Promise.all([
      prisma.user.count(),
      prisma.idea.count({ where: { isLite: false, status: "COMPLETED", user: { tier: "STARTER" } } }),
      prisma.idea.count({ where: { isLite: false, status: "COMPLETED", user: { tier: "PRO" } } }),
      prisma.idea.count({ where: { isLite: false, status: "COMPLETED", user: { tier: "TEAM" } } }),
      prisma.idea.count({ where: { isLite: false, status: "COMPLETED", user: { tier: "ENTERPRISE" } } }),
      prisma.idea.count({ where: { isLite: true, status: "COMPLETED" } }),
      // Sum of all unused credits across all users
      prisma.user.aggregate({ _sum: { availableCredits: true } }),
      // Indian Revenue (Razorpay)
      prisma.user.aggregate({
        _sum: { totalSpent: true },
        where: { razorpayCustomerId: { not: null } }
      }),
      // International Revenue (LemonSqueezy)
      prisma.user.aggregate({
        _sum: { totalSpent: true },
        where: { razorpayCustomerId: null }
      })
    ]);

    const totalINR = indianUsersSum._sum.totalSpent || 0;
    const intlINR = intlUsersSum._sum.totalSpent || 0;
    
    // We stored LemonSqueezy totalSpent in INR using a rough 83.5 conversion earlier.
    // Convert back to get the actual USD representation for International.
    // Total USD should ONLY reflect international payments to prevent double counting visually.
    const intlUSD = Math.round(intlINR / 83.5);
    const totalUSD = intlUSD; // Only international USD

    const unusedCredits = activeTickets._sum.availableCredits || 0;

    const kpis = {
      totalUSD, // International USD only
      totalINR, // Specifically Indian Revenue
      intlUSD,  
      totalFounders,
      starterReports,
      proReports,
      teamReports,
      enterpriseReports,
      freeReports,
      activeTickets: unusedCredits // Keep the same property name to avoid breaking frontend immediately
    };

    return NextResponse.json(kpis);
  } catch (error) {
    console.error("Admin KPIs Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
