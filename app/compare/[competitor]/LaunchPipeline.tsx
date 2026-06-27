"use client";

import { motion } from "framer-motion";
import { Code2, FileText, Lightbulb, Users, CheckCircle2, XCircle, LucideIcon } from "lucide-react";

export interface PipelineStage {
  id: number;
  name: string;
  iconName: "Lightbulb" | "FileText" | "Code2" | "Users"; // We map these to actual icons below
  competitorHas: boolean;
  validexioHas: boolean;
  description: string;
}

interface LaunchPipelineProps {
  competitorName: string;
  title?: string;
  description: string;
  stages: PipelineStage[];
}

const iconMap: Record<string, LucideIcon> = {
  Lightbulb,
  FileText,
  Code2,
  Users
};

export function LaunchPipeline({ competitorName, title, description, stages }: LaunchPipelineProps) {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto overflow-hidden">
      <div className="text-center mb-16">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#75070C] mb-3">The Delivery Funnel</p>
        <h2 className="text-3xl md:text-5xl font-black text-[#1B1716] mb-4 tracking-tight">Where they stop vs Where we launch</h2>
        <p className="text-[#1B1716]/60 max-w-2xl mx-auto text-lg">
          {description}
        </p>
      </div>

      <div className="relative">
        {/* Connection Line Background */}
        <div className="absolute top-[100px] left-0 w-full h-1 bg-[#1B1716]/5 hidden md:block"></div>
        
        {/* Validexio Progress Line */}
        <motion.div 
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
          className="absolute top-[100px] left-0 h-1 bg-gradient-to-r from-[#75070C]/20 via-[#75070C] to-[#75070C] hidden md:block origin-left"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {stages.map((stage, idx) => {
            const IconComponent = iconMap[stage.iconName] || Lightbulb;
            
            return (
              <motion.div 
                key={stage.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="relative"
              >
                {/* Card */}
                <div className="glass-card bg-white p-6 rounded-2xl border border-[#1B1716]/10 h-full flex flex-col items-center text-center hover:border-[#75070C]/30 transition-colors z-10 relative">
                  
                  {/* Icon Circle */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${stage.validexioHas ? 'bg-[#75070C]/5 border-[#75070C]/20 text-[#75070C]' : 'bg-[#1B1716]/5 border-[#1B1716]/10 text-[#1B1716]/40'}`}>
                    <IconComponent className="w-8 h-8" strokeWidth={1.5} />
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1B1716]/40 mb-2">
                    Stage 0{stage.id}
                  </span>
                  <h3 className="text-xl font-bold text-[#1B1716] mb-3">
                    {stage.name}
                  </h3>
                  <p className="text-sm text-[#1B1716]/60 leading-relaxed mb-8 flex-grow">
                    {stage.description}
                  </p>

                  {/* Status Badges */}
                  <div className="w-full space-y-2 border-t border-[#1B1716]/5 pt-4">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#1B1716]/40">{competitorName}</span>
                      {stage.competitorHas ? (
                        <span className="flex items-center text-[#1B1716]/40 bg-[#1B1716]/5 px-2 py-1 rounded">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Yes
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500/50 bg-red-500/5 px-2 py-1 rounded">
                          <XCircle className="w-3 h-3 mr-1" /> Stops Here
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className="text-[#75070C]">Validexio</span>
                      {stage.validexioHas && (
                        <span className="flex items-center text-[#75070C] bg-[#75070C]/10 px-2 py-1 rounded">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Delivered
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
