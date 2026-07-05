"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Globe as GlobeIcon } from "lucide-react";
import { getMarkerHTML } from "./GlobeMarker";

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

export default function GlobalCompetitorsGlobe() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isClient, setIsClient] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  }, [isClient, countries]);

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
            <div className="badge badge-cherry flex items-center gap-1.5 whitespace-nowrap text-[10px] sm:text-xs mx-auto">
              <GlobeIcon className="w-3.5 h-3.5 shrink-0" /> <span>Real-Time Global Intelligence</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111827] mb-6 tracking-tight">
            Map The World&apos;s <br />
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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "100px" }}
          transition={{ duration: 0.8 }}
          className="relative w-full flex justify-center items-center"
        >
          <div className="relative cursor-grab active:cursor-grabbing">
            <Globe
              ref={globeRef}
              width={dimensions.width}
              height={dimensions.height}
              backgroundColor="rgba(255,255,255,0)"
              showAtmosphere={true}
              atmosphereColor="#52A5EF"
              atmosphereAltitude={0.1}
              
              // Vector Map Implementation via Polygons
              polygonsData={countries.features}
              polygonCapColor={() => '#BDE5A1'} // Soft vector green for land
              polygonSideColor={() => '#A8D389'}
              polygonStrokeColor={() => '#A1CB82'}
              polygonAltitude={0.005} // Very flat for a crisp map look

              htmlElementsData={COMPETITORS}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              htmlElement={(d: any) => {
                const el = document.createElement("div");
                el.insertAdjacentHTML('beforeend', getMarkerHTML(d));
                return el;
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
