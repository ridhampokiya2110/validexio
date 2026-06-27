"use client";

import { motion } from "framer-motion";
import { Terminal, Code2, Database, Search, ArrowDown } from "lucide-react";

export function PipelineVisualization() {
  const lineVariant = {
    hidden: { height: 0 },
    visible: { height: "100%", transition: { duration: 1.5, ease: "easeInOut" } }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative max-w-4xl mx-auto py-12">
      
      {/* Central Line connecting stages */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-[#1B1716]/10 transform md:-translate-x-1/2">
        <motion.div 
          className="w-full bg-cherry origin-top"
          variants={lineVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        />
      </div>

      <div className="space-y-24 relative z-10">
        
        {/* STAGE 1: Tavily Intelligence Layer */}
        <motion.div 
          className="flex flex-col md:flex-row items-center md:justify-between gap-8"
          variants={itemVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="w-full md:w-5/12 pl-16 md:pl-0 md:text-right">
            <h3 className="text-xl font-black uppercase tracking-tight text-[#1B1716] mb-3">Stage 1: The Tavily Intelligence Layer</h3>
            <p className="text-[#1B1716]/70 text-sm leading-relaxed mb-4">
              Real-time web search and competitor scraping. We do not rely on static training data. We pull live market caps, competitor pricing tiers, and active demand signals.
            </p>
          </div>
          
          <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-[#FDFCF8] border-2 border-cherry rounded-full transform md:-translate-x-1/2 flex items-center justify-center shadow-[0_0_15px_rgba(117,7,12,0.3)]">
            <Search className="w-4 h-4 text-cherry" />
          </div>

          <div className="w-full pl-16 md:pl-0 md:w-5/12">
            <div className="bg-[#FFFFFF] border border-[#1B1716]/10 shadow-[4px_4px_0px_#1B1716] p-5 font-mono text-xs text-[#1B1716]">
              <div className="flex gap-2 border-b border-[#1B1716]/10 pb-3 mb-3">
                <Terminal className="w-4 h-4 text-cherry" />
                <span className="font-bold uppercase tracking-widest text-[#1B1716]/50">Tavily.Search()</span>
              </div>
              <div className="space-y-2 opacity-80">
                <p><span className="text-cherry">&gt;</span> Pinging G2 reviews for "Salesforce"</p>
                <p><span className="text-cherry">&gt;</span> Extracting 1-star complaints...</p>
                <p><span className="text-cherry">&gt;</span> Identified gap: "Clunky mobile interface"</p>
                <p className="text-cherry font-bold">STATUS: Market Demand Verified</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* STAGE 2: Infrastructure Compiler */}
        <motion.div 
          className="flex flex-col md:flex-row-reverse items-center md:justify-between gap-8"
          variants={itemVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="w-full md:w-5/12 pl-16 md:pl-0">
            <h3 className="text-xl font-black uppercase tracking-tight text-[#1B1716] mb-3">Stage 2: The Infrastructure Compiler</h3>
            <p className="text-[#1B1716]/70 text-sm leading-relaxed mb-4">
              Translating market gaps into cloud architecture. We compile a bespoke software blueprint tailored to exactly what the market is begging for.
            </p>
          </div>
          
          <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-[#FDFCF8] border-2 border-cherry rounded-full transform md:-translate-x-1/2 flex items-center justify-center shadow-[0_0_15px_rgba(117,7,12,0.3)]">
            <Code2 className="w-4 h-4 text-cherry" />
          </div>

          <div className="w-full pl-16 md:pl-0 md:w-5/12">
            <div className="bg-[#FFFFFF] border border-[#1B1716]/10 shadow-[4px_4px_0px_#1B1716] p-5 font-mono text-xs text-[#1B1716]">
              <div className="flex gap-2 border-b border-[#1B1716]/10 pb-3 mb-3">
                <Code2 className="w-4 h-4 text-cherry" />
                <span className="font-bold uppercase tracking-widest text-[#1B1716]/50">Gemini.Compile()</span>
              </div>
              <div className="space-y-2 opacity-80">
                <p className="text-[#1B1716]/50">/* Generating MVP Architecture */</p>
                <p>import &#123; createClient &#125; from '@supabase/supabase-js'</p>
                <p>const db = createClient(URL, KEY)</p>
                <p className="mt-2 text-cherry font-bold">// Edge Network Provisioned</p>
                <p className="text-cherry font-bold">// Database Schema Compiled</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* STAGE 3: Apollo Revenue Router */}
        <motion.div 
          className="flex flex-col md:flex-row items-center md:justify-between gap-8"
          variants={itemVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="w-full md:w-5/12 pl-16 md:pl-0 md:text-right">
            <h3 className="text-xl font-black uppercase tracking-tight text-[#1B1716] mb-3">Stage 3: The Apollo.io Revenue Router</h3>
            <p className="text-[#1B1716]/70 text-sm leading-relaxed mb-4">
              Sourcing the first 10 paying customers. We don't give you theoretical personas. We query verified B2B databases to hand you the exact names, titles, and domains of your Day 1 targets.
            </p>
          </div>
          
          <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-cherry border-2 border-cherry rounded-full transform md:-translate-x-1/2 flex items-center justify-center shadow-[0_0_20px_rgba(117,7,12,0.5)]">
            <Database className="w-4 h-4 text-white" />
          </div>

          <div className="w-full pl-16 md:pl-0 md:w-5/12">
            <div className="bg-[#FFFFFF] border border-[#1B1716]/10 shadow-[4px_4px_0px_#1B1716] overflow-hidden">
              <div className="grid grid-cols-12 bg-[#1B1716] text-[#FDFCF8] border-b border-[#1B1716]/10 uppercase text-[10px] font-bold tracking-widest p-3">
                <div className="col-span-4">Target</div>
                <div className="col-span-4">Title</div>
                <div className="col-span-4 text-right">Status</div>
              </div>
              <div className="p-3 text-xs font-mono space-y-3">
                <div className="grid grid-cols-12 items-center opacity-80">
                  <div className="col-span-4 truncate font-bold">Acme Corp</div>
                  <div className="col-span-5 truncate text-[#1B1716]/60">VP of Sales</div>
                  <div className="col-span-3 text-right text-cherry font-bold text-[10px]">VERIFIED</div>
                </div>
                <div className="grid grid-cols-12 items-center opacity-80">
                  <div className="col-span-4 truncate font-bold">Globex Inc</div>
                  <div className="col-span-5 truncate text-[#1B1716]/60">Dir. Operations</div>
                  <div className="col-span-3 text-right text-cherry font-bold text-[10px]">VERIFIED</div>
                </div>
                <div className="grid grid-cols-12 items-center opacity-80">
                  <div className="col-span-4 truncate font-bold">Initech</div>
                  <div className="col-span-5 truncate text-[#1B1716]/60">CEO</div>
                  <div className="col-span-3 text-right text-cherry font-bold text-[10px]">VERIFIED</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
