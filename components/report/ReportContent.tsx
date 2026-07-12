"use client";

import { useState } from "react";

import Link from "next/link";
import {
  ChevronLeft,
  TrendingUp,
  AlertTriangle,
  Users,
  DollarSign,
  Target,
  Rocket,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { UnitEconomicsCard } from "@/components/UnitEconomicsCard";
import { UnifiedScoreCard } from "@/components/report/UnifiedScoreCard";
import { MetricsRow } from "@/components/report/MetricsRow";
import { ExecutionLock } from "@/components/report/ExecutionLock";
import { PremiumLock } from "@/components/report/PremiumLock";
import { DeleteReportButton } from "@/components/dashboard/DeleteReportButton";
import { PremiumRevenueChart } from "@/components/PremiumRevenueChart";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReportContent({ report, isReadOnly = false, userTier = "STARTER" }: { report: any, isReadOnly?: boolean, userTier?: string }) {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  if (!report) return null;

  const market = {
    summary: "Analysis pending...",
    tam: "-", sam: "-", som: "-", growth: "-", trends: [],
    ...(typeof report.marketAnalysis === 'object' && report.marketAnalysis ? report.marketAnalysis : {})
  } as {
    summary: string;
    tam: string;
    sam: string;
    som: string;
    growth: string;
    trends: string[];
    score?: number;
    reasoning?: string;
    sourceUrl?: string;
  };

  const swot = {
    strengths: [], weaknesses: [], opportunities: [], threats: [],
    ...(typeof report.swotAnalysis === 'object' && report.swotAnalysis ? report.swotAnalysis : {})
  } as {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };

  const competitors = (Array.isArray(report.competitors) ? report.competitors : []) as Array<{
    name: string;
    website?: string;
    description: string;
    strengths: string[];
    weaknesses?: string[];
    pricing: string;
    differentiator: string;
    weakness?: string;
    sourceUrl?: string;
  }>;

  const personas = (Array.isArray(report.customerPersonas) ? report.customerPersonas : []) as Array<{
    name: string;
    age: string;
    title: string;
    painPoints: string[];
    goals: string[];
    buyingBehavior: string;
    channels: string[];
    willingnessToPay: string;
  }>;

  const revenue = {
    year1: "-", year2: "-", year3: "-", assumptions: [], revenueStreams: [],
    ...(typeof report.revenuePotential === 'object' && report.revenuePotential ? report.revenuePotential : {})
  } as {
    year1: string;
    year2: string;
    year3: string;
    assumptions: string[];
    revenueStreams: string[];
    unitEconomics?: {
      competitorPricingTiers: Array<{ competitorName: string; price: string; billingModel: string }>;
      suggestedPricingStrategy: { recommendedPrice: string; justification: string };
      projectedMargins: string;
    };
  };

  const salesFunnel = (typeof report.salesFunnel === 'object' && report.salesFunnel ? report.salesFunnel : null) as {
    awareness: { channels: string[]; content: string[] };
    consideration: { touchpoints: string[]; objections: string[] };
    conversion: { triggers: string[]; incentives: string[] };
    retention: { strategies: string[]; metrics: string[] };
  } | null;

  const codeBoilerplate = typeof report.codeBoilerplate === 'string' ? report.codeBoilerplate : null;

  const risks = (Array.isArray(report.riskAnalysis) ? report.riskAnalysis : []) as Array<{
    risk: string;
    probability: string;
    impact: string;
    mitigation: string;
  }>;

  const pricing = {
    strategy: "Pending...", tiers: [], rationale: "",
    ...(typeof report.pricingRecommendation === 'object' && report.pricingRecommendation ? report.pricingRecommendation : {})
  } as {
    strategy: string;
    tiers: Array<{ name: string; price: string; features: string[]; target: string }>;
    rationale: string;
  };

  const growth = (Array.isArray(report.growthOpportunities) ? report.growthOpportunities : []) as Array<{
    tactic: string;
    description: string;
    effort: string;
    impact: string;
    timeframe: string;
  }>;

  const acquisition = {
    primaryChannels: [], firstCustomerTactics: [], communityBuilding: "", contentStrategy: "", partnershipOpportunities: [],
    ...(typeof report.acquisitionStrategy === 'object' && report.acquisitionStrategy ? report.acquisitionStrategy : {})
  } as {
    primaryChannels: string[];
    firstCustomerTactics: string[];
    communityBuilding: string;
    contentStrategy: string;
    partnershipOpportunities: string[];
  };

  const actionPlan = {
    day30: [], day60: [], day90: [], premium_execution: undefined,
    ...(typeof report.actionPlan === 'object' && report.actionPlan ? report.actionPlan : {})
  } as {
    day30: string[];
    day60: string[];
    day90: string[];
    premium_execution?: {
      market_sizing_and_pricing?: { tam_sam_som_values: string; calculated_entry_price_strategy: string };
      adaptive_tech_stack?: { database_schema: string; cloud_blueprint: string };
      signal_to_sales_mapping?: Array<{ reddit_complaint: string; email_hook: string }>;
    };
  };

  const landingPage = (typeof report.landingPageCopy === 'object' && report.landingPageCopy ? report.landingPageCopy : null) as {
    headline: string;
    subheadline: string;
    valueProp: string;
    cta: string;
    socialProof: string;
    features: Array<{ title: string; description: string }>;
  } | null;

  const launchPlatforms = (Array.isArray(report.launchPlatforms) ? report.launchPlatforms : []) as Array<{
    platform: string;
    reason: string;
    url?: string;
  }>;

  const mvpPrioritization = {
    mustHave: [], shouldHave: [], couldHave: [], wontHave: [],
    ...(typeof report.mvpPrioritization === 'object' && report.mvpPrioritization ? report.mvpPrioritization : {})
  } as {
    mustHave: string[];
    shouldHave: string[];
    couldHave: string[];
    wontHave: string[];
  };

  const complianceCheck = (Array.isArray(report.complianceCheck) ? report.complianceCheck : []) as Array<{
    requirement: string;
    description: string;
    riskLevel: string;
  }>;

  const leads = (Array.isArray(report.leads) ? report.leads : []) as Array<{
    id: string;
    name: string;
    title: string;
    company: string;
    email?: string;
    linkedin?: string;
    twitter?: string;
  }>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto break-words bg-[#FDFCF8] font-sans antialiased selection:bg-cherry/20 selection:text-cherry">
      {/* Back + Header */}
      <div className="mb-10 border-b border-[#E5E7EB]/50 pb-8 animate-fade-in">
        {!isReadOnly && (
        <Link aria-label="Navigation link"
          href="/dashboard/reports"
          className="inline-flex items-center gap-1.5 text-[#6B7280] hover:text-[#111827] text-sm mb-4 transition-colors break-words"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Reports
        </Link>
        )}

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-black text-[#111827] mb-3 break-words tracking-tight leading-tight">
              {report.idea?.title || "Untitled Idea"}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#6B7280]">
              <span className="flex items-center gap-2 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#630102] shadow-[0_0_8px_rgba(99,1,2,0.6)]"></div>
                <span className="text-xs font-black uppercase tracking-widest text-[#111827]/80 truncate">{report.idea?.industry || "Uncategorized"}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(report.createdAt)}
              </span>
              {report.processingTime && (
                <span className="text-[#6B7280]">
                  Analyzed in {(report.processingTime / 1000).toFixed(1)}s
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {!isReadOnly && <DeleteReportButton reportId={report.id} />}
            {!isReadOnly && (
              <div className="flex flex-wrap items-center gap-2">
                {/* PDF Export Button - Gated for Pro, Team, and Enterprise */}
                {userTier !== "STARTER" && userTier !== "FREE" ? (
                  <button aria-label="Button action" type="button"
                    onClick={() => {
                      window.open(`/api/v1/projects/${report.id}/export/pdf`, '_blank');
                    }}
                    className="btn-primary text-sm gap-2 px-3 py-2 bg-[#111827] text-white border border-[#111827] hover:bg-[#FFFFFF] hover:text-[#111827] transition-colors rounded-none flex items-center"
                  >
                      <>
                        <FileText className="w-4 h-4" />
                        Export PDF
                      </>
                  </button>
                ) : (
                  <button aria-label="Button action" type="button" 
                    onClick={() => alert("PDF Export is available on PRO plans and above. Upgrade your plan to unlock.")}
                    className="btn-primary text-sm gap-2 px-3 py-2 bg-[#F3F4F6] text-[#9CA3AF] border border-[#E5E7EB] cursor-not-allowed rounded-none"
                  >
                    <FileText className="w-4 h-4" />
                    Export PDF (Locked)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Score Overview */}
      <UnifiedScoreCard score={report.validationScore ?? 0} report={report} />

      {/* Main Grid */}
      <div className="space-y-10">
        {/* Market Analysis */}
        <section className="glass-card p-6 sm:p-8 animate-fade-in-scale delay-100 group hover:border-[#111827]/20 transition-all duration-500" id="market-analysis">
          <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB]/60 pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
              <BarChart3 className="w-5 h-5 text-[#630102]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Market Analysis</h2>
          </div>
          
          {market.score !== undefined && (
            <div className="mb-8 bg-gradient-to-br from-[#FDFCF8] to-[#FFFFFF] p-6 rounded-xl border border-[#E5E7EB] hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-bold text-[#111827] text-xs uppercase tracking-widest">Saturation Score</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-[#630102]/10 text-[#630102] border border-[#630102]/20 shadow-sm">{market.score}/100</span>
              </div>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                {market.reasoning}
                {market.sourceUrl && (
                  <a aria-label="Link action"
                    href={market.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#630102] font-semibold hover:underline transition-opacity ml-2 whitespace-nowrap"
                  >
                    [Source]
                  </a>
                )}
              </p>
            </div>
          )}

          <p className="text-[#111827] text-sm sm:text-base leading-relaxed mb-8">{market.summary}</p>
          
          <div className="mb-8">
            <MetricsRow 
              tam={market.tam} 
              sam={market.sam} 
              som={market.som} 
              cagr={market.growth} 
            />
          </div>

          <div>
            <p className="text-xs text-[#6B7280] font-bold uppercase tracking-wider mb-3">Market Trends</p>
            <div className="flex flex-wrap gap-2">
              {market.trends.map((trend) => (
                <span key={trend} className="text-xs font-semibold px-3 py-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[#111827]">{trend}</span>
              ))}
            </div>
          </div>
        </section>

        {/* SWOT Analysis */}
        <section id="swot-analysis" className="glass-card p-6 sm:p-8 animate-fade-in-scale delay-200 group hover:border-[#111827]/20 transition-all duration-500">
          <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB]/60 pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
              <Target className="w-5 h-5 text-[#630102]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">SWOT Analysis</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-[#FDFCF8] border border-[#E5E7EB] rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-emerald-700 font-bold text-xs uppercase tracking-wider mb-4 pb-2 border-b border-[#E5E7EB] flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Strengths
              </h3>
              <ul className="space-y-2">
                {swot.strengths.map((s) => (
                  <li key={s} className="text-[#111827] text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span className="leading-relaxed flex-1 min-w-0 break-words">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#FDFCF8] border border-[#E5E7EB] rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-red-700 font-bold text-xs uppercase tracking-widest mb-5 pb-3 border-b border-[#E5E7EB] flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Weaknesses
              </h3>
              <ul className="space-y-2">
                {swot.weaknesses.map((w) => (
                  <li key={w} className="text-[#111827] text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span className="leading-relaxed flex-1 min-w-0 break-words">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#FDFCF8] border border-[#E5E7EB] rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-blue-700 font-bold text-xs uppercase tracking-widest mb-5 pb-3 border-b border-[#E5E7EB] flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Opportunities
              </h3>
              <ul className="space-y-2">
                {swot.opportunities.map((o) => (
                  <li key={o} className="text-[#111827] text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span className="leading-relaxed flex-1 min-w-0 break-words">{o}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#FDFCF8] border border-[#E5E7EB] rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-yellow-700 font-bold text-xs uppercase tracking-widest mb-5 pb-3 border-b border-[#E5E7EB] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Threats
              </h3>
              <ul className="space-y-2">
                {swot.threats.map((t) => (
                  <li key={t} className="text-[#111827] text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span className="leading-relaxed flex-1 min-w-0 break-words">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Competitors */}
        <section id="competitors" className="glass-card p-6 sm:p-8 animate-fade-in-scale delay-300 group hover:border-[#111827]/20 transition-all duration-500">
          <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB]/60 pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
              <BarChart3 className="w-5 h-5 text-[#630102]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Competitor Analysis</h2>
          </div>
          <div className="space-y-6">
            {competitors.length === 0 || report.isLite ? (
              <PremiumLock 
                isLocked={true} 
                title="Real-time Competitor Intel Locked" 
                description="Upgrade to Premium to unlock SerpAPI-powered live competitor tracking, vulnerability analysis, and positioning strategies." 
              />
            ) : (
              (userTier === "STARTER" ? competitors.slice(0, 3) : competitors).map((comp) => (
                <div key={comp.name} className="relative bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:shadow-[0_8px_30px_rgba(99,1,2,0.08)] transition-all duration-500">
                  {/* Elegant Header Area */}
                  <div className="bg-[#1B1716] p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-black text-[#FDFCF8] tracking-tight">{comp.name}</h3>
                      {comp.website && (
                        <a aria-label="Link action" href={`https://${comp.website}`} target="_blank" rel="noopener noreferrer" className="text-[#FDFCF8]/50 hover:text-[#FFEDAB] text-sm font-medium transition-colors flex items-center gap-1.5 mt-1 w-max">
                          {comp.website} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex-shrink-0 whitespace-nowrap">
                      <div className="w-2 h-2 rounded-full bg-[#FFEDAB] animate-pulse flex-shrink-0"></div>
                      <span className="text-[#FFEDAB] text-xs font-bold tracking-widest uppercase truncate">{comp.pricing}</span>
                    </div>
                  </div>

                  {/* Description & Details */}
                  <div className="p-6 sm:p-8 bg-[#FDFCF8]">
                    <p className="text-[#1B1716]/80 text-base leading-relaxed mb-8 max-w-4xl">
                      {comp.description}
                      {comp.weakness && (
                        <span className="block mt-3 bg-red-50 text-red-900 border border-red-100 rounded-lg p-3 text-sm">
                          <strong className="uppercase tracking-wider text-xs text-red-700 mr-2">Key Weakness:</strong> 
                          {comp.weakness}
                        </span>
                      )}
                      {comp.sourceUrl && (
                        <a aria-label="Link action" href={comp.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#630102] hover:text-[#8C0203] font-bold text-sm mt-3 transition-colors inline-flex items-center gap-1">
                          [Source Intelligence]
                        </a>
                      )}
                    </p>

                    {/* The Intelligence Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Strengths & Weaknesses (Left/Center) */}
                      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded bg-emerald-50 flex items-center justify-center border border-emerald-100">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h4 className="text-[#1B1716] font-bold text-sm tracking-wide uppercase">Core Strengths</h4>
                          </div>
                          <ul className="space-y-3">
                            {comp.strengths.map(s => (
                              <li key={s} className="flex items-start gap-2 text-sm text-[#1B1716]/80 leading-snug">
                                <span className="text-emerald-500 font-bold mt-0.5">✓</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {comp.weaknesses && comp.weaknesses.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-7 h-7 rounded bg-red-50 flex items-center justify-center border border-red-100">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              </div>
                              <h4 className="text-[#1B1716] font-bold text-sm tracking-wide uppercase">Vulnerabilities</h4>
                            </div>
                            <ul className="space-y-3">
                              {comp.weaknesses.map(w => (
                                <li key={w} className="flex items-start gap-2 text-sm text-[#1B1716]/80 leading-snug">
                                  <span className="text-red-500 font-bold mt-0.5">×</span> {w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Your Differentiator (Right) */}
                      <div className="bg-gradient-to-br from-[#1B1716] to-[#3a302e] rounded-xl p-6 shadow-lg relative overflow-hidden group-hover:from-[#630102] group-hover:to-[#2a0001] transition-colors duration-700">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                        <div className="flex items-center gap-2 mb-4 relative z-10">
                          <Target className="w-5 h-5 text-[#FFEDAB]" />
                          <h4 className="text-[#FFEDAB] font-black text-sm tracking-widest uppercase">The Kill Shot</h4>
                        </div>
                        <p className="text-[#FDFCF8]/90 text-sm leading-relaxed font-medium relative z-10">
                          {comp.differentiator}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Customer Personas */}
        <section id="personas" className="glass-card p-6 sm:p-8 animate-fade-in-scale delay-400 group hover:border-[#111827]/20 transition-all duration-500">
          <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB]/60 pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
              <Users className="w-5 h-5 text-[#630102]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Customer Personas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {personas.length === 0 || report.isLite || userTier === "STARTER" || userTier === "FREE" ? (
              <div className="md:col-span-3">
                <PremiumLock 
                  isLocked={true} 
                  title="Customer Personas Locked" 
                  description="Upgrade to Premium to unlock deep psychological profiles, buying behaviors, and acquisition channels for your exact target audience." 
                />
              </div>
            ) : (
              personas.map((persona, i) => (
                <div key={persona.name} className="border border-[#E5E7EB] rounded-xl p-6 bg-[#FDFCF8] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#E5E7EB]">
                    <div className="w-12 h-12 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-[#111827]">{persona.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#111827] font-bold text-base truncate">{persona.name}</p>
                      <p className="text-[#6B7280] text-xs font-medium truncate">{persona.title} • {persona.age}</p>
                    </div>
                  </div>

                  <div className="space-y-5 text-sm">
                    <div>
                      <p className="text-[#6B7280] font-bold text-[10px] uppercase tracking-widest mb-2 border-l-2 border-[#630102] pl-2">Pain Points</p>
                      <ul className="space-y-1">
                        {persona.painPoints.slice(0, 3).map((p) => (
                          <li key={p} className="text-[#111827] flex items-start gap-2">
                            <span className="text-red-500 mt-0.5 text-xs flex-shrink-0">•</span> <span className="leading-relaxed flex-1 min-w-0 break-words">{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-4">
                      <p className="text-[#6B7280] font-bold text-[10px] uppercase tracking-widest">Willingness to Pay</p>
                      <p className="text-[#111827] font-bold">{persona.willingnessToPay}</p>
                    </div>
                    <div className="border-t border-[#E5E7EB] pt-4">
                      <p className="text-[#6B7280] font-bold text-[10px] uppercase tracking-widest mb-2">Acquisition Channels</p>
                      <div className="flex flex-wrap gap-1.5">
                        {persona.channels.map((c) => (
                          <span key={c} className="text-xs font-semibold px-2 py-0.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded text-[#6B7280]">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Revenue Potential */}
        <section id="revenue" className="glass-card p-6 sm:p-8 relative overflow-hidden animate-fade-in-scale delay-500 group hover:border-[#111827]/20 transition-all duration-500">
          {/* Subtle decorative glassmorphism glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#630102]/5 rounded-full blur-[60px] -z-10 translate-x-1/3 -translate-y-1/3 group-hover:bg-[#630102]/10 transition-colors duration-700"></div>
          
          <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB]/60 pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
              <DollarSign className="w-5 h-5 text-[#630102]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Revenue Potential</h2>
          </div>

          {revenue.year1 === "Locked" || revenue.year1 === "-" || report.isLite || userTier === "FREE" || userTier === "STARTER" ? (
            <>
              <PremiumLock 
                isLocked={true} 
                title={userTier === "STARTER" ? "Revenue Projections Locked" : "Financial Forecasting Locked"}
                description={userTier === "STARTER" ? "Upgrade to Pro to unlock 3-year revenue projections, charts, and key financial assumptions." : "Upgrade to Premium to unlock a realistic 3-year revenue projection, unit economics breakdown, and key financial assumptions."}
              />
              {userTier === "STARTER" && revenue.unitEconomics && (
                <div className="mt-8 pt-8 border-t border-[#E5E7EB] relative z-10">
                  <p className="text-xs text-[#630102]/70 font-bold uppercase tracking-wider mb-4">Unit Economics</p>
                  <UnitEconomicsCard data={revenue.unitEconomics} />
                </div>
              )}
            </>
          ) : (
            <>
              {actionPlan.premium_execution?.market_sizing_and_pricing && (
                <div className="mb-8 border-b border-[#E5E7EB]/60 pb-8 relative z-10">
                  <p className="text-xs text-[#6B7280] font-bold uppercase tracking-widest mb-5 border-l-2 border-[#630102] pl-3">Market Sizing & Entry Pricing (Premium)</p>
                  <div className="bg-gradient-to-r from-[#FDFCF8] to-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 mb-4 hover:shadow-md transition-shadow duration-300">
                    <p className="text-xs font-bold text-[#6B7280] mb-2 uppercase tracking-widest">TAM / SAM / SOM</p>
                    <p className="text-xl text-[#630102] font-black font-mono tracking-tight">{actionPlan.premium_execution.market_sizing_and_pricing.tam_sam_som_values}</p>
                  </div>
                  <div className="bg-gradient-to-r from-[#FDFCF8] to-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                    <p className="text-xs font-bold text-[#6B7280] mb-2 uppercase tracking-widest">Calculated Entry Price Strategy</p>
                    <p className="text-sm text-[#111827] leading-relaxed">{actionPlan.premium_execution.market_sizing_and_pricing.calculated_entry_price_strategy}</p>
                  </div>
                </div>
              )}

              <div className="mb-8 border-b border-[#E5E7EB] pb-8 relative z-10">
                <PremiumRevenueChart 
                  year1={revenue.year1} 
                  year2={revenue.year2} 
                  year3={revenue.year3} 
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-8 relative z-10">
                <div className="glass border border-[#E5E7EB] rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <p className="text-xs text-[#6B7280] font-bold uppercase tracking-widest mb-5 border-l-2 border-[#630102] pl-3">Revenue Streams</p>
                  <ul className="space-y-3">
                    {revenue.revenueStreams.map((s) => (
                      <li key={s} className="text-[#111827] text-sm flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-[#630102] rounded-full mt-2 flex-shrink-0 shadow-sm" />
                        <span className="font-semibold flex-1 min-w-0 break-words">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass border border-[#E5E7EB] rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <p className="text-xs text-[#630102]/70 font-bold uppercase tracking-widest mb-5 border-l-2 border-[#630102] pl-3">Key Assumptions</p>
                  <ul className="space-y-3">
                    {revenue.assumptions.map((a) => (
                      <li key={a} className="text-[#111827] text-sm flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-[#630102]/30 rounded-full mt-2 flex-shrink-0" />
                        <span className="font-medium text-[#6B7280] flex-1 min-w-0 break-words">{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {revenue.unitEconomics && (
                <div className="mt-8 pt-8 border-t border-[#630102]/10 relative z-10">
                  <p className="text-xs text-[#630102]/70 font-bold uppercase tracking-wider mb-4">Unit Economics</p>
                  <UnitEconomicsCard data={revenue.unitEconomics} />
                </div>
              )}
            </>
          )}
        </section>

        {/* Risk Analysis */}
        <section id="risks" className="glass-card p-6 sm:p-8 animate-fade-in-scale delay-[600ms] group hover:border-[#111827]/20 transition-all duration-500">
          <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB]/60 pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
              <AlertTriangle className="w-5 h-5 text-[#630102]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Risk Analysis</h2>
          </div>
          <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
            {risks.length === 0 || report.isLite ? (
              <PremiumLock 
                isLocked={true} 
                title="Risk Analysis Locked" 
                description="Upgrade to Premium to uncover critical market risks, competitive threats, and actionable mitigation strategies." 
              />
            ) : (
              risks.map((risk, i) => (
                <div key={`item-${i}`} className={`p-5 flex flex-col sm:flex-row gap-4 sm:items-start ${i !== risks.length - 1 ? 'border-b border-[#E5E7EB]' : ''} hover:bg-[#F9FAFB] transition-colors`}>
                  <div className="flex flex-wrap gap-2 sm:flex-col sm:gap-1 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider w-max whitespace-nowrap ${risk.probability.toLowerCase() === 'high' ? 'bg-red-50 text-red-700 border border-red-200' : risk.probability.toLowerCase() === 'medium' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                      P: {risk.probability}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider w-max whitespace-nowrap ${risk.impact.toLowerCase() === 'high' ? 'bg-red-50 text-red-700 border border-red-200' : risk.impact.toLowerCase() === 'medium' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                      I: {risk.impact}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#111827] font-bold text-sm mb-1 break-words">{risk.risk}</p>
                    <p className="text-[#6B7280] text-sm leading-relaxed break-words">
                      <strong className="text-[#111827] font-semibold text-xs uppercase tracking-wider mr-1">Mitigation:</strong> {risk.mitigation}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Pricing Recommendation */}
        <section className="glass-card p-6 sm:p-8 relative overflow-hidden animate-fade-in-scale delay-[700ms] group hover:border-[#111827]/20 transition-all duration-500">
          {pricing.strategy.includes("Locked") || pricing.strategy === "Pending..." || report.isLite ? (
            <PremiumLock 
              isLocked={true} 
              title="Pricing Strategy Locked" 
              description="Upgrade to Premium to unlock real-time data-backed pricing tiers, feature bundling, and competitor-benchmarked rates." 
            />
          ) : (
            <>
              {/* Subtle decorative glassmorphism glow */}
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#630102]/5 rounded-full blur-[60px] -z-10 -translate-x-1/3 translate-y-1/3 group-hover:bg-[#630102]/10 transition-colors duration-700"></div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
                  <DollarSign className="w-5 h-5 text-[#630102]" />
                </div>
                <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Pricing Recommendation</h2>
              </div>
              <p className="text-[#6B7280] text-sm mb-6 pb-6 border-b border-[#E5E7EB] font-medium">
                Strategy: <strong className="text-[#630102] text-base">{pricing.strategy}</strong>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
                {pricing.tiers.map((tier) => (
                  <div key={tier.name} className="glass border border-[#E5E7EB] rounded-xl p-8 flex flex-col hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <p className="text-[#6B7280] font-bold text-xs uppercase tracking-widest mb-3">{tier.name}</p>
                    <div className="flex items-baseline gap-1 mb-5 pb-5 border-b border-[#E5E7EB]">
                      <span className="text-4xl font-black text-[#630102] tracking-tighter">{tier.price}</span>
                    </div>
                    <p className="text-[#630102] text-xs font-bold uppercase tracking-wider mb-4">{tier.target}</p>
                    <ul className="space-y-3 flex-1">
                      {tier.features.slice(0, 4).map((f) => (
                        <li key={f} className="text-[#111827] text-sm flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#630102] flex-shrink-0 mt-0.5" />
                          <span className="font-medium leading-relaxed flex-1 min-w-0 break-words">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-[#111827] text-sm italic border-l-2 border-[#630102]/30 pl-3 py-1 font-medium relative z-10">&quot;{pricing.rationale}&quot;</p>
            </>
          )}
        </section>

        {/* Growth Opportunities */}
        <section id="growth" className="glass-card p-6 sm:p-8 animate-fade-in-scale delay-[800ms] group hover:border-[#111827]/20 transition-all duration-500">
          <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB]/60 pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
              <TrendingUp className="w-5 h-5 text-[#630102]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Growth Opportunities</h2>
          </div>
          <div className="grid gap-5">
            {growth.length === 0 || report.isLite ? (
              <PremiumLock 
                isLocked={true} 
                title="Growth Strategy Locked" 
                description="Upgrade to Premium to discover high-impact growth tactics, low-effort wins, and long-term scaling opportunities." 
              />
            ) : (
              growth.map((g) => (
                <div key={g.tactic} className="border border-[#E5E7EB] rounded-lg p-5 flex flex-col sm:flex-row items-start gap-4 hover:border-[#630102]/30 transition-colors bg-[#FDFDFD]">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <p className="text-[#111827] font-bold text-base break-words">{g.tactic}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB]">Effort: {g.effort}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#630102]/5 text-[#630102] border border-[#630102]/20">Impact: {g.impact}</span>
                    </div>
                    <p className="text-[#6B7280] text-sm leading-relaxed mb-1 break-words">{g.description}</p>
                  </div>
                  <div className="text-right sm:text-left flex-shrink-0 text-xs font-bold text-[#111827] bg-[#F9FAFB] border border-[#E5E7EB] px-3 py-1.5 rounded-md mt-2 sm:mt-0">
                    {g.timeframe}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* First Customer Acquisition - Premium Redesign */}
        <section id="acquisition" className="relative p-8 sm:p-10 animate-fade-in-scale delay-[900ms] group bg-white border border-[#E5E7EB] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden">
          {acquisition.primaryChannels.length === 0 || report.isLite || userTier === "STARTER" || userTier === "FREE" ? (
            <PremiumLock 
              isLocked={true} 
              title="Go-to-Market Blueprint Locked" 
              description="Upgrade to Pro to unlock your acquisition strategy, content engine, and step-by-step first customer tactics." 
            />
          ) : (
            <>
              {/* Subtle background decoration */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1B1716] via-[#630102] to-[#FFEDAB]"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#E5E7EB]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Rocket className="w-4 h-4 text-[#630102]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#630102]">Go-to-Market Blueprint</span>
                  </div>
                  <h2 className="text-3xl font-black text-[#1B1716] tracking-tight">Acquisition Strategy</h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1B1716]/40 block mb-1">Targeting</span>
                  <span className="text-sm font-black text-[#1B1716] bg-[#FDFCF8] px-3 py-1 rounded-md border border-[#E5E7EB] inline-block">First 10 Paying Users</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Channels & Content */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                  
                  {/* Primary Channels - Premium Light Redesign */}
                  <div className="relative rounded-2xl p-[1px] overflow-hidden group hover:shadow-[0_20px_50px_rgba(99,1,2,0.08)] transition-shadow duration-700">
                    {/* Animated gradient border effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#630102]/20 via-[#FFEDAB]/30 to-[#E5E7EB] opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* Inner Card */}
                    <div className="relative bg-gradient-to-br from-[#FFFFFF] via-[#FDFCF8] to-[#F9FAFB] rounded-2xl p-6 sm:p-8 h-full border border-white overflow-hidden backdrop-blur-xl">
                      {/* Atmospheric Glows */}
                      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#630102]/5 rounded-full blur-[80px] group-hover:bg-[#630102]/10 group-hover:scale-110 transition-all duration-1000 ease-out"></div>
                      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#FFEDAB]/20 rounded-full blur-[60px] group-hover:bg-[#FFEDAB]/40 group-hover:scale-110 transition-all duration-1000 ease-out"></div>
                      
                      {/* Header */}
                      <div className="relative z-10 flex items-center justify-between mb-8 border-b border-[#E5E7EB]/80 pb-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#630102] to-[#1B1716] flex items-center gap-3 drop-shadow-sm">
                          <div className="w-6 h-6 rounded-md bg-[#630102]/5 flex items-center justify-center border border-[#630102]/10 shadow-[0_0_10px_rgba(99,1,2,0.05)]">
                            <Target className="w-3.5 h-3.5 text-[#630102]" />
                          </div>
                          Primary Channels
                        </h3>
                      </div>
                      
                      {/* Channel List */}
                      <div className="space-y-4 relative z-10">
                        {acquisition.primaryChannels.map((c, i) => (
                          <div 
                            key={c} 
                            className="group/item flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl bg-white border border-[#E5E7EB]/80 hover:border-[#630102]/20 hover:bg-[#FDFCF8] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-500 cursor-default relative overflow-hidden"
                          >
                            {/* Subtle highlight on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#630102]/[0.02] to-transparent translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                            
                            {/* Number Badge */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-b from-[#630102] to-[#3a0001] border border-[#630102]/20 group-hover/item:shadow-[0_0_20px_rgba(99,1,2,0.2)] transition-all duration-500 flex-shrink-0 relative z-10">
                              <span className="text-[#FFEDAB] font-bold text-xs tracking-tighter">0{i + 1}</span>
                            </div>
                            
                            {/* Content */}
                            <span className="text-[15px] font-medium tracking-wide text-[#1B1716]/80 leading-relaxed group-hover/item:text-[#1B1716] transition-colors relative z-10 flex-1 min-w-0 break-words">
                              {c}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Content Strategy */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#1B1716]/60 mb-4 ml-1">Content Engine</h3>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#630102] rounded-l-lg"></div>
                      <div className="bg-[#FDFCF8] border border-[#E5E7EB] border-l-0 rounded-r-lg p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <p className="text-[#1B1716]/90 text-lg leading-relaxed font-serif italic tracking-wide">
                          &quot;{acquisition.contentStrategy}&quot;
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Execution Tactics */}
                <div className="lg:col-span-7">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#1B1716]/60 mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#630102] rounded-sm"></div>
                    Execution Tactics
                  </h3>
                  
                  <div className="space-y-4">
                    {acquisition.firstCustomerTactics.map((tactic, i) => (
                      <div key={`item-${i}`} className="group flex items-stretch gap-4 p-5 bg-white border border-[#E5E7EB] rounded-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-[#630102]/20 transition-all duration-300">
                        <div className="flex flex-col items-center justify-center border-r border-[#E5E7EB] pr-5 group-hover:border-[#630102]/30 transition-colors">
                          <span className="text-2xl font-black text-[#1B1716]/10 group-hover:text-[#630102] transition-colors leading-none tracking-tighter">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="flex items-center flex-1">
                          <span className="text-base font-heading font-light tracking-wide text-[#1B1716]/90 leading-relaxed group-hover:text-[#1B1716] transition-colors">
                            {tactic}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Launch Platforms */}
        <section id="launch-platforms" className="glass-card p-6 sm:p-8 animate-fade-in-scale delay-[950ms] group hover:border-[#111827]/20 transition-all duration-500">
          <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB]/60 pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
              <Rocket className="w-5 h-5 text-[#630102]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Launch Platforms</h2>
          </div>
          {launchPlatforms.length === 0 || report.isLite ? (
            <PremiumLock 
              isLocked={true} 
              title="Launch Strategy Locked" 
              description="Upgrade to Premium to discover the exact platforms (local or digital) where you should launch to get your first 5 customers." 
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {launchPlatforms.map((platform) => (
                <div key={platform.platform} className="bg-[#FDFCF8] border border-[#E5E7EB] rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="font-bold text-[#111827] mb-2 text-lg">{platform.platform}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed mb-3">{platform.reason}</p>
                  {platform.url && (
                    <a aria-label="Link action" href={platform.url} target="_blank" rel="noopener noreferrer" className="text-[#630102] text-sm font-semibold hover:underline inline-flex items-center gap-1">
                      Visit Platform <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* B2B Leads */}
        <section id="b2b-leads" className="glass-card p-6 sm:p-8 animate-fade-in-scale delay-[975ms] group hover:border-[#111827]/20 transition-all duration-500">
          <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB]/60 pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
              <Users className="w-5 h-5 text-[#630102]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">B2B Leads</h2>
          </div>
          {leads.length === 0 || report.isLite || userTier === "FREE" ? (
            <PremiumLock 
              isLocked={true} 
              title="B2B Lead Generation Locked" 
              description="Upgrade to Starter or higher to instantly generate verified contact details for your startup ideas." 
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(userTier === "STARTER" ? leads.slice(0, 2) : userTier === "PRO" ? leads.slice(0, 5) : leads).map((lead) => (
                <div key={lead.id} className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow duration-300">
                  <h3 className="font-bold text-[#111827] text-base truncate">{lead.name}</h3>
                  <p className="text-sm font-medium text-[#630102] truncate mb-2">{lead.title} @ {lead.company}</p>
                  <div className="space-y-1.5 mt-4">
                    {lead.email && <p className="text-xs text-[#6B7280] truncate">Email: <span className="font-semibold text-[#111827]">{lead.email}</span></p>}
                    {lead.linkedin && <a aria-label="Link action" href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0077b5] hover:underline block truncate">LinkedIn Profile</a>}
                    {lead.twitter && <a aria-label="Link action" href={lead.twitter} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1DA1F2] hover:underline block truncate">Twitter Profile</a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MVP Prioritization */}
        <section id="mvp-prioritization" className="glass-card p-6 sm:p-8 animate-fade-in-scale delay-[990ms] group hover:border-[#111827]/20 transition-all duration-500">
          <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB]/60 pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
              <Target className="w-5 h-5 text-[#630102]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">MVP Prioritization (MoSCoW)</h2>
          </div>
          {mvpPrioritization.mustHave.length === 0 || report.isLite ? (
            <PremiumLock 
              isLocked={true} 
              title="MVP Strategy Locked" 
              description="Upgrade to Premium to get a strict prioritization matrix that prevents overbuilding." 
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-[#FDFCF8] border border-[#E5E7EB] rounded-xl p-5">
                <h3 className="text-emerald-700 font-bold text-xs uppercase tracking-wider mb-3 pb-2 border-b border-[#E5E7EB]">Must Have</h3>
                <ul className="space-y-2 text-sm text-[#111827]">
                  {mvpPrioritization.mustHave.map((item, i) => <li key={`mh-${i}`} className="flex gap-2"><span className="text-emerald-500 font-bold">•</span>{item}</li>)}
                </ul>
              </div>
              <div className="bg-[#FDFCF8] border border-[#E5E7EB] rounded-xl p-5">
                <h3 className="text-blue-700 font-bold text-xs uppercase tracking-wider mb-3 pb-2 border-b border-[#E5E7EB]">Should Have</h3>
                <ul className="space-y-2 text-sm text-[#111827]">
                  {mvpPrioritization.shouldHave.map((item, i) => <li key={`sh-${i}`} className="flex gap-2"><span className="text-blue-500 font-bold">•</span>{item}</li>)}
                </ul>
              </div>
              <div className="bg-[#FDFCF8] border border-[#E5E7EB] rounded-xl p-5">
                <h3 className="text-yellow-700 font-bold text-xs uppercase tracking-wider mb-3 pb-2 border-b border-[#E5E7EB]">Could Have</h3>
                <ul className="space-y-2 text-sm text-[#111827]">
                  {mvpPrioritization.couldHave.map((item, i) => <li key={`ch-${i}`} className="flex gap-2"><span className="text-yellow-500 font-bold">•</span>{item}</li>)}
                </ul>
              </div>
              <div className="bg-[#FDFCF8] border border-[#E5E7EB] rounded-xl p-5">
                <h3 className="text-red-700 font-bold text-xs uppercase tracking-wider mb-3 pb-2 border-b border-[#E5E7EB]">Won&apos;t Have (For Now)</h3>
                <ul className="space-y-2 text-sm text-[#111827]">
                  {mvpPrioritization.wontHave.map((item, i) => <li key={`wh-${i}`} className="flex gap-2"><span className="text-red-500 font-bold">•</span>{item}</li>)}
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Compliance Check */}
        <section id="compliance-check" className="glass-card p-6 sm:p-8 animate-fade-in-scale delay-[1050ms] group hover:border-[#111827]/20 transition-all duration-500">
          <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB]/60 pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
              <ShieldCheck className="w-5 h-5 text-[#630102]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Regulatory & Compliance Check</h2>
          </div>
          {complianceCheck.length === 0 || report.isLite ? (
            <PremiumLock 
              isLocked={true} 
              title="Compliance Intel Locked" 
              description="Upgrade to Premium to get an analysis of legal and regulatory requirements for your idea." 
            />
          ) : (
            <div className="space-y-4">
              {complianceCheck.map((item, i) => (
                <div key={`comp-${i}`} className="bg-white border border-[#E5E7EB] p-5 rounded-xl flex flex-col sm:flex-row gap-4 sm:items-start hover:shadow-sm transition-shadow">
                  <div className="flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap
                      ${item.riskLevel === 'CRITICAL' || item.riskLevel === 'HIGH' ? 'bg-red-50 text-red-700 border border-red-200' :
                        item.riskLevel === 'MEDIUM' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                      {item.riskLevel} RISK
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111827] text-sm mb-1">{item.requirement}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 90-Day Action Plan */}
        <section id="action-plan" className="glass-card p-6 sm:p-8 animate-fade-in-scale delay-[1000ms] group hover:border-[#111827]/20 transition-all duration-500">
          <div className="flex items-center gap-3 mb-8 border-b border-[#E5E7EB]/60 pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
              <CheckCircle className="w-5 h-5 text-[#630102]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">90-Day Action Plan</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-0 border border-[#E5E7EB] rounded-lg overflow-hidden">
            {actionPlan.day30.length === 0 || report.isLite ? (
              <div className="md:col-span-3">
                <PremiumLock 
                  isLocked={true} 
                  title="90-Day Action Plan Locked" 
                  description="Upgrade to Premium to get a detailed, week-by-week execution roadmap tailored specifically to your business." 
                />
              </div>
            ) : (
              [
                { label: "First 30 Days", items: actionPlan.day30 },
                { label: "Days 31–60", items: actionPlan.day60 },
                { label: "Days 61–90", items: actionPlan.day90 },
              ].map((phase, idx) => (
                <div key={phase.label} className={`bg-[#FDFDFD] p-6 ${idx !== 2 ? 'border-b md:border-b-0 md:border-r border-[#E5E7EB]' : ''}`}>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-4 pb-2 border-b border-[#E5E7EB]">{phase.label}</p>
                  <ol className="space-y-4">
                    {phase.items.map((item, i) => (
                      <li key={`item-${i}`} className="flex items-start gap-3 text-sm text-[#111827]">
                        <span className="font-bold text-[#630102] text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                        <span className="leading-relaxed flex-1 min-w-0 break-words">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Sales Funnel */}
        {salesFunnel && (
          <section id="sales-funnel" className="glass-card p-6 sm:p-8 animate-fade-in-scale delay-[1100ms] group hover:border-[#111827]/20 transition-all duration-500">
            <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB]/60 pb-5">
              <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
                <TrendingUp className="w-5 h-5 text-[#630102]" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Sales Funnel Strategy</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-[#E5E7EB] rounded-lg overflow-hidden">
              {[
                { title: "Awareness", data: salesFunnel.awareness, keys: ["channels", "content"] },
                { title: "Consideration", data: salesFunnel.consideration, keys: ["touchpoints", "objections"] },
                { title: "Conversion", data: salesFunnel.conversion, keys: ["triggers", "incentives"] },
                { title: "Retention", data: salesFunnel.retention, keys: ["strategies", "metrics"] },
              ].map((stage, idx) => (
                <div key={stage.title} className={`p-5 bg-[#FDFDFD] border-b border-[#E5E7EB] md:border-b-0 ${idx !== 3 ? 'md:border-r' : ''}`}>
                  <p className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-4 border-l-2 border-[#630102] pl-2">{stage.title}</p>
                  <div className="space-y-5">
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-2">{stage.keys[0]}</p>
                      <ul className="space-y-1.5">
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-ignore */}
                        {stage.data[stage.keys[0]].map((c: string) => (
                          <li key={c} className="text-[#111827] text-xs flex items-start gap-1.5 leading-relaxed">
                            <span className="text-[#E5E7EB] font-bold mt-0.5 flex-shrink-0">•</span> 
                            <span className="flex-1 min-w-0 break-words">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-2 border-t border-[#E5E7EB] pt-3">{stage.keys[1]}</p>
                      <ul className="space-y-1.5">
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-ignore */}
                        {stage.data[stage.keys[1]].map((c: string) => (
                          <li key={c} className="text-[#111827] text-xs flex items-start gap-1.5 leading-relaxed">
                            <span className="text-[#E5E7EB] font-bold mt-0.5 flex-shrink-0">•</span> 
                            <span className="flex-1 min-w-0 break-words">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Community Signals to Sales Engine */}
        {actionPlan.premium_execution?.signal_to_sales_mapping && userTier !== "STARTER" && userTier !== "FREE" && (
          <section id="sales-signals" className="glass-card p-6 sm:p-8 mt-10 animate-fade-in-scale delay-[1200ms] group hover:border-[#111827]/20 transition-all duration-500">
            <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB]/60 pb-5">
              <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
                <TrendingUp className="w-5 h-5 text-[#630102]" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Community Signals to Sales Engine</h2>
            </div>
            <div className="space-y-6">
              {actionPlan.premium_execution.signal_to_sales_mapping.map((mapping, idx) => (
                <div key={`item-${idx}`} className="bg-gradient-to-r from-[#FDFCF8] to-[#FFFFFF] border border-[#E5E7EB] p-6 rounded-xl hover:shadow-md hover:border-[#630102]/30 transition-all duration-300">
                  <div className="mb-4 pb-4 border-b border-[#E5E7EB]">
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">Raw Complaint Signal</p>
                    <p className="text-sm text-[#111827] italic font-medium">&quot;{mapping.reddit_complaint}&quot;</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#630102] uppercase tracking-widest mb-1">Cold Email Hook Translation</p>
                    <p className="text-sm text-[#111827] bg-[#F9FAFB] p-3 rounded border border-[#E5E7EB] font-mono whitespace-pre-wrap">
                      {mapping.email_hook}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Code Boilerplate */}
        {codeBoilerplate && userTier !== "STARTER" && userTier !== "FREE" && (
          <section id="code-boilerplate" className="glass-card p-4 sm:p-6 overflow-hidden mt-10 animate-fade-in-scale delay-[1300ms] group hover:border-[#111827]/20 transition-all duration-500">
            <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB]/60 pb-5">
              <div className="w-10 h-10 rounded-xl bg-cherry/5 border border-cherry/10 flex items-center justify-center group-hover:bg-cherry/10 transition-colors">
                <FileText className="w-5 h-5 text-cherry" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] tracking-tight">MVP Code Boilerplate</h2>
            </div>
            <ExecutionLock isReadOnly={isReadOnly}>
              <div className="bg-[#111827] text-[#E5E7EB] p-3 sm:p-5 rounded-xl overflow-x-auto w-full text-xs sm:text-sm font-mono whitespace-pre max-h-[400px] sm:max-h-[600px] overflow-y-auto custom-scrollbar">
                {codeBoilerplate}
              </div>
            </ExecutionLock>
          </section>
        )}

        {/* Adaptive Tech Stack */}
        {actionPlan.premium_execution?.adaptive_tech_stack && userTier !== "STARTER" && userTier !== "FREE" && (
          <section id="adaptive-tech-stack" className="bg-[#111827] border border-[#111827] rounded-2xl p-6 overflow-hidden mt-10 animate-fade-in-scale delay-[1400ms] shadow-2xl hover:shadow-3xl transition-shadow duration-500">
            <div className="flex items-center justify-between mb-6 border-b border-[#374151] pb-5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <h2 className="text-sm font-mono text-[#E5E7EB] ml-4">adaptive-tech-stack.sh</h2>
              </div>
              <span className="text-xs text-green-400 font-mono tracking-widest uppercase">READY</span>
            </div>
            <div className="space-y-6 font-mono">
              <div>
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-2"># Cloud Architecture Blueprint</p>
                <div className="text-[#E5E7EB] text-sm whitespace-pre-wrap bg-[#1B1716]/50 p-4 rounded-lg">
                  {actionPlan.premium_execution.adaptive_tech_stack.cloud_blueprint}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-2"># Database Schema Topology</p>
                <div className="text-[#E5E7EB] text-sm whitespace-pre-wrap bg-[#1B1716]/50 p-4 rounded-lg">
                  {actionPlan.premium_execution.adaptive_tech_stack.database_schema}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Launch Resources */}
        {userTier !== "STARTER" && userTier !== "FREE" && (
          <section id="launch-resources" className="glass-card p-6 sm:p-8 animate-fade-in-scale delay-[1500ms] group hover:border-[#111827]/20 transition-all duration-500 mt-10">
            <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB]/60 pb-5">
              <div className="w-10 h-10 rounded-xl bg-[#630102]/5 border border-[#630102]/10 flex items-center justify-center group-hover:bg-[#630102]/10 transition-colors">
                <Rocket className="w-5 h-5 text-[#630102]" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Launch Your Idea</h2>
            </div>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-8 max-w-3xl">
              Your idea is validated. Now it&apos;s time to launch. We&apos;ve taken your validation data and pre-generated the exact copy you need to submit your startup to the top discovery platforms for free. Just copy, paste, and launch.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Hunt */}
              <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#DA552F] text-white flex items-center justify-center font-bold text-lg shrink-0">P</span>
                    <h3 className="font-bold text-[#111827] text-lg">Product Hunt</h3>
                  </div>
                  <a aria-label="Link action" href="https://www.producthunt.com/posts/new" target="_blank" rel="noopener noreferrer" className="text-xs font-bold px-3 py-1.5 bg-[#DA552F] text-white rounded-md hover:bg-[#bf4825] transition-colors text-center whitespace-nowrap">
                    Submit
                  </a>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">Tagline</p>
                    <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-3 rounded-md text-[#111827] text-sm font-medium">
                      {landingPage?.headline || `AI-powered ${report.idea?.industry} solution.`}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">Description</p>
                    <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-3 rounded-md text-[#111827] text-sm font-medium whitespace-pre-wrap">
                      {landingPage?.valueProp || market.summary || "A revolutionary approach to solving critical pain points in this space."}
                    </div>
                  </div>
                </div>
              </div>

              {/* BetaList */}
              <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#F14B5A] text-white flex items-center justify-center font-bold text-lg shrink-0">B</span>
                    <h3 className="font-bold text-[#111827] text-lg">BetaList</h3>
                  </div>
                  <a aria-label="Link action" href="https://betalist.com/submit" target="_blank" rel="noopener noreferrer" className="text-xs font-bold px-3 py-1.5 bg-[#F14B5A] text-white rounded-md hover:bg-[#d6414f] transition-colors text-center whitespace-nowrap">
                    Submit
                  </a>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">Elevator Pitch</p>
                    <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-3 rounded-md text-[#111827] text-sm font-medium">
                      {landingPage?.subheadline || `The new way to build for ${report.idea?.industry}`}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">Target Audience</p>
                    <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-3 rounded-md text-[#111827] text-sm font-medium">
                      {personas[0]?.title || "Professionals"} & {personas[1]?.title || "Businesses"}
                    </div>
                  </div>
                </div>
              </div>

              {/* SaaSHub */}
              <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#515969] text-white flex items-center justify-center font-bold text-lg shrink-0">S</span>
                    <h3 className="font-bold text-[#111827] text-lg">SaaSHub</h3>
                  </div>
                  <a aria-label="Link action" href="https://www.saashub.com/submit" target="_blank" rel="noopener noreferrer" className="text-xs font-bold px-3 py-1.5 bg-[#515969] text-white rounded-md hover:bg-[#3d434f] transition-colors text-center whitespace-nowrap">
                    Submit
                  </a>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">Alternatives to</p>
                    <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-3 rounded-md text-[#111827] text-sm font-medium flex flex-wrap gap-2">
                      {competitors.slice(0, 3).map(c => c.name).join(", ") || "Industry leaders"}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">Pricing Model</p>
                    <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-3 rounded-md text-[#111827] text-sm font-medium">
                      {pricing.strategy || "Subscription Based"}
                    </div>
                  </div>
                </div>
              </div>

              {/* dang.ai */}
              <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#000000] text-white flex items-center justify-center font-bold text-lg shrink-0">d</span>
                    <h3 className="font-bold text-[#111827] text-lg">dang.ai</h3>
                  </div>
                  <a aria-label="Link action" href="https://dang.ai/submit" target="_blank" rel="noopener noreferrer" className="text-xs font-bold px-3 py-1.5 bg-[#000000] text-white rounded-md hover:bg-[#333333] transition-colors text-center whitespace-nowrap">
                    Submit
                  </a>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">AI Category</p>
                    <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-3 rounded-md text-[#111827] text-sm font-medium">
                      {report.idea?.industry || "Generative AI Solutions"}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">Core AI Feature</p>
                    <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-3 rounded-md text-[#111827] text-sm font-medium line-clamp-3">
                      {landingPage?.features?.[0]?.description || market.summary || "AI powered automation and analysis"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
