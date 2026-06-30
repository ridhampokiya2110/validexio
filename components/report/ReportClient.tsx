"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PaywallGate from "./PaywallGate";
import { generateReportPdf } from "@/lib/pdf/generatePdf";
import { Download, Code, Briefcase, Database, Cloud } from "lucide-react";

interface ReportClientProps {
  session: any; // Prisma ValidationSession
}

export default function ReportClient({ session }: ReportClientProps) {
  const [activeTab, setActiveTab] = useState<"founder" | "builder">("founder");
  const [isGenerating, setIsGenerating] = useState(!session.businessSections);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!session.businessSections) {
      const generateData = async () => {
        try {
          const res = await fetch("/api/v1/generate-premium-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: session.id,
              businessIdea: session.businessIdea,
              targetAudience: "Tech Startups",
              scale: "Enterprise"
            }),
          });
          
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Generation failed");
          }
          
          // Refresh the page to load the new server data
          router.refresh();
          setIsGenerating(false);
        } catch (err: any) {
          setError(err.message);
          setIsGenerating(false);
        }
      };
      generateData();
    }
  }, [session, router]);
  
  // Use DB data if exists, otherwise mock template data for the UI
  const isUnlocked = session.isUnlocked || false;
  const score = session.viabilityScore || 85;
  const pivotTeaser = session.antiRoadmap ? JSON.parse(session.antiRoadmap as string)?.pivot || "We pivot this into a highly technical execution play." : "We pivot this into a highly technical execution play. By embedding directly into their existing infrastructure rather than offering a standalone dashboard, stickiness increases by 300%.";

  const businessSections = session.businessSections ? session.businessSections as any[] : [
    { title: "Executive Summary", content: "This SaaS targets a deeply underserved niche with an initial market size exceeding $4.5B." },
    { title: "Market Sizing Validation", content: "TAM: INR 18,000Cr. The core entry wedge is currently held by legacy providers operating on 15-year-old on-premise architectures." },
    { title: "Competitor Benchmarking", content: "Incumbents suffer from poor API connectivity. Our wedge relies on immediate webhook integrations." },
    { title: "Financial Forecasting", content: "Target pricing is INR 14,999/mo. Breaking even requires exactly 14 B2B accounts." },
    { title: "Strategic Pivot Vectors", content: "Do not sell a dashboard. Sell a silent integration that pipes data into their existing ERP." },
  ];

  const localMarketOverview = session.localMarketOverview || {
    demandScore: "85/100",
    competitionScore: "Low",
    marketSize: "INR 18,000Cr",
    averageOrderValue: "INR 14,999",
    cac: "INR 2,500",
    profitMargin: "65%",
    growthTrend: "+15% YoY"
  };

  const opportunityComparison = session.opportunityComparison || null;

  const executionAssets = session.executionAssets ? session.executionAssets as any : {
    nextjs_waitlist_component: "export default function Waitlist() { return <div>Waitlist Code</div> }",
    postgresql_ddl: "CREATE TABLE users (id UUID PRIMARY KEY);",
    aws_architecture_json: '{"loadBalancer": "ALB", "autoScaling": "Min 2, Max 10"}'
  };

  const handleDownload = () => {
    generateReportPdf("pdf-report-container", `Validexio-Report-${session.id.substring(0,6)}`);
  };

  if (isGenerating) {
    return (
      <main className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-[#75070C] border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-black text-[#1B1716] mb-2 uppercase tracking-tight">Compiling Execution Blueprint</h2>
        <p className="text-[#1B1716]/60 font-medium max-w-md">
          Performing a single-pass deep extraction. We are generating your 15-section narrative, Next.js code boilerplate, and AWS Cloud architecture. This usually takes 15-20 seconds.
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center p-6 text-center">
        <div className="text-[#75070C] mb-4">
          <Database className="w-12 h-12 mx-auto" />
        </div>
        <h2 className="text-2xl font-black text-[#1B1716] mb-2">Generation Failed</h2>
        <p className="text-[#1B1716]/60 font-medium max-w-md mb-6">{error}</p>
        <button aria-label="Button action" type="button" onClick={() => window.location.reload()} className="bg-[#1B1716] text-[#FFEDAB] px-6 py-2 rounded font-bold">Try Again</button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#1B1716] font-sans selection:bg-[#75070C]/20 selection:text-[#75070C]">
      {/* Header */}
      <header className="bg-white border-b border-[#1B1716]/10 pt-24 pb-6 px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1B1716] uppercase tracking-tight">Validation Dashboard</h1>
            <p className="text-[#1B1716]/60 font-medium">Idea: {session.businessIdea || "Premium Idea Analysis"}</p>
          </div>
          
          <div className="flex bg-[#FDFCF8] border border-[#75070C]/30 rounded-lg p-1">
            <button aria-label="Button action" type="button"
              onClick={() => setActiveTab("founder")}
              className={`px-6 py-2 rounded-md font-bold text-sm flex items-center gap-2 transition-all ${
                activeTab === "founder" ? "bg-[#630102] text-[#EDEBDE] shadow-md" : "text-[#1B1716]/60 hover:text-[#1B1716]"
              }`}
            >
              <Briefcase className="w-4 h-4" /> Business Founder
            </button>
            <button aria-label="Button action" type="button"
              onClick={() => setActiveTab("builder")}
              className={`px-6 py-2 rounded-md font-bold text-sm flex items-center gap-2 transition-all ${
                activeTab === "builder" ? "bg-[#630102] text-[#EDEBDE] shadow-md" : "text-[#1B1716]/60 hover:text-[#1B1716]"
              }`}
            >
              <Code className="w-4 h-4" /> Builder & Tech
            </button>
          </div>
        </div>
      </header>

      <div className="relative max-w-6xl mx-auto p-6 min-h-[800px] mt-8">
        
        {/* The Paywall Gate (will blur content below if locked) */}
        <PaywallGate isUnlocked={isUnlocked} score={score} pivotTeaser={pivotTeaser} />

        {/* Content Container (Blurred if locked) */}
        <div className={`${!isUnlocked ? "filter blur-md select-none pointer-events-none opacity-40" : ""} transition-all duration-500`} id="pdf-report-container">
          
          <AnimatePresence mode="wait">
            {activeTab === "founder" ? (
              <motion.div
                key="founder"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center no-print">
                  <h2 className="text-2xl font-black text-[#75070C]">15-Section Analytical Evaluation</h2>
                  <button aria-label="Button action" type="button" 
                    onClick={handleDownload}
                    className="bg-[#FFEDAB] text-[#1B1716] font-bold px-6 py-3 rounded shadow hover:bg-[#ffe175] transition-colors flex items-center gap-2 border border-[#1B1716]/20"
                  >
                    <Download className="w-4 h-4" /> Download 15-Page Analytical Report (PDF)
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* LOCAL MARKET OVERVIEW DASHBOARD */}
                  <div className="bg-white/80 backdrop-blur-xl border border-[#75070C]/20 p-8 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-black text-[#1B1716] mb-6 uppercase tracking-tight flex items-center gap-2">
                      <span className="w-2 h-6 bg-[#75070C] rounded-sm"></span> 
                      Local Market Intelligence
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {[
                        { label: "Demand Score", value: localMarketOverview.demandScore },
                        { label: "Competition", value: localMarketOverview.competitionScore },
                        { label: "Market Size", value: localMarketOverview.marketSize },
                        { label: "Avg. Order Value", value: localMarketOverview.averageOrderValue },
                        { label: "CAC", value: localMarketOverview.cac },
                        { label: "Profit Margin", value: localMarketOverview.profitMargin },
                        { label: "Growth Trend", value: localMarketOverview.growthTrend },
                      ].map((stat, i) => (
                        <div key={`item-${i}`} className="bg-[#1B1716]/5 p-4 rounded-xl border border-[#1B1716]/10">
                          <p className="text-xs font-bold text-[#1B1716]/60 uppercase tracking-wider mb-1">{stat.label}</p>
                          <p className="text-lg font-black text-[#75070C]">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* OPPORTUNITY COMPARISON ENGINE */}
                    {opportunityComparison && (
                      <div className="mt-8 pt-8 border-t border-[#1B1716]/10">
                        <h4 className="text-sm font-black text-[#1B1716] uppercase tracking-widest mb-4">Market Arbitrage: {opportunityComparison.currentRegion} vs {opportunityComparison.betterRegion}</h4>
                        <div className="bg-gradient-to-br from-[#1B1716] to-[#2a2422] rounded-xl p-6 shadow-lg text-[#EDEBDE]">
                          <p className="text-sm font-medium mb-6 leading-relaxed opacity-90">{opportunityComparison.reasoning}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {opportunityComparison.metrics?.map((m: any, i: number) => (
                              <div key={`item-${i}`} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                                <span className="text-xs font-bold uppercase tracking-wider opacity-70">{m.metricName}</span>
                                <div className="flex flex-col items-end">
                                  <span className="text-xs line-through opacity-50">{m.currentValue} ({opportunityComparison.currentRegion})</span>
                                  <span className="text-sm font-black text-[#FFEDAB]">{m.betterValue} ({opportunityComparison.betterRegion})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {businessSections.map((section, idx) => (
                    <div key={`item-${idx}`} className="bg-white border border-[#1B1716]/10 p-8 rounded-xl shadow-sm">
                      <h3 className="text-xl font-bold text-[#1B1716] mb-4 border-b border-[#75070C]/20 pb-2">
                        {idx + 1}. {section.title}
                      </h3>
                      <div className="text-[#1B1716]/80 leading-relaxed font-medium whitespace-pre-wrap">
                        {section.content}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="builder"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {/* Waitlist Component */}
                <div className="col-span-1 md:col-span-2 bg-[#1B1716] rounded-2xl overflow-hidden border border-[#75070C] shadow-lg">
                  <div className="bg-[#2a2422] px-6 py-3 border-b border-[#75070C]/30 flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#FFEDAB]" />
                    <span className="text-xs font-bold text-[#EDEBDE] uppercase tracking-widest">Waitlist Component (Next.js)</span>
                  </div>
                  <pre className="p-6 text-sm font-mono text-[#EDEBDE] overflow-x-auto">
                    {executionAssets.nextjs_waitlist_component}
                  </pre>
                </div>

                {/* SQL Schema */}
                <div className="bg-[#1B1716] rounded-2xl overflow-hidden border border-[#75070C] shadow-lg">
                  <div className="bg-[#2a2422] px-6 py-3 border-b border-[#75070C]/30 flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#FFEDAB]" />
                    <span className="text-xs font-bold text-[#EDEBDE] uppercase tracking-widest">PostgreSQL DDL</span>
                  </div>
                  <pre className="p-6 text-sm font-mono text-[#EDEBDE] overflow-x-auto h-64">
                    {executionAssets.postgresql_ddl}
                  </pre>
                </div>

                {/* Cloud Blueprint */}
                <div className="bg-[#1B1716] rounded-2xl overflow-hidden border border-[#75070C] shadow-lg">
                  <div className="bg-[#2a2422] px-6 py-3 border-b border-[#75070C]/30 flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-[#FFEDAB]" />
                    <span className="text-xs font-bold text-[#EDEBDE] uppercase tracking-widest">AWS Architecture Blueprint</span>
                  </div>
                  <pre className="p-6 text-sm font-mono text-[#EDEBDE] overflow-x-auto h-64">
                    {executionAssets.aws_architecture_json}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
