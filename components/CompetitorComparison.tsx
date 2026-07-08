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
        <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
          <h2 className="text-center text-3xl md:text-5xl font-black text-[#1B1716] mb-4 sm:mb-6 tracking-tight leading-tight px-2 mx-auto">
            Stop paying for <br className="sm:hidden" /><span className="gradient-text">glorified chatbots</span>.
          </h2>
          <p className="text-center text-base sm:text-lg text-[#1B1716]/60 max-w-2xl mx-auto font-medium px-4 sm:px-0">
            While other tools just regurgitate Wikipedia, our proprietary intelligence engine delivers brutal reality checks, precise market sizing, and exact execution roadmaps you can deploy today.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 relative z-10 px-2 sm:px-0">
          <div className="grid grid-cols-12 gap-2 sm:gap-4 items-end mb-4 sm:mb-10 px-1 sm:px-4">
            <div className="col-span-6 sm:col-span-4" />
            <div className="col-span-3 sm:col-span-4 text-center flex flex-col items-center justify-center gap-1 sm:gap-3">
              <span className="text-[9px] sm:text-xs font-medium text-[#1B1716]/40 tracking-wider sm:tracking-[0.25em] uppercase leading-tight">Typical<br className="sm:hidden"/> Validators</span>
              <div className="hidden sm:block w-8 h-[1px] bg-[#1B1716]/10" />
            </div>
            <div className="col-span-3 sm:col-span-4 text-center flex flex-col items-center justify-center gap-1 sm:gap-2">
              <div className="relative group cursor-default">
                <span className="text-xs sm:text-2xl font-heading font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#630102] via-[#A80205] to-[#630102] drop-shadow-sm transition-all duration-500">
                  Validexio
                </span>
                <div className="hidden sm:block absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-gradient-to-r from-transparent via-[#630102] to-transparent group-hover:w-full transition-all duration-700 ease-in-out opacity-70 group-hover:opacity-100" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3">
            {features.map((feature, idx) => (
              <div
                key={`item-${idx}`}
                className="grid grid-cols-12 gap-2 sm:gap-4 items-center bg-white border border-[#1B1716]/5 rounded-xl p-3 sm:p-5 hover:border-[#1B1716]/15 hover:-translate-y-0.5 transition-all duration-300 group shadow-sm"
              >
                <div className="col-span-6 sm:col-span-4 pl-1 sm:pl-4">
                  <p className="text-[10px] sm:text-base font-bold text-[#1B1716] group-hover:text-[#630102] transition-colors duration-300 leading-tight pr-1 sm:pr-0">{feature.name}</p>
                </div>
                
                <div className="col-span-3 sm:col-span-4 flex justify-center">
                  {feature.typical ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#1B1716]/30" strokeWidth={1.5} />
                  ) : (
                     <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#630102]" strokeWidth={1.5} />
                  )}
                </div>

                <div className="col-span-3 sm:col-span-4 flex justify-center relative">
                  {feature.validexio ? (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Check className="w-3 h-3 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#630102]" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 text-center flex justify-center">
            <Link aria-label="Navigation link" href="/compare" className="inline-flex items-center text-xs sm:text-sm font-bold text-[#75070C] hover:text-[#810100] transition-colors px-4">
              See how we compare against the market <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
