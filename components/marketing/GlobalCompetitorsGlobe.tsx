"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Globe as GlobeIcon } from "lucide-react";

// Simplified globe for desktop/tablet using pure canvas — matches the reference design:
// black ocean, solid green continents, red competitor markers, no cheap dots on mobile.
// Section is hidden entirely on screens < md (768px) via parent wrapper in page.tsx.

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

// ─── Continent scanline bands ─────────────────────────────────────────────────
// Each band: latitude + longitude ranges that are land.
// Step is 2° inside ranges for solid fill at any globe size.
const LAND_BANDS: { lat: number; r: [number, number][] }[] = [
  // Greenland
  { lat: 76, r: [[-55, -18]] },
  { lat: 72, r: [[-67, -18]] },
  { lat: 68, r: [[-55, -18]] },
  { lat: 64, r: [[-52, -18]] },
  // North America
  { lat: 60, r: [[-168, -52]] },
  { lat: 56, r: [[-168, -52]] },
  { lat: 52, r: [[-140, -52]] },
  { lat: 48, r: [[-126, -52]] },
  { lat: 44, r: [[-124, -64]] },
  { lat: 40, r: [[-124, -70]] },
  { lat: 36, r: [[-122, -76]] },
  { lat: 32, r: [[-118, -80]] },
  { lat: 28, r: [[-112, -80]] },
  { lat: 24, r: [[-110, -82]] },
  { lat: 20, r: [[-108, -84]] },
  { lat: 16, r: [[-92, -82]] },
  { lat: 12, r: [[-86, -83]] },
  // South America
  { lat: 10, r: [[-76, -60]] },
  { lat: 6, r: [[-80, -50]] },
  { lat: 2, r: [[-82, -48]] },
  { lat: -2, r: [[-82, -44]] },
  { lat: -6, r: [[-80, -42]] },
  { lat: -10, r: [[-78, -40]] },
  { lat: -14, r: [[-76, -40]] },
  { lat: -18, r: [[-76, -42]] },
  { lat: -22, r: [[-72, -42]] },
  { lat: -26, r: [[-72, -46]] },
  { lat: -30, r: [[-72, -50]] },
  { lat: -34, r: [[-72, -52]] },
  { lat: -38, r: [[-74, -58]] },
  { lat: -42, r: [[-76, -62]] },
  { lat: -46, r: [[-76, -66]] },
  { lat: -50, r: [[-76, -68]] },
  { lat: -54, r: [[-72, -66]] },
  // Iceland
  { lat: 64, r: [[-24, -13]] },
  { lat: 66, r: [[-24, -13]] },
  // Europe
  { lat: 72, r: [[14, 32]] },
  { lat: 68, r: [[14, 32]] },
  { lat: 64, r: [[14, 32]] },
  { lat: 60, r: [[-12, 32]] },
  { lat: 56, r: [[-10, 32]] },
  { lat: 52, r: [[-10, 36]] },
  { lat: 48, r: [[-6, 38]] },
  { lat: 44, r: [[-10, 45]] },
  { lat: 40, r: [[-10, 45]] },
  { lat: 36, r: [[-10, 38]] },
  // Africa
  { lat: 36, r: [[-6, 14]] },
  { lat: 32, r: [[-10, 36]] },
  { lat: 28, r: [[-16, 38]] },
  { lat: 24, r: [[-18, 42]] },
  { lat: 20, r: [[-18, 52]] },
  { lat: 16, r: [[-18, 52]] },
  { lat: 12, r: [[-18, 52]] },
  { lat: 8, r: [[-18, 46]] },
  { lat: 4, r: [[-8, 44]] },
  { lat: 0, r: [[8, 44]] },
  { lat: -4, r: [[10, 44]] },
  { lat: -8, r: [[10, 42]] },
  { lat: -12, r: [[12, 40]] },
  { lat: -16, r: [[12, 38]] },
  { lat: -20, r: [[12, 36]] },
  { lat: -24, r: [[14, 35]] },
  { lat: -28, r: [[16, 33]] },
  { lat: -32, r: [[16, 32]] },
  { lat: -36, r: [[18, 28]] },
  // Russia + Asia top
  { lat: 72, r: [[40, 180]] },
  { lat: 68, r: [[30, 180]] },
  { lat: 64, r: [[22, 180]] },
  { lat: 60, r: [[22, 180]] },
  { lat: 56, r: [[22, 180]] },
  { lat: 52, r: [[22, 180]] },
  // Asia Mid/South/SE
  { lat: 48, r: [[26, 180]] },
  { lat: 44, r: [[26, 78], [94, 180]] },
  { lat: 40, r: [[26, 72], [76, 180]] },
  { lat: 36, r: [[26, 72], [76, 180]] },
  { lat: 32, r: [[26, 62], [66, 180]] },
  { lat: 28, r: [[48, 68], [70, 102], [108, 122]] },
  { lat: 24, r: [[50, 68], [68, 90], [94, 106], [108, 122]] },
  { lat: 20, r: [[38, 68], [72, 90], [94, 102], [108, 122]] },
  { lat: 16, r: [[42, 55], [72, 88], [94, 102], [100, 110]] },
  { lat: 12, r: [[42, 52], [76, 82], [98, 108]] },
  { lat: 8, r: [[76, 82], [98, 106]] },
  { lat: 4, r: [[100, 106]] },
  { lat: 0, r: [[100, 112]] },
  { lat: -4, r: [[102, 118]] },
  { lat: -8, r: [[106, 122]] },
  // Japan
  { lat: 44, r: [[140, 146]] },
  { lat: 40, r: [[124, 132], [140, 146]] },
  { lat: 36, r: [[130, 134], [136, 142]] },
  { lat: 32, r: [[130, 132]] },
  // Australia
  { lat: -16, r: [[128, 142]] },
  { lat: -20, r: [[114, 150]] },
  { lat: -24, r: [[114, 152]] },
  { lat: -28, r: [[114, 152]] },
  { lat: -32, r: [[114, 152]] },
  { lat: -36, r: [[136, 152]] },
  { lat: -38, r: [[140, 150]] },
  // New Zealand
  { lat: -36, r: [[174, 178]] },
  { lat: -40, r: [[172, 178]] },
  { lat: -44, r: [[168, 172]] },
  { lat: -46, r: [[167, 170]] },
  // Madagascar
  { lat: -14, r: [[44, 50]] },
  { lat: -18, r: [[44, 48]] },
  { lat: -22, r: [[43, 48]] },
];

// Pre-compute all land points (2° longitude step for solid fill)
const LAND_PTS: [number, number][] = [];
for (const { lat, r } of LAND_BANDS) {
  for (const [lo, hi] of r) {
    for (let lng = lo; lng <= hi; lng += 2) {
      LAND_PTS.push([lat, lng]);
    }
  }
}

function project(lat: number, lng: number, cx: number, cy: number, rad: number, rot: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + rot) * Math.PI) / 180;
  const sp = Math.sin(phi);
  return {
    x: cx + rad * sp * Math.cos(theta),
    y: cy + rad * Math.cos(phi),
    z: rad * sp * Math.sin(theta), // >0 = front face
  };
}

export default function GlobalCompetitorsGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const rotRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cssSize, setCssSize] = useState(520);
  const [isClient, setIsClient] = useState(false);
  // JS-level mobile guard: prevents canvas from running at all on small screens
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const update = () => {
      const vw = window.innerWidth;
      // Completely skip globe on mobile (<768px) — no canvas, no arc, no errors
      setIsMobile(vw < 768);
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        // Guard: never set size to 0 (hidden element has offsetWidth=0)
        if (w > 10) setCssSize(Math.min(w, 560));
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    // Don't run any canvas code on mobile — prevents negative-radius crashes
    if (!isClient || isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // DPR: crisp on Retina / high-density screens
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = cssSize * dpr;
    canvas.height = cssSize * dpr;
    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";
    ctx.scale(dpr, dpr);

    const cx = cssSize / 2;
    const cy = cssSize / 2;
    const rad = cssSize * 0.43;

    // Guard: if somehow size is invalid, abort
    if (rad < 1) return;

    // Dot radius sized to fill 2° steps solidly at this globe size
    const dotR = Math.max(3, rad * 0.022);

    const draw = () => {
      ctx.clearRect(0, 0, cssSize, cssSize);

      // ── Ocean: black like the reference ──────────────────────────────────
      const safeRad = Math.max(0.01, rad); // clamp — always positive
      const ocean = ctx.createRadialGradient(cx - safeRad * 0.2, cy - safeRad * 0.25, safeRad * 0.05, cx, cy, safeRad);
      ocean.addColorStop(0, "#1a1a2e");
      ocean.addColorStop(0.65, "#0d0f18");
      ocean.addColorStop(1, "#060809");
      ctx.beginPath();
      ctx.arc(cx, cy, safeRad, 0, Math.PI * 2);
      ctx.fillStyle = ocean;
      ctx.fill();

      // ── Clip land + atmosphere to sphere ─────────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0.01, safeRad - 0.5), 0, Math.PI * 2);
      ctx.clip();

      // ── Solid continent dots ─────────────────────────────────────────────
      for (const [lat, lng] of LAND_PTS) {
        const p = project(lat, lng, cx, cy, rad, rotRef.current);
        if (p.z <= 0) continue;
        const ef = Math.min(1, p.z / (rad * 0.3));
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
        // Bright green matching reference (lime-300 / #86efac family)
        ctx.fillStyle = `rgba(134,239,172,${0.9 * ef})`;
        ctx.fill();
      }

      ctx.restore();

      // ── Atmosphere rim ────────────────────────────────────────────────────
      const atm = ctx.createRadialGradient(cx, cy, Math.max(0.01, safeRad * 0.9), cx, cy, safeRad * 1.12);
      atm.addColorStop(0, "rgba(56,189,248,0.0)");
      atm.addColorStop(0.5, "rgba(134,239,172,0.06)");
      atm.addColorStop(1, "rgba(56,189,248,0.0)");
      ctx.beginPath();
      ctx.arc(cx, cy, safeRad * 1.12, 0, Math.PI * 2);
      ctx.fillStyle = atm;
      ctx.fill();

      // ── Specular highlight ────────────────────────────────────────────────
      const shine = ctx.createRadialGradient(cx - safeRad * 0.38, cy - safeRad * 0.42, 0, cx, cy, safeRad);
      shine.addColorStop(0, "rgba(255,255,255,0.1)");
      shine.addColorStop(0.4, "rgba(255,255,255,0.0)");
      shine.addColorStop(1, "rgba(0,0,0,0.0)");
      ctx.beginPath();
      ctx.arc(cx, cy, safeRad, 0, Math.PI * 2);
      ctx.fillStyle = shine;
      ctx.fill();

      // Globe border
      ctx.beginPath();
      ctx.arc(cx, cy, safeRad, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(134,239,172,0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── Competitor markers ────────────────────────────────────────────────
      COMPETITORS.forEach((c) => {
        const p = project(c.lat, c.lng, cx, cy, safeRad, rotRef.current);
        if (p.z < 0) return;
        const ef = Math.max(0, Math.min(1, p.z / (safeRad * 0.4)));
        const mR = Math.max(0.01, safeRad * 0.03);

        // Outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, mR * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248,113,113,${0.12 * ef})`;
        ctx.fill();

        // Marker
        const mg = ctx.createRadialGradient(p.x - mR * 0.3, p.y - mR * 0.3, 0, p.x, p.y, mR);
        mg.addColorStop(0, `rgba(255,100,100,${ef})`);
        mg.addColorStop(1, `rgba(153,27,27,${ef})`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, mR, 0, Math.PI * 2);
        ctx.fillStyle = mg;
        ctx.fill();

        // White core
        ctx.beginPath();
        ctx.arc(p.x, p.y, mR * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${ef})`;
        ctx.fill();
      });

      rotRef.current += 0.12;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [isClient, cssSize]);

  // Return null on mobile — no canvas rendered at all
  if (!isClient || isMobile) return null;

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
            Our proprietary data engine scans and analyzes every global competitor instantly.
            We pinpoint exact geographic locations, unit economics, and tech stacks globally—no guessing, just raw, verified data.
          </p>
        </motion.div>

        {/* Globe — desktop/tablet only, hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "80px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative w-full flex justify-center items-center"
          ref={containerRef}
        >
          <canvas
            ref={canvasRef}
            style={{
              display: "block",
              maxWidth: "100%",
              width: cssSize,
              height: cssSize,
              borderRadius: "50%",
            }}
          />
        </motion.div>

      </div>
    </section>
  );
}
