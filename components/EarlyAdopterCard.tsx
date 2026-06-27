"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface EarlyAdopterPsychology {
  coreFrustration: string;
  coldEmailHook: string;
  commonObjection: string;
  howToOvercomeObjection: string;
}

interface EarlyAdopterCardProps {
  data: EarlyAdopterPsychology;
}

export function EarlyAdopterCard({ data }: EarlyAdopterCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.coldEmailHook);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <motion.div
      className="bg-[#630102]/20 rounded-xl border border-[#75070C] overflow-hidden flex flex-col w-full backdrop-blur-md"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="p-6 space-y-8">
        
        {/* Section 1: The Core Frustration */}
        <div>
          <h3 className="text-[#FFEDAB] text-lg font-bold mb-2 uppercase tracking-wider">
            The Customer's Deepest Pain
          </h3>
          <p className="text-[#EDEBDE] text-base leading-relaxed">
            {data.coreFrustration}
          </p>
        </div>

        {/* Solid Divider */}
        <div className="h-px w-full bg-[#75070C]/50" />

        {/* Section 2: The Cold Email Hook */}
        <div>
          <h4 className="text-[#FFEDAB] text-sm font-bold uppercase tracking-wide mb-3">
            Copy-Paste Cold Email Hook
          </h4>
          <div className="relative bg-[#1B1716]/50 border-l-4 border-[#75070C] p-4 rounded-r-lg group">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded bg-[#1B1716] text-[#EDEBDE] border border-[#75070C] hover:bg-[#75070C]/30 transition-colors"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <p className="text-[#EDEBDE] font-bold italic text-base leading-relaxed pr-12">
              "{data.coldEmailHook}"
            </p>
          </div>
        </div>

        {/* Solid Divider */}
        <div className="h-px w-full bg-[#75070C]/50" />

        {/* Section 3: Objection Handling */}
        <div>
          <h4 className="text-[#EDEBDE] text-lg font-bold mb-4 uppercase tracking-wider">
            Objection Handling
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1B1716]/60 rounded-lg p-4 border border-[#75070C]/50">
              <span className="text-[#EDEBDE]/60 text-xs uppercase tracking-wide block mb-2">
                They will say NO because:
              </span>
              <p className="text-[#EDEBDE] text-sm">
                {data.commonObjection}
              </p>
            </div>
            <div className="bg-[#1B1716]/60 rounded-lg p-4 border border-[#75070C]/50">
              <span className="text-[#EDEBDE]/60 text-xs uppercase tracking-wide block mb-2">
                Your Response:
              </span>
              <p className="text-[#EDEBDE] text-sm">
                {data.howToOvercomeObjection}
              </p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
