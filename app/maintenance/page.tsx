"use client";

import { motion } from "framer-motion";
import { Wrench, ShieldAlert, Sparkles, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MaintenancePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-red-600/30 blur-[100px] sm:blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-orange-600/20 blur-[120px] sm:blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6 py-12 flex flex-col items-center text-center">
        {/* Animated Icon Container */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1,
          }}
          className="relative mb-6 sm:mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse" />
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center relative shadow-2xl">
            <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-[-1px] rounded-full border border-dashed border-white/20"
            />
          </div>
        </motion.div>

        {/* Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3 sm:mb-4"
        >
          Scheduled{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
            Maintenance
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-gray-400 max-w-lg mb-8 sm:mb-10 leading-relaxed px-2"
        >
          We are upgrading our systems to bring you a faster, more robust
          experience. We will be back online shortly.
        </motion.p>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full mb-8 sm:mb-12"
        >
          {[
            { icon: Sparkles, title: "Enhancements", desc: "Deploying new features" },
            { icon: ShieldAlert, title: "Security", desc: "Upgrading core systems" },
            { icon: Clock, title: "Downtime", desc: "Expected < 15 mins" },
          ].map((item, idx) => (
            <div
              key={`item-${idx}`}
              className="flex flex-row sm:flex-col items-center sm:justify-center p-4 sm:p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-colors text-left sm:text-center"
            >
              <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 mr-4 sm:mr-0 sm:mb-3 flex-shrink-0" />
              <div className="flex-1 sm:flex-none">
                <h3 className="font-semibold text-white text-sm sm:text-base mb-0.5 sm:mb-1">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
