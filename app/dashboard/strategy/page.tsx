import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { TrendingUp, Target, Rocket } from "lucide-react";
import Link from "next/link";


export const metadata = { title: "Go-to-Market Strategy" };

async function getCachedReports(userId: string) {
    return await prisma.validationReport.findMany({
      where: { userId },
      select: { id: true, actionPlan: true, acquisitionStrategy: true, idea: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

export default async function StrategyPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const reports = await getCachedReports(session.user.id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1716] mb-1">Go-to-Market Strategy</h1>
        <p className="text-[#1B1716]/50 text-sm">Actionable strategies to launch and grow your startup</p>
      </div>

      {reports.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cherry/10 border border-cherry/20 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-cherry" />
          </div>
          <h3 className="text-lg font-bold text-[#1B1716] mb-2">No strategies yet</h3>
          <p className="text-[#1B1716]/45 text-sm mb-6">Validate an idea to get a customized Go-to-Market strategy.</p>
          <Link href="/dashboard/validate" className="btn-primary text-sm">Validate an Idea</Link>
        </div>
      ) : (
        reports.map((r, i) => {
          const actionPlan = r.actionPlan as any;
          const acquisition = r.acquisitionStrategy as any;
          
          if (!actionPlan || !acquisition) return null;

          return (
            <div key={i} className="glass-card p-6 border border-[#1B1716]/10">
              <div className="flex items-center gap-3 mb-6 border-b border-[#1B1716]/10 pb-4">
                <Rocket className="w-6 h-6 text-cherry" />
                <h2 className="text-xl font-bold text-[#1B1716]">{r.idea.title} Strategy</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-[#1B1716] flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-cherry" /> Acquisition Channels
                  </h3>
                  <div className="space-y-4">
                    <div className="relative rounded-2xl p-[1px] overflow-hidden group hover:shadow-[0_10px_30px_rgba(99,1,2,0.06)] transition-shadow duration-700 mt-2 mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#630102]/20 via-[#FFEDAB]/30 to-[#E5E7EB] opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="relative bg-gradient-to-br from-[#FFFFFF] via-[#FDFCF8] to-[#F9FAFB] rounded-2xl p-5 h-full border border-white overflow-hidden backdrop-blur-xl">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#630102]/5 rounded-full blur-[50px] group-hover:bg-[#630102]/10 transition-all duration-1000"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#FFEDAB]/20 rounded-full blur-[40px] group-hover:bg-[#FFEDAB]/40 transition-all duration-1000"></div>
                        
                        <p className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-[#630102] to-[#1B1716] uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10 drop-shadow-sm">
                          <Target className="w-3.5 h-3.5 text-[#630102]" /> Primary Channels
                        </p>
                        
                        <div className="flex flex-col gap-3 relative z-10">
                          {acquisition.primaryChannels?.map((ch: string, i: number) => (
                            <div key={i} className="group/item flex items-start gap-4 p-3.5 rounded-xl bg-white border border-[#E5E7EB]/80 hover:border-[#630102]/20 hover:bg-[#FDFCF8] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 overflow-hidden relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#630102]/[0.02] to-transparent translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-b from-[#630102] to-[#3a0001] border border-[#630102]/20 group-hover/item:shadow-[0_0_15px_rgba(99,1,2,0.2)] transition-all duration-500 flex-shrink-0 relative z-10 mt-0.5">
                                <span className="text-[#FFEDAB] font-bold text-[10px] tracking-tighter">0{i + 1}</span>
                              </div>
                              <span className="text-sm font-medium tracking-wide text-[#1B1716]/80 leading-relaxed group-hover/item:text-[#1B1716] transition-colors relative z-10 break-words flex-1 min-w-0">
                                {ch}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1B1716]/50 uppercase mb-2">First Customers</p>
                      <ul className="space-y-1">
                        {acquisition.firstCustomerTactics?.map((t: string) => (
                          <li key={t} className="text-[#1B1716]/70 text-sm flex items-start gap-2">
                            <span className="text-cherry mt-0.5">•</span> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-[#1B1716] flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-cherry" /> 90-Day Action Plan
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-[#1B1716]/5 bg-[#1B1716]/5 shadow-sm">
                      <p className="text-xs font-bold text-cherry uppercase mb-2">First 30 Days</p>
                      <ul className="space-y-1">
                        {actionPlan.day30?.map((a: string) => <li key={a} className="text-xs text-[#1B1716]/70">• {a}</li>)}
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl border border-[#1B1716]/5 bg-[#1B1716]/5 shadow-sm">
                      <p className="text-xs font-bold text-cherry uppercase mb-2">Days 31-60</p>
                      <ul className="space-y-1">
                        {actionPlan.day60?.map((a: string) => <li key={a} className="text-xs text-[#1B1716]/70">• {a}</li>)}
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl border border-[#1B1716]/5 bg-[#1B1716]/5 shadow-sm">
                      <p className="text-xs font-bold text-cherry uppercase mb-2">Days 61-90</p>
                      <ul className="space-y-1">
                        {actionPlan.day90?.map((a: string) => <li key={a} className="text-xs text-[#1B1716]/70">• {a}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
