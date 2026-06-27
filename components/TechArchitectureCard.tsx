"use client";

import React from "react";
import { motion } from "framer-motion";

export interface TechArchitecture {
  recommendedStack: {
    frontend: string;
    backend: string;
    database: string;
  };
  cloudHostingStrategy: {
    recommendedPlatform: string;
    deploymentApproach: string;
  };
  whyThisArchitecture: string;
}

interface TechArchitectureCardProps {
  data: TechArchitecture;
}

export function TechArchitectureCard({ data }: TechArchitectureCardProps) {
  return (
    <motion.div
      className="bg-[#630102]/20 rounded-xl border border-[#75070C] overflow-hidden flex flex-col w-full backdrop-blur-md"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Top Section: The Core Stack */}
      <div className="p-6">
        <h3 className="text-[#EDEBDE] text-lg font-bold mb-4 uppercase tracking-wider">The Core Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1B1716]/60 rounded-lg p-3 border border-[#75070C]/50 flex flex-col items-center text-center">
            <span className="text-[#EDEBDE]/60 text-xs uppercase tracking-wide mb-1">Frontend</span>
            <span className="text-[#FFEDAB] font-bold">{data.recommendedStack.frontend}</span>
          </div>
          <div className="bg-[#1B1716]/60 rounded-lg p-3 border border-[#75070C]/50 flex flex-col items-center text-center">
            <span className="text-[#EDEBDE]/60 text-xs uppercase tracking-wide mb-1">Backend</span>
            <span className="text-[#FFEDAB] font-bold">{data.recommendedStack.backend}</span>
          </div>
          <div className="bg-[#1B1716]/60 rounded-lg p-3 border border-[#75070C]/50 flex flex-col items-center text-center">
            <span className="text-[#EDEBDE]/60 text-xs uppercase tracking-wide mb-1">Database</span>
            <span className="text-[#FFEDAB] font-bold">{data.recommendedStack.database}</span>
          </div>
        </div>
      </div>

      {/* Solid Divider */}
      <div className="h-px w-full bg-[#75070C]" />

      {/* Bottom Section: Cloud & Deployment */}
      <div className="p-6 bg-[#1B1716]/40">
        <h4 className="text-[#EDEBDE] text-xl font-bold mb-2">
          {data.cloudHostingStrategy.recommendedPlatform}
        </h4>
        <p className="text-[#EDEBDE]/80 text-sm leading-relaxed mb-6">
          {data.cloudHostingStrategy.deploymentApproach}
        </p>

        {/* Why this Architecture */}
        <div className="border-l-2 border-[#75070C] pl-4">
          <p className="text-[#EDEBDE]/70 text-sm italic leading-relaxed">
            {data.whyThisArchitecture}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
