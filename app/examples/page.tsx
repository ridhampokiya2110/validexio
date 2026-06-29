"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Activity, TrendingUp, Layers, Code, Zap } from "lucide-react";

const examples = [
  {
    slug: "heeratrack",
    name: "Heeratrack",
    tagline: "B2B Diamond Logistics & Reconciliation",
    tam: "INR 18,000Cr",
    score: 92,
    icon: <Layers className="w-6 h-6" />
  },
  {
    slug: "laminar-clone",
    name: "Laminar Clone",
    tagline: "Data Engine Dev Tool Observability Pipeline",
    tam: "INR 4,500Cr",
    score: 88,
    icon: <Activity className="w-6 h-6" />
  },
  {
    slug: "cleanops-ai",
    name: "CleanOps Data Engine",
    tagline: "Micro-SaaS Fleet Management",
    tam: "INR 2,200Cr",
    score: 95,
    icon: <Zap className="w-6 h-6" />
  },
  {
    slug: "openfx",
    name: "OpenFX",
    tagline: "Fintech Cross-Border Settlement Rails",
    tam: "INR 45,000Cr",
    score: 82,
    icon: <TrendingUp className="w-6 h-6" />
  },
  {
    slug: "nicheledger",
    name: "NicheLedger",
    tagline: "Productized Data Engine Bookkeeping for Agencies",
    tam: "INR 1,200Cr",
    score: 89,
    icon: <Code className="w-6 h-6" />
  }
];

// Circular Score Meter Component
function RigorScore({ score }: { score: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      {/* Background Circle */}
      <svg className="absolute w-full h-full transform -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="4"
        />
        {/* Animated Foreground Circle */}
        <motion.circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#630102"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <span className="font-black text-[#111827] text-sm">{score}</span>
    </div>
  );
}

export default function ExamplesGallery() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 font-sans bg-[#FDFDFD] text-[#111827] selection:bg-[#630102]/10 selection:text-[#630102]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-[#630102] bg-[#630102]/5 px-3 py-1 rounded-full mb-4 inline-block border border-[#630102]/10">
            Premium Execution Vault
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-[#111827]">
            The Live Asset Gallery
          </h1>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            Stop reading theory. Explore 5 production-ready validation blueprints containing complete AWS architectures, Postgres schemas, and B2B lead lists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((ex, idx) => (
            <motion.div
              key={ex.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-8 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-12 h-12 bg-[#FDFDFD] border border-[#E5E7EB] rounded-xl flex items-center justify-center text-[#630102]">
                  {ex.icon}
                </div>
                <div className="flex flex-col items-center">
                  <RigorScore score={ex.score} />
                  <span className="text-[10px] uppercase tracking-widest text-[#6B7280] mt-1 font-bold">Rigor</span>
                </div>
              </div>

              <div className="relative z-10 flex-grow">
                <h2 className="text-2xl font-black text-[#111827] mb-2">{ex.name}</h2>
                <p className="text-[#6B7280] text-sm mb-6 h-10">{ex.tagline}</p>

                <div className="bg-[#FDFDFD] rounded-lg p-4 mb-8 border border-[#E5E7EB]">
                  <p className="text-xs uppercase tracking-widest text-[#6B7280] font-bold mb-1">Target Market Scale</p>
                  <p className="text-[#630102] font-bold text-lg">{ex.tam}</p>
                </div>
              </div>

              <Link
                href={`/examples/${ex.slug}`}
                className="w-full relative z-10 bg-[#111827] border border-[#111827] hover:bg-[#630102] hover:border-[#630102] text-[#FFFFFF] font-bold py-4 rounded-xl flex items-center justify-center transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Explore Asset Pack <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
