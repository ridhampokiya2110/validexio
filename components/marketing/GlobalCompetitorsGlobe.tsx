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

// Dot-matrix land masses — sampled lat/lng points that are on land
// This gives a realistic Earth silhouette without any GeoJSON dependency
const LAND_DOTS: [number, number][] = [
  // North America
  [70,-140],[70,-120],[70,-100],[70,-80],[65,-140],[65,-130],[65,-120],[65,-110],[65,-100],[65,-90],[65,-80],
  [60,-140],[60,-130],[60,-120],[60,-110],[60,-100],[60,-90],[60,-80],[60,-70],[60,-65],
  [55,-130],[55,-120],[55,-110],[55,-100],[55,-90],[55,-80],[55,-70],[55,-65],[55,-60],
  [50,-130],[50,-120],[50,-110],[50,-100],[50,-90],[50,-80],[50,-70],[50,-65],[50,-60],
  [45,-124],[45,-115],[45,-105],[45,-95],[45,-85],[45,-75],[45,-70],[45,-65],
  [40,-122],[40,-115],[40,-105],[40,-95],[40,-90],[40,-80],[40,-75],[40,-73],
  [35,-120],[35,-110],[35,-100],[35,-90],[35,-85],[35,-80],[35,-78],
  [30,-118],[30,-105],[30,-95],[30,-90],[30,-85],[30,-82],
  [25,-110],[25,-100],[25,-95],[25,-90],[25,-85],[25,-80],
  [20,-105],[20,-100],[20,-90],[20,-85],[20,-78],
  [17,-92],[17,-88],[15,-90],[15,-85],[12,-85],[12,-83],[10,-84],[10,-83],
  // Greenland
  [76,-68],[76,-50],[76,-35],[72,-60],[72,-45],[72,-35],[68,-50],[68,-40],[68,-28],[65,-42],[65,-38],
  // South America
  [10,-75],[10,-68],[10,-62],[8,-73],[8,-62],[5,-77],[5,-67],[5,-60],[5,-52],
  [0,-78],[0,-68],[0,-60],[0,-52],[0,-50],
  [-5,-80],[- 5,-70],[- 5,-60],[- 5,-50],[- 5,-42],
  [-10,-75],[- 10,-65],[- 10,-55],[- 10,-48],[- 10,-42],
  [-15,-75],[- 15,-65],[- 15,-55],[- 15,-48],
  [-20,-68],[- 20,-60],[- 20,-50],[- 20,-45],
  [-25,-65],[- 25,-58],[- 25,-50],[- 25,-48],
  [-30,-68],[- 30,-62],[- 30,-55],[- 30,-52],
  [-35,-70],[- 35,-65],[- 35,-60],[- 35,-58],
  [-40,-73],[- 40,-68],[- 40,-65],[- 40,-62],
  [-45,-73],[- 45,-68],[- 45,-65],
  [-50,-75],[- 50,-70],[- 50,-68],
  [-55,-68],[- 55,-65],
  // Europe
  [70,28],[70,20],[68,18],[68,28],[68,20],[65,14],[65,18],[65,25],[65,28],[62,5],[62,10],[62,15],[62,25],[62,28],
  [60,5],[60,10],[60,18],[60,25],[60,28],[58,5],[58,10],[58,15],[58,18],[58,22],[58,28],
  [55,5],[55,10],[55,15],[55,18],[55,22],[55,28],[55,35],
  [52,0],[52,5],[52,10],[52,15],[52,18],[52,22],[52,28],[52,35],
  [50,-5],[50,0],[50,5],[50,10],[50,15],[50,18],[50,22],[50,28],
  [48,-5],[48,0],[48,5],[48,10],[48,15],[48,18],[48,22],
  [45,-2],[45,0],[45,5],[45,10],[45,15],[45,18],[45,22],[45,28],
  [42,-8],[42,-5],[42,0],[42,5],[42,10],[42,12],[42,15],[42,18],[42,22],[42,28],
  [40,-8],[40,-5],[40,0],[40,5],[40,15],[40,18],[40,22],[40,28],
  [38,-8],[38,-5],[38,0],[38,5],[38,12],[38,15],[38,22],[38,28],
  [36,-5],[36,0],[36,5],[36,10],[36,14],[36,28],
  // Russia / Asia top
  [70,60],[70,80],[70,100],[70,120],[70,140],[68,40],[68,60],[68,80],[68,100],[68,120],[68,140],
  [65,40],[65,60],[65,80],[65,100],[65,120],[65,140],[65,160],
  [60,40],[60,60],[60,80],[60,100],[60,120],[60,140],[60,160],
  [55,40],[55,60],[55,80],[55,100],[55,110],[55,120],[55,130],[55,140],
  [50,40],[50,60],[50,70],[50,80],[50,90],[50,100],[50,120],[50,130],[50,140],
  [45,40],[45,50],[45,60],[45,70],[45,80],[45,90],[45,100],[45,120],[45,130],[45,135],
  // Middle East
  [40,36],[40,40],[38,36],[38,40],[38,45],[36,36],[36,40],[36,45],[36,50],
  [35,36],[35,38],[35,42],[35,45],[35,50],[35,55],[35,60],
  [30,30],[30,35],[30,40],[30,45],[30,50],[30,55],[30,60],[30,65],
  [25,50],[25,55],[25,60],[25,65],[22,40],[22,45],[22,55],[22,60],
  // South / East Asia
  [40,120],[40,125],[38,115],[38,120],[38,125],[35,105],[35,110],[35,115],[35,120],[35,125],[35,130],
  [32,105],[32,110],[32,115],[32,120],[30,105],[30,110],[30,115],[30,120],
  [28,84],[28,88],[28,92],[28,96],[25,80],[25,85],[25,90],[25,95],[25,98],[25,105],[25,110],[25,115],[25,120],
  [22,90],[22,95],[22,100],[22,105],[22,110],[22,113],[20,73],[20,78],[20,85],[20,90],[20,95],[20,100],[20,105],
  [15,74],[15,78],[15,80],[15,98],[15,100],[15,105],[12,75],[12,78],[12,80],[12,98],[12,100],[12,102],[12,105],
  [10,77],[10,78],[10,80],[10,98],[10,100],[10,102],[8,77],[8,78],[8,80],
  [5,100],[5,102],[5,103],[2,103],[2,105],[0,100],[0,103],[0,105],[0,110],
  [-2,100],[- 2,105],[- 2,110],[- 5,105],[- 5,110],[- 5,115],[- 8,115],[- 8,120],
  // Africa
  [36,10],[36,8],[34,8],[34,10],[34,6],[32,20],[32,25],[32,30],[30,18],[30,25],[30,30],
  [25,25],[25,30],[25,35],[22,15],[22,20],[22,25],[22,30],[22,35],[22,40],
  [18,15],[18,20],[18,25],[18,30],[18,35],[15,15],[15,20],[15,25],[15,30],[15,38],
  [10,10],[10,15],[10,20],[10,25],[10,30],[10,35],[10,40],[10,42],
  [5,5],[5,10],[5,15],[5,20],[5,25],[5,30],[5,38],[5,42],
  [0,10],[0,15],[0,20],[0,25],[0,28],[0,32],[0,38],[0,42],
  [-5,12],[- 5,18],[- 5,22],[- 5,28],[- 5,32],[- 5,38],[- 5,42],
  [-10,15],[- 10,20],[- 10,25],[- 10,30],[- 10,32],[- 10,36],[- 10,40],
  [-15,15],[- 15,20],[- 15,25],[- 15,28],[- 15,32],[- 15,36],
  [-20,20],[- 20,25],[- 20,30],[- 20,34],
  [-25,25],[- 25,28],[- 25,30],[- 25,32],
  [-30,27],[- 30,30],[- 30,25],[- 30,22],
  [-34,18],[- 34,22],[- 34,26],
  // Australia
  [-15,130],[- 15,133],[- 15,136],
  [-20,118],[- 20,122],[- 20,126],[- 20,130],[- 20,134],[- 20,138],[- 20,142],[- 20,145],
  [-25,114],[- 25,118],[- 25,122],[- 25,126],[- 25,130],[- 25,134],[- 25,138],[- 25,142],[- 25,148],
  [-30,115],[- 30,118],[- 30,122],[- 30,126],[- 30,130],[- 30,134],[- 30,138],[- 30,142],[- 30,148],[- 30,151],
  [-34,115],[- 34,118],[- 34,122],[- 34,126],[- 34,138],[- 34,142],[- 34,146],[- 34,150],
  [-38,142],[- 38,145],[- 38,148],[- 38,145],
  // New Zealand
  [-38,175],[- 38,178],[- 42,172],[- 42,174],[- 45,168],[- 45,170],
  // Japan
  [44,142],[42,140],[42,143],[40,140],[38,140],[36,136],[36,138],[34,133],[34,136],[32,130],[32,131],
  // UK / Ireland
  [58,-5],[56,-3],[56,-5],[54,-5],[54,-2],[52,-4],[52,-2],[50,-5],[50,-3],
  [53,-10],[53,-7],[52,-9],[52,-7],[51,-10],
  // Madagascar
  [-13,49],[- 16,46],[- 19,44],[- 22,44],[- 25,46],
];

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
  const z = r * Math.sin(phi) * Math.sin(theta);
  return { x, y, z };
}

// Safe rounded rect — fallback for Android Chrome < 105
function safeRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, radius);
  } else {
    // Manual rounded rect path
    const r2 = Math.min(radius, w / 2, h / 2);
    ctx.moveTo(x + r2, y);
    ctx.lineTo(x + w - r2, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r2);
    ctx.lineTo(x + w, y + h - r2);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r2, y + h);
    ctx.lineTo(x + r2, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r2);
    ctx.lineTo(x, y + r2);
    ctx.quadraticCurveTo(x, y, x + r2, y);
    ctx.closePath();
  }
}

export default function GlobalCompetitorsGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const rotationRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(480);

  useEffect(() => {
    setIsClient(true);
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setSize(Math.min(w, 560));
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

      // --- Ocean gradient ---
      const oceanGrad = ctx.createRadialGradient(
        cx - r * 0.3, cy - r * 0.3, r * 0.05,
        cx, cy, r
      );
      oceanGrad.addColorStop(0, "#5BA8E8");
      oceanGrad.addColorStop(0.55, "#3A8FD4");
      oceanGrad.addColorStop(1, "#1A5FA0");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = oceanGrad;
      ctx.fill();

      // Clip all drawing to the sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      // --- Grid lines (latitude) ---
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 0.8;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let first = true;
        for (let lng = -180; lng <= 180; lng += 3) {
          const p = latLngToXY(lat, lng, cx, cy, r, rotationRef.current);
          if (p.z > 0) {
            if (first) { ctx.moveTo(p.x, p.y); first = false; }
            else ctx.lineTo(p.x, p.y);
          } else { first = true; }
        }
        ctx.stroke();
      }

      // --- Grid lines (longitude) ---
      for (let lng = 0; lng < 360; lng += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -90; lat <= 90; lat += 3) {
          const p = latLngToXY(lat, lng, cx, cy, r, rotationRef.current);
          if (p.z > 0) {
            if (first) { ctx.moveTo(p.x, p.y); first = false; }
            else ctx.lineTo(p.x, p.y);
          } else { first = true; }
        }
        ctx.stroke();
      }

      // --- Land dot matrix ---
      const dotSize = Math.max(2.5, r * 0.018);
      for (const [lat, lng] of LAND_DOTS) {
        const p = latLngToXY(lat, lng, cx, cy, r, rotationRef.current);
        if (p.z <= 0) continue; // Back of globe
        const edge = Math.max(0, Math.min(1, p.z / (r * 0.4)));
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(72,160,72,${0.72 * edge})`; // Land green
        ctx.fill();
      }

      ctx.restore(); // End clip

      // --- Atmosphere glow ---
      const atmGrad = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.12);
      atmGrad.addColorStop(0, "rgba(82,165,239,0.0)");
      atmGrad.addColorStop(0.5, "rgba(82,165,239,0.1)");
      atmGrad.addColorStop(1, "rgba(82,165,239,0.0)");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
      ctx.fillStyle = atmGrad;
      ctx.fill();

      // --- Specular highlight (top-left shine) ---
      const shine = ctx.createRadialGradient(cx - r * 0.38, cy - r * 0.38, 0, cx, cy, r);
      shine.addColorStop(0, "rgba(255,255,255,0.22)");
      shine.addColorStop(0.45, "rgba(255,255,255,0.0)");
      shine.addColorStop(1, "rgba(0,0,0,0.18)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = shine;
      ctx.fill();

      // Globe border
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // --- Competitor markers ---
      COMPETITORS.forEach((comp, i) => {
        const p = latLngToXY(comp.lat, comp.lng, cx, cy, r, rotationRef.current);
        if (p.z < 0) return;

        const edgeFactor = Math.max(0, Math.min(1, p.z / (r * 0.5)));
        const isActive = activeIndex === i;
        const pulseR = 6 + (isActive ? 4 : 0);

        // Outer glow ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseR + 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,1,2,${0.13 * edgeFactor})`;
        ctx.fill();

        // Marker body
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,1,2,${0.88 * edgeFactor})`;
        ctx.fill();

        // White core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${edgeFactor})`;
        ctx.fill();

        // Tooltip label when hovered
        if (isActive && edgeFactor > 0.5) {
          const label = comp.name;
          ctx.font = `bold ${Math.round(size * 0.022)}px Inter,sans-serif`;
          const lw = ctx.measureText(label).width;
          const lx = p.x + 14;
          const ly = p.y - 4;

          // Label pill background — cross-browser safe rounded rect
          ctx.beginPath();
          safeRoundRect(ctx, lx - 5, ly - 14, lw + 14, 22, 5);
          ctx.fillStyle = `rgba(255,255,255,${0.93 * edgeFactor})`;
          ctx.fill();

          ctx.fillStyle = `rgba(17,24,39,${edgeFactor})`;
          ctx.fillText(label, lx + 2, ly);

          ctx.font = `${Math.round(size * 0.019)}px Inter,sans-serif`;
          ctx.fillStyle = `rgba(107,114,128,${edgeFactor})`;
          ctx.fillText(comp.location, lx + 2, ly + 14);
        }
      });

      rotationRef.current += 0.16;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isClient, size, activeIndex]);

  if (!isClient) {
    return (
      <div className="w-full h-[480px] flex items-center justify-center">
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
              style={{ borderRadius: "50%", display: "block", maxWidth: "100%" }}
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
              onTouchStart={() => setActiveIndex(i)}
              onTouchEnd={() => setTimeout(() => setActiveIndex(null), 1500)}
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
