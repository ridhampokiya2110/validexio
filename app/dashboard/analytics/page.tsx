import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { LineChart, TrendingUp, FileText, Zap, BarChart2 } from "lucide-react";
import { unstable_cache } from "next/cache";

export const metadata = { title: "Analytics" };

const getCachedData = unstable_cache(
  async (userId: string) => {
    const [reports, totalIdeas] = await Promise.all([
      prisma.validationReport.findMany({
        where: { userId },
        select: {
          validationScore: true,
          marketOpportunity: true,
          productMarketFit: true,
          riskScore: true,
          createdAt: true,
          idea: { select: { industry: true, title: true } },
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.idea.count({ where: { userId } })
    ]);

    return { reports, totalIdeas };
  },
  ['analytics-data'],
  { revalidate: 300 }
);

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const { reports, totalIdeas } = await getCachedData(userId);
  const avgScore = reports.length > 0
    ? Math.round(reports.reduce((a: number, r: typeof reports[0]) => a + r.validationScore, 0) / reports.length)
    : 0;
  const bestScore = reports.length > 0 ? Math.max(...reports.map((r: typeof reports[0]) => r.validationScore)) : 0;

  const industryBreakdown = reports.reduce((acc: Record<string, number>, r: typeof reports[0]) => {
    acc[r.idea.industry] = (acc[r.idea.industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1B1716] tracking-tight mb-2">Performance Analytics</h1>
          <p className="text-[#1B1716]/50 text-sm font-medium">Quantify your validation hit rate and industry spread</p>
        </div>
        <div className="hidden sm:flex w-12 h-12 rounded-full bg-cherry/10 items-center justify-center border border-cherry/20">
          <BarChart2 className="w-6 h-6 text-cherry" />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {[
          { label: "Total Concepts", value: totalIdeas, icon: Zap },
          { label: "Reports Generated", value: reports.length, icon: FileText },
          { label: "Average Rigor Score", value: avgScore || "—", icon: TrendingUp },
          { label: "Highest Score", value: bestScore || "—", icon: LineChart },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-6 flex flex-col justify-between border-[#1B1716]/10 hover:border-cherry/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#1B1716]/50 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <stat.icon className="w-4 h-4 text-cherry/60" />
            </div>
            <p className="text-4xl font-black text-[#1B1716] tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Score History */}
        <div className="lg:col-span-2">
          {reports.length > 0 ? (
            <div className="glass-card p-4 sm:p-8 h-full border-[#1B1716]/10">
              <h2 className="text-lg font-bold text-[#1B1716] mb-6">Historical Rigor Analysis</h2>
              <div className="space-y-4">
                {[...reports].reverse().map((report, i) => (
                  <div key={`item-${i}`} className="flex items-center gap-2 sm:gap-4 group">
                    <span className="text-[#1B1716]/40 text-xs w-14 sm:w-20 font-medium flex-shrink-0">
                      {new Date(report.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[#1B1716] text-xs font-bold truncate pr-2">{report.idea.title}</span>
                      </div>
                      <div className="h-4 bg-[#1B1716]/5 rounded-full overflow-hidden flex">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${report.validationScore}%`,
                            background: `linear-gradient(90deg, #75070C, ${report.validationScore >= 70 ? "#10B981" : report.validationScore >= 50 ? "#F59E0B" : "#EF4444"})`,
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="w-12 text-right flex-shrink-0">
                      <span className="text-[#1B1716] text-sm font-black">{report.validationScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-16 text-center h-full border-[#1B1716]/10 flex flex-col items-center justify-center">
              <LineChart className="w-12 h-12 text-[#1B1716]/20 mx-auto mb-4" />
              <p className="text-[#1B1716]/45 text-sm font-medium">Accumulate data to reveal trends.</p>
            </div>
          )}
        </div>

        {/* Industry Breakdown */}
        <div>
          {Object.keys(industryBreakdown).length > 0 ? (
            <div className="glass-card p-8 h-full border-[#1B1716]/10">
              <h2 className="text-lg font-bold text-[#1B1716] mb-6">Market Sector Focus</h2>
              <div className="space-y-6">
                {Object.entries(industryBreakdown)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([industry, count]) => {
                    const percentage = Math.round(((count as number) / reports.length) * 100);
                    return (
                      <div key={industry}>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-[#1B1716]/80 text-sm font-bold truncate pr-4">{industry}</span>
                          <span className="text-[#1B1716]/50 text-xs font-bold">{percentage}%</span>
                        </div>
                        <div className="h-2.5 bg-[#1B1716]/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cherry rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="glass-card p-16 text-center h-full border-[#1B1716]/10 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full border border-dashed border-[#1B1716]/20 mx-auto mb-4" />
              <p className="text-[#1B1716]/45 text-sm font-medium">No sector data available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
