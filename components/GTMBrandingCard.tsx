"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface GTMBrandingKit {
  linkedinAnnouncement: string;
  productHuntPitch: string;
  githubReadmeIntro: string;
}

interface GTMBrandingCardProps {
  data: GTMBrandingKit;
}

export function GTMBrandingCard({ data }: GTMBrandingCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const platforms = [
    { name: "LinkedIn Announcement", content: data.linkedinAnnouncement },
    { name: "Product Hunt Pitch", content: data.productHuntPitch },
    { name: "GitHub README Intro", content: data.githubReadmeIntro },
  ];

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <motion.div
      className="bg-[#630102]/20 rounded-xl border border-[#75070C] overflow-hidden flex flex-col w-full backdrop-blur-md"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="p-6">
        <h3 className="text-[#EDEBDE] text-lg font-bold mb-6 uppercase tracking-wider">
          Day-1 GTM Branding Kit
        </h3>
        
        <div className="space-y-6">
          {platforms.map((platform, index) => (
            <div key={index} className="flex flex-col gap-2">
              <span className="text-[#FFEDAB] text-xs font-bold uppercase tracking-wide">
                {platform.name}
              </span>
              <div className="relative bg-[#1B1716]/50 rounded-lg border border-[#75070C] p-4 group">
                <button
                  onClick={() => handleCopy(platform.content, index)}
                  className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded bg-[#1B1716] text-[#EDEBDE] border border-[#75070C] hover:bg-[#75070C]/30 transition-colors"
                >
                  {copiedIndex === index ? "Copied" : "Copy"}
                </button>
                <p className="text-[#EDEBDE] text-sm leading-relaxed whitespace-pre-wrap pr-12">
                  {platform.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
