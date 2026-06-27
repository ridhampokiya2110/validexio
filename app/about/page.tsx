"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Target, Rocket, Users, Globe, Brain } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1B1716] font-sans selection:bg-cherry/40 selection:text-[#1B1716] flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cherry/10 rounded-full blur-[120px] pointer-events-none" />
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 text-[#1B1716] relative z-10">
            We <span className="gradient-text">Kill</span> Bad Ideas <br />
            Before They Kill Your <span className="gradient-text">Bank Account</span>.
          </h1>
          <p className="text-lg md:text-xl text-[#1B1716]/70 max-w-3xl mx-auto mb-10 leading-relaxed relative z-10">
            Validexio was built by founders, for founders. We got tired of watching brilliant people waste months of their lives and thousands of dollars building products nobody actually wanted. So we built the ultimate reality check.
          </p>
        </section>

        {/* The Problem Section */}
        <section className="py-24 bg-white border-y border-[#1B1716]/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cherry/5 rounded-full blur-[150px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-black mb-6 text-[#1B1716]">The 90% Failure Rate is a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#630102] to-[#CE202A]">Choice</span>.</h2>
                <p className="text-[#1B1716]/70 text-lg mb-6 leading-relaxed font-medium">
                  Most startups fail not because they couldn't build the product, but because they built something the market didn't need. They spend 6 months coding, launch to crickets, and wonder what went wrong.
                </p>
                <p className="text-[#1B1716]/70 text-lg leading-relaxed font-medium">
                  Validexio completely flips this model. By leveraging advanced AI, competitor intelligence, and hard unit economics, we simulate the first 6 months of your startup in exactly 60 seconds. We validate the market before you write a single line of code.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#FDFCF8] border border-[#1B1716]/10 shadow-[0_8px_30px_rgba(27,23,22,0.04)] p-8 rounded-2xl hover:shadow-[0_8px_30px_rgba(117,7,12,0.1)] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-cherry/10 flex items-center justify-center mb-6 border border-cherry/20">
                    <Brain className="w-6 h-6 text-cherry" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#1B1716]">AI-Powered Intelligence</h3>
                  <p className="text-[#1B1716]/60 text-sm font-medium">Our models analyze thousands of data points, competitor strategies, and market trends instantly.</p>
                </div>
                <div className="bg-[#FDFCF8] border border-[#1B1716]/10 shadow-[0_8px_30px_rgba(27,23,22,0.04)] p-8 rounded-2xl sm:translate-y-8 hover:shadow-[0_8px_30px_rgba(117,7,12,0.1)] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                    <Target className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#1B1716]">Zero Bias</h3>
                  <p className="text-[#1B1716]/60 text-sm font-medium">Friends will tell you your idea is great. Validexio will tell you exactly why it might fail.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#1B1716] mb-4">Our Core <span className="gradient-text">Values</span></h2>
            <p className="text-lg text-[#1B1716]/60 max-w-2xl mx-auto">The principles that drive every feature we build.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-8 rounded-2xl bg-white border border-[#1B1716]/10 shadow-[0_8px_30px_rgba(27,23,22,0.04)] hover:shadow-[0_8px_30px_rgba(117,7,12,0.1)] transition-all">
              <ShieldCheck className="w-10 h-10 text-cherry mb-6" />
              <h3 className="text-2xl font-bold text-[#1B1716] mb-3">Brutal Honesty</h3>
              <p className="text-[#1B1716]/70 leading-relaxed">We don't sugarcoat. If your idea is oversaturated or lacks a clear USP, our engine will tell you directly to save you time and money.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-[#1B1716]/10 shadow-[0_8px_30px_rgba(27,23,22,0.04)] hover:shadow-[0_8px_30px_rgba(117,7,12,0.1)] transition-all">
              <Rocket className="w-10 h-10 text-cherry mb-6" />
              <h3 className="text-2xl font-bold text-[#1B1716] mb-3">Speed to Execution</h3>
              <p className="text-[#1B1716]/70 leading-relaxed">Ideas are cheap; execution is everything. We give you the exact blueprints, templates, and strategy to start executing on day one.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-[#1B1716]/10 shadow-[0_8px_30px_rgba(27,23,22,0.04)] hover:shadow-[0_8px_30px_rgba(117,7,12,0.1)] transition-all">
              <Users className="w-10 h-10 text-cherry mb-6" />
              <h3 className="text-2xl font-bold text-[#1B1716] mb-3">Founder First</h3>
              <p className="text-[#1B1716]/70 leading-relaxed">Everything we design is intended to empower the solo founder, the indie hacker, and the small agency to compete with venture-backed giants.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-maroon/5 border-t border-cherry/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-[#1B1716] mb-6">Ready to face reality?</h2>
            <p className="text-lg text-[#1B1716]/70 mb-10">Stop guessing. Start validating. Get a comprehensive breakdown of your startup idea in 60 seconds.</p>
            <Link href="/#pricing" className="inline-flex items-center justify-center gap-2 bg-cherry hover:bg-[#910505] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-cherry/30 hover:scale-105">
              Validate Your Idea Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
