import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { FileText, ChevronRight, Clock, Plus } from "lucide-react";
import { formatRelativeTime, getScoreColor, getScoreLabel } from "@/lib/utils";
import { DeleteReportButton } from "@/components/dashboard/DeleteReportButton";

export const metadata = { title: "Validation Reports" };



async function getCachedReports(userId: string) {
    return await prisma.validationReport.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, validationScore: true, createdAt: true, marketOpportunity: true, productMarketFit: true, idea: { select: { title: true, industry: true, description: true } } },
    });
  }

async function ReportsContent({ userId }: { userId: string }) {
  const reports = await getCachedReports(userId);

  if (reports.length === 1) {
    redirect(`/dashboard/reports/${reports[0].id}`);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1716] mb-1">Validation Reports</h1>
          <p className="text-[#1B1716]/50 text-sm">{reports.length} report{reports.length !== 1 ? "s" : ""} generated</p>
        </div>
        <Link aria-label="Navigation link" href="/dashboard/validate" className="btn-primary text-sm px-4 py-2.5">
          <Plus className="w-4 h-4 mr-1" />
          New
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cherry/10 border border-cherry/20 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-cherry" />
          </div>
          <h3 className="text-lg font-bold text-[#1B1716] mb-2">No reports yet</h3>
          <p className="text-[#1B1716]/45 text-sm mb-6">Start validating your first startup idea.</p>
          <Link aria-label="Navigation link" href="/dashboard/validate" className="btn-primary text-sm">
            Validate Your First Idea
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Link aria-label="Navigation link"
              key={report.id}
              href={`/dashboard/reports/${report.id}`}
              className="glass-card p-5 flex items-center gap-4 hover:border-cherry/25 group transition-all"
            >
              {/* Score */}
              <div className="flex-shrink-0 relative">
                <svg className="w-16 h-16" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(27, 23, 22,0.08)" strokeWidth="5" />
                  <circle
                    cx="32" cy="32" r="26"
                    fill="none"
                    stroke={report.validationScore >= 70 ? "#10B981" : report.validationScore >= 50 ? "#F59E0B" : "#EF4444"}
                    strokeWidth="5"
                    strokeDasharray={`${(report.validationScore / 100) * 163.4} 163.4`}
                    strokeLinecap="round"
                    transform="rotate(-90 32 32)"
                  />
                  <text x="32" y="37" textAnchor="middle" fill="#1B1716" fontSize="14" fontWeight="900">
                    {report.validationScore}
                  </text>
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[#1B1716] font-semibold truncate group-hover:text-cherry transition-colors">
                  {report.idea.title}
                </p>
                <p className="text-[#1B1716]/70 text-xs mt-0.5 truncate">{report.idea.description.slice(0, 80)}...</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="badge badge-cherry text-xs">{report.idea.industry}</span>
                  <span className={`text-xs font-medium ${getScoreColor(report.validationScore)}`}>
                    {getScoreLabel(report.validationScore)}
                  </span>
                  <span className="text-[#1B1716]/30 text-xs hidden sm:flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(report.createdAt)}
                  </span>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="hidden sm:flex flex-col gap-1 text-xs text-right flex-shrink-0">
                <span className="text-[#1B1716]/70">Market: <span className="text-[#1B1716]/70">{report.marketOpportunity}</span></span>
                <span className="text-[#1B1716]/70">PMF: <span className="text-[#1B1716]/70">{report.productMarketFit}</span></span>
              </div>

              <div className="flex items-center gap-2">
                <DeleteReportButton reportId={report.id} />
                <ChevronRight className="w-4 h-4 text-[#1B1716]/25 group-hover:text-[#1B1716]/60 flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import DashboardLoading from "../loading";

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <Suspense fallback={<DashboardLoading />}>
      <ReportsContent userId={session.user.id} />
    </Suspense>
  );
}
