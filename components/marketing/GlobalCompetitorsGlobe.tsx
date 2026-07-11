"use client";

import React from "react";
import { Globe as GlobeIcon, MapPin } from "lucide-react";

const COMPETITORS = [
  { name: "Acme Corp", location: "San Francisco", x: 12, y: 42, status: "Analyzed" },
  { name: "GlobalTech", location: "London", x: 46, y: 28, status: "Analyzed" },
  { name: "VentureXYZ", location: "New Delhi", x: 66, y: 38, status: "Analyzed" },
  { name: "FinEdge India", location: "Mumbai", x: 64, y: 44, status: "Analyzed" },
  { name: "TechBengaluru", location: "Bangalore", x: 65, y: 48, status: "Analyzed" },
  { name: "Startio", location: "São Paulo", x: 30, y: 68, status: "Analyzed" },
  { name: "Nippon AI", location: "Tokyo", x: 82, y: 36, status: "Analyzed" },
  { name: "Aussie AI", location: "Sydney", x: 83, y: 72, status: "Analyzed" },
  { name: "Paris Labs", location: "Paris", x: 48, y: 30, status: "Analyzed" },
];

export default function GlobalCompetitorsGlobe() {
  return (
    <section className="relative w-full pt-32 pb-12 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="badge badge-cherry flex items-center gap-1.5 whitespace-nowrap text-[10px] sm:text-xs mx-auto">
              <GlobeIcon className="w-3.5 h-3.5 shrink-0" />
              <span>Real-Time Global Intelligence</span>
            </div>
          </div>
          <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-black text-[#111827] mb-6 tracking-tight mx-auto">
            Map The World&apos;s <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#630102] to-red-600">
              Hidden Competitors
            </span>
          </h2>
          <p className="text-center text-[#6B7280] text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Our proprietary data engine scans and analyzes every global competitor instantly. We pinpoint exact geographic locations, unit economics, and tech stacks globally—no guessing, just raw, verified data.
          </p>
        </div>

        {/* World Map Container */}
        <div className="relative w-full max-w-5xl mx-auto">
          {/* Map background */}
          <div className="relative w-full rounded-3xl overflow-hidden border border-[#1B1716]/8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] bg-gradient-to-b from-[#EEF6FF] to-[#DBEEFF]">
            {/* SVG World Map */}
            <svg
              viewBox="0 0 100 60"
              className="w-full h-auto"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Ocean background */}
              <rect width="100" height="60" fill="#DBEEFF" />

              {/* Simplified continent paths */}
              {/* North America */}
              <path d="M5,10 L22,8 L26,14 L24,22 L20,28 L15,30 L10,26 L6,20 Z" fill="#BDE5A1" stroke="#A8D389" strokeWidth="0.3" />
              {/* South America */}
              <path d="M22,32 L30,30 L34,38 L32,52 L26,56 L20,50 L18,42 Z" fill="#BDE5A1" stroke="#A8D389" strokeWidth="0.3" />
              {/* Europe */}
              <path d="M44,10 L54,8 L56,14 L52,20 L46,22 L42,18 Z" fill="#BDE5A1" stroke="#A8D389" strokeWidth="0.3" />
              {/* Africa */}
              <path d="M46,24 L56,22 L58,30 L56,44 L50,50 L44,46 L42,36 L44,26 Z" fill="#BDE5A1" stroke="#A8D389" strokeWidth="0.3" />
              {/* Asia */}
              <path d="M56,8 L86,6 L90,14 L88,24 L80,28 L70,30 L60,26 L56,20 L54,12 Z" fill="#BDE5A1" stroke="#A8D389" strokeWidth="0.3" />
              {/* Australia */}
              <path d="M78,46 L88,44 L90,52 L86,56 L78,56 L74,52 Z" fill="#BDE5A1" stroke="#A8D389" strokeWidth="0.3" />

              {/* Grid lines */}
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((x) => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="60" stroke="#52A5EF" strokeWidth="0.08" opacity="0.4" />
              ))}
              {[0, 10, 20, 30, 40, 50, 60].map((y) => (
                <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#52A5EF" strokeWidth="0.08" opacity="0.4" />
              ))}

              {/* Competitor pins */}
              {COMPETITORS.map((comp, i) => (
                <g key={comp.name}>
                  {/* Pulse ring */}
                  <circle
                    cx={comp.x}
                    cy={comp.y}
                    r="1.8"
                    fill="none"
                    stroke="#630102"
                    strokeWidth="0.3"
                    opacity="0.3"
                  />
                  {/* Pin dot */}
                  <circle
                    cx={comp.x}
                    cy={comp.y}
                    r="0.9"
                    fill="#630102"
                    opacity="0.85"
                  />
                </g>
              ))}
            </svg>

            {/* Gradient overlay on bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
          </div>

          {/* Floating competitor cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {COMPETITORS.slice(0, 5).map((comp) => (
              <div
                key={comp.name}
                className="bg-white/90 backdrop-blur-sm border border-[#1B1716]/8 rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-6 h-6 rounded-full bg-cherry/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3 h-3 text-cherry" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#1B1716] truncate">{comp.name}</p>
                  <p className="text-[9px] text-[#1B1716]/50 truncate">{comp.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
