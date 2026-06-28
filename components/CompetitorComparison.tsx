"use client";

import React from "react";
import { Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CompetitorComparison() {
  const features = [
    {
      name: "Precise TAM/SAM/SOM Market Sizing",
      typical: true,
      validexio: true,
    },
    {
      name: "Data-Backed Pricing Strategy & Unit Economics",
      typical: true,
      validexio: true,
    },
    {
      name: "Brutal Investor Interrogation Simulator",
      typical: false,
      validexio: true,
    },
    {
      name: "Deep Global Competitor Benchmarking",
      typical: false,
      validexio: true,
    },
    {
      name: "Concrete 90-Day Execution Action Plan",
      typical: false,
      validexio: true,
    },
    {
      name: "Comprehensive Tech Stack Architecture",
      typical: false,
      validexio: true,
    },
  ];

  return (
    <section className="w-full pt-12 pb-24 bg-transparent relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-[#1B1716] mb-6 tracking-tight">
            Stop paying for <span className="gradient-text">glorified chatbots</span>.
          </h2>
          <p className="text-lg text-[#1B1716]/60 max-w-2xl mx-auto font-medium">
            While other tools just regurgitate Wikipedia, our proprietary intelligence engine delivers brutal reality checks, precise market sizing, and exact execution roadmaps you can deploy today.
          </p>
        </div>

        <div className="overflow-x-auto pb-8 w-full max-w-full touch-pan-x [-webkit-overflow-scrolling:touch]">
          <div className="min-w-[800px] grid grid-cols-12 gap-4 items-end mb-10 px-4 relative z-10">
            <div className="col-span-4" />
            <div className="col-span-4 text-center flex flex-col items-center justify-center gap-3">
              <span className="text-xs font-medium text-[#1B1716]/40 tracking-[0.25em] uppercase">Typical Validators</span>
              <div className="w-8 h-[1px] bg-[#1B1716]/10" />
            </div>
            <div className="col-span-4 text-center flex flex-col items-center justify-center gap-2">
              <div className="relative group cursor-default">
                <span className="text-2xl font-heading font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#630102] via-[#A80205] to-[#630102] drop-shadow-sm transition-all duration-500">
                  Validexio
                </span>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-gradient-to-r from-transparent via-[#630102] to-transparent group-hover:w-full transition-all duration-700 ease-in-out opacity-70 group-hover:opacity-100" />
              </div>
            </div>
          </div>

          <div className="min-w-[800px] flex flex-col gap-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-4 items-center bg-white border border-[#1B1716]/5 rounded-xl p-5 hover:border-[#1B1716]/15 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="col-span-4 pl-4">
                  <p className="font-bold text-[#1B1716] group-hover:text-[#630102] transition-colors duration-300">{feature.name}</p>
                </div>
                
                <div className="col-span-4 flex justify-center">
                  {feature.typical ? (
                    <Check className="w-5 h-5 text-[#1B1716]/30" strokeWidth={1.5} />
                  ) : (
                     <X className="w-5 h-5 text-[#630102]" strokeWidth={1.5} />
                  )}
                </div>

                <div className="col-span-4 flex justify-center relative">
                  {feature.validexio ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center">
                      <X className="w-5 h-5 text-[#630102]" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center flex justify-center">
            <Link href="/compare" className="inline-flex items-center text-sm font-bold text-[#75070C] hover:text-[#810100] transition-colors">
              See how we compare against the market <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
