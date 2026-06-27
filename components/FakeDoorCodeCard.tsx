"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface FakeDoorCode {
  reactComponent: string;
  sqlSchema: string;
}

interface FakeDoorCodeCardProps {
  data: FakeDoorCode;
}

export function FakeDoorCodeCard({ data }: FakeDoorCodeCardProps) {
  const [activeTab, setActiveTab] = useState<"react" | "sql">("react");
  const [copied, setCopied] = useState(false);

  const activeCode = activeTab === "react" ? data.reactComponent : data.sqlSchema;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <motion.div
      className="bg-[#630102]/20 rounded-xl border border-[#75070C] overflow-hidden flex flex-col w-full backdrop-blur-md"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="p-6">
        <h3 className="text-[#EDEBDE] text-lg font-bold mb-6 uppercase tracking-wider">
          Test Landing Page Code
        </h3>
        
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-4 border-b border-[#75070C]/50">
          <button
            onClick={() => setActiveTab("react")}
            className={`pb-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
              activeTab === "react"
                ? "text-[#FFEDAB] border-b-2 border-[#FFEDAB]"
                : "text-[#EDEBDE]/60 hover:text-[#EDEBDE]"
            }`}
          >
            React Code
          </button>
          <button
            onClick={() => setActiveTab("sql")}
            className={`pb-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
              activeTab === "sql"
                ? "text-[#FFEDAB] border-b-2 border-[#FFEDAB]"
                : "text-[#EDEBDE]/60 hover:text-[#EDEBDE]"
            }`}
          >
            Database Code
          </button>
        </div>

        {/* Code Block Container */}
        <div className="relative group rounded-lg overflow-hidden border border-[#75070C] bg-[#1B1716]">
          {/* Top Bar for Copy Button */}
          <div className="absolute top-0 right-0 p-2 z-10">
            <button
              onClick={handleCopy}
              className="text-xs font-semibold px-3 py-1.5 rounded bg-[#630102] text-[#EDEBDE] hover:bg-[#75070C] transition-colors border border-[#75070C]/50 shadow-md"
            >
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>
          
          {/* Scrollable Code Area */}
          <div className="overflow-x-auto p-4 pt-12 max-h-[400px] overflow-y-auto">
            <pre className="text-[#EDEBDE] font-mono text-sm leading-relaxed">
              <code>{activeCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
