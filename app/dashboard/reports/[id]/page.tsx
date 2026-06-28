import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";

async function getReport(reportId: string, userId: string) {
  return await prisma.validationReport.findFirst({
    where: { id: reportId, userId },
    include: {
      idea: true,
    },
  });
}

import { Lock } from "lucide-react";
import Link from "next/link";

import { ReportContent } from "@/components/report/ReportContent";
import DashboardLoading from "../../loading";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  return (
    <Suspense fallback={<DashboardLoading />}>
      <ReportDataFetcher id={id} userId={session.user.id} />
    </Suspense>
  );
}

async function ReportDataFetcher({ id, userId }: { id: string, userId: string }) {
  const [report, user] = await Promise.all([
    getReport(id, userId),
    prisma.user.findUnique({ where: { id: userId }, select: { tier: true } })
  ]);
  
  if (!report) notFound();

  // Handle Starter tier 7-day lock and 30-day auto-delete
  if ((user?.tier as string) === "STARTER") {
    const daysOld = Math.floor((Date.now() - new Date(report.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysOld >= 30) {
      await prisma.validationReport.delete({ where: { id: report.id } });
      notFound();
    }

    if (daysOld >= 7) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
          <div className="w-16 h-16 bg-cherry/10 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-cherry" />
          </div>
          <h2 className="text-3xl font-black text-[#1B1716] tracking-tight mb-4">Report Archived</h2>
          <p className="text-[#1B1716]/60 max-w-md mx-auto mb-8 font-medium">
            Starter tier reports are securely locked after 7 days and permanently deleted after 30 days. Upgrade to Pro for lifetime access to this and all future intelligence reports.
          </p>
          <Link href="/pricing" className="btn-primary">
            Upgrade to Pro for Lifetime Access
          </Link>
        </div>
      );
    }
  }

  return <ReportContent report={report} isReadOnly={false} userTier={user?.tier || "STARTER"} />;
}
