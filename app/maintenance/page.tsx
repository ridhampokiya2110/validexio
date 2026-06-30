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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-600/30 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-600/20 blur-[150px] rounded-full mix-blend-screen" />
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
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse" />
          <div className="w-24 h-24 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center relative shadow-2xl">
            <Wrench className="w-10 h-10 text-red-500" />
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
          className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4"
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
          className="text-lg md:text-xl text-gray-400 max-w-lg mb-10 leading-relaxed"
        >
          We are upgrading our systems to bring you a faster, more robust
          experience. We will be back online shortly.
        </motion.p>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-12"
        >
          {[
            { icon: Sparkles, title: "Enhancements", desc: "Deploying new features" },
            { icon: ShieldAlert, title: "Security", desc: "Upgrading core systems" },
            { icon: Clock, title: "Downtime", desc: "Expected < 15 mins" },
          ].map((item, idx) => (
            <div
              key={`item-${idx}`}
              className="flex flex-col items-center p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-colors"
            >
              <item.icon className="w-6 h-6 text-orange-400 mb-3" />
              <h3 className="font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
