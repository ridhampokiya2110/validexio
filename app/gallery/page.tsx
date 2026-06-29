"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Share2, ShieldAlert, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function StartupGallery() {
  const router = useRouter();
  const roasts = [
    {
      id: 1,
      idea: "A social network exclusively for dogs to find playdates.",
      verdict: "0% Willingness-to-Pay. High acquisition cost. Pivot immediately. The end-user (dog) possesses zero purchasing power. The buyer (owner) already uses Facebook Groups.",
      negativeMetric: "0% Willingness-to-Pay.",
      saved: "$15,000 in dev costs",
    },
    {
      id: 2,
      idea: "Tinder for Co-founders.",
      verdict: "Extreme churn rate post-matching. Market size is artificially inflated by wantrepreneurs who will never pay a subscription. The successful matches leave the platform immediately.",
      negativeMetric: "Extreme churn rate",
      saved: "$42,000 in lost equity",
    },
    {
      id: 3,
      idea: "Uber but for private security guards.",
      verdict: "Severe regulatory risk. 90% margin loss to liability insurance. Target demographic prefers contracted firms over on-demand gig workers due to trust deficits.",
      negativeMetric: "90% margin loss",
      saved: "$120,000 in legal fees",
    },
    {
      id: 4,
      idea: "Blockchain-based decentralized grocery delivery.",
      verdict: "Negative unit economics. Adding a ledger to a low-margin logistics business increases latency and compute costs by 400% with zero consumer-facing benefit.",
      negativeMetric: "Negative unit economics.",
      saved: "$85,000 in AWS bills",
    },
    {
      id: 5,
      idea: "A to-do list app that shocks you if you miss a deadline.",
      verdict: "LTV:CAC ratio is inverted. Hardware integration costs eclipse potential subscription revenue. App Store guidelines strictly prohibit hardware that induces physical pain.",
      negativeMetric: "LTV:CAC ratio is inverted.",
      saved: "$25,000 in prototyping",
    },
    {
      id: 6,
      idea: "Airbnb for renting out your personal kitchen equipment.",
      verdict: "CAC exceeds LTV by 12x. The logistics of exchanging a $40 blender outweigh the rental yield. High risk of theft/damage with impossible insurance unit economics.",
      negativeMetric: "CAC exceeds LTV by 12x.",
      saved: "$60,000 in operations",
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1B1716] font-sans selection:bg-cherry/40 selection:text-[#1B1716]">
      {/* 1. TOP NAVIGATION */}
      <Navbar />

      <main className="pb-24">
        {/* 2. HERO SECTION */}
        <section className="relative pt-24 pb-20 px-6 lg:px-12 text-center max-w-5xl mx-auto flex flex-col items-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cherry rounded-full opacity-10 blur-[120px] pointer-events-none" />
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 relative z-10 w-full">
            <span className="block bg-gradient-to-r from-[#810100] via-[#C02626] to-[#D97706] bg-clip-text text-transparent pb-2 drop-shadow-sm">
              The Startup Graveyard.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#1B1716]/80 max-w-2xl leading-relaxed relative z-10 font-medium">
            Explore the most brutally honest Data Engine reality checks. See why thousands of bad ideas were stopped before they cost founders their life savings.
          </p>
        </section>

        {/* 3. MAIN CONTENT AREA: ROAST GALLERY (MASONRY GRID) */}
        <section className="px-6 lg:px-12 max-w-7xl mx-auto relative z-10 mb-32">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {roasts.map((roast) => {
              // Split the verdict to highlight the negative metric
              const verdictParts = roast.verdict.split(roast.negativeMetric);
              
              return (
                <div 
                  key={roast.id} 
                  className="break-inside-avoid bg-maroon/20 border border-cherry/30 rounded-2xl p-6 lg:p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cherry/60 hover:bg-maroon/30 hover:shadow-[0_12px_40px_rgba(117,7,12,0.2)] group flex flex-col"
                >
                  {/* Original Idea */}
                  <div className="mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#1B1716]/40 mb-2">Original Idea</h3>
                    <p className="text-lg md:text-xl font-bold italic text-[#1B1716] leading-snug">
                      &quot;{roast.idea}&quot;
                    </p>
                  </div>

                  {/* The Brutal Verdict */}
                  <div className="mb-8 flex-1">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2 flex items-center gap-1.5">
                      <ShieldAlert className="w-3 h-3" />
                      The Brutal Verdict
                    </h3>
                    <p className="text-sm text-[#1B1716]/80 leading-relaxed font-medium">
                      {verdictParts[0]}
                      <span className="text-white font-bold bg-[#810100] px-1.5 py-0.5 rounded shadow-sm">{roast.negativeMetric}</span>
                      {verdictParts[1]}
                    </p>
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="flex items-center justify-between pt-5 border-t border-cherry/20 mt-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FDFCF8] border border-cherry/30 shadow-[0_0_15px_rgba(255,237,171,0.05)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-cherry shadow-[0_0_8px_rgba(255,237,171,0.8)]" />
                      <span className="text-cherry text-[10px] font-bold uppercase tracking-wider">
                        {roast.saved}
                      </span>
                    </div>
                    
                    <button className="p-2 rounded-lg text-[#1B1716]/50 hover:text-[#1B1716] hover:bg-cherry/20 border border-transparent hover:border-cherry/30 transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. BOTTOM CALL-TO-ACTION BANNER */}
        <section className="px-6 lg:px-12 max-w-5xl mx-auto relative z-10">
          <div className="bg-[#FDFCF8] border border-cherry/40 rounded-3xl p-10 lg:p-16 flex flex-col items-center text-center relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-t from-cherry/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cherry rounded-full opacity-15 blur-[100px] pointer-events-none translate-y-1/2" />
            
            <h2 className="text-3xl md:text-4xl font-black text-[#1B1716] mb-8 tracking-tight relative z-10 max-w-2xl leading-tight">
              Is your idea the next unicorn, or does it belong in the graveyard?
            </h2>
            
            <button onClick={() => router.push('/pricing')} className="relative z-10 flex items-center gap-3 px-8 py-5 bg-[#75070C] hover:bg-[#910505] text-white font-bold text-lg rounded-xl transition-all shadow-[0_0_30px_rgba(117,7,12,0.4)] hover:shadow-[0_0_50px_rgba(117,7,12,0.6)] border border-[#a10505] hover:scale-105 animate-pulse-glow">
              Get Your Reality Check Now
              <ArrowRight className="w-5 h-5 text-butter" />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
