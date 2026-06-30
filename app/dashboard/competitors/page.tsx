import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { BarChart3, TrendingUp, TrendingDown, Target, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Competitor Analysis" };

async function getCachedReports(userId: string) {
  return await prisma.validationReport.findMany({
    where: { userId },
    select: { id: true, competitors: true, idea: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export default async function CompetitorsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const reports = await getCachedReports(session.user.id);
  const reportsWithCompetitors = reports.filter((r) => Array.isArray(r.competitors) && r.competitors.length > 0);

  const totalCompetitors = reportsWithCompetitors.reduce((acc, r) => {
    return acc + (r.competitors as any[]).length;
  }, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1716] mb-1">Competitor Intelligence</h1>
        <p className="text-[#1B1716]/50 text-sm">{totalCompetitors} direct competitors identified</p>
      </div>

      {reportsWithCompetitors.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-400/20 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-[#1B1716] mb-2">No competitor data yet</h3>
          <p className="text-[#1B1716]/45 text-sm mb-6">Validate an idea to discover competitors.</p>
          <Link aria-label="Navigation link" href="/dashboard/validate" className="btn-primary text-sm">Validate an Idea</Link>
        </div>
      ) : (
        <div className="space-y-12">
          {reportsWithCompetitors.map((report) => (
            <div key={report.id} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-[#1B1716]/5 pb-3">
                <div className="w-2 h-2 rounded-full bg-cherry"></div>
                <h2 className="text-xl font-black text-[#1B1716]">{report.idea.title}</h2>
                <span className="badge badge-butter text-xs px-2 py-0.5">
                  {(report.competitors as any[]).length} Competitors
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(report.competitors as any[]).map((comp, i) => (
                  <div key={`item-${i}`} className="glass-card flex flex-col h-full border-[#1B1716]/10 hover:border-cherry/30 transition-all duration-300 overflow-hidden relative">
                    
                    {/* Header */}
                    <div className="p-6 pb-4 border-b border-[#1B1716]/5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-[#1B1716] mb-1 tracking-tight">{comp.name}</h3>
                          {comp.website && (
                            <a aria-label="Link action" href={`https://${comp.website}`} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-[#1B1716]/40 hover:text-cherry transition-colors flex items-center gap-1 group"
                            >
                              <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
                              {comp.website}
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-[#1B1716]/60 text-sm mt-3 leading-relaxed line-clamp-3">
                        {comp.description}
                      </p>
                    </div>

                    {/* Pricing - PREMIUM UI */}
                    <div className="bg-[#1B1716]/[0.02] p-6 border-b border-[#1B1716]/5">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-[#1B1716]/40 mb-2">Market Pricing</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#1B1716] tracking-tight">{comp.pricing}</span>
                      </div>
                    </div>

                    {/* Strengths / Weaknesses Grid */}
                    <div className="grid grid-cols-2 flex-1 divide-x divide-[#1B1716]/5">
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <p className="text-sm font-bold text-[#1B1716]">Strengths</p>
                        </div>
                        <ul className="space-y-3">
                          {comp.strengths?.map((s: string) => (
                            <li key={s} className="text-[#1B1716]/70 text-xs leading-relaxed flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5 font-bold">•</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center">
                            <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                          </div>
                          <p className="text-sm font-bold text-[#1B1716]">Weaknesses</p>
                        </div>
                        <ul className="space-y-3">
                          {comp.weaknesses?.map((w: string) => (
                            <li key={w} className="text-[#1B1716]/70 text-xs leading-relaxed flex items-start gap-2">
                              <span className="text-red-500 mt-0.5 font-bold">•</span>
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Differentiator (Your Advantage) */}
                    <div className="p-6 bg-gradient-to-r from-cherry/5 to-transparent border-t border-cherry/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-cherry" />
                        <p className="text-sm font-bold text-cherry">Your Attack Vector</p>
                      </div>
                      <p className="text-[#1B1716]/80 text-sm leading-relaxed font-medium">
                        {comp.differentiator}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
