import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { LineChart, DollarSign, Wallet } from "lucide-react";
import Link from "next/link";
import { PremiumRevenueChart } from "@/components/PremiumRevenueChart";


export const metadata = { title: "Unit Economics" };

async function getCachedReports(userId: string) {
    return await prisma.validationReport.findMany({
      where: { userId },
      select: { id: true, revenuePotential: true, pricingRecommendation: true, idea: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

export default async function EconomicsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const reports = await getCachedReports(session.user.id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1716] mb-1">Unit Economics & Revenue</h1>
        <p className="text-[#1B1716]/50 text-sm">Financial models and pricing strategies</p>
      </div>

      {reports.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cherry/10 border border-cherry/20 flex items-center justify-center mx-auto mb-4">
            <LineChart className="w-8 h-8 text-cherry" />
          </div>
          <h3 className="text-lg font-bold text-[#1B1716] mb-2">No financial data yet</h3>
          <p className="text-[#1B1716]/45 text-sm mb-6">Validate an idea to get pricing and revenue projections.</p>
          <Link href="/dashboard/validate" className="btn-primary text-sm">Validate an Idea</Link>
        </div>
      ) : (
        reports.map((r, i) => {
          const rev = r.revenuePotential as any;
          const pricing = r.pricingRecommendation as any;
          
          if (!rev || !pricing) return null;

          return (
            <div key={i} className="glass-card p-6 border border-[#1B1716]/10 mb-8">
              <div className="flex items-center gap-3 mb-6 border-b border-[#1B1716]/10 pb-4">
                <Wallet className="w-6 h-6 text-cherry" />
                <h2 className="text-xl font-bold text-[#1B1716]">{r.idea.title} Economics</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Revenue Potential */}
                <div>
                  <h3 className="font-bold text-[#1B1716] flex items-center gap-2 mb-4">
                    <LineChart className="w-4 h-4 text-cherry" /> Revenue Projections
                  </h3>
                  
                  <div className="mb-6">
                    <PremiumRevenueChart 
                      year1={rev.year1} 
                      year2={rev.year2} 
                      year3={rev.year3} 
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-[#1B1716]/50 uppercase mb-2">Revenue Streams</p>
                      <ul className="space-y-1">
                        {rev.revenueStreams?.map((s: string) => (
                          <li key={s} className="text-[#1B1716]/70 text-sm flex items-start gap-2">
                            <span className="text-cherry mt-0.5">•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1B1716]/50 uppercase mb-2">Key Assumptions</p>
                      <ul className="space-y-1">
                        {rev.assumptions?.map((a: string) => (
                          <li key={a} className="text-[#1B1716]/70 text-sm flex items-start gap-2">
                            <span className="text-cherry mt-0.5">•</span> {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Pricing Strategy */}
                <div>
                  <h3 className="font-bold text-[#1B1716] flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#630102]/10 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-[#630102]" />
                    </div>
                    <span className="font-heading tracking-wide">Recommended Pricing</span>
                  </h3>
                  
                  <div className="mb-6 p-5 bg-gradient-to-br from-[#630102]/5 to-transparent border border-[#630102]/10 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#630102]/10 rounded-full blur-xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
                    <p className="text-xs uppercase tracking-widest text-[#630102] font-bold mb-2">Strategy: {pricing.strategy}</p>
                    <p className="text-[#1B1716]/90 text-sm font-serif italic leading-relaxed">"{pricing.rationale}"</p>
                  </div>

                  <div className="space-y-4">
                    {pricing.tiers?.map((tier: any, idx: number) => (
                      <div key={idx} className="group relative overflow-hidden bg-white/60 backdrop-blur-sm border border-[#1B1716]/10 rounded-2xl p-6 hover:shadow-[0_15px_40px_-15px_rgba(99,1,2,0.15)] hover:border-[#630102]/30 hover:-translate-y-1 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#630102]/5 to-transparent rounded-full blur-2xl -z-10 translate-x-1/3 -translate-y-1/3 group-hover:from-[#630102]/10 transition-colors duration-500"></div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-4 pb-4 border-b border-[#1B1716]/5 group-hover:border-[#630102]/10 transition-colors">
                          <h4 className="text-2xl font-heading font-light tracking-tight text-[#1B1716] mb-1 sm:mb-0">{tier.name}</h4>
                          <div className="flex items-center gap-3">
                            <div className="h-[1px] w-8 bg-[#630102]/20 hidden sm:block"></div>
                            <span className="text-sm font-heading font-bold tracking-widest text-[#630102] uppercase">{tier.price}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm font-serif italic text-[#1B1716]/70 mb-5 leading-relaxed">
                          Target: {tier.target}
                        </p>
                        
                        <ul className="space-y-2.5">
                          {tier.features?.map((f: string) => (
                            <li key={f} className="text-[#1B1716]/80 text-sm flex items-start gap-3 group/item">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#630102]/40 mt-1.5 group-hover/item:bg-[#630102] group-hover/item:shadow-[0_0_8px_rgba(99,1,2,0.6)] transition-all flex-shrink-0"></div>
                              <span className="font-light tracking-wide">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
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
