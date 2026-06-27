"use client";

import { motion } from "framer-motion";

export function TruthGraph() {
  return (
    <section className="py-20 px-6 max-w-4xl mx-auto my-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#1B1716] mb-2">The Validexio AI Rigor Filter</h2>
        <p className="text-[#1B1716]/60">We do not rubber-stamp bad ideas. We pivot them into revenue.</p>
      </div>
      
      <div className="glass-card relative h-64 p-6 flex flex-col justify-end overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 bg-grid opacity-20" />
        
        {/* Graph Line */}
        <svg className="absolute inset-0 w-full h-full preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M0,90 Q20,80 40,85 T70,50 T100,10"
            fill="none"
            stroke="#75070C"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          {/* Shaded area */}
          <motion.path
            d="M0,90 Q20,80 40,85 T70,50 T100,10 L100,100 L0,100 Z"
            fill="url(#lightGradient)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          <defs>
            <linearGradient id="lightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#75070C" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#75070C" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Rejection marker */}
        <motion.div 
          className="absolute left-[40%] bottom-[15%] bg-white border border-[#75070C]/30 text-[#75070C] text-xs font-bold px-3 py-1 rounded shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          80% Pivot Rate
        </motion.div>
      </div>
    </section>
  );
}
