import { Verdict as VerdictType } from "@/lib/data/competitors";
import { Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";

interface VerdictProps {
  competitorName: string;
  data: VerdictType;
}

export function Verdict({ competitorName, data }: VerdictProps) {
  if (!data) return null;

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto border-t border-[#1B1716]/10">
      <div className="text-center mb-16">
        <span className="badge badge-cherry mb-4">The Verdict</span>
        <h2 className="text-3xl md:text-5xl font-black text-[#1B1716] tracking-tight">
          Who should use which?
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Competitor Column */}
        <div className="flex flex-col">
          <div className="pb-4 border-b-2 border-gray-200 mb-6">
            <h3 className="text-2xl font-bold text-gray-500">
              Choose {competitorName} if...
            </h3>
          </div>
          <ul className="space-y-6 flex-grow">
            {data.competitorBestFor.map((item, idx) => (
              <li key={`item-${idx}`} className="flex items-start gap-4 text-gray-500">
                <X className="w-6 h-6 shrink-0 mt-0.5 text-gray-400" />
                <span className="text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Validexio Column */}
        <div className="flex flex-col">
          <div className="pb-4 border-b-2 border-[#75070C] mb-6">
            <h3 className="text-2xl font-bold text-[#1B1716]">
              Choose Validexio if...
            </h3>
          </div>
          <ul className="space-y-6 flex-grow">
            {data.validexioBestFor.map((item, idx) => (
              <li key={`item-${idx}`} className="flex items-start gap-4 text-[#1B1716]">
                <Check className="w-6 h-6 shrink-0 mt-0.5 text-[#75070C]" />
                <span className="text-lg font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-20 text-center">
        <div className="inline-block p-[2px] rounded-full bg-gradient-to-r from-[#75070C] to-[#a8101a] shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
          <Link aria-label="Navigation link" href="https://your-store.lemonsqueezy.com/checkout/buy/placeholder" className="bg-[#1B1716] text-white px-10 py-5 rounded-full font-bold text-lg inline-flex items-center hover:bg-[#2a2423] transition-colors">
            Start Building Now <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
        <p className="mt-6 text-[#1B1716]/60 font-medium">One-time payment of INR 1499. You own the code forever.</p>
      </div>
    </section>
  );
}
