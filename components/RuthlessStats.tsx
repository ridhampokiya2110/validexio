"use client";

import React from "react";

export function RuthlessStats() {
  return (
    <section className="w-full py-24 bg-transparent relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        <div className="glass-card p-8 md:p-12 shadow-2xl relative overflow-hidden border-[#1B1716]/10">
          {/* Subtle Glow Effect */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-cherry/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            {/* Copy Side */}
            <div>
              <div className="inline-flex items-center gap-2 bg-cherry/10 px-3 py-1.5 rounded-full mb-6 border border-cherry/20">
                <span className="w-2 h-2 bg-cherry rounded-full animate-pulse" />
                <span className="text-xs font-bold text-cherry tracking-widest uppercase">
                  Execution &gt; Validation
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-[#1B1716] mb-4 leading-tight tracking-tight">
                We don't sell <span className="gradient-text">false hope</span>. <br />
                We sell <span className="gradient-text">reality</span>.
              </h2>
              
              <p className="text-lg text-[#1B1716]/60 leading-relaxed font-medium">
                Typical tools say yes to 90% of ideas. Validexio is strict. We reject 78% of ideas and immediately give you a better, profitable direction so you stop wasting time and money.
              </p>
            </div>

            {/* Graph Side */}
            <div className="bg-white/80 rounded-2xl p-6 border border-[#1B1716]/10 shadow-sm">
              <p className="text-xs font-bold text-[#1B1716]/50 uppercase tracking-widest mb-6 text-center">
                Validexio Results
              </p>

              {/* Bar 1 */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-[#1B1716]">Pivot Recommended</span>
                  <span className="text-lg font-black text-cherry">78%</span>
                </div>
                <div className="w-full bg-[#1B1716]/5 h-4 rounded-full overflow-hidden">
                  <div className="bg-cherry h-full rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{ width: "78%" }} />
                </div>
              </div>

              {/* Bar 2 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-[#1B1716]">Green Light</span>
                  <span className="text-lg font-black text-emerald-500">22%</span>
                </div>
                <div className="w-full bg-[#1B1716]/5 h-4 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]" style={{ width: "22%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
