"use client";

import React from "react";
import { motion } from "framer-motion";

export interface PivotStrategy {
  recommendedAngle: string;
  whyItWorks: string;
  newTargetAudience: string;
}

interface AntiRoadmapCardProps {
  antiRoadmap: string[];
  pivotStrategy?: PivotStrategy | null;
}

export function AntiRoadmapCard({ antiRoadmap, pivotStrategy }: AntiRoadmapCardProps) {
  return (
    <div className="bg-[#630102] rounded-xl border border-[#75070C] overflow-hidden flex flex-col w-full">
      {/* Top Section: The Anti-Roadmap */}
      <motion.div 
        className="p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-[#FFEDAB] text-xl font-bold mb-4">The Anti-Roadmap</h3>
        <p className="text-[#EDEBDE]/80 text-sm mb-4">What NOT to build right now:</p>
        <ul className="space-y-3">
          {antiRoadmap.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1B1716] border border-[#FFEDAB]/50 flex items-center justify-center text-[#FFEDAB] text-xs font-bold mt-0.5">
                {index + 1}
              </span>
              <span className="text-[#EDEBDE] text-sm leading-tight">{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Bottom Section: The Pivot Strategy */}
      {pivotStrategy && (
        <motion.div 
          className="border-t border-[#1B1716]/40 bg-[#1B1716]/30 p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h4 className="text-[#FFEDAB] text-lg font-bold mb-3 drop-shadow-[0_0_8px_rgba(255,237,171,0.5)]">
            Recommended Pivot Angle
          </h4>
          <p className="text-[#EDEBDE] text-base font-bold mb-5 leading-relaxed">
            {pivotStrategy.recommendedAngle}
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[#1B1716]/40 rounded-lg p-4 border border-[#75070C]/30">
              <p className="text-[#EDEBDE]/60 text-xs font-bold uppercase tracking-wider mb-2">Why It Works</p>
              <p className="text-[#EDEBDE]/80 text-sm leading-relaxed">{pivotStrategy.whyItWorks}</p>
            </div>
            <div className="bg-[#1B1716]/40 rounded-lg p-4 border border-[#75070C]/30">
              <p className="text-[#EDEBDE]/60 text-xs font-bold uppercase tracking-wider mb-2">New Target Audience</p>
              <p className="text-[#EDEBDE]/80 text-sm leading-relaxed">{pivotStrategy.newTargetAudience}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
