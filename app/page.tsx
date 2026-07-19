"use client";

import Link from "next/link";
import { RuthlessStats } from "@/components/RuthlessStats";
import { useCurrency } from "@/hooks/useCurrency";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { SecureCheckoutBadge } from "@/components/SecureCheckoutBadge";
import React, { useState, useEffect, useRef } from "react";
import GlobalCompetitorsGlobe from "@/components/marketing/GlobalCompetitorsGlobe";
import {
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  TrendingDown,
  ChevronRight,
  ChevronDown,
  Zap,
  BarChart3,
  Users,
  Target,
  Shield,
  TrendingUp,
  Lightbulb,
  Star,
  StarHalf,
  Globe,
  Brain,
  Lock,
  Rocket,
  Play,
  Newspaper,
  Database,
  MessageSquare,
  Radar,
  FileText,
} from "lucide-react";

import {
  SiReddit,
  SiQuora,
  SiYcombinator,
  SiProducthunt,
  SiG2,
  SiCrunchbase,
  SiX,
  SiStackoverflow,
  SiGoogle,
  SiWikipedia,
  SiTrustpilot,
  SiGlassdoor,
  SiYoutube,
  SiKaggle,
  SiDevdotto
} from "react-icons/si";

import { FaLinkedin } from "react-icons/fa";

import { Navbar } from "@/components/layout/Navbar";

// =============================================
// HERO SECTION
// =============================================
function HeroSection() {
  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      <div className="hero-orb-1 top-1/4 -left-32 opacity-40 mix-blend-multiply" />
      <div className="hero-orb-2 bottom-1/4 -right-16 opacity-30 mix-blend-multiply" />
      <div className="hero-orb-1 top-0 right-1/4 opacity-20 mix-blend-multiply" style={{ width: 400, height: 400 }} />

      {/* Animated border gradient lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cherry/50 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 text-center">

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-[4.25rem] lg:text-7xl font-black text-[#1B1716] tracking-tight leading-tight mb-6 animate-fade-in delay-100 text-center mx-auto w-full">
          Stop <span className="gradient-text">Guessing</span>.
          <br />
          Start <span className="gradient-text">Executing</span>.
        </h1>

        {/* Subheadline */}
        <div className="flex flex-col items-center justify-center mb-10 animate-fade-in delay-200 text-center px-4 w-full max-w-3xl mx-auto">
          <p className="text-[1rem] sm:text-lg md:text-xl font-medium text-[#1B1716]/70 mx-auto text-balance leading-relaxed">
            <span className="font-semibold text-[#1B1716]/90 block mb-3 sm:mb-4">From Concept to Customer in 60 Seconds.</span> 
            Data-backed validation for your startup idea without writing a single line of code. Get brutal reality checks, target personas, and GTM strategies instantly.
          </p>
        </div>



        {/* CTA Group */}
        <div className="flex justify-center w-full mb-16 animate-fade-in delay-300 px-4">
          <Link 
            aria-label="Navigation link" 
            href="/register" 
            className="btn-primary text-base sm:text-lg px-8 sm:px-10 py-4 inline-flex items-center justify-center shadow-[0_8px_30px_rgb(99,1,2,0.2)] hover:shadow-[0_12px_40px_rgb(99,1,2,0.3)] transition-all duration-300 hover:-translate-y-1 group ring-2 ring-transparent hover:ring-cherry/20 ring-offset-2"
          >
            <Rocket className="w-5 h-5 mr-2 shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-bold tracking-wide">Validate My Idea Now</span>
            <ArrowRight className="w-5 h-5 ml-2 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm font-medium text-[#1B1716]/60 animate-fade-in delay-400 mt-6 sm:mt-8">
          {[
            "Secure, one-time payments",
            "Free tier available",
            "Results in under 60 seconds",
          ].map((item, i) => (
            <React.Fragment key={`item-${i}`}>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle className="w-4 h-4 text-cherry flex-shrink-0" />
                <span>{item}</span>
              </div>
              {i < 2 && (
                <div className="hidden sm:block w-1 h-1 rounded-full bg-[#1B1716]/20 mx-1" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Payment Methods Badge */}
        {/* Dashboard Preview */}
        <div className="mt-20 relative animate-fade-in delay-500 hover:-translate-y-2 transition-transform duration-700 ease-out">
          <div className="glass-card p-2 sm:p-3 max-w-5xl mx-auto shadow-2xl shadow-black/5 ring-1 ring-black/5">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-1.5 mb-3 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-3 h-5 rounded bg-[#1B1716]/5 flex items-center px-2">
                <span className="text-xs text-[#1B1716]/30">validexio.com/dashboard</span>
              </div>
            </div>

            {/* Dashboard Preview Layout */}
            <div className="rounded-2xl overflow-hidden bg-white/50 backdrop-blur-3xl border border-white/60 p-3 sm:p-6 grid grid-cols-12 gap-3 sm:gap-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              
              {/* Top Left: Score */}
              <div className="col-span-12 md:col-span-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1B1716] to-[#3a312e] p-4 sm:p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -top-10 -right-10 opacity-20 pointer-events-none">
                  <Brain className="w-40 h-40" />
                </div>
                <div className="relative z-10 sm:mb-6">
                  <div className="flex justify-between items-center mb-3 sm:mb-6">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/60 font-bold">market validation Score</p>
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] bg-white/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-white font-medium border border-white/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE
                    </div>
                  </div>
                  <div className="flex items-end gap-2 sm:mb-2">
                    <span className="text-4xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tighter leading-none">88</span>
                    <span className="text-sm sm:text-lg text-emerald-400 font-bold mb-0.5 sm:mb-1">/100</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-bold px-2 py-1 rounded mt-2">
                    <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Exceptional Market Fit
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-white/60 leading-relaxed relative z-10 border-t border-white/10 pt-3 sm:pt-4 mt-3 sm:mt-0">
                  High demand speed detected with lower-than-average difficulty getting customers. Clear path to profitability.
                </p>
              </div>

              {/* Top Right: Metrics */}
              <div className="col-span-12 md:col-span-8 flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {[
                  { label: "Total Market Size", value: "$4.2B", trend: "+12.4% YoY Growth", icon: Globe, color: "text-blue-600", bg: "bg-blue-600/10" },
                  { label: "Target Market Size", value: "$850M", trend: "Divided market", icon: Target, color: "text-emerald-600", bg: "bg-emerald-600/10" },
                  { label: "Cost to Acquire Customer", value: "$12.50", trend: "Via organic & social", icon: Users, color: "text-purple-600", bg: "bg-purple-600/10" },
                  { label: "Customer Budget", value: "$29-49", trend: "Monthly subscription", icon: BarChart3, color: "text-cherry", bg: "bg-cherry/10" },
                  { label: "Time to Launch", value: "3 Weeks", trend: "Low technical complexity", icon: Rocket, color: "text-orange-600", bg: "bg-orange-600/10" },
                  { label: "Project Risk", value: "Medium-Low", trend: "Marketing intensive", icon: Shield, color: "text-yellow-600", bg: "bg-yellow-600/10" },
                ].map((metric, idx) => (
                  <div key={metric.label} className="col-span-1 bg-white border border-[#1B1716]/5 p-2.5 sm:p-4 rounded-lg sm:rounded-xl flex flex-row sm:flex-col justify-between items-center sm:items-start shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2.5 sm:w-full sm:justify-between sm:mb-3">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg ${metric.bg} flex items-center justify-center shrink-0`}>
                        <metric.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${metric.color}`} />
                      </div>
                      <p className="sm:hidden text-[10px] font-bold text-[#1B1716]/70 uppercase tracking-wider leading-tight w-24">{metric.label}</p>
                      <span className="hidden sm:block text-[10px] font-bold text-[#1B1716]/30">0{idx + 1}</span>
                    </div>
                    <div className="flex flex-col items-end sm:items-start text-right sm:text-left shrink-0">
                      <p className="hidden sm:block text-[11px] font-semibold text-[#1B1716]/50 uppercase tracking-wider mb-1">{metric.label}</p>
                      <div className="flex flex-col sm:block items-end sm:items-start">
                        <p className="text-sm sm:text-xl font-black text-[#1B1716] tracking-tight leading-none mb-0.5 sm:mb-0">{metric.value}</p>
                        <p className="text-[9px] sm:text-[10px] font-medium text-[#1B1716]/40 mt-0 sm:mt-1 max-w-[120px] sm:max-w-none truncate">{metric.trend}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Left: Competitors */}
              <div className="col-span-12 lg:col-span-7 bg-white border border-[#1B1716]/5 p-3 sm:p-5 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-3 sm:mb-5 border-b border-[#1B1716]/5 pb-2 sm:pb-3">
                  <p className="text-[10px] sm:text-xs font-bold text-[#1B1716]/80 uppercase tracking-widest flex items-center gap-1.5 sm:gap-2">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cherry" />
                    Competitor Research
                  </p>
                  <span className="text-[9px] sm:text-[10px] bg-[#1B1716]/5 text-[#1B1716]/60 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-bold uppercase tracking-wider">Top 3 Threats</span>
                </div>
                <div className="space-y-2 sm:space-y-4">
                  {[
                    { name: "LegacyCorp Inc.", share: 65, price: "$99/mo", weakness: "Outdated UX, slow support", color: "bg-red-500" },
                    { name: "Goliath Solutions", share: 25, price: "$250/mo", weakness: "Enterprise only, high friction", color: "bg-orange-500" },
                    { name: "StartupX", share: 10, price: "$15/mo", weakness: "Feature incomplete, buggy", color: "bg-blue-500" },
                  ].map(comp => (
                    <div key={comp.name} className="flex items-center gap-3 sm:gap-4 group">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#1B1716]/5 flex items-center justify-center font-black text-xs sm:text-sm text-[#1B1716]/40 group-hover:bg-[#1B1716]/10 transition-colors shrink-0">
                        {comp.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1 sm:mb-1.5">
                          <span className="text-xs sm:text-sm font-bold text-[#1B1716] truncate pr-2">{comp.name}</span>
                          <span className="text-[10px] sm:text-xs font-semibold text-[#1B1716]/60 shrink-0">{comp.price}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="hidden sm:block flex-1 h-1.5 sm:h-2 bg-[#1B1716]/5 rounded-full overflow-hidden relative">
                            <div className={`absolute top-0 left-0 h-full rounded-full ${comp.color}`} style={{ width: `${comp.share}%` }} />
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-medium text-cherry bg-cherry/10 px-1.5 py-0.5 rounded truncate max-w-full sm:max-w-[120px]">
                            Weakness: {comp.weakness}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Right: Action Plan */}
              <div className="col-span-12 lg:col-span-5 flex flex-col sm:flex-row lg:col-span-5 lg:flex-col gap-2 sm:gap-4">
                <div className="flex-1 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-lg sm:rounded-xl p-3 sm:p-5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <p className="text-[10px] sm:text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-2 sm:mb-4 flex items-center gap-1.5 sm:gap-2 relative z-10">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Your Advantage
                  </p>
                  <ul className="space-y-1.5 sm:space-y-3 relative z-10">
                    <li className="text-[11px] sm:text-sm text-emerald-900/80 leading-snug sm:leading-relaxed font-medium flex items-start gap-2">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500 mt-1.5 sm:mt-2 flex-shrink-0" />
                      Divided market with no clear modern, design-first leader.
                    </li>
                    <li className="text-[11px] sm:text-sm text-emerald-900/80 leading-snug sm:leading-relaxed font-medium flex items-start gap-2">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500 mt-1.5 sm:mt-2 flex-shrink-0" />
                      Strong margins possible due to low costs to grow.
                    </li>
                  </ul>
                </div>
                <div className="flex-1 bg-gradient-to-br from-cherry/10 to-cherry/5 border border-cherry/20 rounded-lg sm:rounded-xl p-3 sm:p-5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cherry/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <p className="text-[10px] sm:text-[11px] font-black text-cherry uppercase tracking-widest mb-2 sm:mb-4 flex items-center gap-1.5 sm:gap-2 relative z-10">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Action Plan
                  </p>
                  <ul className="space-y-1.5 sm:space-y-3 relative z-10">
                    <li className="text-[11px] sm:text-sm text-cherry/90 leading-snug sm:leading-relaxed font-medium flex items-start gap-2">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-cherry mt-1.5 sm:mt-2 flex-shrink-0" />
                      Target frustrated lower-end users of Goliath Solutions with a self-serve $29/mo tier.
                    </li>
                    <li className="text-[11px] sm:text-sm text-cherry/90 leading-snug sm:leading-relaxed font-medium flex items-start gap-2">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-cherry mt-1.5 sm:mt-2 flex-shrink-0" />
                      Launch MVP via ProductHunt focusing strictly on the core USP.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Third Row: New Data Engine Capabilities Showcase */}
              <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-0 sm:mt-2">
                {/* Psych Profile */}
                <div className="col-span-1 bg-white border border-[#1B1716]/5 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cherry/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-cherry uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 relative z-10">
                      <Target className="w-3 h-3" /> Customer Mindset
                    </p>
                    <div className="space-y-1 sm:space-y-2 relative z-10">
                      <p className="text-[10px] sm:text-[11px] text-[#1B1716]/50 font-semibold uppercase tracking-wider">Main Problem</p>
                      <p className="text-[11px] sm:text-xs font-bold text-[#1B1716]">Spending 10+ hrs/week on manual data entry.</p>
                      <div className="h-px w-full bg-[#1B1716]/5 my-1.5 sm:my-2" />
                      <p className="text-[10px] sm:text-[11px] text-[#1B1716]/50 font-semibold uppercase tracking-wider">Email Subject</p>
                      <p className="text-[11px] sm:text-xs font-bold text-cherry italic">"Are you tired of losing track of $10k+ invoices?"</p>
                    </div>
                  </div>
                </div>

                {/* Tech Architecture */}
                <div className="col-span-1 bg-white border border-[#1B1716]/5 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-[#1B1716]/80 uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <Zap className="w-3 h-3 text-emerald-600" /> Tech Setup
                    </p>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-emerald-600/10 flex items-center justify-center">
                          <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" />
                        </div>
                        <p className="text-[11px] sm:text-xs font-bold text-[#1B1716]">Next.js + Tailwind</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-blue-600/10 flex items-center justify-center">
                          <BarChart3 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
                        </div>
                        <p className="text-[11px] sm:text-xs font-bold text-[#1B1716]">Node.js + Supabase</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-orange-600/10 flex items-center justify-center">
                          <Rocket className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-600" />
                        </div>
                        <p className="text-[11px] sm:text-xs font-bold text-[#1B1716]">Deploy on Vercel</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Landing Page Code */}
                <div className="col-span-1 bg-white border border-[#1B1716]/5 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-butter/20 rounded-full blur-3xl" />
                  <p className="text-[9px] sm:text-[10px] font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 relative z-10">
                    <Lightbulb className="w-3 h-3" /> Test Landing Page
                  </p>
                  <div className="font-mono text-[8px] sm:text-[9px] text-[#1B1716]/70 bg-[#1B1716]/5 p-2 sm:p-2.5 rounded border border-[#1B1716]/5 relative z-10 leading-relaxed overflow-hidden">
                    <span className="text-purple-600">export default</span> <span className="text-blue-600">function</span> <span className="text-orange-600 font-bold">Waitlist</span>() {'{\n'}
                    {'  '}<span className="text-purple-600">return</span> (<br/>
                    {'    '}&lt;<span className="text-blue-600">div</span> <span className="text-emerald-600">className</span>=<span className="text-emerald-700">"bg-black p-8"</span>&gt;<br/>
                    {'      '}&lt;<span className="text-blue-600">h1</span>&gt;Join Waitlist&lt;/<span className="text-blue-600">h1</span>&gt;<br/>
                    {'      '}&lt;<span className="text-blue-600">input</span> <span className="text-emerald-600">type</span>=<span className="text-emerald-700">"email"</span> /&gt;<br/>
                    {'    '}&lt;/<span className="text-blue-600">div</span>&gt;<br/>
                    {'  '});<br/>
                    {'}'}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Glow under card */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-20 bg-cherry/20 blur-3xl rounded-full" />
        </div>

        {/* Data Partners (Bottom Right Corner outside dashboard) */}
        <div className="max-w-5xl mx-auto mt-6 flex justify-end px-2 sm:px-0 animate-fade-in delay-700">
          <div className="flex items-center gap-3">
             <span className="text-[14px] font-medium text-[#8492a6]">
               Data sources:
             </span>
             <div className="flex items-center gap-2 flex-wrap justify-end">
               {[
                 { Icon: SiGoogle, color: "text-[#4285F4]" },
                 { Icon: SiWikipedia, color: "text-[#000000]" },
                 { Icon: SiReddit, color: "text-[#FF4500]" },
                 { Icon: SiYoutube, color: "text-[#FF0000]" },
                 { Icon: SiQuora, color: "text-[#B92B27]" },
                 { Icon: SiYcombinator, color: "text-[#F0652F]" },
                 { Icon: SiProducthunt, color: "text-[#DA552F]" },
                 { Icon: SiTrustpilot, color: "text-[#00B67A]" },
                 { Icon: SiG2, color: "text-[#FF492C]" },
                 { Icon: SiCrunchbase, color: "text-[#146AEB]" },
                 { Icon: SiGlassdoor, color: "text-[#0CAA41]" },
                 { Icon: SiStackoverflow, color: "text-[#F58025]" },
                 { Icon: SiKaggle, color: "text-[#20BEFF]" },
                 { Icon: FaLinkedin, color: "text-[#0A66C2]" },
                 { Icon: SiX, color: "text-[#1B1716]" },
               ].map((source, i) => (
                 <div key={`item-${i}`} className="w-6 h-6 rounded-[8px] bg-[#F8F9FA] border border-[#1B1716]/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center transition-transform hover:scale-110 cursor-default">
                   <source.Icon className={`w-3 h-3 ${source.color}`} />
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================
// PREMIUM ACTION PLAN SHOWCASE
// =============================================
function PremiumExecutionShowcase() {
  return (
    <section className="relative w-full py-24 bg-gradient-to-b from-[#FDFDFD] to-transparent overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="flex items-center justify-center gap-2 text-xs font-heading font-black uppercase tracking-[0.2em] text-[#630102]">
              <Lock className="w-3.5 h-3.5" /> Unlock Premium
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] mb-6 tracking-tight">
            The Action <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#630102] to-red-500">Plan</span>
          </h2>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto text-center font-medium leading-relaxed">
            Stop validating in theory. Upgrade to Premium and instantly generate ready-to-use tech setups, exact pricing, and ready-to-use email subjects.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Card 1: Flexible Tech Setup */}
          <div className="group bg-white border border-[#E5E7EB] rounded-2xl p-8 hover:border-red-500/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(99,1,2,0.1)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-all duration-500" />
            <div>
              <Database className="w-8 h-8 text-[#630102] mb-6" />
              <h3 className="text-xl font-bold text-[#111827] mb-3">Flexible Tech Setup</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-6 font-medium">
                Receive a complete database structure and cloud setup for your idea. Ready to hand off to an engineer or build yourself.
              </p>
            </div>
            <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-4 font-mono text-[10px] text-[#111827] shadow-inner">
              <span className="text-purple-600 font-semibold">const</span> schema = <span className="text-emerald-600">"Prisma"</span>;
              <br />
              <span className="text-blue-600 font-semibold">Deploy</span> <span className="text-[#6B7280]">-to</span> Vercel;
            </div>
          </div>

          {/* Card 2: Market Size & Pricing */}
          <div className="group bg-white border border-[#E5E7EB] rounded-2xl p-8 hover:border-orange-500/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(249,115,22,0.1)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all duration-500" />
            <div>
              <TrendingUp className="w-8 h-8 text-orange-500 mb-6" />
              <h3 className="text-xl font-bold text-[#111827] mb-3">Market Size & Pricing</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-6 font-medium">
                Calculated market size and a smart starting price to beat competitors.
              </p>
            </div>
            <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-4 flex items-center justify-between shadow-inner">
               <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Entry Price</span>
               <span className="text-xl font-black text-orange-600">$19/mo</span>
            </div>
          </div>

          {/* Card 3: Sales Triggers */}
          <div className="group bg-white border border-[#E5E7EB] rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(16,185,129,0.1)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-500" />
            <div>
              <MessageSquare className="w-8 h-8 text-emerald-500 mb-6" />
              <h3 className="text-xl font-bold text-[#111827] mb-3">Sales Triggers</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-6 font-medium">
                We find real customer complaints on Reddit and turn them into email subjects that get you sales from day one.
              </p>
            </div>
            <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-4 shadow-inner">
              <span className="block text-[10px] text-emerald-600 uppercase font-black mb-1 tracking-wider">Generated Hook</span>
              <span className="text-xs text-[#111827] italic font-medium">"Saw you struggling with manual entry..."</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================
// FEATURES SECTION
// =============================================
const features = [
  {
    icon: Brain,
    title: "market validation Engine",
    description:
      "Get a comprehensive 0–100 validation score backed by our Data Engine's analysis of market data, competition, and timing.",
    color: "text-cherry",
    bg: "bg-cherry/10",
  },
  {
    icon: Target,
    title: "Competitor & Market Intel",
    description:
      "TAM/SAM sizing, pricing benchmarks, and an Early Adopter Psych Profile with high-converting cold email hooks.",
    color: "text-blue-600",
    bg: "bg-blue-600/10",
  },
  {
    icon: Lightbulb,
    title: "UI Mockups & Fake Door",
    description:
      "real-time data-backed interfaces plus a copy-pasteable Waitlist React Component to start capturing leads instantly.",
    color: "text-emerald-600",
    bg: "bg-emerald-600/10",
  },
  {
    icon: Zap,
    title: "Tech Architecture Blueprint",
    description:
      "The exact scalable tech stack and cloud deployment strategy tailored specifically to your idea's complexity.",
    color: "text-purple-600",
    bg: "bg-purple-600/10",
  },
  {
    icon: Rocket,
    title: "Day-1 GTM Branding Kit",
    description:
      "Instant, high-converting marketing and launch copy for LinkedIn, ProductHunt, and your landing page.",
    color: "text-orange-600",
    bg: "bg-orange-600/10",
  },
  {
    icon: TrendingUp,
    title: "Revenue & Unit Economics",
    description:
      "3-year revenue forecast with realistic assumptions, pricing benchmarks, and monetization strategy.",
    color: "text-pink-600",
    bg: "bg-pink-600/10",
  },
  {
    icon: Shield,
    title: "Pivot Strategy & Anti-Roadmap",
    description:
      "Actionable intelligence on what NOT to build, and a specific recommended pivot angle if viability is low.",
    color: "text-yellow-600",
    bg: "bg-yellow-600/10",
  },
  {
    icon: Users,
    title: "First Customer Strategy",
    description:
      "Actionable playbook to land your first 10 customers — complete with up to 10 verified target B2B leads.",
    color: "text-red-600",
    bg: "bg-red-600/10",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="badge badge-cherry inline-flex mb-4 mx-auto">
            Enterprise Intelligence
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-[#1B1716] mb-4 sm:mb-6 tracking-tight leading-tight max-w-4xl">
            Everything you need to <span className="gradient-text">validate</span>{" "}
            <br className="hidden sm:block" />
            before you build
          </h2>
          <p className="text-[#1B1716]/60 text-base sm:text-lg max-w-xl mx-auto text-center px-4 sm:px-0">
            Stop wasting months building products nobody wants. Get data-driven validation and production-ready code in 60 seconds.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="card group cursor-default"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
              >
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="font-bold text-[#1B1716] text-base mb-2">
                {feature.title}
              </h3>
              <p className="text-[#1B1716]/50 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================
// HOW IT WORKS
// =============================================
const steps = [
  {
    number: "01",
    title: "Describe Your Idea",
    description:
      "Fill out our smart 3-step intake form. Tell us your industry, describe your concept, and select your pricing model. Takes less than 2 minutes.",
    icon: Lightbulb,
  },
  {
    number: "02",
    title: "Data Engine Analyzes Everything",
    description:
      "Our proprietary Data Engine scans market data, competitor landscapes, customer behavior, and business viability in real time.",
    icon: Brain,
  },
  {
    number: "03",
    title: "Get Actionable Intelligence",
    description:
      "Receive a comprehensive report with scores, SWOT analysis, competitor breakdown, customer personas, and a step-by-step execution plan.",
    icon: Rocket,
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-32 relative bg-gradient-to-b from-transparent to-[#FDFDFD]">
      {/* Subtle Background Elements */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-24">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#630102]/30" />
            <span className="text-xs font-heading font-black uppercase tracking-[0.2em] text-[#630102]">
              Process
            </span>
            <div className="w-8 h-[1px] bg-[#630102]/30" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-[#111827] tracking-tight mb-6 text-center mx-auto">
            From idea to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#630102] to-red-500">insight</span><br className="sm:hidden" /> in 60 seconds
          </h2>
          <p className="text-[#6B7280] text-lg md:text-xl text-center font-medium max-w-2xl mx-auto">
            Three simple steps to validate your startup idea with enterprise-grade Data Engine.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 relative">
          {/* Abstract Connecting Lines */}
          <div className="hidden lg:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-[#E5E7EB] via-[#630102]/30 to-[#E5E7EB] border-t border-dashed border-[#E5E7EB]" />

          {steps.map((step, i) => (
            <div key={step.number} className="relative group">
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-10 h-full hover:border-[#630102]/20 transition-all duration-700 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_40px_-12px_rgba(99,1,2,0.08)] relative overflow-hidden">
                
                {/* Massive Number Watermark */}
                <div className="absolute right-2 top-2 sm:-right-4 sm:-top-8 text-[60px] sm:text-[120px] font-heading font-black text-[#F8F9FA] pointer-events-none group-hover:text-red-50 transition-colors duration-500 leading-none">
                  {step.number}
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 border border-[#630102]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#630102] group-hover:border-[#630102] transition-colors duration-500 shadow-sm">
                      <step.icon className="w-6 h-6 text-[#630102] group-hover:text-white transition-colors duration-500" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-[#111827] mb-4 group-hover:text-[#630102] transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-[#6B7280] font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================
// PRICING SECTION
// =============================================
const homePlans = [
  {
    name: "Free",
    prices: { USD: "$0", INR: "₹0", EUR: "€0" },
    period: "forever",
    description: "Perfect for a quick reality check",
    features: [
      "1 Basic Validation Score",
      "Market Saturation Check",
      "Anti-Roadmap & Pivot Strategy",
      "Investor Simulator (1 Persona, 3 QA Rounds)",
      "Blurred Mockups & Tech Stack",
      "Blurred Leads & GTM Kit",
      "Standard processing time"
    ],
    cta: "Start Free",
    href: "/register",
    featured: false,
  },
  {
    name: "Pro",
    prices: { USD: "$39", INR: "₹1499", EUR: "€39" },
    period: "per validation",
    description: "For founders who move fast",
    features: [
      "1 Full Execution Credit",
      "Comprehensive Validation Score",
      "Up to 5 Direct Competitors Analyzed",
      "Tech Architecture & Fake Door Code",
      "Early Adopter Psych & GTM Kit",
      "Unit Economics & Revenue Projections",
      "5 Verified Target B2B Leads",
      "2 High-Fidelity UI Mockups",
      "Lifetime access to the report",
      "Export to PDF",
      "Investor Simulator (All Personas, 10 QA Rounds)"
    ],
    cta: "Unlock Execution Pro",
    href: "/register?plan=pro",
    featured: true,
  },
  {
    name: "Team",
    prices: { USD: "$89", INR: "₹2999", EUR: "€89" },
    period: "for 3 validations",
    description: "For serial entrepreneurs and agencies",
    features: [
      "3 Full Execution Credits (Save 25%)",
      "Everything in the Pro Plan",
      "Priority Processing Engine (Under 1h)",
      "Up to 7 Direct Competitors Analyzed",
      "8 Verified Target B2B Leads",
      "Export to PDF for Investors",

      "Dedicated account support manager",
      "White-label branding options (Your Logo)",
      "Shared Team Workspace (Coming soon)",
      "Investor Simulator (All Personas, 15 QA Rounds + PDF)"
    ],
    cta: "Buy Credit Bundle",
    href: "/register?plan=team",
    featured: false,
  },
];

function PricingCard({ plan, currency }: { plan: any; currency: string }) {
  return (
    <div
      className={`relative p-6 sm:p-8 flex flex-col h-full rounded-[2rem] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        plan.featured
          ? "bg-gradient-to-b from-[#FFFDFD] to-[#FDF8F8] border-[1.5px] border-[#630102]/10 shadow-[0_20px_60px_-15px_rgba(99,1,2,0.1)] hover:shadow-[0_30px_80px_-20px_rgba(99,1,2,0.2)] hover:-translate-y-2 z-10 ring-1 ring-[#630102]/5 hover:border-[#630102]/30 group"
          : "bg-white border border-[#E5E7EB] shadow-sm hover:shadow-xl hover:border-[#D1D5DB] hover:-translate-y-1"
      }`}
    >
      {plan.featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="absolute inset-0 bg-[#630102] blur-md opacity-40 rounded-full animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-[#630102] to-[#8C0203] text-white px-4 py-1.5 rounded-full shadow-lg text-[10px] font-black uppercase tracking-[0.25em] flex items-center justify-center whitespace-nowrap border border-white/20">
              MOST POPULAR
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex-shrink-0">
        <h3 className={`text-xl font-black mb-1.5 ${plan.featured ? "text-[#630102]" : "text-[#111827]"}`}>{plan.name}</h3>
        <p className="text-[#6B7280] text-[13px] leading-snug mb-5 min-h-[40px] font-medium">{plan.description}</p>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl lg:text-5xl font-black tracking-tight ${plan.featured ? "text-[#111827]" : "text-[#111827]"}`}>{plan.prices[currency]}</span>
        </div>
        <div className="text-[#6B7280] text-xs mt-2 font-medium uppercase tracking-wider">{plan.period}</div>
      </div>

      <ul className="space-y-3.5 mb-8 flex-1">
        {plan.features.map((feature: string) => (
          <li key={feature} className="flex items-start gap-3 text-[13.5px] leading-tight text-[#111827]/80 font-medium">
            <CheckCircle className={`w-[16px] h-[16px] mt-0.5 flex-shrink-0 ${plan.featured ? "text-[#630102]" : "text-emerald-500"}`} strokeWidth={2.5} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link aria-label="Navigation link"
        href={plan.href}
        className={`mt-auto block text-center py-3.5 px-6 rounded-2xl font-semibold text-[15px] tracking-tight transition-all duration-700 overflow-hidden relative group/btn ${
          plan.featured
            ? "bg-gradient-to-r from-[#630102] via-[#A80205] to-[#630102] bg-[length:200%_auto] text-white shadow-[0_8px_20px_-6px_rgba(99,1,2,0.5)] hover:shadow-[0_15px_30px_-8px_rgba(99,1,2,0.7)] hover:bg-[position:right_center] hover:-translate-y-1 ring-2 ring-transparent hover:ring-[#630102]/40 ring-offset-2 ring-offset-[#FDF8F8]"
            : "bg-gradient-to-b from-[#FFF8F8] to-[#FFF0F0] text-[#8C0203] border-[1.5px] border-[#FFE4E4] shadow-[0_4px_12px_-4px_rgba(99,1,2,0.1)] hover:shadow-[0_12px_24px_-6px_rgba(99,1,2,0.15)] hover:from-[#FFF0F0] hover:to-[#FFE4E4] hover:border-[#FFC2C2] hover:-translate-y-1"
        }`}
      >
        <div className={`absolute inset-0 w-full h-full transform -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent ${plan.featured ? "via-white/20" : "via-white/60"} to-transparent pointer-events-none`} />
        <span className="relative z-10 flex items-center justify-center gap-2">
          {plan.cta}
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </span>
      </Link>
    </div>
  );
}

function PricingSection() {
  const { currency } = useCurrency();

  return (
    <section id="pricing" className="py-24 relative bg-gradient-to-b from-transparent via-[#FDFDFD] to-transparent">
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#630102]/30" />
            <span className="text-xs font-heading font-black uppercase tracking-[0.2em] text-[#630102]">
              Pricing
            </span>
            <div className="w-8 h-[1px] bg-[#630102]/30" />
          </div>
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-[#1B1716] mb-6 tracking-tight leading-tight mx-auto">
            Simple pricing.
            <br />
            <span className="gradient-text">Extraordinary</span> value.
          </h2>
          <p className="text-[#1B1716]/60 text-lg max-w-lg mx-auto text-center">
            Get the clarity you need to build with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-6 max-w-5xl mx-auto items-stretch">
          {homePlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} currency={currency} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <SecureCheckoutBadge />
          <Link aria-label="Navigation link" href="/pricing" className="btn-secondary px-8 py-3.5 inline-flex items-center gap-2 mt-4">
            View all 5 plans
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// =============================================
// TESTIMONIALS
// =============================================
const testimonials = [
  {
    quote: "Validexio saved me 6 months of building the wrong product. The competitor analysis alone was worth 10x the price.",
    name: "Sarah Chen", title: "Founder, DataFlow Data Engine", avatar: "SC", rating: 5,
  },
  {
    quote: "I went from idea to first customer in 3 weeks using the acquisition strategy from Validexio. Unbelievable ROI.",
    name: "Marcus Williams", title: "CEO, ShipFast", avatar: "MW", rating: 4.5,
  },
  {
    quote: "The SWOT analysis and pricing recommendations were more insightful than what I got from a $500/hr consultant.",
    name: "Priya Sharma", title: "Founder, MediSync", avatar: "PS", rating: 5,
  },
  {
    quote: "I was about to waste $15k on an agency. Validexio gave me the exact MVP roadmap and saved my runway. Simply incredible.",
    name: "James Thorne", title: "Co-Founder, BuildScale", avatar: "JT", rating: 5,
  },
  {
    quote: "A complete game-changer. The platform literally pinpointed 3 glaring flaws in my go-to-market strategy before I even launched.",
    name: "Aisha Patel", title: "CEO, LaunchPad", avatar: "AP", rating: 4.5,
  },
  {
    quote: "The brutal Investor Roast destroyed my ego, but it saved my startup. It forced me to fix my unit economics instantly.",
    name: "David Chen", title: "Founder, TechStack", avatar: "DC", rating: 4,
  },
  {
    quote: "I pivoted my entire SaaS platform because of the market saturation data. Best $39 I've ever spent in my life.",
    name: "Elena Rodriguez", title: "CEO, Nexa", avatar: "ER", rating: 5,
  },
  {
    quote: "Finally a tool that doesn't just give generic ChatGPT advice. The data is real, raw, and highly actionable.",
    name: "Michael Chang", title: "CTO, BlockSync", avatar: "MC", rating: 5,
  },
  {
    quote: "Saved us thousands in wasted dev time. The 90-day execution plan became our company's actual operating manual.",
    name: "Sophie Laurent", title: "Founder, Lumiere", avatar: "SL", rating: 4.5,
  },
  {
    quote: "The competitor heatmapping is insane. I found 3 indirect competitors I didn't even know existed.",
    name: "Omar Farooq", title: "CEO, Zenith Data Engine", avatar: "OF", rating: 5,
  },
  {
    quote: "Unbelievable accuracy in the pricing tier recommendations. We implemented it and our conversions doubled overnight.",
    name: "Liam O'Connor", title: "Founder, GrowthOps", avatar: "LO", rating: 5,
  },
  {
    quote: "A must-have for any serious founder. Do not write a single line of code before running your idea through Validexio.",
    name: "Ava Martinez", title: "Co-Founder, ScaleUp", avatar: "AM", rating: 4,
  },
];

function TestimonialCard({ t }: { t: any }) {
  const fullStars = Math.floor(t.rating || 5);
  const hasHalfStar = (t.rating || 5) % 1 !== 0;
  const emptyStars = 5 - Math.ceil(t.rating || 5);
  
  return (
    <div className="glass-card p-6 w-[350px] shrink-0 hover:border-cherry/25 transition-all mx-3">
      <div className="flex gap-1 mb-4">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 text-cherry fill-current" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 text-cherry fill-current" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-cherry opacity-30" />
        ))}
      </div>
      <p className="text-[#1B1716]/75 text-sm leading-relaxed mb-6 italic">
        &quot;{t.quote}&quot;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-cherry/20 border border-cherry/30 flex items-center justify-center">
          <span className="text-xs font-bold text-cherry">{t.avatar}</span>
        </div>
        <div>
          <p className="text-[#1B1716] text-sm font-semibold">{t.name}</p>
          <p className="text-[#1B1716]/45 text-xs">{t.title}</p>
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const row1 = testimonials.slice(0, 6);
  const row2 = testimonials.slice(6, 12);

  return (
    <section className="py-24 relative bg-gradient-to-b from-white to-[#FDFDFD] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="badge badge-butter inline-flex mb-4">
            <Star className="w-3 h-3 fill-current" />
            Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#1B1716] mb-6 tracking-tight leading-tight">
            Trusted by <span className="gradient-text">founders</span> worldwide
          </h2>
        </div>
      </div>

      <div className="w-full relative flex flex-col gap-6 pause-on-hover">
        {/* Top Row Marquee (Left to Right) */}
        <div className="flex w-max animate-marquee">
          {[...row1, ...row1, ...row1].map((t, idx) => (
            <TestimonialCard key={`row1-${idx}`} t={t} />
          ))}
        </div>
        
        {/* Bottom Row Marquee (Right to Left) */}
        <div className="flex w-max animate-marquee-reverse">
          {[...row2, ...row2, ...row2].map((t, idx) => (
            <TestimonialCard key={`row2-${idx}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================
// FAQ SECTION
// =============================================
const faqs = [
  {
    question: "How accurate is the market validation Score?",
    answer: "Our engine is trained on thousands of successful and failed startups, real-time market data, and competitor analysis. It provides a brutally honest, data-backed assessment rather than a simple guess.",
    icon: Brain,
  },
  {
    question: "Is my startup idea safe with Validexio's Data Engine?",
    answer: "Absolutely. We use enterprise-grade encryption and strictly ensure our Data Engine models do not train on your proprietary data. Your market research, unique concept, and generated React codebase remain 100% confidential and exclusively yours.",
    icon: Lock,
  },
  {
    question: "Do I need technical skills to launch my startup with Validexio?",
    answer: "No coding experience is required. Validexio bridges the gap between idea and execution by generating production-ready React code, cloud database schemas, and step-by-step deployment blueprints. You can launch your MVP yourself, or hand our precise technical assets to a developer to save thousands.",
    icon: Zap,
  },
  {
    question: "Can I iterate on my startup idea after the initial validation report?",
    answer: "Yes. Validexio is built for rapid iteration. With our Pro and Team plans, you can use our Investor Simulator to instantly refine your pitch, tweak assumptions, and generate new UI layouts and technical architectures as you pivot based on market feedback.",
    icon: Rocket,
  },
  {
    question: "What exactly do I get in the free startup validation scan?",
    answer: "The free tier provides a comprehensive reality check before you commit time or money. You receive a basic validation score, an automated market saturation check, and our unique 'Anti-Roadmap' to explicitly show you what not to build based on current competitor failures.",
    icon: Shield,
  },
  {
    question: "Where does Validexio's market and competitor intelligence come from?",
    answer: "We dynamically aggregate real-time market signals from high-intent platforms like Reddit, Quora, ProductHunt, G2, HackerNews, Crunchbase, Trustpilot, Capterra, and specialized niche forums. This ensures your generated codebase, user psychology profiles, and go-to-market strategies solve actual user frustrations rather than relying on static templates.",
    icon: Globe,
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative bg-gradient-to-b from-[#FDFDFD] to-transparent">
      <div className="absolute inset-0 bg-grid opacity-[0.02]" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="badge badge-cherry inline-flex mb-4">
            <MessageSquare className="w-3 h-3 fill-current" />
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#1B1716] mb-6 tracking-tight leading-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#630102] to-red-500">questions</span> founders ask before they execute.
          </h2>
          <p className="text-[#1B1716]/60 text-lg max-w-xl mx-auto text-center">
            Everything you need to know about how Validexio protects your ideas and delivers actionable intelligence.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={`item-${index}`} 
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#630102]/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)]' : 'border-[#1B1716]/5 hover:border-[#1B1716]/10'}`}
              >
                <button aria-label="Button action" type="button"
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isOpen ? 'bg-[#630102]/10' : 'bg-[#1B1716]/5'}`}>
                      <faq.icon className={`w-5 h-5 ${isOpen ? 'text-[#630102]' : 'text-[#1B1716]/50'}`} />
                    </div>
                    <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-[#1B1716]' : 'text-[#1B1716]/80'}`}>
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[#1B1716]/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="pt-2 sm:pt-0 sm:pl-14 text-[#1B1716]/65 leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// =============================================
// CTA SECTION
// =============================================
function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cherry/5 to-transparent" />
        <div className="hero-orb-1 top-0 left-1/4 opacity-30" />
        <div className="hero-orb-2 bottom-0 right-1/4 opacity-20" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
        <div className="glass-card p-12 sm:p-16 border-cherry/20">
          <div className="badge badge-cherry inline-flex mb-6">
            <Zap className="w-3 h-3" />
            Get Started Today
          </div>
          <h2 className="text-[#1B1716] mb-6 text-3xl sm:text-4xl md:text-5xl">
            Your competitors are
            <br />
            <span className="gradient-text">validating</span> right now.
          </h2>
          <p className="text-[#1B1716]/60 text-lg mb-10 max-w-lg mx-auto text-center">
            Don&apos;t build in the dark. Get data-driven clarity in 60 seconds and
            start executing with confidence.
          </p>
          <Link aria-label="Navigation link" href="/register" className="btn-primary text-base px-6 sm:px-10 py-4 flex items-center justify-center w-full sm:w-auto max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
            <Rocket className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="truncate">Start Validating for Free</span>
            <ArrowRight className="w-5 h-5 ml-2 flex-shrink-0" />
          </Link>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[#1B1716]/45 text-sm font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-cherry/60 flex-shrink-0" /> Free tier available</span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#1B1716]/20"></span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-cherry/60 flex-shrink-0" /> Secure, one-time payments</span>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Footer } from "@/components/layout/Footer";

// =============================================
// VALUE ANCHORING SECTION
// =============================================

const anchorCosts = {
  marketResearch: { USD: "$250", INR: "₹20,000", EUR: "€250" },
  businessConsultant: { USD: "$150", INR: "₹12,000", EUR: "€150" },
  marketingStrategist: { USD: "$100", INR: "₹8,000", EUR: "€100" },
  techConsultant: { USD: "$100", INR: "₹8,000", EUR: "€100" },
  totalAgencies: { USD: "$600+", INR: "₹48,000+", EUR: "€600+" },
  validexioEngine: { USD: "Just $39", INR: "Just ₹1,499", EUR: "Just €39" }
};

function ValueAnchoringSection() {
  const { currency } = useCurrency();

  return (
    <section className="py-32 relative bg-gradient-to-b from-transparent via-[#FDFCF8]/50 to-transparent overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cherry/10 text-cherry text-sm font-bold tracking-wide uppercase mb-6 border border-cherry/20 shadow-sm">
            <TrendingDown className="w-4 h-4" />
            Cost Comparison
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#1B1716] mb-6 tracking-tight leading-tight">
            The Real Cost of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cherry to-red-500">Execution</span>.
          </h2>
          <p className="text-xl text-center text-[#1B1716]/60 max-w-2xl mx-auto font-medium">
            Why traditional validation drains your runway before you even write a single line of code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative items-stretch">
          
          {/* Left Column: The Traditional Way */}
          <div className="flex flex-col bg-white/80 backdrop-blur-sm rounded-[2rem] p-5 sm:p-8 md:p-10 border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full">
            <div className="flex items-center gap-3 mb-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Agencies & Upwork
                </h3>
                <p className="text-gray-500 text-sm font-medium">The Traditional Route</p>
              </div>
            </div>
            
            <ul className="space-y-4 flex-1 mb-10">
              <li className="flex justify-between items-center p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <span className="text-gray-600 font-medium">Market Research</span>
                <span className="font-mono text-gray-900 font-bold">{anchorCosts.marketResearch[currency]}</span>
              </li>
              <li className="flex justify-between items-center p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <span className="text-gray-600 font-medium">Business Consultant</span>
                <span className="font-mono text-gray-900 font-bold">{anchorCosts.businessConsultant[currency]}</span>
              </li>
              <li className="flex justify-between items-center p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <span className="text-gray-600 font-medium">Marketing Strategist</span>
                <span className="font-mono text-gray-900 font-bold">{anchorCosts.marketingStrategist[currency]}</span>
              </li>
              <li className="flex justify-between items-center p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <span className="text-gray-600 font-medium">Tech Consultant</span>
                <span className="font-mono text-gray-900 font-bold">{anchorCosts.techConsultant[currency]}</span>
              </li>
            </ul>
            
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-2 gap-2 sm:gap-0">
                <span className="text-gray-900 font-bold text-lg">Total Estimated Cost</span>
                <span className="font-mono text-gray-900 font-black text-[26px] sm:text-4xl tracking-tight leading-none text-center sm:text-right">{anchorCosts.totalAgencies[currency]}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-4 bg-orange-50/50 px-4 py-3 rounded-lg border border-orange-100 gap-1 sm:gap-0">
                <span className="text-orange-800 text-sm uppercase tracking-wider font-bold">Time to deliver</span>
                <span className="text-orange-900 font-black text-sm">2 to 4 weeks</span>
              </div>
            </div>
          </div>

          {/* Right Column: The Validexio Way (Bright & Premium) */}
          <div className="group flex flex-col bg-white rounded-[2rem] p-5 sm:p-8 md:p-10 border-2 border-cherry shadow-2xl shadow-cherry/10 relative overflow-hidden transform md:-translate-y-2 hover:-translate-y-4 transition-all duration-500 w-full">
            {/* Premium Glow Effects */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-cherry/10 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cherry/[0.02] pointer-events-none" />
            
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-cherry text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-md z-20 whitespace-nowrap">
              The Smart Choice
            </div>

            <div className="flex items-center gap-3 mb-8 relative z-10 mt-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1B1716] tracking-tight">
                  The Validexio Engine
                </h3>
                <p className="text-cherry font-semibold text-xs sm:text-sm">Instant Data Engine Execution</p>
              </div>
            </div>
            
            <ul className="space-y-4 flex-1 mb-10 relative z-10">
              {[
                "5 Direct Competitors Analyzed",
                "Unit Economics & Projections",
                "Early Adopter Psych & GTM Kit",
                "Tech Architecture & Fake Door Code"
              ].map((feature, idx) => (
                <li key={`item-${idx}`} className="flex justify-between items-center p-4 rounded-xl bg-white border border-cherry/10 shadow-sm hover:border-cherry/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cherry shrink-0" />
                    <span className="text-[#1B1716] font-semibold">{feature}</span>
                  </div>
                  <span className="font-bold text-cherry bg-cherry/5 px-3 py-1 rounded-full text-xs uppercase tracking-wider">Included</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-6 border-t border-cherry/10 relative z-10">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-2 gap-2 sm:gap-0">
                <span className="text-[#1B1716] font-bold text-lg">Total Cost</span>
                <span className="font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-cherry to-red-600 text-[26px] sm:text-4xl tracking-tight leading-none text-center sm:text-right">{anchorCosts.validexioEngine[currency]}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-4 bg-green-50 px-4 py-3 rounded-lg border border-green-100 gap-1 sm:gap-0">
                <span className="text-green-800 text-sm uppercase tracking-wider font-bold">Time to deliver</span>
                <span className="text-green-700 font-black text-sm flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  60 Seconds
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// =============================================
// INVESTOR SIMULATOR SECTION
// =============================================
function InvestorSimulatorSection() {
  return (
    <section className="py-32 relative bg-gradient-to-b from-transparent via-[#FDFCF8] to-white overflow-hidden">
      {/* Premium bright background effects */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#630102]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-24">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#630102]/30" />
            <span className="text-xs font-heading font-black uppercase tracking-[0.2em] text-[#630102]">
              New Feature
            </span>
            <div className="w-8 h-[1px] bg-[#630102]/30" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#111827] tracking-tight mb-8">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#630102] to-[#CE202A]">Investor Simulator</span>
          </h2>
          <p className="text-lg md:text-xl text-center text-[#6B7280] max-w-2xl mx-auto font-medium leading-relaxed">
            Stop pitching blindly. Get interrogated by a ruthless Data Engine trained on top-tier VC and Technical Architect frameworks before you face the real world.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Abstract Connecting Lines */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-[#E5E7EB] via-[#630102]/30 to-[#E5E7EB] border-t border-dashed border-[#E5E7EB]" />

          {/* Feature 1 */}
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 hover:border-[#630102]/20 transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(99,1,2,0.08)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#630102]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FDFCF8] flex items-center justify-center mb-8 border border-[#E5E7EB] group-hover:bg-[#630102]/5 group-hover:border-[#630102]/20 transition-colors duration-500 shadow-sm">
                <Brain className="w-8 h-8 text-[#630102] transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h3 className="text-2xl font-black text-[#111827] mb-4 tracking-tight group-hover:text-[#630102] transition-colors duration-300">Brutal Interrogation</h3>
              <p className="text-[#6B7280] leading-relaxed font-medium">
                Defend your unit economics, acquisition strategy, and tech stack against adaptive, rapid-fire questions designed to break weak business models.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 hover:border-[#630102]/20 transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(99,1,2,0.08)] relative overflow-hidden group md:-translate-y-6">
            <div className="absolute inset-0 bg-gradient-to-b from-[#630102]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FDFCF8] flex items-center justify-center mb-8 border border-[#E5E7EB] group-hover:bg-[#630102]/5 group-hover:border-[#630102]/20 transition-colors duration-500 shadow-sm">
                <Target className="w-8 h-8 text-[#630102] transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h3 className="text-2xl font-black text-[#111827] mb-4 tracking-tight group-hover:text-[#630102] transition-colors duration-300">Harsh Scoring</h3>
              <p className="text-[#6B7280] leading-relaxed font-medium">
                Receive a brutally honest Readiness Score (0-100%). We don't sugarcoat. If your idea relies on unproven assumptions, the simulator will flag it immediately.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 hover:border-[#630102]/20 transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(99,1,2,0.08)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#630102]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FDFCF8] flex items-center justify-center mb-8 border border-[#E5E7EB] group-hover:bg-[#630102]/5 group-hover:border-[#630102]/20 transition-colors duration-500 shadow-sm">
                <FileText className="w-8 h-8 text-[#630102] transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h3 className="text-2xl font-black text-[#111827] mb-4 tracking-tight group-hover:text-[#630102] transition-colors duration-300">Execution Briefs</h3>
              <p className="text-[#6B7280] leading-relaxed font-medium">
                Export your entire interrogation log into a premium PDF Execution Brief to share with co-founders or iterate on your pitch deck.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================
// LISTED ON SECTION (Social Proof)
// =============================================
function ListedOnSection() {
  return (
    <section className="py-16 bg-[#FDFCF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <h3 className="text-[10px] font-bold text-[#111827]/40 uppercase tracking-[0.3em] mb-10">
          Recognized & Published On
        </h3>
        
        <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-20 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-700">
          
          {/* Product Hunt */}
          <a 
            href="https://www.producthunt.com/" 
            target="_blank" 
            rel="dofollow noopener" 
            className="flex items-center gap-2.5 hover:scale-105 transition-transform duration-300"
          >
            <SiProducthunt className="w-8 h-8 text-[#DA552F]" />
            <span className="text-xl font-black text-[#111827] tracking-tight">Product Hunt</span>
          </a>

          {/* Dev.to */}
          <a 
            href="https://dev.to/" 
            target="_blank" 
            rel="dofollow noopener" 
            className="flex items-center hover:scale-105 transition-transform duration-300"
          >
            <SiDevdotto className="w-12 h-12 text-[#0A0A0A]" />
          </a>

          {/* Dang.ai */}
          <a 
            href="https://dang.ai" 
            target="_blank" 
            rel="dofollow noopener" 
            className="flex items-center gap-1.5 hover:scale-105 transition-transform duration-300"
          >
            <div className="bg-[#111827] text-white px-2 py-0.5 rounded-md text-xl font-black italic leading-none">d.</div>
            <span className="text-2xl font-black text-[#111827] tracking-tighter">dang.ai</span>
          </a>

          {/* BetaList */}
          <a 
            href="https://betalist.com" 
            target="_blank" 
            rel="dofollow noopener" 
            className="flex items-center gap-1 hover:scale-105 transition-transform duration-300"
          >
            <span className="text-[#E63737] font-black text-3xl leading-none -mt-1">β</span>
            <span className="text-xl font-black text-[#111827] tracking-tight">BetaList</span>
          </a>

          {/* SaaS Hub */}
          <a 
            href="https://saashub.com" 
            target="_blank" 
            rel="dofollow noopener" 
            className="flex items-center gap-1.5 hover:scale-105 transition-transform duration-300"
          >
            <div className="bg-[#2563EB] text-white px-1.5 py-1 rounded text-lg font-black leading-none">S</div>
            <span className="text-xl font-black text-[#111827] tracking-tight">SaaSHub</span>
          </a>

          {/* Smolhunt */}
          <a 
            href="https://smolhunt.com" 
            target="_blank" 
            rel="dofollow noopener" 
            className="flex items-center gap-1.5 hover:scale-105 transition-transform duration-300"
          >
            <img src="/logos/smolhunt.svg" alt="Smolhunt" className="h-6 w-6" />
            <span className="text-xl font-bold text-[#111827] tracking-tight">Smol Hunt</span>
          </a>

          {/* Peerpush */}
          <a 
            href="https://peerpush.com" 
            target="_blank" 
            rel="dofollow noopener" 
            className="flex items-center gap-1.5 hover:scale-105 transition-transform duration-300"
          >
            <img src="/logos/peerpush.svg" alt="PeerPush" className="h-6 w-6" />
            <span className="text-xl font-bold text-[#111827] tracking-tight">PeerPush</span>
          </a>

        </div>
      </div>
    </section>
  );
}

// =============================================
// MAIN PAGE
// =============================================
export default function LandingPage() {
  return (
    <main className="overflow-x-hidden w-full flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Validexio",
            "url": "https://validexio.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://validexio.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }`
        }}
      />
      <Navbar />
      <HeroSection />
      <RuthlessStats />
      <FeaturesSection />
      <HowItWorksSection />
      <PremiumExecutionShowcase />
      <GlobalCompetitorsGlobe />
      <CompetitorComparison />
      <PricingSection />
      <ValueAnchoringSection />
      <InvestorSimulatorSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
      <ListedOnSection />
    </main>
  );
}
