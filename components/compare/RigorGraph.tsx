"use client";

import { motion } from "framer-motion";

export function RigorGraph() {
  return (
    <div className="bg-[#FFFFFF] border border-[#1B1716]/10 p-8 rounded-none">
      <h3 className="text-xl font-bold text-[#1B1716] uppercase tracking-wider mb-8">The Validexio Rigor Filter</h3>
      
      <div className="relative h-48 w-full border-l border-b border-[#1B1716]/20 flex items-end pt-4 pr-4">
        {/* Y Axis Labels */}
        <div className="absolute -left-12 top-0 h-full flex flex-col justify-between text-xs font-bold text-[#1B1716]/40 uppercase py-2">
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>

        {/* Competitor Line (Validates Everything) */}
        <div className="relative w-1/2 h-full flex flex-col items-center justify-end group">
          <motion.div 
            className="w-16 bg-[#1B1716]/10"
            initial={{ height: 0 }}
            animate={{ height: "95%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <div className="mt-4 text-xs font-bold text-[#1B1716]/60 uppercase tracking-widest text-center">
            Them<br/><span className="text-[10px] opacity-70">Approve All</span>
          </div>
        </div>

        {/* Validexio Line (Rejects 80%) */}
        <div className="relative w-1/2 h-full flex flex-col items-center justify-end group">
          <motion.div 
            className="w-16 bg-cherry"
            initial={{ height: 0 }}
            animate={{ height: "20%" }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          />
          <div className="mt-4 text-xs font-bold text-cherry uppercase tracking-widest text-center">
            Validexio<br/><span className="text-[10px] opacity-70">Top 20% Only</span>
          </div>
        </div>

        {/* Threshold Line */}
        <motion.div 
          className="absolute top-1/4 left-0 w-full border-t border-dashed border-[#1B1716]/30"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ duration: 1, delay: 1 }}
        >
          <span className="absolute -top-5 right-0 text-[10px] font-bold text-[#1B1716]/50 uppercase">Rigor Threshold</span>
        </motion.div>
      </div>
    </div>
  );
}
