import { PricingReveal as PricingRevealType } from "@/lib/data/competitors";
import { DollarSign, Code2, CheckCircle2, AlertCircle, Sparkles, XCircle } from "lucide-react";

interface PricingRevealProps {
  competitorName: string;
  data: PricingRevealType;
}

export function PricingReveal({ competitorName, data }: PricingRevealProps) {
  if (!data) return null;

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cherry/10 text-cherry text-sm font-semibold tracking-wide uppercase">
          <DollarSign className="w-4 h-4" />
          Pricing Breakdown
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-[#1B1716] tracking-tight">
          Subscriptions vs Ownership
        </h2>
        <p className="text-xl text-[#1B1716]/60 max-w-2xl mx-auto font-medium">
          Compare standard recurring fees against our one-time flat fee execution model.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* Competitor Side - Standard Pricing Card */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-[#1B1716]/10 shadow-sm flex flex-col h-full relative">
          <div className="mb-8">
            <h3 className="font-black text-2xl text-[#1B1716] mb-2">{competitorName}</h3>
            <p className="text-[#1B1716]/60 font-medium">Standard subscription tiers</p>
          </div>
          
          <div className="space-y-4 flex-grow">
            {data.competitorTiers.map((tier, idx) => (
              <div key={`item-${idx}`} className="bg-[#FDFCF8] rounded-2xl p-5 border border-[#1B1716]/5 flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#1B1716] text-lg">{tier.name}</div>
                  <div className="text-sm text-[#1B1716]/60 mt-1 flex items-center gap-1.5">
                    {tier.validatesIdea.startsWith('Yes') ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    {tier.validatesIdea}
                  </div>
                </div>
                <div className="text-xl font-black text-[#1B1716]">
                  {tier.price}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#1B1716]/10">
            <div className="bg-[#1B1716]/5 text-[#1B1716]/70 text-sm font-medium p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#1B1716]/40 shrink-0 mt-0.5" />
              <p>Deliverables focus on research formats (PDFs, spreadsheets). <strong>Code or leads are not included.</strong></p>
            </div>
          </div>
        </div>

        {/* Validexio Side - Highlighted Premium Pricing Card */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 border-2 border-cherry shadow-xl shadow-cherry/5 flex flex-col h-full relative">
          {/* Subtle Accent Background */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cherry/5 to-transparent pointer-events-none rounded-t-[2rem]"></div>
          
          <div className="absolute top-0 right-8 transform -translate-y-1/2">
             <span className="bg-cherry text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-md">
               Recommended
             </span>
          </div>

          <div className="mb-8 relative z-10">
            <h3 className="font-black text-2xl text-[#1B1716] flex items-center gap-2 mb-2">
              Validexio Execution
            </h3>
            <p className="text-[#1B1716]/60 font-medium">One-time flat fee. Full ownership.</p>
          </div>

          <div className="flex-grow flex flex-col justify-center relative z-10">
            <div className="mb-10">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-[#1B1716]/50 mb-2">INR</span>
                <span className="text-6xl font-black text-[#1B1716] tracking-tighter">1499</span>
              </div>
              <p className="text-cherry font-bold mt-2 text-sm uppercase tracking-wider">No Recurring Subscriptions</p>
            </div>
            
            <div className="bg-cherry/5 rounded-2xl p-6 border border-cherry/10">
              <p className="text-[#1B1716]/80 text-sm font-bold uppercase tracking-wider mb-5">What you actually get:</p>
              <div className="space-y-4">
                {[
                  "Full React / Next.js Source Code",
                  "2 High-Fidelity UI Layouts",
                  "5 Verified B2B Target Leads",
                  "Complete Database Schemas",
                ].map((item, idx) => (
                  <div key={`item-${idx}`} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-cherry/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cherry" />
                    </div>
                    <span className="text-[#1B1716] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
