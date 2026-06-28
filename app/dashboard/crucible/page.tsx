import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import CrucibleClient from "./CrucibleClient";

export const metadata = {
  title: "Investor Simulator | Validexio",
  description: "Stress test your startup idea against an elite AI interrogator.",
};

async function CrucibleDataLoader({ userId }: { userId: string }) {
  const [user, latestReport] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { tier: true },
    }),
    prisma.validationReport.findFirst({
      where: { userId },
      select: { id: true },
    })
  ]);

  if (!user) {
    redirect("/login");
  }

  let maxQuestions = 0;
  if ((user.tier as string) === "STARTER") maxQuestions = 5;
  else if ((user.tier as string) === "PRO") maxQuestions = 10;
  else if ((user.tier as string) === "TEAM") maxQuestions = 15;
  else if ((user.tier as string) === "ENTERPRISE") maxQuestions = 999;

  if (maxQuestions === 0) {
    redirect("/pricing");
  }

  return (
    <CrucibleClient 
      tier={user.tier} 
      maxQuestions={maxQuestions} 
      reportExists={!!latestReport} 
    />
  );
}

function CrucibleSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-12 h-12 border-4 border-[#1B1716] border-t-transparent rounded-full animate-spin mb-6" />
      <h2 className="text-2xl font-black text-[#111827] mb-2 tracking-tight">Initializing Simulator...</h2>
      <p className="text-[#6B7280] max-w-md mx-auto">Loading your startup profile and previous reports.</p>
    </div>
  );
}

export default async function CruciblePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/crucible");
  }

  return (
    <Suspense fallback={<CrucibleSkeleton />}>
      <CrucibleDataLoader userId={session.user.id} />
    </Suspense>
  );
}
