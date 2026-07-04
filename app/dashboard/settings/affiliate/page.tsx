"use client";

import Link from "next/link";
import { ChevronLeft, Award, ExternalLink, ArrowRight, Zap, Target, TrendingUp, Sparkles, CircleDollarSign } from "lucide-react";

export default function AffiliatePortalPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1B1716] font-sans pb-12 selection:bg-cherry/20">
      {/* HEADER */}
      <header className="sticky top-0 z-40 h-16 flex items-center px-6 bg-[#FDFCF8]/80 backdrop-blur-md border-b border-[#1B1716]/5">
        <div className="flex-1 flex items-center gap-4 max-w-7xl mx-auto w-full">
          <Link aria-label="Navigation link" href="/dashboard/settings" className="w-9 h-9 rounded-xl hover:bg-[#1B1716]/5 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#1B1716]/80" />
          </Link>
          <span className="font-semibold text-[15px] text-[#1B1716] tracking-tight">Partner & Affiliate Portal</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
        <div className="animate-fade-in-scale">
          {/* Hero Section */}
          <div className="relative rounded-[2.5rem] bg-white border border-[#1B1716]/5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] overflow-hidden mb-8 group">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cherry/10 to-butter/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 opacity-70 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cherry/5 to-transparent rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
            
            <div className="relative z-10 p-10 lg:p-16 flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-gradient-to-r from-[#FDFCF8] to-white border border-[#1B1716]/10 text-[#1B1716]/70 text-[12px] font-bold tracking-[0.2em] uppercase mb-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-default">
                Coming Soon
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-[#1B1716] mb-6 max-w-3xl leading-[1.1]">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cherry to-[#910505]">Validexio</span> Partner Network
              </h1>
              
              <p className="text-lg lg:text-xl text-[#1B1716]/60 mb-10 max-w-2xl leading-relaxed font-medium">
                We are currently upgrading our affiliate platform to provide a better experience. The partner network will be launching soon. Stay tuned!
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
