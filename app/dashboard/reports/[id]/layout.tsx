"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, Target, BarChart3, Users, DollarSign, AlertTriangle, Lightbulb, Rocket, CheckCircle, AlignLeft, Shield, FileText, TrendingUp, Send } from "lucide-react";
import { usePathname } from "next/navigation";

const TOC_ITEMS = [
  { id: "overview", icon: Target, label: "Overview & Verdict" },
  { id: "market-analysis", icon: BarChart3, label: "Market Analysis" },
  { id: "swot-analysis", icon: Shield, label: "SWOT Analysis" },
  { id: "competitors", icon: AlignLeft, label: "Competitors" },
  { id: "personas", icon: Users, label: "Customer Personas" },
  { id: "revenue", icon: DollarSign, label: "Revenue Potential" },
  { id: "risks", icon: AlertTriangle, label: "Risk Analysis" },
  { id: "growth", icon: Lightbulb, label: "Growth Opportunities" },
  { id: "acquisition", icon: Rocket, label: "Acquisition Tactics" },
  { id: "launch-platforms", icon: Rocket, label: "Launch Platforms" },
  { id: "b2b-leads", icon: Users, label: "B2B Leads" },
  { id: "action-plan", icon: CheckCircle, label: "90-Day Action Plan" },
  { id: "mvp-prioritization", icon: Target, label: "MVP Prioritization" },
  { id: "sales-funnel", icon: TrendingUp, label: "Sales Funnel" },
  { id: "compliance-check", icon: Shield, label: "Compliance Check" },
  { id: "code-boilerplate", icon: FileText, label: "Code Boilerplate" },
  { id: "launch-resources", icon: Send, label: "Launch Your Idea" },
];

export default function ReportLayout({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState("overview");
  const mobileNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Auto-scroll mobile navbar when active section changes
    if (mobileNavRef.current) {
      const activeItem = mobileNavRef.current.querySelector('.active-toc');
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeSection]);

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-[#FDFCF8] overflow-hidden">
      {/* Mobile Top Navigation */}
      <div className="flex md:hidden flex-col flex-shrink-0 bg-white border-b border-[#1B1716]/10">
        <div className="p-3 border-b border-[#1B1716]/10 flex items-center justify-between">
          <Link aria-label="Navigation link"
            href="/dashboard/reports"
            className="inline-flex items-center gap-1.5 text-[#1B1716]/60 hover:text-[#1B1716] text-sm font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="font-bold text-sm tracking-tight text-[#1B1716]">Validexio</span>
        </div>
        <nav ref={mobileNavRef} className="flex overflow-x-auto p-2 gap-2 hide-scrollbar">
          {TOC_ITEMS.map((item) => (
            <TOCLink
              key={item.id}
              href={`#${item.id}`}
              active={activeSection === item.id}
              icon={<item.icon className="w-4 h-4" />}
              label={item.label}
              onClick={() => setActiveSection(item.id)}
            />
          ))}
        </nav>
      </div>

      {/* Desktop Table of Contents Sidebar */}
      <aside className="w-64 bg-[#FFFFFF] border-r border-[#1B1716]/10 flex-col hidden md:flex flex-shrink-0">
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
          {TOC_ITEMS.map((item) => (
            <TOCLink
              key={item.id}
              href={`#${item.id}`}
              active={activeSection === item.id}
              icon={<item.icon className="w-4 h-4" />}
              label={item.label}
              onClick={() => setActiveSection(item.id)}
            />
          ))}
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
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
        active 
          ? "active-toc bg-cherry/5 text-[#1B1716] border-l-2 border-cherry rounded-l-none" 
          : "text-[#1B1716]/60 hover:text-[#1B1716] hover:bg-[#1B1716]/5"
      }`}
    >
      <span className={active ? "text-cherry" : "text-[#1B1716]/40"}>{icon}</span>
      {label}
    </a>
  );
}
