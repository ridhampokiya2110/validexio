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

// ─── Scanline land bands: { lat → [lngMin, lngMax][] } ─────────────────────
// Each entry covers a 4-degree latitude strip.
// We step every 4° of longitude inside each range to paint solid continents.
const LAND_BANDS: { lat: number; ranges: [number, number][] }[] = [
  // ── Greenland ──────────────────────────────────────────────────────────────
  { lat: 76, ranges: [[-55, -18]] },
  { lat: 72, ranges: [[-66, -18]] },
  { lat: 68, ranges: [[-55, -18], [-166, -60]] },
  { lat: 64, ranges: [[-50, -18], [-170, -52]] },

  // ── North America ──────────────────────────────────────────────────────────
  { lat: 60, ranges: [[-170, -54]] },
  { lat: 56, ranges: [[-170, -54]] },
  { lat: 52, ranges: [[-140, -54]] },
  { lat: 48, ranges: [[-128, -54]] },
  { lat: 44, ranges: [[-126, -66]] },
  { lat: 40, ranges: [[-124, -72]] },
  { lat: 36, ranges: [[-122, -76]] },
  { lat: 32, ranges: [[-118, -80]] },
  { lat: 28, ranges: [[-110, -80]] },
  { lat: 24, ranges: [[-110, -82]] },
  { lat: 20, ranges: [[-108, -84]] },
  { lat: 16, ranges: [[-92, -82]] },
  { lat: 12, ranges: [[-86, -83]] },

  // ── South America ─────────────────────────────────────────────────────────
  { lat: 10, ranges: [[-76, -60]] },
  { lat: 6, ranges: [[-80, -50]] },
  { lat: 2, ranges: [[-82, -48]] },
  { lat: -2, ranges: [[-82, -44]] },
  { lat: -6, ranges: [[-80, -42]] },
  { lat: -10, ranges: [[-78, -40]] },
  { lat: -14, ranges: [[-76, -40]] },
  { lat: -18, ranges: [[-76, -42]] },
  { lat: -22, ranges: [[-72, -42]] },
  { lat: -26, ranges: [[-72, -46]] },
  { lat: -30, ranges: [[-72, -50]] },
  { lat: -34, ranges: [[-72, -52]] },
  { lat: -38, ranges: [[-74, -58]] },
  { lat: -42, ranges: [[-76, -62]] },
  { lat: -46, ranges: [[-76, -66]] },
  { lat: -50, ranges: [[-76, -68]] },
  { lat: -54, ranges: [[-72, -66]] },

  // ── Iceland ───────────────────────────────────────────────────────────────
  { lat: 64, ranges: [[-24, -13]] },
  { lat: 66, ranges: [[-24, -13]] },

  // ── Europe ────────────────────────────────────────────────────────────────
  { lat: 72, ranges: [[14, 32]] },
  { lat: 68, ranges: [[14, 32]] },
  { lat: 64, ranges: [[14, 32]] },
  { lat: 60, ranges: [[-12, 32]] },
  { lat: 56, ranges: [[-10, 32]] },
  { lat: 52, ranges: [[-10, 36]] },
  { lat: 48, ranges: [[-6, 38]] },
  { lat: 44, ranges: [[-10, 45]] },
  { lat: 40, ranges: [[-10, 45]] },
  { lat: 36, ranges: [[-10, 38]] },

  // ── Africa ────────────────────────────────────────────────────────────────
  { lat: 36, ranges: [[-6, 14]] },
  { lat: 32, ranges: [[-10, 36]] },
  { lat: 28, ranges: [[-16, 38]] },
  { lat: 24, ranges: [[-18, 42]] },
  { lat: 20, ranges: [[-18, 52]] },
  { lat: 16, ranges: [[-18, 52]] },
  { lat: 12, ranges: [[-18, 52]] },
  { lat: 8, ranges: [[-18, 46]] },
  { lat: 4, ranges: [[-8, 44]] },
  { lat: 0, ranges: [[8, 44]] },
  { lat: -4, ranges: [[10, 44]] },
  { lat: -8, ranges: [[10, 42]] },
  { lat: -12, ranges: [[12, 40]] },
  { lat: -16, ranges: [[12, 38]] },
  { lat: -20, ranges: [[12, 36]] },
  { lat: -24, ranges: [[14, 35]] },
  { lat: -28, ranges: [[16, 33]] },
  { lat: -32, ranges: [[16, 32]] },
  { lat: -36, ranges: [[18, 28]] },

  // ── Asia (Russia) ─────────────────────────────────────────────────────────
  { lat: 72, ranges: [[40, 180]] },
  { lat: 68, ranges: [[30, 180]] },
  { lat: 64, ranges: [[22, 180]] },
  { lat: 60, ranges: [[22, 180]] },
  { lat: 56, ranges: [[22, 180]] },
  { lat: 52, ranges: [[22, 180]] },

  // ── Asia (Middle East + South + Southeast) ────────────────────────────────
  { lat: 48, ranges: [[26, 180]] },
  { lat: 44, ranges: [[26, 78], [94, 180]] },
  { lat: 40, ranges: [[26, 72], [76, 180]] },
  { lat: 36, ranges: [[26, 72], [76, 180]] },
  { lat: 32, ranges: [[26, 62], [66, 180]] },
  { lat: 28, ranges: [[48, 68], [70, 102], [108, 122]] },
  { lat: 24, ranges: [[50, 68], [68, 90], [94, 106], [108, 122]] },
  { lat: 20, ranges: [[38, 68], [72, 90], [94, 102], [108, 122]] },
  { lat: 16, ranges: [[42, 55], [72, 88], [94, 102], [100, 110]] },
  { lat: 12, ranges: [[42, 52], [76, 82], [98, 108]] },
  { lat: 8, ranges: [[76, 82], [98, 106]] },
  { lat: 4, ranges: [[100, 106]] },
  { lat: 0, ranges: [[100, 112]] },
  { lat: -4, ranges: [[102, 118]] },
  { lat: -8, ranges: [[106, 122]] },

  // ── Japan ─────────────────────────────────────────────────────────────────
  { lat: 44, ranges: [[140, 146]] },
  { lat: 40, ranges: [[124, 132], [140, 146]] },
  { lat: 36, ranges: [[130, 134], [136, 142]] },
  { lat: 32, ranges: [[130, 132]] },

  // ── Australia ─────────────────────────────────────────────────────────────
  { lat: -16, ranges: [[128, 142]] },
  { lat: -20, ranges: [[114, 150]] },
  { lat: -24, ranges: [[114, 152]] },
  { lat: -28, ranges: [[114, 152]] },
  { lat: -32, ranges: [[114, 152]] },
  { lat: -36, ranges: [[136, 152]] },
  { lat: -38, ranges: [[140, 150]] },

  // ── New Zealand ───────────────────────────────────────────────────────────
  { lat: -36, ranges: [[174, 178]] },
  { lat: -40, ranges: [[172, 178]] },
  { lat: -44, ranges: [[168, 172]] },
  { lat: -46, ranges: [[167, 170]] },

  // ── Madagascar ────────────────────────────────────────────────────────────
  { lat: -14, ranges: [[44, 50]] },
  { lat: -18, ranges: [[44, 48]] },
  { lat: -22, ranges: [[43, 48]] },
  { lat: -24, ranges: [[43, 47]] },
];

// Precompute all land points from scanline bands (every 4° longitude step)
const LAND_POINTS: [number, number][] = [];
for (const band of LAND_BANDS) {
  for (const [lMin, lMax] of band.ranges) {
    for (let lng = lMin; lng <= lMax; lng += 4) {
      LAND_POINTS.push([band.lat, lng]);
    }
  }
}

// ─── Projection helpers ────────────────────────────────────────────────────
function project(
  lat: number,
  lng: number,
  cx: number,
  cy: number,
  r: number,
  rotDeg: number
) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + rotDeg) * Math.PI) / 180;
  const sinPhi = Math.sin(phi);
  return {
    x: cx + r * sinPhi * Math.cos(theta),
    y: cy + r * Math.cos(phi),
    z: r * sinPhi * Math.sin(theta), // positive = front face
  };
}

// Cross-browser safe rounded rect (Android Chrome < 105 has no ctx.roundRect)
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rad: number
) {
  const rr = Math.min(rad, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  ctx.lineTo(x + rr, y + h);
  ctx.arcTo(x, y + h, x, y + h - rr, rr);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function GlobalCompetitorsGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const rotationRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cssSize, setCssSize] = useState(500);

  // Responsive sizing
  useEffect(() => {
    setIsClient(true);
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setCssSize(Math.min(w, 560));
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Canvas draw loop
  useEffect(() => {
    if (!isClient) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Critical: Device Pixel Ratio fix (makes canvas crisp on Android/Retina) ──
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const phys = cssSize * dpr; // physical pixel size
    canvas.width = phys;
    canvas.height = phys;
    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";
    ctx.scale(dpr, dpr); // now all coordinates are in CSS pixels

    const cx = cssSize / 2;
    const cy = cssSize / 2;
    const r = cssSize * 0.42;

    // Dot radius: large enough that 4° steps fill solid at all zoom levels
    const dotR = Math.max(3.5, r * 0.028);

    const draw = () => {
      ctx.clearRect(0, 0, cssSize, cssSize);

      // ── Ocean: deep black (matches reference) ──
      const ocean = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.25, r * 0.05, cx, cy, r);
      ocean.addColorStop(0, "#1a1a2e");
      ocean.addColorStop(0.6, "#0d1117");
      ocean.addColorStop(1, "#080b10");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = ocean;
      ctx.fill();

      // ── Clip all land/grid to sphere ──
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r - 0.5, 0, Math.PI * 2);
      ctx.clip();

      // ── Land dots: bright green, scanline-filled ──
      for (const [lat, lng] of LAND_POINTS) {
        const p = project(lat, lng, cx, cy, r, rotationRef.current);
        if (p.z <= 0) continue; // back-face cull

        // Edge softening: full opacity until z drops near horizon
        const edgeFade = Math.min(1, p.z / (r * 0.25));

        ctx.beginPath();
        ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(134,239,172,${0.88 * edgeFade})`; // tailwind green-300
        ctx.fill();
      }

      ctx.restore(); // end clip

      // ── Atmosphere rim (subtle blue glow around edge) ──
      const atm = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.14);
      atm.addColorStop(0, "rgba(56,189,248,0.0)");
      atm.addColorStop(0.5, "rgba(56,189,248,0.08)");
      atm.addColorStop(1, "rgba(56,189,248,0.0)");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.14, 0, Math.PI * 2);
      ctx.fillStyle = atm;
      ctx.fill();

      // ── Specular highlight (top-left) ──
      const shine = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.42, 0, cx, cy, r);
      shine.addColorStop(0, "rgba(255,255,255,0.12)");
      shine.addColorStop(0.4, "rgba(255,255,255,0.0)");
      shine.addColorStop(1, "rgba(0,0,0,0.0)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = shine;
      ctx.fill();

      // Globe border
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(134,239,172,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── Competitor markers ──
      COMPETITORS.forEach((comp, i) => {
        const p = project(comp.lat, comp.lng, cx, cy, r, rotationRef.current);
        if (p.z < 0) return;

        const ef = Math.max(0, Math.min(1, p.z / (r * 0.45)));
        const isActive = activeIndex === i;
        const mR = r * 0.028;

        // Outer pulse ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, mR * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248,113,113,${0.15 * ef})`;
        ctx.fill();

        // Marker body
        const markerGrad = ctx.createRadialGradient(p.x - mR * 0.3, p.y - mR * 0.3, 0, p.x, p.y, mR);
        markerGrad.addColorStop(0, `rgba(255,100,100,${ef})`);
        markerGrad.addColorStop(1, `rgba(153,27,27,${ef})`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, mR, 0, Math.PI * 2);
        ctx.fillStyle = markerGrad;
        ctx.fill();

        // White core
        ctx.beginPath();
        ctx.arc(p.x, p.y, mR * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${ef})`;
        ctx.fill();

        // Tooltip label on hover/touch
        if (isActive && ef > 0.45) {
          const label = comp.name;
          const fSize = Math.round(cssSize * 0.025);
          ctx.font = `bold ${fSize}px Inter,system-ui,sans-serif`;
          const lw = ctx.measureText(label).width;
          const pad = 8;
          const lx = p.x + mR + 8;
          const ly = p.y - fSize * 0.35;
          const boxW = lw + pad * 2;
          const boxH = fSize + pad * 1.8;

          // pill background
          roundRect(ctx, lx, ly - fSize, boxW, boxH, 6);
          ctx.fillStyle = `rgba(17,24,39,${0.92 * ef})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(134,239,172,${0.4 * ef})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = `rgba(255,255,255,${ef})`;
          ctx.fillText(label, lx + pad, ly);

          const subSize = Math.round(fSize * 0.78);
          ctx.font = `${subSize}px Inter,system-ui,sans-serif`;
          ctx.fillStyle = `rgba(134,239,172,${0.85 * ef})`;
          ctx.fillText(comp.location, lx + pad, ly + fSize * 0.9);
        }
      });

      rotationRef.current += 0.15;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isClient, cssSize, activeIndex]);

  if (!isClient) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: 500 }}>
        <div className="text-gray-400 font-medium">Initializing Global Intelligence...</div>
      </div>
    );
  }

  return (
    <section className="relative w-full pt-32 pb-12 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">

        {/* Section header */}
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

        {/* Globe */}
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
            // width/height set dynamically in useEffect (DPR-aware)
            style={{
              display: "block",
              maxWidth: "100%",
              width: cssSize,
              height: cssSize,
              borderRadius: "50%",
            }}
          />
        </motion.div>

        {/* Competitor cards */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {COMPETITORS.map((comp, i) => (
            <motion.div
              key={comp.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              onTouchStart={() => setActiveIndex(i)}
              onTouchEnd={() => setTimeout(() => setActiveIndex(null), 1800)}
              className="flex items-center gap-2 bg-white/80 border border-[#E5E7EB] rounded-xl px-3 py-2 shadow-sm cursor-pointer hover:border-[#630102]/30 hover:shadow-md transition-all duration-200"
            >
              <div className="w-2 h-2 rounded-full bg-[#630102] shadow-[0_0_6px_rgba(99,1,2,0.6)] shrink-0" />
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
