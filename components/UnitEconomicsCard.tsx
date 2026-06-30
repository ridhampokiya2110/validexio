"use client";

import React from "react";
import { motion } from "framer-motion";

export interface CompetitorPricingTier {
  competitorName: string;
  price: string;
  billingModel: string;
}

export interface SuggestedPricingStrategy {
  recommendedPrice: string;
  justification: string;
}

export interface UnitEconomicsData {
  competitorPricingTiers: CompetitorPricingTier[];
  suggestedPricingStrategy: SuggestedPricingStrategy;
  projectedMargins: string;
}

interface UnitEconomicsCardProps {
  data: UnitEconomicsData;
}

export function UnitEconomicsCard({ data }: UnitEconomicsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white/40 backdrop-blur-md border border-[#630102]/10 rounded-xl p-6 shadow-[0_4px_20px_rgb(99,1,2,0.03)] flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-[#111827]">Competitor Pricing</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#630102]/10">
                <th className="py-3 px-4 text-[#630102]/70 font-bold text-xs uppercase tracking-wider">Competitor</th>
                <th className="py-3 px-4 text-[#630102]/70 font-bold text-xs uppercase tracking-wider">Price</th>
                <th className="py-3 px-4 text-[#630102]/70 font-bold text-xs uppercase tracking-wider">Payment Type</th>
              </tr>
            </thead>
            <tbody>
              {data.competitorPricingTiers.map((tier, index) => (
                <tr key={`item-${index}`} className="border-b border-[#630102]/5 hover:bg-white/50 transition-colors">
                  <td className="py-4 px-4 text-[#111827] text-base whitespace-nowrap font-heading font-medium tracking-wide">{tier.competitorName}</td>
                  <td className="py-4 px-4 text-[#630102] text-lg whitespace-nowrap font-heading font-light tracking-tight">{tier.price}</td>
                  <td className="py-4 px-4 text-[#111827]/70 text-sm whitespace-nowrap font-heading font-light tracking-wider uppercase">{tier.billingModel}</td>
                </tr>
              ))}
              {(!data.competitorPricingTiers || data.competitorPricingTiers.length === 0) && (
                <tr>
                  <td colSpan={3} className="py-4 px-4 text-center text-[#6B7280] text-sm font-medium">
                    No competitor data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-[#630102]/10 bg-gradient-to-br from-[#630102]/5 to-transparent p-6 mt-2 relative overflow-hidden shadow-[0_10px_40px_-15px_rgba(99,1,2,0.1)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#630102]/10 rounded-full blur-2xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <h4 className="text-[#630102] font-bold text-xs tracking-widest uppercase mb-4 break-words">
          Recommended Entry Price
        </h4>
        <p className="text-4xl sm:text-5xl lg:text-6xl font-heading font-light tracking-tighter text-[#630102] mb-6 drop-shadow-sm break-words">
          {data.suggestedPricingStrategy.recommendedPrice}
        </p>
        <p className="text-[#1B1716]/90 text-lg leading-relaxed font-serif italic tracking-wide break-words border-l-2 border-[#630102]/30 pl-4 mb-4">
          {data.suggestedPricingStrategy.justification}
        </p>

        {data.projectedMargins && (
          <div className="mt-6 pt-5 border-t border-[#630102]/10">
            <p className="text-[#630102]/70 text-xs uppercase font-bold tracking-widest mb-2">Estimated Profit</p>
            <p className="text-[#111827] text-2xl font-heading font-light tracking-tight">{data.projectedMargins}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
