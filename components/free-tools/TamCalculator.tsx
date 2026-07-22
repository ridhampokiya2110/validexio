"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Zap,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  BarChart3,
  ChevronRight,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

export function TamCalculator() {
  const [totalMarket, setTotalMarket] = useState<number | string>(10000);
  const [targetSegment, setTargetSegment] = useState<number | string>(20);
  const [marketShare, setMarketShare] = useState<number | string>(5);
  const [arpu, setArpu] = useState<number | string>(1200);
  const [cac, setCac] = useState<number | string>(400);
  const [grossMargin, setGrossMargin] = useState<number | string>(80);
  const [activeTab, setActiveTab] = useState<"inputs" | "results">("inputs");

  const tam = Number(totalMarket) * Number(arpu);
  const sam = tam * (Number(targetSegment) / 100);
  const som = sam * (Number(marketShare) / 100);
  const customersNeeded = Math.ceil(som / Number(arpu));
  const mrr = som / 12;
  const ltv = Number(arpu) * 3;
  const ltvCacRatio = (ltv * (Number(grossMargin) / 100)) / Number(cac);
  const paybackMonths = Number(cac) / ((Number(arpu) / 12) * (Number(grossMargin) / 100));
  const grossMrr = mrr * (Number(grossMargin) / 100);

  const fmt = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  const fmtCompact = (val: number) => {
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
    return fmt(val);
  };

  const inputs = [
    {
      label: "Total Potential Customers",
      sublabel: "TAM",
      icon: <Users className="w-4 h-4" />,
      value: totalMarket,
      setter: setTotalMarket,
      placeholder: "10,000",
      hint: "Total universe of people who could use your product",
      suffix: "people",
    },
    {
      label: "Annual Revenue Per User",
      sublabel: "ARPU",
      icon: <DollarSign className="w-4 h-4" />,
      value: arpu,
      setter: setArpu,
      placeholder: "1,200",
      hint: "Average $ earned per customer per year",
      prefix: "$",
    },
    {
      label: "Target Segment %",
      sublabel: "SAM",
      icon: <Target className="w-4 h-4" />,
      value: targetSegment,
      setter: setTargetSegment,
      placeholder: "20",
      hint: "% of TAM you can practically reach",
      suffix: "%",
    },
    {
      label: "Realistic Market Share %",
      sublabel: "SOM",
      icon: <TrendingUp className="w-4 h-4" />,
      value: marketShare,
      setter: setMarketShare,
      placeholder: "5",
      hint: "% of SAM you can capture in years 1-3",
      suffix: "%",
    },
    {
      label: "Customer Acquisition Cost",
      sublabel: "CAC",
      icon: <BarChart3 className="w-4 h-4" />,
      value: cac,
      setter: setCac,
      placeholder: "400",
      hint: "Avg marketing & sales cost to win 1 customer",
      prefix: "$",
    },
    {
      label: "Gross Margin %",
      sublabel: "GM",
      icon: <CheckCircle2 className="w-4 h-4" />,
      value: grossMargin,
      setter: setGrossMargin,
      placeholder: "80",
      hint: "Revenue % remaining after direct costs",
      suffix: "%",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex bg-[#1B1716]/5 rounded-2xl p-1 mb-6">
        <button
          onClick={() => setActiveTab("inputs")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === "inputs"
              ? "bg-white text-[#1B1716] shadow-md"
              : "text-[#1B1716]/50"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Inputs
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === "results"
              ? "bg-cherry text-white shadow-md"
              : "text-[#1B1716]/50"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Results
        </button>
      </div>

      {/* Live Preview Strip — mobile only */}
      <div
        className="md:hidden mb-4 grid grid-cols-3 gap-2 cursor-pointer"
        onClick={() => setActiveTab("results")}
      >
        {[
          { label: "TAM", value: fmtCompact(tam), color: "text-[#1B1716]" },
          { label: "SAM", value: fmtCompact(sam), color: "text-[#1B1716]" },
          {
            label: "SOM",
            value: fmtCompact(som),
            color: "text-cherry",
            highlight: true,
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`${item.highlight ? "bg-cherry/10 border-cherry/20" : "bg-white border-[#1B1716]/10"} border rounded-xl p-2.5 text-center`}
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#1B1716]/40 mb-0.5">
              {item.label}
            </p>
            <p
              className={`text-sm font-black ${item.color} leading-none`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#1B1716]/10 rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]">
        {/* Card Header */}
        <div className="px-5 py-4 sm:px-8 sm:py-6 border-b border-[#1B1716]/5 flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cherry/10 rounded-2xl flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-cherry" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-black text-[#1B1716] tracking-tight leading-tight">
              TAM / SAM / SOM Calculator
            </h2>
            <p className="text-xs text-[#1B1716]/40 font-medium">
              Real-time market sizing for your pitch
            </p>
          </div>
        </div>

        <div className="md:grid md:grid-cols-2">
          {/* ─── INPUTS PANEL ─── */}
          <div
            className={`${activeTab === "results" ? "hidden md:block" : "block"} px-5 py-5 sm:px-8 sm:py-8 md:border-r border-[#1B1716]/5`}
          >
            <div className="space-y-4">
              {inputs.map((inp) => (
                <div key={inp.sublabel} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-[#1B1716]/70 uppercase tracking-wider">
                      <span className="text-cherry">{inp.icon}</span>
                      {inp.label}
                      <span className="bg-cherry/10 text-cherry text-[9px] px-1.5 py-0.5 rounded-full font-black">
                        {inp.sublabel}
                      </span>
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    {inp.prefix && (
                      <span className="absolute left-3.5 text-[#1B1716]/40 font-bold text-sm pointer-events-none">
                        {inp.prefix}
                      </span>
                    )}
                    <input
                      type="number"
                      inputMode="numeric"
                      value={inp.value}
                      onChange={(e) => inp.setter(e.target.value)}
                      placeholder={inp.placeholder}
                      className={`w-full bg-[#FDFCF8] border border-[#1B1716]/10 rounded-xl py-3 text-base font-semibold text-[#1B1716] focus:ring-2 focus:ring-cherry/30 focus:border-cherry outline-none transition-all placeholder:text-[#1B1716]/20 ${inp.prefix ? "pl-7 pr-4" : inp.suffix ? "pl-4 pr-12" : "px-4"}`}
                    />
                    {inp.suffix && (
                      <span className="absolute right-3.5 text-[#1B1716]/30 font-bold text-sm pointer-events-none">
                        {inp.suffix}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#1B1716]/40 mt-1 pl-0.5">
                    {inp.hint}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile CTA to see results */}
            <button
              onClick={() => setActiveTab("results")}
              className="md:hidden mt-6 w-full flex items-center justify-center gap-2 bg-cherry text-white font-black text-sm py-3.5 rounded-xl shadow-lg shadow-cherry/20 active:scale-[0.98] transition-transform"
            >
              View My Market Results
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ─── RESULTS PANEL ─── */}
          <div
            className={`${activeTab === "inputs" ? "hidden md:block" : "block"} bg-[#1B1716] px-5 py-5 sm:px-8 sm:py-8`}
          >
            {/* TAM / SAM / SOM Big Numbers */}
            <div className="space-y-4 mb-6">
              {[
                {
                  label: "Total Addressable Market",
                  abbr: "TAM",
                  value: tam,
                  desc: "Total global demand for your product",
                  color: "text-white",
                  size: "text-2xl sm:text-3xl",
                },
                {
                  label: "Serviceable Available Market",
                  abbr: "SAM",
                  value: sam,
                  desc: "Segment your products can reach",
                  color: "text-white",
                  size: "text-2xl sm:text-3xl",
                },
                {
                  label: "Serviceable Obtainable Market",
                  abbr: "SOM",
                  value: som,
                  desc: "Your realistic revenue target",
                  color: "text-cherry",
                  size: "text-3xl sm:text-4xl",
                  highlight: true,
                },
              ].map((item) => (
                <div
                  key={item.abbr}
                  className={`${item.highlight ? "bg-cherry/20 border border-cherry/30 rounded-2xl p-4" : "border-b border-white/5 pb-4"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                      {item.label}
                    </span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${item.highlight ? "bg-cherry text-white" : "bg-white/10 text-white/60"}`}
                    >
                      {item.abbr}
                    </span>
                  </div>
                  <p
                    className={`${item.size} font-black ${item.color} leading-none tracking-tight`}
                  >
                    {fmtCompact(item.value)}
                  </p>
                  <p className="text-[10px] text-white/30 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Health Metrics Grid */}
            <div className="border-t border-white/10 pt-5">
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">
                Unit Economics
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Customers Needed",
                    value: customersNeeded.toLocaleString(),
                    sub: "To hit SOM",
                    status: null,
                  },
                  {
                    label: "Target MRR",
                    value: fmtCompact(mrr),
                    sub: "Monthly Revenue",
                    status: null,
                  },
                  {
                    label: "LTV",
                    value: fmtCompact(ltv),
                    sub: "3-year retention",
                    status: null,
                  },
                  {
                    label: "Gross MRR",
                    value: fmtCompact(grossMrr),
                    sub: "After direct costs",
                    status: null,
                  },
                  {
                    label: "LTV:CAC Ratio",
                    value: `${ltvCacRatio.toFixed(1)}:1`,
                    sub: ltvCacRatio >= 3 ? "Excellent" : "Improve CAC",
                    status: ltvCacRatio >= 3 ? "good" : "warn",
                  },
                  {
                    label: "Payback Period",
                    value: `${paybackMonths.toFixed(1)} mo`,
                    sub: paybackMonths <= 12 ? "On track" : "Reduce CAC",
                    status: paybackMonths <= 12 ? "good" : "warn",
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="bg-white/5 border border-white/5 rounded-xl p-3"
                  >
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1">
                      {m.label}
                    </p>
                    <p
                      className={`text-lg font-black leading-none ${
                        m.status === "good"
                          ? "text-emerald-400"
                          : m.status === "warn"
                            ? "text-orange-400"
                            : "text-white"
                      }`}
                    >
                      {m.value}
                    </p>
                    <p
                      className={`text-[9px] mt-1 ${m.status === "good" ? "text-emerald-400/60" : m.status === "warn" ? "text-orange-400/60" : "text-white/30"}`}
                    >
                      {m.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-xs text-white/50 mb-3 text-center font-medium">
                Want the exact code & architecture to capture this market?
              </p>
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 bg-cherry hover:bg-[#810100] text-white font-black text-sm py-3.5 rounded-xl shadow-lg shadow-cherry/30 transition-colors active:scale-[0.98]"
              >
                Generate My Startup Assets
                <Zap className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
