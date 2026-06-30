import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap, Target, BarChart3, Code, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { competitors } from "@/lib/data/competitors";

export const metadata: Metadata = {
  title: "Validexio vs The Market - Data Engine Startup Validation",
  description: "See why founders are switching from legacy PDF report generators to Validexio's live execution engine.",
};

export default function CompareHubPage() {
  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#1B1716] font-sans selection:bg-[#75070C]/20 selection:text-[#75070C]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
          <span className="badge badge-cherry mb-6">
            The Market Standard is Broken
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-[#1B1716] tracking-tight leading-tight mb-6">
            Validexio vs <br />
            <span className="gradient-text">The Market</span>
          </h1>
          <p className="text-lg md:text-xl text-[#1B1716]/80 max-w-3xl mx-auto leading-relaxed mb-10">
            Most validation tools charge you for a static PDF report that tells you what you already know. 
            We build the actual execution assets—React code, architecture blueprints, and verified B2B leads—so you can launch today.
          </p>
        </div>
      </section>

      {/* Competitors Grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitors.map((comp) => {
            // Extract the target output from the new schema
            const targetOutput = comp.targetOutputCompetitor;
            
            return (
              <Link aria-label="Navigation link" 
                key={comp.id} 
                href={`/compare/${comp.slug}`}
                className="group glass-card p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-[#75070C]/20"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-black text-[#1B1716] group-hover:text-[#75070C] transition-colors">{comp.name}</h3>
                  <div className="w-8 h-8 rounded-full bg-[#1B1716]/5 flex items-center justify-center group-hover:bg-[#75070C]/10 transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-[#1B1716]/40 group-hover:text-[#75070C] transition-colors" />
                  </div>
                </div>
                
                <p className="text-sm font-medium text-[#1B1716]/60 mb-6 line-clamp-3">
                  {comp.heroSubheadline}
                </p>
                
                <div className="mt-auto space-y-3 pt-6 border-t border-[#1B1716]/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1B1716]/40 uppercase tracking-wider">Their Output</span>
                    <span className="font-medium text-[#1B1716]/80">{targetOutput}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1B1716]/40 uppercase tracking-wider">Validexio Output</span>
                    <span className="font-bold text-[#75070C]">{comp.targetOutputValidexio}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Global CTA */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center mb-20">
        <div className="glass-card p-12 bg-gradient-to-b from-white to-[#1B1716]/[0.02]">
          <h2 className="text-3xl font-bold text-[#1B1716] mb-4">Ready to stop planning and start shipping?</h2>
          <p className="text-[#1B1716]/60 mb-8 max-w-2xl mx-auto">
            Get the code, the leads, and the architecture you need to launch your SaaS this weekend.
          </p>
          <Link aria-label="Navigation link" 
            href="https://your-store.lemonsqueezy.com/checkout/buy/placeholder"
            className="btn-primary inline-flex items-center justify-center px-8 py-4 text-lg"
          >
            Deploy Validexio for INR 1499
            <Zap className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
