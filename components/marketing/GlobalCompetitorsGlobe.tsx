"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Globe as GlobeIcon } from "lucide-react";

const COMPETITORS = [
  { lat: 37.7749, lng: -122.4194, name: "Acme Corp", location: "San Francisco" },
  { lat: 51.5074, lng: -0.1278, name: "GlobalTech", location: "London" },
  { lat: 28.6139, lng: 77.209, name: "VentureXYZ", location: "New Delhi" },
  { lat: 19.076, lng: 72.8777, name: "FinEdge India", location: "Mumbai" },
  { lat: 12.9716, lng: 77.5946, name: "TechBengaluru", location: "Bangalore" },
  { lat: -23.5505, lng: -46.6333, name: "Startio", location: "São Paulo" },
  { lat: 35.6762, lng: 139.6503, name: "Nippon Innovate", location: "Tokyo" },
  { lat: -33.8688, lng: 151.2093, name: "Aussie AI", location: "Sydney" },
  { lat: 48.8566, lng: 2.3522, name: "Paris Labs", location: "Paris" },
];

// Convert lat/lng to 3D sphere projection coordinates for a canvas-based globe
function latLngToXY(
  lat: number,
  lng: number,
  cx: number,
  cy: number,
  r: number,
  rotationDeg: number
) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + rotationDeg) * Math.PI) / 180;
  const x = cx + r * Math.sin(phi) * Math.cos(theta);
  const y = cy + r * Math.cos(phi);
  const z = r * Math.sin(phi) * Math.sin(theta); // z for visibility check
  return { x, y, z };
}

export default function GlobalCompetitorsGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const rotationRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(560);

  useEffect(() => {
    setIsClient(true);
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setSize(Math.min(w, 600));
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.42;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // Globe background — beautiful deep ocean gradient
      const oceanGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.05, cx, cy, r);
      oceanGrad.addColorStop(0, "#6BB8F5");
      oceanGrad.addColorStop(0.5, "#4A9FE0");
      oceanGrad.addColorStop(1, "#2B6CB0");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = oceanGrad;
      ctx.fill();

      // Atmosphere glow
      const atmGrad = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.15);
      atmGrad.addColorStop(0, "rgba(82,165,239,0.0)");
      atmGrad.addColorStop(0.5, "rgba(82,165,239,0.12)");
      atmGrad.addColorStop(1, "rgba(82,165,239,0.0)");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
      ctx.fillStyle = atmGrad;
      ctx.fill();

      // Grid lines (latitude lines)
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 0.7;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        for (let lng = -180; lng <= 180; lng += 2) {
          const p = latLngToXY(lat, lng, cx, cy, r, rotationRef.current);
          if (p.z > 0) {
            lng === -180 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Grid lines (longitude lines)
      for (let lng = 0; lng < 360; lng += 30) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 2) {
          const p = latLngToXY(lat, lng, cx, cy, r, rotationRef.current);
          if (p.z > 0) {
            lat === -90 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Globe edge highlight
      const edgeGrad = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.4, 0, cx, cy, r);
      edgeGrad.addColorStop(0, "rgba(255,255,255,0.18)");
      edgeGrad.addColorStop(0.6, "rgba(255,255,255,0.0)");
      edgeGrad.addColorStop(1, "rgba(0,0,0,0.25)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = edgeGrad;
      ctx.fill();

      // Globe border
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw competitor markers
      COMPETITORS.forEach((comp, i) => {
        const p = latLngToXY(comp.lat, comp.lng, cx, cy, r, rotationRef.current);
        if (p.z < 0) return; // Hidden on back of globe

        // Visibility fade at edges
        const edgeFactor = Math.max(0, Math.min(1, p.z / (r * 0.5)));

        const isActive = activeIndex === i;
        const pulseR = 7 + (isActive ? 3 : 0);

        // Outer pulse ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseR + 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,1,2,${0.15 * edgeFactor})`;
        ctx.fill();

        // Inner dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,1,2,${0.85 * edgeFactor})`;
        ctx.fill();

        // White core
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${edgeFactor})`;
        ctx.fill();

        // Label for active/nearby
        if (isActive && edgeFactor > 0.5) {
          ctx.font = "bold 11px Inter, sans-serif";
          ctx.fillStyle = `rgba(17,24,39,${edgeFactor})`;
          const label = comp.name;
          const labelW = ctx.measureText(label).width;
          const lx = p.x + 14;
          const ly = p.y - 6;

          // Label background
          ctx.fillStyle = `rgba(255,255,255,${0.92 * edgeFactor})`;
          ctx.beginPath();
          ctx.roundRect(lx - 4, ly - 12, labelW + 8, 18, 4);
          ctx.fill();

          ctx.fillStyle = `rgba(17,24,39,${edgeFactor})`;
          ctx.fillText(label, lx, ly);

          ctx.font = "10px Inter, sans-serif";
          ctx.fillStyle = `rgba(107,114,128,${edgeFactor})`;
          ctx.fillText(comp.location, lx, ly + 13);
        }
      });

      rotationRef.current += 0.18;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isClient, size, activeIndex]);

  if (!isClient) {
    return (
      <div className="w-full h-[560px] flex items-center justify-center">
        <div className="text-gray-400 font-medium">Initializing Global Intelligence...</div>
      </div>
    );
  }

  return (
    <section className="relative w-full pt-32 pb-12 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
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
        </motion.div>

        {/* Globe Canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "100px" }}
          transition={{ duration: 0.8 }}
          className="relative w-full flex justify-center items-center"
          ref={containerRef}
        >
          <div className="relative cursor-grab active:cursor-grabbing">
            <canvas
              ref={canvasRef}
              width={size}
              height={size}
              style={{ borderRadius: "50%", display: "block" }}
            />
          </div>
        </motion.div>

        {/* Competitor Cards */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {COMPETITORS.map((comp, i) => (
            <motion.div
              key={comp.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              className="flex items-center gap-2 bg-white/80 border border-[#E5E7EB] rounded-xl px-3 py-2 shadow-sm cursor-pointer hover:border-[#630102]/30 hover:shadow-md transition-all duration-200"
            >
              <div className="w-2 h-2 rounded-full bg-[#630102] shadow-[0_0_6px_rgba(99,1,2,0.6)]" />
              <div>
                <p className="text-xs font-bold text-[#111827]">{comp.name}</p>
                <p className="text-[10px] text-[#6B7280]">{comp.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
