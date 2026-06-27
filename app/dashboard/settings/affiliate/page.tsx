"use client";

import Link from "next/link";
import { ChevronLeft, Award, ExternalLink, ArrowRight } from "lucide-react";

export default function AffiliatePortalPage() {
  return (
    <div className="min-h-screen text-[#1B1716] font-sans pb-12">
      {/* HEADER */}
      <header className="glass-nav sticky top-0 z-40 h-16 flex items-center px-6">
        <div className="flex-1 flex items-center gap-4">
          <Link href="/dashboard/settings" className="w-8 h-8 rounded-lg hover:bg-[#1B1716]/5 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#1B1716]" />
          </Link>
          <span className="font-bold text-lg text-[#1B1716] tracking-tight">Partner & Affiliate Portal</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mt-12 animate-fade-in-scale">
          <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cherry/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cherry to-[#630102] flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-butter" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-[#1B1716] to-[#630102] bg-clip-text text-transparent">
                Validexio Partner Program
              </h1>
            </div>

            <p className="text-[#1B1716]/70 text-lg mb-8 leading-relaxed relative z-10">
              We've partnered with <strong>Lemon Squeezy</strong> to provide a seamless, high-converting affiliate experience. 
              Earn a <strong className="text-cherry">25% recurring commission</strong> on every founder you validate, while giving your audience an exclusive <strong className="text-cherry">10% discount</strong> on their validations.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10 relative z-10">
              <div className="bg-[#1B1716]/5 p-6 rounded-2xl border border-[#1B1716]/10">
                <h3 className="font-bold text-xl text-cherry mb-2">25%</h3>
                <p className="text-[#1B1716]/60 text-sm">Recurring Commission for life on all referred users.</p>
              </div>
              <div className="bg-[#1B1716]/5 p-6 rounded-2xl border border-[#1B1716]/10">
                <h3 className="font-bold text-xl text-butter mb-2">10% Off</h3>
                <p className="text-[#1B1716]/60 text-sm">Exclusive discount applied automatically for your audience.</p>
              </div>
              <div className="bg-[#1B1716]/5 p-6 rounded-2xl border border-[#1B1716]/10">
                <h3 className="font-bold text-xl text-[#1B1716] mb-2">Auto-Payouts</h3>
                <p className="text-[#1B1716]/60 text-sm">Payments hit your bank account automatically every month.</p>
              </div>
            </div>

            <div className="relative z-10 bg-cherry/5 border border-cherry/20 rounded-2xl p-6 md:p-8 text-center">
              <h2 className="text-xl font-bold text-[#1B1716] mb-4">Ready to start earning?</h2>
              <p className="text-[#1B1716]/60 mb-6 max-w-lg mx-auto">
                Click below to join our official Lemon Squeezy Affiliate Hub. You'll get your unique tracking link and access to your earnings dashboard instantly.
              </p>
              
              <a 
                href="https://validexio.lemonsqueezy.com/affiliates" 
                target="_blank" 
                rel="noreferrer"
                className="btn-primary inline-flex py-4 px-8 text-lg w-full md:w-auto justify-center"
              >
                Join Lemon Squeezy Affiliate Hub
                <ExternalLink className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
