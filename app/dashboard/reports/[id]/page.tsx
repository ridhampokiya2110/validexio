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
  return <ReportContent report={report} isReadOnly={false} userTier={user?.tier || "STARTER"} />;
}
