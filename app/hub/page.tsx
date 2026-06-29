"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, User, LogOut, ExternalLink, ArrowRight, ShieldCheck, CreditCard, Rocket, Loader2 } from "lucide-react";

export default function FoundersHub() {
  const [showPricing, setShowPricing] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async (tierKey: string) => {
    setLoadingCheckout(tierKey);
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierKey }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to create checkout");
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      alert("Failed to initiate checkout. Please try again.");
    } finally {
      setLoadingCheckout(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1B1716] font-sans selection:bg-cherry/40 selection:text-[#1B1716]">
      {/* 1. TOP NAVIGATION */}
      <nav className="h-16 flex items-center justify-between px-6 lg:px-10 border-b border-[#1B1716]/10 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo-wordmark-noir.png" alt="Validexio" className="h-6 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-sm font-medium text-[#1B1716]/70 hover:text-[#1B1716] transition-colors">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Founder Profile</span>
          </button>
          <div className="w-px h-4 bg-[#1B1716]/20" />
          <button className="flex items-center gap-2 text-sm font-bold text-[#1B1716]/50 hover:text-cherry transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-12 space-y-16">
        
        {/* 2. TOP SECTION: CREDIT BALANCE WIDGET */}
        <section>
          <div className="relative overflow-hidden rounded-2xl bg-[#1B1716] p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cherry rounded-full opacity-20 blur-[100px] pointer-events-none -mt-40 -mr-40" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-butter rounded-full opacity-10 blur-[80px] pointer-events-none -mb-20 -ml-20" />
            
            <div className="flex items-center gap-6 sm:gap-8 relative z-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1B1716] border border-cherry/40 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(117,7,12,0.4)] flex-shrink-0">
                <span className="text-3xl sm:text-4xl font-black text-[#EDEBDE] leading-none">02</span>
              </div>
              <div>
                <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-butter mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" /> Available Validation Credits
                </h2>
                <p className="text-xs sm:text-sm text-[#EDEBDE]/70 max-w-sm leading-relaxed">
                  You have <strong className="text-white">2 credits</strong> remaining. Each credit generates a comprehensive startup execution architecture.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full md:w-auto relative z-10">
              <Link href="/dashboard/validate" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-cherry hover:bg-[#910505] text-[#EDEBDE] text-sm font-bold rounded-lg transition-all shadow-lg shadow-cherry/20">
                <Rocket className="w-4 h-4" />
                Validate New Idea
              </Link>
              <button 
                onClick={() => setShowPricing(!showPricing)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-bold transition-all border ${
                  showPricing 
                    ? "bg-white/10 border-white/20 text-white" 
                    : "bg-transparent border-[#EDEBDE]/20 hover:bg-[#EDEBDE]/10 text-[#EDEBDE]"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Buy Credit Packs
              </button>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM SECTION: QUICK TOP-UP (CONDITIONAL) */}
        {showPricing && (
          <section className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pack 1 */}
              <div className="glass-card p-8 flex flex-col transition-all hover:border-cherry/30 hover:shadow-md">
                <h3 className="text-lg font-bold text-[#1B1716] mb-1">Starter Pack</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black text-[#1B1716]">$19</span>
                  <span className="text-[#1B1716]/40 text-sm">/pack</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-2 text-sm text-[#1B1716]/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-cherry mt-1.5 flex-shrink-0" />
                    1 Validation Credit
                  </li>
                  <li className="flex items-start gap-2 text-sm text-[#1B1716]/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-cherry mt-1.5 flex-shrink-0" />
                    Standard Delivery
                  </li>
                </ul>
                <button 
                  onClick={() => handleCheckout("STARTER")}
                  disabled={loadingCheckout === "STARTER"}
                  className="w-full py-3 bg-transparent border border-cherry text-cherry hover:bg-cherry hover:text-white rounded font-bold text-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loadingCheckout === "STARTER" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Select Pack"}
                </button>
              </div>

              {/* Pack 2 (Highlighted) */}
              <div className="bg-maroon/10 border-2 border-cherry rounded-xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(117,7,12,0.15)] transform md:-translate-y-2">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cherry text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#a10505]">
                  Most Popular
                </div>
                <h3 className="text-lg font-bold text-cherry mb-1">Pro Founder</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-[#1B1716]">$39</span>
                  <span className="text-[#1B1716]/40 text-sm">/pack</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-2 text-sm text-[#1B1716]/90 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-cherry mt-1.5 flex-shrink-0" />
                    1 Full Execution Credit
                  </li>
                  <li className="flex items-start gap-2 text-sm text-[#1B1716]/90 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-cherry mt-1.5 flex-shrink-0" />
                    Priority Processing
                  </li>
                  <li className="flex items-start gap-2 text-sm text-[#1B1716]/90 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-cherry mt-1.5 flex-shrink-0" />
                    Export to PDF enabled
                  </li>
                </ul>
                <button 
                  onClick={() => handleCheckout("PRO")}
                  disabled={loadingCheckout === "PRO"}
                  className="w-full py-3 bg-cherry hover:bg-[#910505] text-white rounded font-bold text-sm transition-all shadow-lg shadow-cherry/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loadingCheckout === "PRO" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Select Pack"}
                </button>
              </div>

              {/* Pack 3 */}
              <div className="glass-card p-8 flex flex-col transition-all hover:border-cherry/30 hover:shadow-md">
                <h3 className="text-lg font-bold text-[#1B1716] mb-1">Team Bundle</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black text-[#1B1716]">$89</span>
                  <span className="text-[#1B1716]/40 text-sm">/pack</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-2 text-sm text-[#1B1716]/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-cherry mt-1.5 flex-shrink-0" />
                    3 Full Execution Credits
                  </li>
                  <li className="flex items-start gap-2 text-sm text-[#1B1716]/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-cherry mt-1.5 flex-shrink-0" />
                    White-label Reports
                  </li>
                </ul>
                <button 
                  onClick={() => handleCheckout("TEAM")}
                  disabled={loadingCheckout === "TEAM"}
                  className="w-full py-3 bg-transparent border border-cherry text-cherry hover:bg-cherry hover:text-white rounded font-bold text-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loadingCheckout === "TEAM" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Select Pack"}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 3. MAIN SECTION: THE PROJECT LIBRARY */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-[#1B1716]">
              Validation History & Assets
            </h2>
          </div>

          <div className="hidden md:block glass-card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1B1716]/[0.02] border-b border-[#1B1716]/10 text-[#1B1716]/40 text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-5">Project Idea</th>
                  <th className="px-6 py-5">Date Generated</th>
                  <th className="px-6 py-5">Industry</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B1716]/5">
                {[
                  { name: "SaaS for Diamond Merchants", date: "Oct 24, 2026", tag: "B2B SaaS" },
                  { name: "Data Engine Waitlist Generator", date: "Oct 12, 2026", tag: "DevTools" },
                  { name: "Automated Cold Email Agent", date: "Sep 28, 2026", tag: "Marketing" },
                ].map((project, idx) => (
                  <tr key={idx} className="group hover:bg-[#1B1716]/[0.02] transition-colors">
                    <td className="px-6 py-5 font-bold text-[#1B1716] text-base">{project.name}</td>
                    <td className="px-6 py-5 text-[#1B1716]/50 font-mono text-xs">{project.date}</td>
                    <td className="px-6 py-5">
                      <span className="badge badge-butter py-1 px-3">
                        {project.tag}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-emerald-700 font-bold text-xs tracking-wider">Fully Unlocked</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link href="/dashboard" className="btn-secondary text-xs px-4 py-2 gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        View Dashboard
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Stacked Cards */}
          <div className="md:hidden space-y-4">
            {[
              { name: "SaaS for Diamond Merchants", date: "Oct 24, 2026", tag: "B2B SaaS" },
              { name: "Data Engine Waitlist Generator", date: "Oct 12, 2026", tag: "DevTools" },
              { name: "Automated Cold Email Agent", date: "Sep 28, 2026", tag: "Marketing" },
            ].map((project, idx) => (
              <div key={idx} className="glass-card p-5 space-y-4 hover:border-cherry/30 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#1B1716] text-lg leading-tight mb-1">{project.name}</h3>
                    <p className="text-[#1B1716]/50 font-mono text-xs">{project.date}</p>
                  </div>
                  <span className="badge badge-butter py-0.5 px-2 text-[9px]">
                    {project.tag}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#1B1716]/5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.4)]" />
                    <span className="text-emerald-700 font-bold text-[10px] tracking-wider uppercase">Unlocked</span>
                  </div>
                  <Link href="/dashboard" className="btn-primary text-xs px-3 py-1.5 gap-1.5">
                    View
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </section>
      </main>
    </div>
  );
}
