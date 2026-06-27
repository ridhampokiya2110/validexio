"use client";

import { CheckCircle, AlertTriangle, Play } from "lucide-react";
import { getScoreLabel, getScoreColor } from "@/lib/utils";

interface UnifiedScoreCardProps {
  score: number;
  report: {
    swotAnalysis?: any;
    actionPlan?: any;
  };
}

export function UnifiedScoreCard({ score, report }: UnifiedScoreCardProps) {
  const size = 160;
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;
  const color = score >= 70 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";

  // Derive verdict based on score
  const verdict = score >= 85 ? "This idea has strong potential. Execute immediately." 
    : score >= 70 ? "Solid foundation, but requires careful execution." 
    : score >= 50 ? "High risk. Pivot required before building." 
    : "Critical flaws detected. Re-evaluate the core problem.";

  // Extract points from SWOT and Action Plan
  const moat = report?.swotAnalysis?.strengths?.[0] || "Proprietary algorithm or unique distribution channel.";
  const blindSpot = report?.swotAnalysis?.weaknesses?.[0] || "High customer acquisition cost in a crowded market.";
  const action = report?.actionPlan?.day30?.[0] || "Launch a waitlist and validate willingness to pay.";

  return (
    <div className="bg-gradient-to-br from-[#FDFCF8] to-[#FFFFFF] glass-card p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 mb-10 mt-4 shadow-xl hover:shadow-2xl border border-[#E5E7EB] hover:border-[#630102]/20 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden animate-fade-in-scale group" id="overview">
      {/* Subtle decorative glassmorphism glow */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-[#630102]/5 rounded-full blur-[60px] -z-10 -translate-x-1/2 -translate-y-1/2 group-hover:bg-[#630102]/10 transition-colors duration-700"></div>
      
      {/* Left: Circular Rigor Score */}
      <div className="relative flex-shrink-0 flex items-center justify-center z-10" style={{ width: size, height: size }}>
        <div className="absolute inset-0 bg-[#630102]/5 blur-xl rounded-full"></div>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative z-10 drop-shadow-sm">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="12"
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="rgba(99, 1, 2, 0.05)"
            strokeWidth="12"
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dasharray 1.5s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-4xl font-black text-[#111827] tracking-tighter drop-shadow-sm">{score}</span>
          <span className="text-[10px] font-bold text-[#630102]/60 uppercase tracking-wider mt-1">Rigor Score</span>
        </div>
      </div>

      {/* Right: Verdict & Points */}
      <div className="flex-1 min-w-0 w-full relative z-10 bg-white/40 backdrop-blur-md rounded-xl p-6 border border-[#630102]/5 shadow-[0_4px_20px_rgb(99,1,2,0.02)]">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight mb-6">
          {verdict}
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-600 drop-shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#630102]/70 uppercase tracking-wider mb-1">The Moat</p>
              <p className="text-[#111827] text-sm font-medium leading-relaxed break-words">{moat}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-500 drop-shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#630102]/70 uppercase tracking-wider mb-1">Primary Blind Spot</p>
              <p className="text-[#111827] text-sm font-medium leading-relaxed break-words">{blindSpot}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0">
              <Play className="w-5 h-5 text-[#630102] fill-[#630102]/20 drop-shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#630102]/70 uppercase tracking-wider mb-1">Next Action</p>
              <p className="text-[#111827] text-sm font-medium leading-relaxed break-words">{action}</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
