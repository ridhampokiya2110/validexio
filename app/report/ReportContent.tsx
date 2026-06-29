"use client";

import { useState, useEffect } from "react";
import { Terminal, Lock, CheckCircle2, AlertTriangle, TrendingUp, Zap, ChevronRight, Layout, Users } from "lucide-react";

const TERMINAL_STEPS = [
  "Initializing Scraping Engines...",
  "Computing Unit Economics...",
  "Rendering UI Mockups...",
  "Compiling Day-1 Leads...",
];

export default function ReportContent() {
  const [loadingStep, setLoadingStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (loadingStep < TERMINAL_STEPS.length) {
      const timer = setTimeout(() => {
        setLoadingStep((prev) => prev + 1);
      }, 800); // 800ms per step
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        setIsLoaded(true);
      }, 600);
      return () => clearTimeout(finalTimer);
    }
  }, [loadingStep]);

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-full max-w-2xl bg-[#FDFCF8] border border-maroon rounded-lg shadow-glow-cherry overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#FDFCF8] border-b border-maroon/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-cherry/40 border border-cherry/60" />
              <div className="w-3 h-3 rounded-full bg-cherry/40 border border-cherry/60" />
              <div className="w-3 h-3 rounded-full bg-[#1B1716]/20 border border-[#1B1716]/40" />
            </div>
            <div className="ml-4 text-xs font-mono text-[#1B1716]/50 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              validexio_engine_v2.sh
            </div>
          </div>
          
          {/* Terminal Body */}
          <div className="p-6 font-mono text-sm leading-relaxed min-h-[200px] flex flex-col gap-2">
            {TERMINAL_STEPS.slice(0, loadingStep).map((step, idx) => (
              <div key={idx} className="flex items-center gap-3 text-[#1B1716]/80 animate-fade-in">
                <span className="text-cherry">{">"}</span>
                <span>{step}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-cherry ml-auto" />
              </div>
            ))}
            {loadingStep < TERMINAL_STEPS.length && (
              <div className="flex items-center gap-3 text-[#1B1716]">
                <span className="text-cherry">{">"}</span>
                <span className="animate-pulse">_</span>
              </div>
            )}
            {loadingStep === TERMINAL_STEPS.length && (
              <div className="flex items-center gap-3 text-cherry mt-4 animate-fade-in font-bold">
                <span className="text-cherry">{">"}</span>
                <span>Analysis Complete. Generating Report...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-fade-in-scale">
      
      {/* SECTION 1: THE REALITY CHECK */}
      <section className="text-center space-y-8">
        <div className="inline-flex items-center gap-2 badge badge-success mb-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Initial Validation Complete
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="text-[#1B1716]"><span className="gradient-text">Reality</span> Check</span>
        </h1>

        <div className="flex flex-col items-center justify-center pt-4">
          <div className="relative flex items-center justify-center w-48 h-48 rounded-full shadow-glow-butter bg-[#FDFCF8]">
            {/* Simple circular gauge simulation */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(27, 23, 22, 0.05)"
                strokeWidth="12"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#FFEDAB"
                strokeWidth="12"
                strokeDasharray="565.48"
                strokeDashoffset="124.4" /* roughly 78% of circumference */
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center z-10">
              <span className="text-5xl font-black text-cherry drop-shadow-md">78</span>
              <span className="text-sm font-semibold tracking-wider text-[#1B1716]/60 uppercase mt-1">Viability Score</span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-8 text-left">
          <div className="glass bg-maroon/20 border-maroon/40 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cherry" />
            <div className="flex items-start gap-4">
              <div className="p-2 bg-cherry/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-cherry" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1B1716] mb-2">The Anti-Roadmap</h3>
                <p className="text-[#1B1716]/80 leading-relaxed">
                  Market data suggests your proposed &quot;Data Engine Social Feed&quot; feature will drain engineering resources with near-zero ROI. Early adopters in this segment prioritize workflow automation over social interaction. Build the integration engine first; scrap the feed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: LOCKED MASTERPIECE (FOMO ENGINE) */}
      <section className="relative">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1B1716] mb-2">Execution Assets Generated</h2>
          <p className="text-[#1B1716]/60">We built the foundation. You just need to unlock it.</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-[#1B1716]/10 bg-[#FDFCF8]">
          
          {/* BLURRED CONTENT LAYER */}
          <div className="grid md:grid-cols-2 gap-px bg-[#1B1716]/5 blur-md select-none pointer-events-none opacity-50">
            {/* Fake Mockup Section */}
            <div className="bg-[#FDFCF8] p-8 h-[400px]">
              <div className="flex items-center gap-2 mb-6">
                <Layout className="w-5 h-5 text-[#1B1716]/40" />
                <div className="h-4 w-32 bg-[#1B1716]/20 rounded" />
              </div>
              <div className="space-y-4">
                <div className="h-32 w-full bg-[#1B1716]/10 rounded-lg" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-[#1B1716]/10 rounded-lg" />
                  <div className="h-24 bg-[#1B1716]/10 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Fake Leads Section */}
            <div className="bg-[#FDFCF8] p-8 h-[400px]">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-[#1B1716]/40" />
                <div className="h-4 w-40 bg-[#1B1716]/20 rounded" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-[#1B1716]/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#1B1716]/20" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 bg-[#1B1716]/20 rounded" />
                      <div className="h-2 w-1/2 bg-[#1B1716]/10 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* OVERLAY LOCK CONTENT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FDFCF8]/40 z-10">
            <div className="w-16 h-16 rounded-full bg-cherry/20 flex items-center justify-center mb-6 shadow-glow-cherry">
              <Lock className="w-8 h-8 text-cherry" />
            </div>
            <h3 className="text-2xl font-bold text-[#1B1716] mb-3 text-center px-4">
              Unlock Full Execution Assets
            </h3>
            <p className="text-[#1B1716]/70 max-w-md text-center mb-8 px-4">
              View high-fidelity UI mockups, 10 vetted early-adopter leads, and copy-paste code boilerplates tailored to your idea.
            </p>
            <a href="#paywall" className="btn-primary">
              View Pricing to Unlock
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 3: PAYWALL CHECKOUT */}
      <section id="paywall" className="pt-12 border-t border-[#1B1716]/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1B1716] mb-4">The truth about your idea.</h2>
          <p className="text-[#1B1716]/60 max-w-lg mx-auto">
            Stop guessing. Get the data-driven validation you need to build with confidence, or pivot before wasting months of dev time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Starter Card */}
          <div className="glass border-[#1B1716]/10 rounded-2xl p-8 flex flex-col transition-all duration-300 hover:border-[#1B1716]/20">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#1B1716] mb-2">Starter Validation</h3>
              <p className="text-[#1B1716]/60 text-sm h-10">Basic Market Analysis & Compliance Check.</p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-[#1B1716]">$19</span>
              <span className="text-[#1B1716]/50 ml-2">one-time</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-[#1B1716]/80">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-cherry shrink-0 mt-0.5" />
                <span>Viability Score & Market Sizing</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-cherry shrink-0 mt-0.5" />
                <span>&quot;Anti-Roadmap&quot; Feature Warnings</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-cherry shrink-0 mt-0.5" />
                <span>Basic Competitor Threat Matrix</span>
              </li>
            </ul>
            <button className="btn-secondary w-full">Unlock Starter Report</button>
          </div>

          {/* Execution Pro Card */}
          <div className="glass-card border-cherry/30 shadow-glow-butter rounded-2xl p-8 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="badge badge-butter bg-[#FDFCF8] text-[10px]">Recommended</span>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#1B1716] mb-2">Execution Pro</h3>
              <p className="text-[#1B1716]/60 text-sm h-10">Full Report + UI Mockups + Leads + Code.</p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-cherry">$39</span>
              <span className="text-[#1B1716]/50 ml-2">one-time</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-[#1B1716]/80">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-cherry shrink-0 mt-0.5" />
                <span className="font-medium text-[#1B1716]">Everything in Starter, plus:</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-cherry shrink-0 mt-0.5" />
                <span>2 High-Fidelity UI Mockups</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-cherry shrink-0 mt-0.5" />
                <span>10 Vetted Day-1 B2B Leads</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-cherry shrink-0 mt-0.5" />
                <span>Copy-Paste Code Boilerplate</span>
              </li>
              <li className="flex items-start gap-3">
                <TrendingUp className="w-4 h-4 text-cherry shrink-0 mt-0.5" />
                <span>Go-to-Market Strategy Document</span>
              </li>
            </ul>
            <button className="btn-primary w-full shadow-glow-cherry">Unlock Full Execution Pro</button>
          </div>
        </div>
      </section>
      
    </div>
  );
}
