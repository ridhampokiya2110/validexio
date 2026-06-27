"use client";

import { motion } from "framer-motion";
import { Check, X, Shield, BarChart3, Zap, Layers, Rocket, Info } from "lucide-react";
import { ComparisonSection } from "@/lib/data/competitors";

export function DeepComparison({ sections, competitorName }: { sections: ComparisonSection[], competitorName: string }) {
  
  // Icon mapper function for a subtle visual touch
  const getIcon = (name: string) => {
    if (name.includes("Data") || name.includes("Research")) return <BarChart3 className="w-5 h-5" />;
    if (name.includes("Code") || name.includes("Engineering") || name.includes("Format")) return <Layers className="w-5 h-5" />;
    if (name.includes("Lead") || name.includes("Acquisition")) return <Rocket className="w-5 h-5" />;
    if (name.includes("Pricing") || name.includes("Cost")) return <Zap className="w-5 h-5" />;
    return <Shield className="w-5 h-5" />;
  };

  return (
    <div className="w-full">
      {sections.map((section, sIdx) => (
        <section key={section.id} className="mb-20">
          {/* Section Header */}
          <div className="mb-8 border-b border-[#1B1716]/10 pb-4">
            <div className="flex items-baseline gap-3">
              <span className="font-black text-xl tracking-widest text-[#75070C] font-mono tabular-nums">
                {section.id}
              </span>
              <span className="font-bold uppercase tracking-widest text-[#1B1716] text-sm md:text-base">
                {section.title}
              </span>
              <span className="ml-auto hidden md:inline-block font-medium text-xs text-[#1B1716]/40 tabular-nums">
                {section.features.length} POINTS
              </span>
            </div>
            <p className="mt-2 text-sm italic leading-relaxed text-[#1B1716]/60">
              {section.subtitle}
            </p>
          </div>

          {/* Features Wrapper */}
          <div className="space-y-4">
            {section.features.map((feature, fIdx) => (
              <motion.article 
                key={fIdx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: fIdx * 0.1 }}
                className="overflow-hidden rounded-2xl border border-[#1B1716]/10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
              >
                {/* Feature Header */}
                <div className="flex items-center gap-3 px-6 py-4 bg-[#FDFCF8] border-b border-[#1B1716]/5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#75070C]/10 text-[#75070C]">
                    {getIcon(feature.name)}
                  </span>
                  <h3 className="min-w-0 flex-1 font-bold leading-tight tracking-tight text-[#1B1716] text-lg">
                    {feature.name}
                  </h3>
                  <span className="shrink-0 rounded-full border border-[#75070C]/30 bg-[#75070C]/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#75070C]">
                    {feature.pill}
                  </span>
                </div>

                {/* Comparison Grid */}
                <div className="grid md:grid-cols-2">
                  
                  {/* Validexio Side */}
                  <div className="relative px-6 py-6 md:border-r border-[#1B1716]/5 bg-gradient-to-b from-[#75070C]/5 to-transparent">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-xs font-black tracking-wider text-[#75070C] uppercase">
                        Validexio
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#75070C]/30 bg-[#75070C]/10 text-[#75070C]">
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold leading-snug tracking-tight text-[#1B1716] text-base">
                          {feature.validexio.title}
                        </p>
                        <p className="mt-2 text-sm italic leading-relaxed text-[#75070C]/80 font-medium">
                          {feature.validexio.impact}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Competitor Side */}
                  <div className="px-6 py-6 bg-[#FAFAFA]">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-xs font-bold tracking-wider text-[#1B1716]/40 uppercase">
                        {competitorName}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#1B1716]/10 bg-[#1B1716]/5 text-[#1B1716]/40">
                        <X className="w-4 h-4" strokeWidth={2} />
                      </span>
                      <p className="min-w-0 flex-1 text-sm leading-snug text-[#1B1716]/60 font-medium mt-1">
                        {feature.competitor.title}
                      </p>
                    </div>
                  </div>

                </div>
              </motion.article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
