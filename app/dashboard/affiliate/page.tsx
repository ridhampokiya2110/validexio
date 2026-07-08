import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AffiliateDashboard } from "./AffiliateDashboard";
import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Affiliate Partner Dashboard - Validexio",
  description: "Manage your affiliate earnings and coupon codes.",
};

export default async function AffiliatePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch full user to reliably get tier
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) redirect("/login");

  // Geo-Routing
  const headersList = await headers();
  const country = headersList.get("x-vercel-ip-country") || "IN"; // Default IN for local testing
  if (country !== "IN") {
    redirect("https://validexio.lemonsqueezy.com/affiliates");
  }

  // Tier Gating (Only PRO, TEAM, ENTERPRISE can access)
  const allowedTiers = ["PRO", "TEAM", "ENTERPRISE"];
  if (!allowedTiers.includes(user.tier)) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 ring-1 ring-gray-900/10">
          <Lock className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-[#1B1716] mb-3">Partner Program Locked</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          The Validexio Partner Program is an exclusive feature for our premium members. Upgrade to PRO or higher to unlock 20% recurring commissions.
        </p>
        <Link 
          href="/pricing"
          className="bg-[#630102] hover:bg-[#7f1d1d] text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2"
        >
          View Plans <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const profile = await prisma.affiliateProfile.findUnique({
    where: { userId: session.user.id },
  });

  let referralsCount = 0;
  let recentActivity: any[] = [];

  if (profile) {
    // Get actual referrals count
    referralsCount = await prisma.couponUsage.count({
      where: { couponCode: profile.couponCode }
    });

    // Get recent usages
    const usages = await prisma.couponUsage.findMany({
      where: { couponCode: profile.couponCode },
      orderBy: { usedAt: 'desc' },
      take: 5
    });

    // Get recent payouts
    const payouts = await prisma.payoutRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Combine and sort by date for activity feed
    recentActivity = [
      ...usages.map(u => ({ type: 'referral', date: u.usedAt, id: u.id })),
      ...payouts.map(p => ({ type: 'payout', amount: p.amount, status: p.status, date: p.createdAt, id: p.id }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1B1716]">Partner Program</h1>
        <p className="text-[#1B1716]/60 mt-2">
          Earn 20% commission on every sale made with your unique coupon code. 
          Your followers will automatically get a 10% discount at checkout.
        </p>
      </div>

      <AffiliateDashboard 
        initialProfile={profile} 
        userId={session.user.id} 
        userEmail={session.user.email!} 
        referralsCount={referralsCount}
        recentActivity={recentActivity}
      />
    </div>
  );
}
