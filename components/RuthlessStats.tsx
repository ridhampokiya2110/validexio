"use client";
import React from "react";

export function RuthlessStats() {
  return (
    <section className="w-full py-20 bg-transparent relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Premium Dark Card — Sharp Square Design */}
        <div className="bg-[#1B1716] relative overflow-hidden" style={{ borderRadius: "0px" }}>

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#75070C] to-transparent" />

          {/* Corner accent — top right */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#75070C]/10 pointer-events-none"
            style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(253,252,248,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(253,252,248,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }} />

          <div className="relative z-10 grid md:grid-cols-2 gap-0">

            {/* ── LEFT: Copy ── */}
            <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-center md:border-r border-white/5">

              {/* Tag */}
              <div className="inline-flex items-center gap-2 mb-8 self-start">
                <div className="w-2 h-2 bg-[#75070C] rounded-full animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.25em] uppercase text-white/40">
                  Execution &gt; Validation
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-6">
                We don't sell{" "}
                <span style={{
                  background: "linear-gradient(90deg, #D97706, #75070C)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  false hope.
                </span>
                <br />
                We sell{" "}
                <span style={{
                  background: "linear-gradient(90deg, #D97706, #75070C)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  reality.
                </span>
              </h2>

              <p className="text-white/50 text-sm sm:text-base leading-relaxed font-medium">
                Typical tools say yes to 90% of ideas. Validexio is strict.
                We reject 78% of ideas and immediately give you a better,
                profitable direction so you stop wasting time and money.
              </p>

              {/* Divider */}
              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[2px] bg-[#75070C]" />
                  <p className="text-[10px] font-black tracking-widest text-white/30 uppercase">
                    Based on 10,000+ validations
                  </p>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Stats ── */}
            <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-center">

              {/* Header */}
              <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase mb-8">
                Validexio Results
              </p>

              {/* Stat 1 — Pivot */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-[#75070C]" />
                    <span className="text-xs font-bold text-white/60 tracking-wider uppercase">
                      Pivot Recommended
                    </span>
                  </div>
                  <span className="text-2xl font-black text-white tabular-nums">
                    78<span className="text-[#75070C] text-lg">%</span>
                  </span>
                </div>
                {/* Bar */}
                <div className="h-1.5 bg-white/5 w-full">
                  <div
                    className="h-full bg-[#75070C]"
                    style={{ width: "78%" }}
                  />
                </div>
              </div>

              {/* Stat 2 — Green Light */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-500" />
                    <span className="text-xs font-bold text-white/60 tracking-wider uppercase">
                      Green Light
                    </span>
                  </div>
                  <span className="text-2xl font-black text-white tabular-nums">
                    22<span className="text-emerald-400 text-lg">%</span>
                  </span>
                </div>
                {/* Bar */}
                <div className="h-1.5 bg-white/5 w-full">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: "22%" }}
                  />
                </div>
              </div>

              {/* Bottom KPIs */}
              <div className="grid grid-cols-2 gap-4 mt-2 pt-8 border-t border-white/5">
                {[
                  { label: "Avg. Score", value: "61/100" },
                  { label: "Turnaround", value: "< 60s" },
                ].map((kpi) => (
                  <div key={kpi.label}>
                    <p className="text-[9px] font-black tracking-widest text-white/25 uppercase mb-1">
                      {kpi.label}
                    </p>
                    <p className="text-lg font-black text-white">{kpi.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#75070C]/40 via-transparent to-transparent" />
        </div>

      </div>
    </section>
  );
}
