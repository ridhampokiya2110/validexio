import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AffiliateDashboard } from "./AffiliateDashboard";
import { ArrowRight, Lock, ShieldAlert } from "lucide-react";
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

  // Fetch full user and login history to reliably get tier and security score
  const [user, loginHistory] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, tier: true, twoFactorEnabled: true, emailVerified: true }
    }),
    prisma.loginHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    })
  ]);

  if (!user) redirect("/login");

  // Calculate Security Score
  const securityScore = [
    user.emailVerified ? 25 : 0,
    user.twoFactorEnabled ? 35 : 0,
    loginHistory.filter((l) => !l.success).length === 0 ? 20 : 10,
    20, // Base score
  ].reduce((a, b) => a + b, 0);

  // Security Gate
  if (securityScore < 100) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in-scale">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-8 relative overflow-hidden group shadow-lg shadow-orange-500/10 ring-4 ring-orange-50">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-amber-300 opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
          <ShieldAlert className="w-12 h-12 text-orange-600 relative z-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-4">Security Verification Required</h1>
        <p className="text-gray-500 max-w-lg mx-auto mb-10 text-lg leading-relaxed">
          To ensure the integrity of our Partner Program and protect payouts, we require all creators to have a <span className="font-bold text-gray-900 bg-orange-50 px-2 py-0.5 rounded-md">100% Security Score</span>. Please complete your security checklist, including Two-Factor Authentication.
        </p>
        <Link 
          href="/dashboard/security"
          className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-gray-900/30 hover:-translate-y-0.5 flex items-center gap-3 text-lg"
        >
          Complete Security Check <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
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

  // Geo-Routing (International users are redirected to LemonSqueezy AFTER passing security/tier gates)
  const headersList = await headers();
  const country = headersList.get("x-vercel-ip-country") || "IN"; // Default IN for local testing
  if (country !== "IN") {
    redirect("https://validexio.lemonsqueezy.com/affiliates");
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
          Earn <span className="font-extrabold text-green-600">20% commission</span> on every sale made with your unique coupon code. 
          Your followers will automatically get a <span className="font-bold text-[#FF5C35]">10% discount</span> at checkout.
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
