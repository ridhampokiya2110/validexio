import Link from "next/link";
import { Lock } from "lucide-react";

interface PaywallGateProps {
  isUnlocked: boolean;
  score: number;
  pivotTeaser: string;
}

export default function PaywallGate({ isUnlocked, score, pivotTeaser }: PaywallGateProps) {
  if (isUnlocked) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 top-[30%] z-20 flex flex-col items-center justify-center backdrop-blur-md bg-white/30 rounded-b-2xl border-t border-[#1B1716]/10">
      
      {/* High Level Teaser Above the blur center */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 text-center">
        <span className="bg-[#1B1716] text-[#FFEDAB] text-xs font-bold uppercase px-3 py-1 rounded shadow-md mb-4 inline-block tracking-widest">
          Market Score: {score}/100
        </span>
        <h3 className="text-xl font-bold text-[#1B1716] drop-shadow-sm mb-2">Pivot Vector Teaser</h3>
        <p className="text-[#1B1716]/80 font-medium bg-white/80 p-4 rounded-xl shadow-sm border border-[#1B1716]/10">
          {pivotTeaser}
        </p>
      </div>

      {/* The Paywall Card */}
      <div className="bg-[#630102] border border-[#75070C] p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center relative mt-32">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#1B1716] rounded-full flex items-center justify-center border-4 border-[#FDFCF8]">
          <Lock className="w-5 h-5 text-[#FFEDAB]" />
        </div>
        
        <h2 className="text-2xl font-black text-[#EDEBDE] mb-4 mt-2">Access the Premium Execution Engine</h2>
        <p className="text-[#EDEBDE]/80 text-sm mb-6">
          Stop guessing. Get the comprehensive 15-page analytical business report, raw Next.js code boilerplate, PostgreSQL schemas, and AWS cloud architecture blueprints.
        </p>

        {/* Comparison Table */}
        <div className="bg-[#1B1716]/40 rounded-xl border border-[#75070C]/50 overflow-hidden mb-6 text-left">
          <div className="flex border-b border-[#75070C]/50 text-xs font-bold text-[#EDEBDE]/60 uppercase">
            <div className="flex-1 p-3">Feature</div>
            <div className="w-24 p-3 text-center border-l border-[#75070C]/50">Others</div>
            <div className="w-24 p-3 text-center bg-[#FFEDAB] text-[#1B1716]">Validexio</div>
          </div>
          <div className="flex text-sm text-[#EDEBDE] border-b border-[#75070C]/50">
            <div className="flex-1 p-3">Data Depth</div>
            <div className="w-24 p-3 text-center border-l border-[#75070C]/50 opacity-50">Surface</div>
            <div className="w-24 p-3 text-center font-bold text-[#FFEDAB]">Deep</div>
          </div>
          <div className="flex text-sm text-[#EDEBDE]">
            <div className="flex-1 p-3">Raw Code & DB Schemas</div>
            <div className="w-24 p-3 text-center border-l border-[#75070C]/50 opacity-50">No</div>
            <div className="w-24 p-3 text-center font-bold text-[#FFEDAB]">Yes</div>
          </div>
        </div>

        <Link aria-label="Navigation link"
          href="https://your-store.lemonsqueezy.com/checkout/buy/placeholder"
          className="block w-full bg-[#FFEDAB] text-[#1B1716] font-black py-4 rounded-xl text-lg hover:scale-[1.02] transition-transform shadow-lg border border-[#1B1716]"
        >
          Unlock Full Blueprint for ₹1499
        </Link>
        <p className="text-xs text-[#EDEBDE]/50 mt-4">One-time payment. Instant access.</p>
      </div>
    </div>
  );
}
