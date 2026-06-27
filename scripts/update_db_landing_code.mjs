import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const landingPageReactCode = `import React from 'react';
import { ArrowRight, Shield, Zap, Target } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans selection:bg-[#75070C] selection:text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-[#1B1716]/5">
        <div className="text-xl font-black tracking-tighter text-[#1B1716]">
          Your<span className="text-[#75070C]">Startup</span>
        </div>
        <button className="bg-[#1B1716] text-[#FDFCF8] px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#75070C] transition-colors duration-300">
          Request Access
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-24 sm:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75070C]/10 text-[#75070C] text-xs font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#75070C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#75070C]"></span>
            </span>
            Now in Private Beta
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black text-[#1B1716] leading-[1.05] tracking-tight mb-8">
            Orchestrate Your Startup with <span className="text-[#75070C]">Algorithmic Precision</span>.
          </h1>
          
          <p className="text-lg text-[#1B1716]/60 leading-relaxed mb-10 max-w-xl">
            The uncompromising, AI-driven intelligence toolkit for founders who demand market dominance. Stop guessing. Start executing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center gap-2 bg-[#1B1716] text-[#FDFCF8] px-8 py-4 rounded-full font-semibold hover:bg-[#75070C] hover:scale-105 transition-all duration-300 shadow-xl shadow-[#1B1716]/10">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-center gap-2 bg-white text-[#1B1716] px-8 py-4 rounded-full font-semibold border border-[#1B1716]/10 hover:border-[#1B1716]/30 transition-colors duration-300">
              View Architecture
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
`;

  console.log('Fetching all ValidationReports...');
  const reports = await prisma.validationReport.findMany();
  console.log('Found ' + reports.length + ' reports.');

  for (const report of reports) {
    await prisma.validationReport.update({
      where: { id: report.id },
      data: { codeBoilerplate: landingPageReactCode }
    });
    console.log('Updated report ID: ' + report.id);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
