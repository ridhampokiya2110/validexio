"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AntiRoadmapCard, type PivotStrategy } from "./AntiRoadmapCard";
import { TechArchitectureCard, type TechArchitecture } from "./TechArchitectureCard";
import { GTMBrandingCard, type GTMBrandingKit } from "./GTMBrandingCard";
import { FakeDoorCodeCard, type FakeDoorCode } from "./FakeDoorCodeCard";
import { EarlyAdopterCard, type EarlyAdopterPsychology } from "./EarlyAdopterCard";

interface TeaserData {
  viabilityScore: number;
  antiRoadmap: string[];
  pivotStrategy?: PivotStrategy | null;
  techArchitecture?: TechArchitecture | null;
  gtmBrandingKit?: GTMBrandingKit | null;
  fakeDoorCode?: FakeDoorCode | null;
  earlyAdopterPsychology?: EarlyAdopterPsychology | null;
  isPremiumUnlocked: boolean;
  leads: { name: string; company: string; contact: string }[];
  mockups: { screen: string }[];
}

interface FreeTeaserReportProps {
  data: TeaserData;
}

export function FreeTeaserReport({ data }: FreeTeaserReportProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto space-y-8 p-4 bg-[#1B1716] min-h-screen font-sans"
    >
      {/* Real Data Section */}
      <div className="bg-[#630102] rounded-2xl p-6 md:p-8 shadow-2xl border border-[#EDEBDE]/10 backdrop-blur-md">
        <h2 className="text-[#EDEBDE] text-3xl font-black mb-6">Your Reality Check</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#1B1716] rounded-xl p-6 border border-[#FFEDAB]/20 flex flex-col items-center justify-center">
            <p className="text-[#EDEBDE]/80 text-sm uppercase tracking-widest mb-2 font-bold">Viability Score</p>
            <div className="text-6xl font-black text-[#FFEDAB]">{data.viabilityScore}</div>
            <p className="text-[#EDEBDE]/60 text-xs mt-2">/ 100</p>
          </div>

          <div className="flex-1 min-w-0 space-y-6">
            <AntiRoadmapCard antiRoadmap={data.antiRoadmap} pivotStrategy={data.pivotStrategy} />
            {data.techArchitecture && (
              <TechArchitectureCard data={data.techArchitecture} />
            )}
            {data.gtmBrandingKit && (
              <GTMBrandingCard data={data.gtmBrandingKit} />
            )}
            {data.fakeDoorCode && (
              <FakeDoorCodeCard data={data.fakeDoorCode} />
            )}
            {data.earlyAdopterPsychology && (
              <EarlyAdopterCard data={data.earlyAdopterPsychology} />
            )}
          </div>
        </div>
      </div>

      {/* Premium Blurred Sections */}
      <div className="relative">
        {/* The Content to be blurred */}
        <div className="space-y-8 blur-md select-none pointer-events-none opacity-60">
          
          {/* Mockups */}
          <div className="bg-[#1B1716] rounded-2xl p-6 border border-[#630102]">
            <h3 className="text-[#FFEDAB] text-2xl font-bold mb-4">Instant UI Mockups</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.mockups.map((mockup, i) => (
                <div key={i} className="aspect-video bg-gradient-to-br from-[#630102]/40 to-[#1B1716] rounded-lg border border-[#EDEBDE]/10 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#EDEBDE]/5" />
                  <div className="w-3/4 h-4 bg-[#EDEBDE]/5 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Leads */}
          <div className="bg-[#1B1716] rounded-2xl p-6 border border-[#630102]">
            <h3 className="text-[#FFEDAB] text-2xl font-bold mb-4">10 Verified B2B Leads</h3>
            <div className="overflow-x-auto overflow-y-hidden rounded-lg border border-[#EDEBDE]/10">
              <table className="w-full text-left text-[#EDEBDE]">
                <thead className="bg-[#630102]/50 text-[#FFEDAB] text-sm uppercase">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDEBDE]/10">
                  {data.leads.map((lead, i) => (
                    <tr key={i} className="bg-[#1B1716]/50">
                      <td className="px-4 py-3">{lead.name}</td>
                      <td className="px-4 py-3">{lead.company}</td>
                      <td className="px-4 py-3 text-[#EDEBDE]/50">{lead.contact}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#1B1716]/50">
                    <td className="px-4 py-3">...</td>
                    <td className="px-4 py-3">...</td>
                    <td className="px-4 py-3">...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* The Paywall Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
          <div className="bg-[#1B1716]/90 backdrop-blur-sm border border-[#FFEDAB]/30 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-[#630102] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(99,1,2,0.5)]">
              <svg className="w-8 h-8 text-[#FFEDAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-[#EDEBDE] text-2xl font-black mb-3">Unlock Execution Pro</h3>
            <p className="text-[#EDEBDE]/70 mb-8">
              View your customized high-fidelity mockups, download your codebase, and access 10 verified target leads.
            </p>
            <Link 
              href="/register?plan=pro"
              className="inline-block w-full bg-[#75070C] hover:bg-[#630102] text-[#FFEDAB] font-bold py-4 px-6 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(117,7,12,0.39)] hover:shadow-[0_6px_20px_rgba(117,7,12,0.23)] hover:-translate-y-0.5"
            >
              Upgrade for $39 / ₹1499
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
