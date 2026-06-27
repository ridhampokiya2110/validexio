"use client";

import { motion } from "framer-motion";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function AnimatedSecurityScore({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate the score number smoothly
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const stepTime = Math.abs(Math.floor(duration / steps));
    let current = 0;
    
    const timer = setInterval(() => {
      current += (score / steps);
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = "text-red-500";
  let gradientClass = "from-red-500 to-orange-500";
  let shadowClass = "shadow-red-500/20";
  let Icon = ShieldAlert;

  if (score >= 80) {
    colorClass = "text-emerald-500";
    gradientClass = "from-emerald-400 to-cyan-500";
    shadowClass = "shadow-emerald-500/20";
    Icon = ShieldCheck;
  } else if (score >= 50) {
    colorClass = "text-yellow-500";
    gradientClass = "from-yellow-400 to-orange-500";
    shadowClass = "shadow-yellow-500/20";
    Icon = Shield;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl bg-white p-6 md:p-8 mb-6 shadow-xl ${shadowClass} border border-gray-100`}
    >
      {/* Background glow effects for bright theme */}
      <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br ${gradientClass} opacity-10 blur-3xl`} />
      <div className={`absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-gradient-to-tr ${gradientClass} opacity-10 blur-3xl`} />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="flex-1 text-center md:text-left">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full mb-4 border border-gray-100"
          >
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-800 tracking-tight">Security Status</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
            Account Security Score
          </h2>
          <p className="text-gray-500 font-medium max-w-sm mx-auto md:mx-0">
            Higher scores indicate better protection against unauthorized access. Complete all security tasks to reach 100.
          </p>
        </div>

        <div className="relative flex-shrink-0">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className="text-gray-100 stroke-current"
              strokeWidth="8"
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
            ></circle>
            {/* Animated progress circle */}
            <motion.circle
              className={`${colorClass} stroke-current drop-shadow-md`}
              strokeWidth="8"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ strokeDasharray: circumference }}
            ></motion.circle>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br ${gradientClass}`}>
              {animatedScore}
            </span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">/ 100</span>
          </div>

          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-100`}
          >
            <Icon className={`w-6 h-6 ${colorClass}`} />
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
