"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Globe as GlobeIcon } from "lucide-react";

// Dynamically import the Globe to prevent SSR issues
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const COMPETITORS = [
  { lat: 37.7749, lng: -122.4194, name: "Acme Corp", location: "San Francisco", avatar: "/competitors/1.png", status: "Analyzed" },
  { lat: 51.5074, lng: -0.1278, name: "GlobalTech", location: "London", avatar: "/competitors/2.png", status: "Analyzed" },
  { lat: 28.6139, lng: 77.2090, name: "VentureXYZ", location: "New Delhi", avatar: "/competitors/9.png", status: "Analyzed" },
  { lat: 19.0760, lng: 72.8777, name: "FinEdge India", location: "Mumbai", avatar: "/competitors/4.png", status: "Analyzed" },
  { lat: 12.9716, lng: 77.5946, name: "TechBengaluru", location: "Bangalore", avatar: "/competitors/5.png", status: "Analyzed" },
  { lat: -23.5505, lng: -46.6333, name: "Startio", location: "São Paulo", avatar: "/competitors/6.png", status: "Analyzed" },
  { lat: 35.6762, lng: 139.6503, name: "Nippon Innovate", location: "Tokyo", avatar: "/competitors/7.png", status: "Analyzed" },
  { lat: -33.8688, lng: 151.2093, name: "Aussie AI", location: "Sydney", avatar: "/competitors/8.png", status: "Analyzed" },
  { lat: 48.8566, lng: 2.3522, name: "Paris Labs", location: "Paris", avatar: "/competitors/3.png", status: "Analyzed" },
];

const MAP_LABELS = [
  { lat: 39.8283, lng: -98.5795, name: "United States", size: 1.5, type: 'country', color: '#1B1716' },
  { lat: 56.1304, lng: -106.3468, name: "Canada", size: 1.2, type: 'country', color: '#1B1716' },
  { lat: 71.7069, lng: -42.6043, name: "Greenland", size: 1.0, type: 'country', color: '#1B1716' },
  { lat: 46.2276, lng: 2.2137, name: "France", size: 1.2, type: 'country', color: '#1B1716' },
  { lat: 40.4637, lng: -3.7492, name: "Spain", size: 1.2, type: 'country', color: '#1B1716' },
  { lat: 41.8719, lng: 12.5674, name: "Italy", size: 1.2, type: 'country', color: '#1B1716' },
  { lat: 20.5937, lng: 78.9629, name: "India", size: 1.5, type: 'country', color: '#1B1716' },
  { lat: -25.2744, lng: 133.7751, name: "Australia", size: 1.5, type: 'country', color: '#1B1716' },
  { lat: -14.2350, lng: -51.9253, name: "Brazil", size: 1.5, type: 'country', color: '#1B1716' },
  { lat: 60.4720, lng: 8.4689, name: "Norway", size: 1.0, type: 'country', color: '#1B1716' },
  { lat: 64.9631, lng: -19.0208, name: "Iceland", size: 1.0, type: 'country', color: '#1B1716' },
  { lat: 34.0479, lng: 100.6197, name: "China", size: 1.5, type: 'country', color: '#1B1716' },
  { lat: -30.5595, lng: 22.9375, name: "South Africa", size: 1.2, type: 'country', color: '#1B1716' },
  { lat: 36.2048, lng: 138.2529, name: "Japan", size: 1.2, type: 'country', color: '#1B1716' },
  { lat: 55.3781, lng: -3.4360, name: "United Kingdom", size: 1.2, type: 'country', color: '#1B1716' },
  { lat: 35.8617, lng: 104.1954, name: "ASIA", size: 2.0, type: 'continent', color: '#778899' },
  { lat: 45.0, lng: -100.0, name: "NORTH AMERICA", size: 2.0, type: 'continent', color: '#778899' },
  { lat: 48.0, lng: 15.0, name: "EUROPE", size: 2.0, type: 'continent', color: '#778899' },
  { lat: 25.0, lng: -40.0, name: "North Atlantic Ocean", size: 1.8, type: 'ocean', color: '#ffffff' },
];

export default function GlobalCompetitorsGlobe() {
  const globeRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isClient, setIsClient] = useState(false);
  const [countries, setCountries] = useState<any>({ features: [] });

  useEffect(() => {
    setIsClient(true);
    
    let lastWidth = window.innerWidth;
    
    const updateDimensions = () => {
      const currentWidth = window.innerWidth;
      // Only resize if the width actually changed (prevents iOS address bar scroll glitches)
      if (Math.abs(currentWidth - lastWidth) > 10 || lastWidth === currentWidth) {
        lastWidth = currentWidth;
        setDimensions({
          width: Math.min(currentWidth - 32, 1000),
          height: currentWidth < 768 ? 400 : 600,
        });
      }
    };

    // Initial setup
    updateDimensions();
    
    // Debounce the resize event to prevent performance issues
    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDimensions, 150);
    };

    window.addEventListener("resize", handleResize);

    // Fetch the GeoJSON for the premium vector map look
    fetch('/countries.geojson')
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(err => console.error("Could not load map data", err));

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 1.2;
      globeRef.current.controls().minDistance = 150;
      globeRef.current.controls().maxDistance = 400;
      globeRef.current.controls().enableZoom = false;
      
      // Force premium light blue water background on the globe sphere
      if (globeRef.current.globeMaterial) {
          const material = globeRef.current.globeMaterial();
          if (material && material.color) {
            material.color.set('#52A5EF'); // Beautiful vector water blue
          }
      }
    }
  }, [isClient, globeRef.current, countries]);

  if (!isClient) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-transparent rounded-[3rem] animate-pulse">
        <div className="text-gray-400 font-medium">Initializing Global Intelligence...</div>
      </div>
    );
  }

  return (
    <section className="relative w-full pt-32 pb-12 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="badge badge-cherry inline-flex text-[10px] sm:text-xs">
              <GlobeIcon className="w-3.5 h-3.5" /> Real-Time Global Intelligence
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111827] mb-6 tracking-tight">
            Map The World's <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#630102] to-red-600">
              Hidden Competitors
            </span>
          </h2>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Our proprietary data engine scans and analyzes every global competitor instantly. We pinpoint exact geographic locations, unit economics, and tech stacks globally—no guessing, just raw, verified data.
          </p>
        </motion.div>

        {/* Globe Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full flex justify-center items-center"
        >
          <div className="relative cursor-grab active:cursor-grabbing">
            <Globe
              ref={globeRef}
              width={dimensions.width}
              height={dimensions.height}
              backgroundColor="rgba(255,255,255,0)"
              globeImageUrl="/water.png"
              showAtmosphere={true}
              atmosphereColor="#52A5EF"
              atmosphereAltitude={0.1}
              
              // Vector Map Implementation via Polygons
              polygonsData={countries.features}
              polygonCapColor={() => '#BDE5A1'} // Soft vector green for land
              polygonSideColor={() => '#A8D389'}
              polygonStrokeColor={() => '#A1CB82'}
              polygonAltitude={0.005} // Very flat for a crisp map look

              // Bespoke HTML Markers
              htmlElementsData={COMPETITORS}
              htmlElement={(d: any) => {
                const el = document.createElement("div");
                el.innerHTML = `
                  <div class="relative group cursor-pointer -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    
                    <!-- Expanding Ripple Rings for Premium Visual -->
                    <div class="absolute inset-0 rounded-full border border-red-600/40 scale-[1.6] animate-[ping_3s_infinite_ease-out]"></div>
                    <div class="absolute inset-0 rounded-full border border-red-500/20 scale-[2.2] animate-[ping_3s_infinite_ease-out_1s]"></div>
                    <div class="absolute inset-0 rounded-full bg-red-600/10 scale-[1.3]"></div>
                    
                    <!-- Sticker Profile Base -->
                    <div class="relative w-12 h-12 md:w-16 md:h-16 bg-white rounded-full p-[3px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] ring-1 ring-black/5 z-20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
                      <div class="w-full h-full rounded-full overflow-hidden border border-gray-100 bg-[#FDFCF8]">
                        <img src="${d.avatar}" class="w-full h-full object-cover scale-[1.1] translate-y-1" alt="Competitor" />
                      </div>
                    </div>

                    <!-- Sleek Tooltip -->
                    <div class="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 w-48 translate-y-2 group-hover:translate-y-0">
                      <div class="bg-white/95 backdrop-blur-xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-gray-100/50 rounded-2xl p-3 flex flex-col items-center text-center">
                        <span class="text-sm font-bold text-gray-900 leading-tight">${d.name}</span>
                        <span class="text-[11px] font-medium text-gray-500 mb-2 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          ${d.location}
                        </span>
                        <div class="w-full h-[1px] bg-gray-100 mb-2"></div>
                        <span class="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-2 2.5h3L11 22l2-2.5h-3L13 2z"/></svg>
                          ${d.status}
                        </span>
                      </div>
                    </div>
                  </div>
                `;
                return el;
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
