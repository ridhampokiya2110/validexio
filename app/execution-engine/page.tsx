import { Metadata } from "next";
import Link from "next/link";
import { PipelineVisualization } from "@/components/engine/PipelineVisualization";

export const metadata: Metadata = {
  title: "Execution Engine Architecture | Validexio",
  description: "Look under the hood of the Validexio Execution Engine. See exactly how we compile validated markets, Next.js codebases, and B2B leads in under 60 seconds.",
};

export default function ExecutionEnginePage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1B1716] font-sans selection:bg-cherry selection:text-[#FFFFFF]">
      
      {/* Architecture Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-block border border-cherry bg-[#75070C]/5 px-4 py-1.5 mb-8 text-xs font-bold tracking-widest uppercase text-cherry shadow-[2px_2px_0px_#75070C]">
          System Architecture
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-6 text-[#1B1716] leading-[1.1]">
          We Don't Just Source Data.<br />We Compile Businesses.
        </h1>
        <p className="text-lg md:text-xl font-medium text-[#1B1716]/70 max-w-3xl mx-auto mb-12 leading-relaxed">
          Look under the hood of the Validexio Execution Engine. See exactly how we turn a single sentence into a validated market, a functional Next.js codebase, and a live B2B lead list in under 60 seconds.
        </p>

        {/* Rigor Metric */}
        <div className="max-w-2xl mx-auto bg-[#FFFFFF] border border-[#1B1716]/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[4px_4px_0px_#1B1716]">
          <div className="text-left">
            <div className="text-4xl font-black text-cherry">80%</div>
            <div className="text-sm font-bold uppercase tracking-widest text-[#1B1716]/50">Rejection Rate</div>
          </div>
          <div className="h-px w-full md:h-12 md:w-px bg-[#1B1716]/10" />
          <div className="text-left md:text-right">
            <p className="text-sm font-medium text-[#1B1716]/80 leading-relaxed">
              We do not act as validation yes-men. 80% of ideas are rejected by the Rigor Filter. Only viable revenue models are fully compiled.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Stage Pipeline Visualization */}
      <section className="py-20 px-4 overflow-hidden">
        <PipelineVisualization />
      </section>

      {/* The Anti-PDF Manifesto */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-[#630102] border border-[#1B1716] p-8 md:p-12 shadow-[8px_8px_0px_#1B1716] text-center">
          <h2 className="text-2xl md:text-3xl font-black text-[#FDFCF8] uppercase tracking-tighter mb-6">
            The Anti-PDF Manifesto
          </h2>
          <p className="text-[#FFEDAB] text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            Academic validation tools end with a 15-page PDF citing SEC filings. Validexio ends with a repository you can deploy and a lead list you can email today. Execution &gt; Observation.
          </p>
          <Link 
            href="/dashboard/validate"
            className="inline-block bg-[#FDFCF8] text-[#1B1716] font-black uppercase tracking-widest px-8 py-4 border border-[#1B1716] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none shadow-[4px_4px_0px_#1B1716] transition-all"
          >
            Start Compiling Now
          </Link>
        </div>
      </section>

    </div>
  );
}
