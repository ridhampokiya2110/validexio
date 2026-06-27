"use client";

import { useEffect, useRef } from "react";

export function ComparisonTracker({ competitorSlug }: { competitorSlug: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      
      const searchParams = new URLSearchParams(window.location.search);
      const url = `/api/compare/${competitorSlug}?${searchParams.toString()}`;
      
      // Fire and forget
      fetch(url).catch(console.error);
    }
  }, [competitorSlug]);

  return null;
}
