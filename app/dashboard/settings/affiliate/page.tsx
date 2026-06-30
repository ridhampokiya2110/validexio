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
                Invite & Earn
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-[#1B1716] mb-6 max-w-3xl leading-[1.1]">
                Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cherry to-[#910505]">Validexio</span> Partner Network
              </h1>
              
              <p className="text-lg lg:text-xl text-[#1B1716]/60 mb-10 max-w-2xl leading-relaxed font-medium">
                Help fellow founders validate their ideas while building a powerful new revenue stream. Access high-converting assets, real-time analytics, and automatic payouts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a aria-label="Link action" 
                  href="https://validexio.lemonsqueezy.com/affiliates" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center justify-center py-4 px-8 rounded-2xl bg-gradient-to-r from-[#630102] via-[#A80205] to-[#630102] bg-[length:200%_auto] text-white font-semibold text-lg transition-all duration-500 hover:bg-[position:right_center] hover:-translate-y-1 hover:shadow-[0_15px_30px_-8px_rgba(99,1,2,0.4)] ring-2 ring-transparent hover:ring-[#630102]/20 ring-offset-2 ring-offset-[#FDFCF8] overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 w-full h-full transform -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  <span className="relative z-10 flex items-center gap-2">
                    Access Partner Hub
                    <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Value Props Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Prop 1 */}
            <div className="bg-white p-8 rounded-3xl border border-[#1B1716]/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group/card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cherry/5 rounded-bl-full -z-0 transition-transform duration-500 group-hover/card:scale-110" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF5F5] to-[#FFE0E0] flex items-center justify-center mb-6 shadow-inner border border-white relative z-10">
                <CircleDollarSign className="w-7 h-7 text-cherry" strokeWidth={2.5} />
              </div>
              <h3 className="font-black text-4xl text-[#1B1716] mb-3 relative z-10">
                20<span className="text-cherry">%</span>
              </h3>
              <h4 className="font-bold text-lg text-[#1B1716] mb-2 relative z-10">Recurring Commission</h4>
              <p className="text-[#1B1716]/60 text-sm font-medium leading-relaxed relative z-10">
                Earn 20% commission for life on every validation package your referrals purchase. Uncapped earning potential.
              </p>
            </div>

            {/* Prop 2 */}
            <div className="bg-white p-8 rounded-3xl border border-[#1B1716]/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group/card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-butter/10 rounded-bl-full -z-0 transition-transform duration-500 group-hover/card:scale-110" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFFCE8] to-[#FFF5B2] flex items-center justify-center mb-6 shadow-inner border border-white relative z-10">
                <Target className="w-7 h-7 text-yellow-600" strokeWidth={2.5} />
              </div>
              <h3 className="font-black text-4xl text-[#1B1716] mb-3 relative z-10">
                10<span className="text-yellow-600">%</span>
              </h3>
              <h4 className="font-bold text-lg text-[#1B1716] mb-2 relative z-10">Audience Discount</h4>
              <p className="text-[#1B1716]/60 text-sm font-medium leading-relaxed relative z-10">
                Give your audience an exclusive 10% discount applied automatically at checkout to drive higher conversions.
              </p>
            </div>

            {/* Prop 3 */}
            <div className="bg-white p-8 rounded-3xl border border-[#1B1716]/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group/card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -z-0 transition-transform duration-500 group-hover/card:scale-110" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-6 shadow-inner border border-white relative z-10">
                <Zap className="w-7 h-7 text-emerald-600" strokeWidth={2.5} />
              </div>
              <h3 className="font-black text-4xl text-[#1B1716] mb-3 relative z-10">
                Auto
              </h3>
              <h4 className="font-bold text-lg text-[#1B1716] mb-2 relative z-10">Monthly Payouts</h4>
              <p className="text-[#1B1716]/60 text-sm font-medium leading-relaxed relative z-10">
                Payments hit your bank account or PayPal automatically every month. Zero invoicing, zero friction.
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-3xl border border-[#1B1716]/5 p-8 lg:p-12 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B1716] mb-8 text-center">How to get started</h2>
            <div className="flex flex-col md:flex-row justify-between relative">
              <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-cherry/20 via-cherry/40 to-cherry/20" />
              
              {[
                { step: "1", title: "Join the Hub", desc: "Click the button above to access your dedicated partner portal." },
                { step: "2", title: "Get Your Link", desc: "Instantly generate your unique tracking URL and discount code." },
                { step: "3", title: "Share & Earn", desc: "Share with your network and track your real-time earnings." }
              ].map((item, i) => (
                <div key={`item-${i}`} className="flex flex-col items-center text-center relative z-10 mb-8 md:mb-0 max-w-[240px] mx-auto">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-cherry text-cherry font-black text-lg flex items-center justify-center mb-4 shadow-sm shadow-cherry/10">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-[#1B1716] text-lg mb-2">{item.title}</h4>
                  <p className="text-sm text-[#1B1716]/60 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
