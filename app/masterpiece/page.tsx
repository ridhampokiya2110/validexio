"use client";

import { Metadata } from "next";
import Link from "next/link";
import { Zap, Download, LayoutDashboard, LineChart, Copy, FileCode2, Target, BarChart3, ChevronRight } from "lucide-react";

export default function MasterpieceDashboard() {
  return (
    <div className="flex h-screen bg-[#FDFCF8] overflow-hidden text-noir font-sans">
      {/* SIDEBAR - Keep it slightly dark for contrast, but sleek */}
      <aside className="w-64 flex-shrink-0 bg-[#F5F3EB] border-r border-noir/10 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-noir/5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-cherry flex items-center justify-center shadow-lg group-hover:shadow-[0_0_15px_rgba(117,7,12,0.4)] transition-all">
              <Zap className="w-4 h-4 text-cherry" />
            </div>
            <span className="font-bold text-lg text-noir">Validexio</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <div className="text-xs font-bold text-noir/40 uppercase tracking-widest mb-2 px-2">Navigation</div>
          {[
            { label: "Executive Summary", icon: LayoutDashboard, active: true },
            { label: "Financial Model", icon: LineChart },
            { label: "Mockups", icon: Target },
            { label: "B2B Leads", icon: BarChart3 },
            { label: "Code Assets", icon: FileCode2 },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                item.active 
                  ? "bg-white text-cherry border border-cherry/20 shadow-sm" 
                  : "text-noir/70 hover:bg-white/60 hover:text-noir"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${item.active ? "text-cherry" : "text-noir/50"}`} />
                {item.label}
              </div>
              {item.active && <ChevronRight className="w-4 h-4 text-cherry/50" />}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle Light Mesh Background */}
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cherry rounded-full opacity-[0.03] blur-[100px] pointer-events-none" />

        {/* HEADER */}
        <header className="h-20 flex items-center justify-between px-8 bg-white/70 backdrop-blur-md border-b border-noir/5 sticky top-0 z-10">
          <h1 className="text-lg font-bold text-noir/50">Project: <span className="text-noir">Validexio Alpha</span></h1>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-cherry hover:bg-[#910505] text-white text-sm font-bold rounded-lg transition-all shadow-[0_4px_12px_rgba(117,7,12,0.2)]">
            <Download className="w-4 h-4" />
            Export PDF Report
          </button>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative z-0">
          <div className="max-w-6xl mx-auto space-y-16">
            
            {/* SECTION 1: Reality Check & Financials */}
            <section>
              <h2 className="text-3xl font-black mb-8 text-noir tracking-tight">
                Validation & <span className="text-cherry">Unit Economics</span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Card A: Anti-Roadmap */}
                <div className="bg-white border border-noir/5 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xs font-bold text-cherry mb-2 uppercase tracking-widest">The Anti-Roadmap</h3>
                  <p className="text-sm text-noir/60 mb-5 font-medium">Do NOT build these features. They destroy margins.</p>
                  <ul className="space-y-3">
                    {["Custom CRM integrations", "Native iOS/Android Apps (Wait for MRR)", "White-labeling engine", "Complex permission tiers"].map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm font-medium text-noir/80">
                        <div className="w-5 h-5 rounded-full bg-cherry/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-cherry text-[10px]">✕</span>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card B: WTP Score */}
                <div className="bg-white border border-noir/5 shadow-sm rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cherry/20 rounded-full blur-3xl -mr-10 -mt-10" />
                  <h3 className="text-xs font-bold text-noir/40 mb-6 uppercase tracking-widest w-full text-left relative z-10">Willingness-to-Pay</h3>
                  <div className="relative flex items-center justify-center w-40 h-40 rounded-full bg-[#FDFCF8] shadow-[inset_0_4px_12px_rgba(0,0,0,0.02)] border border-noir/5 z-10">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(27, 23, 22, 0.05)" strokeWidth="12" />
                      <circle 
                        cx="100" cy="100" r="90" fill="none" stroke="#75070C" strokeWidth="12" 
                        strokeDasharray="565.48" strokeDashoffset="73.5" /* 87% */
                        strokeLinecap="round" 
                      />
                    </svg>
                    <div className="flex flex-col items-center z-10">
                      <span className="text-5xl font-black text-noir tracking-tighter">87</span>
                      <span className="text-[10px] text-cherry font-bold tracking-widest mt-1">PERCENTILE</span>
                    </div>
                  </div>
                </div>

                {/* Card C: Unit Economics */}
                <div className="bg-white border border-noir/5 shadow-sm rounded-2xl p-6">
                  <h3 className="text-xs font-bold text-noir/40 mb-4 uppercase tracking-widest">Unit Economics</h3>
                  <div className="space-y-0 divide-y divide-noir/5 border border-noir/5 rounded-xl overflow-hidden bg-[#FDFCF8]">
                    {[
                      { label: "Target CAC", value: "$42.50" },
                      { label: "Projected LTV", value: "$1,240.00" },
                      { label: "LTV:CAC Ratio", value: "29.1x", highlight: true },
                      { label: "Gross Margin", value: "88%" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between p-4 text-sm">
                        <span className="text-noir/60 font-medium">{row.label}</span>
                        <span className={`font-bold ${row.highlight ? "text-cherry bg-cherry/10 px-2 py-0.5 rounded" : "text-noir"}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: MVP Mockup Studio */}
            <section>
              <h2 className="text-2xl font-bold text-noir mb-6 tracking-tight">Generated UI/UX Assets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                  <div key={i} className="group relative rounded-2xl overflow-hidden border border-noir/10 shadow-sm aspect-video bg-[#F5F3EB] cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FDFCF8] to-[#F5F3EB] transition-transform duration-500 group-hover:scale-[1.02] flex flex-col">
                      <div className="h-10 border-b border-noir/5 flex items-center px-4 gap-1.5 bg-white/50 backdrop-blur-sm">
                        <div className="w-3 h-3 rounded-full bg-[#FDFCF8]/10" />
                        <div className="w-3 h-3 rounded-full bg-[#FDFCF8]/10" />
                        <div className="w-3 h-3 rounded-full bg-[#FDFCF8]/10" />
                      </div>
                      <div className="flex-1 p-8 flex flex-col gap-4">
                        <div className="w-1/3 h-8 bg-[#FDFCF8]/5 rounded-md" />
                        <div className="w-full flex-1 bg-white rounded-lg border border-noir/5 shadow-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 3: Day-1 Leads Matrix */}
            <section>
              <h2 className="text-2xl font-bold text-noir mb-6 tracking-tight">Target Acquisition List</h2>
              <div className="border border-noir/10 rounded-2xl overflow-x-auto overflow-y-hidden shadow-sm bg-white">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#FDFCF8] border-b border-noir/10 text-noir/50 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-bold">Company Name</th>
                      <th className="px-6 py-4 font-bold">Decision Maker</th>
                      <th className="px-6 py-4 font-bold">Contact</th>
                      <th className="px-6 py-4 font-bold">Pain Point</th>
                      <th className="px-6 py-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-noir/5">
                    {[
                      { company: "Acme Corp", dm: "Sarah Jenkins, VP Product", email: "sarah@acmecorp.com", pain: "High churn on onboarding" },
                      { company: "Nexus Dynamics", dm: "David Chen, CTO", email: "d.chen@nexus.io", pain: "Slow engineering cycles" },
                      { company: "Stellar Logistics", dm: "Marcus Wright, CEO", email: "marcus@stellar.com", pain: "Opaque unit economics" },
                      { company: "Vanguard Tech", dm: "Elena Rostova, Lead Dev", email: "elena.r@vanguard.dev", pain: "Frontend state bloat" },
                    ].map((row, idx) => (
                      <tr key={row.company} className={`hover:bg-[#F5F3EB]/50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[#FDFCF8]"}`}>
                        <td className="px-6 py-4 font-bold text-noir">{row.company}</td>
                        <td className="px-6 py-4 text-noir/70 font-medium">{row.dm}</td>
                        <td className="px-6 py-4 text-noir/50 font-mono text-xs">{row.email}</td>
                        <td className="px-6 py-4 text-cherry font-medium">{row.pain}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-noir/10 text-noir/70 hover:bg-cherry hover:text-white hover:border-cherry transition-colors text-xs font-bold shadow-sm">
                            <Copy className="w-3 h-3" />
                            Copy Pitch
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION 4: Execution Assets */}
            <section className="pb-16">
              <div className="bg-gradient-to-r from-cherry/5 to-maroon/5 border border-cherry/20 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-white relative overflow-hidden shadow-[0_8px_30px_rgba(117,7,12,0.04)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cherry/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-noir mb-2 tracking-tight">Ready to Execute?</h2>
                  <p className="text-noir/60 text-sm max-w-md font-medium leading-relaxed">
                    Your architecture is compiled. Download the complete Node.js boilerplate code and No-Code workflow blueprints to launch today.
                  </p>
                </div>
                <button className="relative z-10 flex-shrink-0 flex items-center gap-3 px-8 py-4 bg-cherry hover:bg-[#910505] text-white font-bold rounded-xl transition-all shadow-[0_8px_20px_rgba(117,7,12,0.2)] hover:shadow-[0_12px_25px_rgba(117,7,12,0.3)] hover:-translate-y-1">
                  <Download className="w-5 h-5" />
                  Download .ZIP Architecture
                </button>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
