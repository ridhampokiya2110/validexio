"use client";

import { use } from "react";
import { Check, X } from "lucide-react";
import Link from "next/link";
// We import the Code Generator component
import FreeCodeGenerator from "../../free-tools/code-generator/page";

interface PageProps {
  params: Promise<{ niche: string }>;
}

export default function ValidateNichePage({ params }: PageProps) {
  // Resolve the params promise for Next.js 15
  const resolvedParams = use(params);
  const rawNiche = resolvedParams.niche || "startup";
  // Format niche (e.g. b2b-saas -> B2b Saas)
  const formattedNiche = rawNiche
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const features = [
    { name: "Live Source Links", typical: "Yes", validexio: "Yes" },
    { name: "Pivot Recommendations", typical: "Basic Text", validexio: "Full Strategic Angle" },
    { name: "Output Format", typical: "15-page PDF", validexio: "Production Code Repository" },
    { name: "B2B Buyer Leads", typical: "None", validexio: "10 Verified Apollo Leads" },
  ];

  return (
    <main className="min-h-screen text-[#1B1716] font-sans selection:bg-[#75070C]/20 selection:text-[#75070C] pb-20">
      
      {/* Dynamic Hero */}
      <section className="pt-32 pb-16 px-6 max-w-5xl mx-auto text-center">
        <span className="badge badge-cherry mb-6">Programmatic Execution</span>
        <h1 className="text-4xl md:text-6xl font-black text-[#1B1716] tracking-tight leading-tight mb-6">
          Validate Your <span className="text-[#75070C]">{formattedNiche}</span> Idea & Get the Exact Tech Blueprint.
        </h1>
        <p className="text-lg md:text-xl text-[#1B1716]/80 max-w-3xl mx-auto leading-relaxed">
          Do not just research. Enter your {formattedNiche} concept below and instantly receive live market data, AWS architecture, and Next.js waitlist code.
        </p>
      </section>

      {/* Embedded Lead Magnet Generator */}
      <section className="relative z-10 -mt-10">
        <FreeCodeGenerator />
      </section>

      {/* Competitor Jab Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1B1716] mb-4">Why Typical Validation Fails</h2>
          <p className="text-[#1B1716]/60">We give you the code and the leads. They give you a PDF.</p>
        </div>

        <div className="glass-card overflow-hidden bg-white border-2 border-[#75070C]/10 shadow-lg rounded-2xl">
          <div className="grid grid-cols-12 border-b border-[#1B1716]/10 bg-[#630102] text-white font-bold text-sm uppercase tracking-wider">
            <div className="col-span-6 p-5">Feature</div>
            <div className="col-span-3 p-5 text-center border-l border-white/20">Typical Tools</div>
            <div className="col-span-3 p-5 text-center border-l border-white/20 text-[#FFEDAB]">Validexio</div>
          </div>

          {features.map((feature, idx) => (
            <div key={`item-${idx}`} className="grid grid-cols-12 border-b border-[#1B1716]/10 last:border-0 hover:bg-[#1B1716]/[0.02] transition-colors">
              <div className="col-span-6 p-5 flex items-center font-bold text-[#1B1716]">
                {feature.name}
              </div>
              <div className="col-span-3 p-5 text-center flex items-center justify-center border-l border-[#1B1716]/10 text-sm text-[#1B1716]/60 font-medium">
                {feature.typical}
              </div>
              <div className="col-span-3 p-5 text-center flex items-center justify-center border-l border-[#1B1716]/10 font-black text-sm text-[#75070C]">
                {feature.validexio}
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </main>
  );
}
