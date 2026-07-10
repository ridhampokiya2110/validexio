"use client";

import { useEffect } from "react";

export function PwaRegistry() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const handleLoad = () => {
        try {
          navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
              console.log("Service Worker registered with scope:", registration.scope);
            })
            .catch((error) => {
              console.error("Service Worker registration failed:", error);
            });
        } catch (error) {
          console.error("Service Worker access denied:", error);
        }
      };
      
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return null;
}
