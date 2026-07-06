"use client";

import { useState, useEffect } from "react";

export type Currency = "USD" | "INR" | "EUR";

export function useCurrency() {
  // Always default to USD to match Lemon Squeezy global checkout
  const [currency, setCurrency] = useState<Currency>("USD");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // We instantly set loaded to true since we no longer fetch IP data
    // This removes any pricing flashes on load and keeps pricing universally in USD
    setIsLoaded(true);
  }, []);

  return { currency, isLoaded };
}
