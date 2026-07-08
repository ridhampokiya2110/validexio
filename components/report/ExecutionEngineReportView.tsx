"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Database, Cloud, Users, Mail, Webhook, Zap, CheckCircle2, Shield, Target, BarChart3, AlertTriangle, Lightbulb, Rocket, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";
import { ExecutionLock } from "@/components/report/ExecutionLock";

export function ExecutionEngineReportView({ report, isReadOnly = false }: { report: any, isReadOnly?: boolean }) {
  const [activeTab, setActiveTab] = useState<"code" | "plan" | "ui">("code");
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  if (!report) return null;

  // Extract necessary fields with fallbacks
  const idea = report.idea || {};
  const market = report.marketAnalysis || {};
  const acquisition = report.acquisitionStrategy || {};
  const pricing = report.pricingRecommendation || {};
  const codeBoilerplate = typeof report.codeBoilerplate === 'string' ? report.codeBoilerplate : null;
  const swot = report.swotAnalysis || {};
  const actionPlan = report.actionPlan || {};

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#1B1716] font-sans pt-12 pb-12 px-4 selection:bg-[#75070C]/20 selection:text-[#75070C]">
      
      {!isReadOnly && (
        <div className="max-w-[1600px] mx-auto mb-6">
          <Link aria-label="Navigation link"
            href="/dashboard/reports"
            className="inline-flex items-center gap-1.5 text-[#1B1716]/50 hover:text-[#1B1716] text-sm font-semibold transition-colors uppercase tracking-widest"
          >
            ← Back to Dashboard
          </Link>
        </div>
      )}

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isReadOnly && (
          <button aria-label="Button action" type="button"
            onClick={() => {
              window.open(`/api/v1/projects/${report.id}/export/pdf`, '_blank');
            }}
            className="bg-[#FFEDAB] text-[#1B1716] font-black px-6 py-3 rounded-lg shadow-2xl border border-[#1B1716] hover:bg-[#ffe175] transition-all flex items-center gap-2 uppercase tracking-tight text-sm"
          >
            Export Full PDF <FileText className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="max-w-[1600px] mx-auto h-auto min-h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-end justify-between border-b-2 border-[#1B1716]/10 pb-4 gap-4">
          <div>
            <span className="bg-cherry/10 text-cherry border border-cherry/20 text-xs font-black px-2 py-1 uppercase tracking-widest mb-2 inline-block rounded">
              Validexio Rigor: {report.validationScore ?? 0}/100
            </span>
            <h1 className="text-3xl font-black text-[#1B1716] uppercase tracking-tight">{idea.title || "Untitled Project"}</h1>
            <p className="text-[#1B1716]/60 font-medium max-w-xl">{idea.description || "No description provided."}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm font-bold text-[#1B1716]/40 uppercase tracking-widest">Primary Strategy</p>
            <p className="text-xl font-black text-[#75070C] uppercase">{pricing.strategy || "Pending"}</p>
          </div>
        </div>

        {/* 3-Pane Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* LEFT PANE: Market Verdict */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-6 lg:overflow-y-auto lg:pr-2 custom-scrollbar lg:max-h-[calc(100vh-12rem)]">
            <div className="bg-white p-6 border border-[#1B1716]/10 rounded-xl shadow-sm">
              <h3 className="font-bold uppercase tracking-widest text-sm text-[#1B1716]/50 mb-4">Financial Scale</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-[#1B1716]/40 uppercase">Total Addressable (TAM)</p>
                  <p className="text-xl font-black text-[#1B1716]">{market.tam || "N/A"}</p>
                </div>
                <div className="h-px bg-[#1B1716]/10" />
                <div>
                  <p className="text-xs font-bold text-[#1B1716]/40 uppercase">Serviceable Obtainable (SOM)</p>
                  <p className="text-xl font-black text-[#1B1716]">{market.som || "N/A"}</p>
                </div>
                <div className="h-px bg-[#1B1716]/10" />
                <div>
                  <p className="text-xs font-bold text-[#1B1716]/40 uppercase">Market Growth (CAGR)</p>
                  <p className="text-[#75070C] font-bold uppercase">{market.growth || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#630102] text-[#EDEBDE] p-6 border border-[#75070C] rounded-xl shadow-md">
              <h3 className="font-bold uppercase tracking-widest text-sm text-[#FFEDAB] mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" /> Market Verdict
              </h3>
              <p className="text-sm leading-relaxed text-[#EDEBDE]/90 mb-4">
                {market.summary || "Pending analysis."}
              </p>
            </div>

            {swot && swot.strengths && (
              <div className="bg-white p-6 border border-[#1B1716]/10 rounded-xl shadow-sm">
                <h3 className="font-bold uppercase tracking-widest text-sm text-[#1B1716]/50 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Tactical Advantages
                </h3>
                <ul className="space-y-2">
                  {swot.strengths.slice(0, 3).map((s: string, i: number) => (
                    <li key={`item-${i}`} className="text-sm text-[#1B1716]/80 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* CENTER PANE: Code & Execution */}
          <div className="col-span-1 lg:col-span-5 flex flex-col bg-[#1B1716] rounded-xl shadow-xl overflow-hidden border border-[#75070C]/30 lg:max-h-[calc(100vh-12rem)]">
            <div className="flex bg-[#2a2422] border-b border-[#75070C]/30 text-xs font-bold uppercase tracking-widest">
              <button aria-label="Button action" type="button" 
                onClick={() => setActiveTab("code")}
                className={`flex-1 py-4 flex items-center justify-center gap-2 transition-colors ${activeTab === "code" ? "bg-[#1B1716] text-[#FFEDAB] border-t-2 border-[#FFEDAB]" : "text-[#EDEBDE]/50 hover:bg-[#1B1716]/50 hover:text-[#EDEBDE]"}`}
              >
                <Terminal className="w-4 h-4" /> MVP Code
              </button>
              <button aria-label="Button action" type="button" 
                onClick={() => setActiveTab("plan")}
                className={`flex-1 py-4 flex items-center justify-center gap-2 transition-colors ${activeTab === "plan" ? "bg-[#1B1716] text-[#FFEDAB] border-t-2 border-[#FFEDAB]" : "text-[#EDEBDE]/50 hover:bg-[#1B1716]/50 hover:text-[#EDEBDE]"}`}
              >
                <Zap className="w-4 h-4" /> Action Plan
              </button>
              <button aria-label="Button action" type="button" 
                onClick={() => setActiveTab("ui")}
                className={`flex-1 py-4 flex items-center justify-center gap-2 transition-colors ${activeTab === "ui" ? "bg-[#1B1716] text-[#FFEDAB] border-t-2 border-[#FFEDAB]" : "text-[#EDEBDE]/50 hover:bg-[#1B1716]/50 hover:text-[#EDEBDE]"}`}
              >
                <Cloud className="w-4 h-4" /> UI Spec
              </button>
            </div>
            
            <div className="flex-grow p-0 overflow-y-auto custom-scrollbar bg-[#1B1716] relative">
              <AnimatePresence mode="wait">
                {activeTab === "code" && (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 h-full"
                  >
                    <ExecutionLock isReadOnly={isReadOnly}>
                      <pre className="font-mono text-sm text-[#EDEBDE] whitespace-pre-wrap">
                        {codeBoilerplate || "// Generating code boilerplate..."}
                      </pre>
                    </ExecutionLock>
                  </motion.div>
                )}
                {activeTab === "plan" && (
                  <motion.div
                    key="plan"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 font-mono text-sm text-[#EDEBDE]"
                  >
                    <div className="space-y-6">
                      {actionPlan && actionPlan.day30 && (
                        <div>
                          <h4 className="text-[#FFEDAB] font-bold uppercase tracking-widest mb-3 border-b border-[#75070C]/30 pb-2">Phase 1: Zero to One (Days 0-30)</h4>
                          <ul className="space-y-2 text-[#EDEBDE]/80">
                            {actionPlan.day30.map((item: string, i: number) => <li key={`item-${i}`}>[{i+1}] {item}</li>)}
                          </ul>
                        </div>
                      )}
                      {actionPlan && actionPlan.day60 && (
                        <div>
                          <h4 className="text-[#FFEDAB] font-bold uppercase tracking-widest mb-3 border-b border-[#75070C]/30 pb-2">Phase 2: Growth Engine (Days 31-60)</h4>
                          <ul className="space-y-2 text-[#EDEBDE]/80">
                            {actionPlan.day60.map((item: string, i: number) => <li key={`item-${i}`}>[{i+1}] {item}</li>)}
                          </ul>
                        </div>
                      )}
                      {actionPlan && actionPlan.day90 && (
                        <div>
                          <h4 className="text-[#FFEDAB] font-bold uppercase tracking-widest mb-3 border-b border-[#75070C]/30 pb-2">Phase 3: Scale (Days 61-90)</h4>
                          <ul className="space-y-2 text-[#EDEBDE]/80">
                            {actionPlan.day90.map((item: string, i: number) => <li key={`item-${i}`}>[{i+1}] {item}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
                {activeTab === "ui" && (
                  <motion.div
                    key="ui"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 h-full overflow-y-auto custom-scrollbar"
                  >
                    {!report.uiMockupDescriptions ? (
                      <div className="text-center py-12 text-[#EDEBDE]/50 font-mono text-sm">
                        {"// Awaiting UX Generation..."}
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {(report.uiMockupDescriptions as Array<{ screen: string; description: string; keyElements: string[]; userFlow: string }>).map((mockup, idx) => (
                          <div key={`item-${idx}`} className="bg-[#2a2422] rounded-xl p-6 border border-[#75070C]/20 shadow-md relative overflow-hidden group">
                            {/* Abstract Dark Wireframe graphic */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1B1716] to-transparent opacity-50" />
                            
                            <div className="relative z-10">
                              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#75070C]/30">
                                <h3 className="text-[#FFEDAB] font-bold text-lg uppercase tracking-tight">{mockup.screen}</h3>
                                <div className="flex gap-1.5 opacity-40">
                                  <div className="w-2 h-2 rounded-full bg-[#EDEBDE]" />
                                  <div className="w-2 h-2 rounded-full bg-[#EDEBDE]" />
                                  <div className="w-2 h-2 rounded-full bg-[#EDEBDE]" />
                                </div>
                              </div>
                              
                              <p className="text-[#EDEBDE]/80 text-sm leading-relaxed mb-6 font-sans">
                                {mockup.description}
                              </p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="text-[10px] font-black text-[#EDEBDE]/40 uppercase tracking-[0.2em] mb-3">Architecture & Elements</h4>
                                  <ul className="space-y-2">
                                    {mockup.keyElements.map((el, i) => (
                                      <li key={`item-${i}`} className="flex items-start gap-2 text-sm font-mono text-[#EDEBDE]/70">
                                        <span className="text-[#75070C] mt-0.5">↳</span> {el}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-[#1B1716] p-4 rounded-lg border border-[#75070C]/20">
                                  <h4 className="text-[10px] font-black text-[#EDEBDE]/40 uppercase tracking-[0.2em] mb-2">Primary User Flow</h4>
                                  <p className="text-[#FFEDAB]/90 text-sm font-medium leading-relaxed">
                                    {mockup.userFlow}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT PANE: GTM Data */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6 lg:overflow-y-auto lg:pr-2 custom-scrollbar lg:max-h-[calc(100vh-12rem)]">
            
            <div className="bg-white p-6 border border-[#1B1716]/10 rounded-xl shadow-sm">
              <h3 className="font-bold uppercase tracking-widest text-sm text-[#1B1716]/50 mb-4 flex items-center gap-2">
                <Rocket className="w-4 h-4" /> Acquisition Tactics
              </h3>
              <div className="bg-[#1B1716]/5 p-3 rounded font-mono text-xs text-[#75070C] mb-4">
                {acquisition.contentStrategy || "Direct Outbound & Inbound Content"}
              </div>
              <div className="border border-[#1B1716]/10 rounded overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#1B1716]/5 border-b border-[#1B1716]/10 text-xs uppercase text-[#1B1716]/50">
                    <tr>
                      <th className="p-2">Primary Channels</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(acquisition.primaryChannels || []).map((channel: string, i: number) => (
                      <tr key={`item-${i}`} className="border-b border-[#1B1716]/5 last:border-0">
                        <td className="p-2 font-medium text-[#1B1716] flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-cherry/50 flex-shrink-0" />
                           {channel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 border border-[#1B1716]/10 rounded-xl shadow-sm">
              <h3 className="font-bold uppercase tracking-widest text-sm text-[#1B1716]/50 mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Landing Page Hook
              </h3>
              <div className="font-sans text-sm text-[#1B1716]/80 bg-[#FDFCF8] p-4 rounded border border-[#1B1716]/5 leading-relaxed">
                <p className="font-black text-lg mb-2 text-[#1B1716] leading-tight">
                  {report.landingPageCopy?.headline || "Headline Not Generated"}
                </p>
                <p className="mb-4 text-[#1B1716]/60">
                  {report.landingPageCopy?.subheadline || "Subheadline"}
                </p>
                <div className="bg-cherry/10 text-cherry border border-cherry/20 text-xs font-bold uppercase tracking-widest px-3 py-2 rounded text-center">
                  {report.landingPageCopy?.cta || "Sign Up"}
                </div>
              </div>
            </div>

            <div className="bg-[#1B1716] p-6 border border-[#75070C]/30 rounded-xl shadow-sm text-[#EDEBDE]">
              <h3 className="font-bold uppercase tracking-widest text-sm text-[#FFEDAB] mb-4 flex items-center gap-2">
                <Webhook className="w-4 h-4" /> Extracted Personas
              </h3>
              <div className="space-y-4">
                {(report.customerPersonas || []).slice(0, 2).map((persona: any, i: number) => (
                   <div key={`item-${i}`} className="border border-[#75070C]/30 p-3 rounded">
                      <p className="text-[#FFEDAB] font-bold text-xs uppercase tracking-widest mb-1">{persona.name}</p>
                      <p className="text-[#EDEBDE]/60 text-xs mb-2">{persona.title} ({persona.age})</p>
                      <ul className="text-xs text-[#EDEBDE]/80 space-y-1 font-mono">
                         {persona.painPoints?.slice(0,2).map((p: string, j: number) => <li key={j}>- {p}</li>)}
                      </ul>
                   </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
