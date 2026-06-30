"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Target, BarChart3, Users, DollarSign, AlertTriangle, Lightbulb, Rocket, CheckCircle, AlignLeft, Shield, FileText, TrendingUp } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ReportLayout({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState("overview");

  // A basic intersection observer to highlight the active TOC item could be added here
  // For now, we rely on click-to-scroll and manual setting if needed

  return (
    <div className="flex h-[100dvh] bg-[#FDFCF8] overflow-hidden">
      {/* Table of Contents Sidebar */}
      <aside className="w-64 bg-[#FFFFFF] border-r border-[#1B1716]/10 flex flex-col hidden md:flex">
        <div className="p-4 sm:p-6 border-b border-[#1B1716]/10">
          <Link aria-label="Navigation link"
            href="/dashboard/reports"
            className="inline-flex items-center gap-1.5 text-[#1B1716]/60 hover:text-[#1B1716] text-sm font-medium transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cherry text-white flex items-center justify-center font-bold">
              V
            </div>
            <span className="font-bold text-lg tracking-tight text-[#1B1716]">Validexio</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-bold text-[#1B1716]/40 uppercase tracking-wider mb-3 px-2">Table of Contents</div>
          
          <TOCLink href="#overview" active={activeSection === "overview"} icon={<Target className="w-4 h-4" />} label="Overview & Verdict" onClick={() => setActiveSection("overview")} />
          <TOCLink href="#market-analysis" active={activeSection === "market-analysis"} icon={<BarChart3 className="w-4 h-4" />} label="Market Analysis" onClick={() => setActiveSection("market-analysis")} />
          <TOCLink href="#swot-analysis" active={activeSection === "swot-analysis"} icon={<Shield className="w-4 h-4" />} label="SWOT Analysis" onClick={() => setActiveSection("swot-analysis")} />
          <TOCLink href="#competitors" active={activeSection === "competitors"} icon={<AlignLeft className="w-4 h-4" />} label="Competitors" onClick={() => setActiveSection("competitors")} />
          <TOCLink href="#personas" active={activeSection === "personas"} icon={<Users className="w-4 h-4" />} label="Customer Personas" onClick={() => setActiveSection("personas")} />
          <TOCLink href="#revenue" active={activeSection === "revenue"} icon={<DollarSign className="w-4 h-4" />} label="Revenue Potential" onClick={() => setActiveSection("revenue")} />
          <TOCLink href="#risks" active={activeSection === "risks"} icon={<AlertTriangle className="w-4 h-4" />} label="Risk Analysis" onClick={() => setActiveSection("risks")} />
          <TOCLink href="#growth" active={activeSection === "growth"} icon={<Lightbulb className="w-4 h-4" />} label="Growth Opportunities" onClick={() => setActiveSection("growth")} />
          <TOCLink href="#acquisition" active={activeSection === "acquisition"} icon={<Rocket className="w-4 h-4" />} label="Acquisition Tactics" onClick={() => setActiveSection("acquisition")} />
          <TOCLink href="#action-plan" active={activeSection === "action-plan"} icon={<CheckCircle className="w-4 h-4" />} label="90-Day Action Plan" onClick={() => setActiveSection("action-plan")} />
          <TOCLink href="#sales-funnel" active={activeSection === "sales-funnel"} icon={<TrendingUp className="w-4 h-4" />} label="Sales Funnel" onClick={() => setActiveSection("sales-funnel")} />
          <TOCLink href="#code-boilerplate" active={activeSection === "code-boilerplate"} icon={<FileText className="w-4 h-4" />} label="Code Boilerplate" onClick={() => setActiveSection("code-boilerplate")} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[#FDFCF8]">
        {children}
      </main>
    </div>
  );
}

function TOCLink({ href, active, icon, label, onClick }: { href: string, active: boolean, icon: ReactNode, label: string, onClick: () => void }) {
  return (
    <a aria-label="Link action"
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        active 
          ? "bg-cherry/5 text-[#1B1716] border-l-2 border-cherry rounded-l-none" 
          : "text-[#1B1716]/60 hover:text-[#1B1716] hover:bg-[#1B1716]/5"
      }`}
    >
      <span className={active ? "text-cherry" : "text-[#1B1716]/40"}>{icon}</span>
      {label}
    </a>
  );
}
