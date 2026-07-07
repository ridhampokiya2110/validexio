"use client";

import { useState, useEffect } from "react";

export type Currency = "USD" | "INR" | "EUR";

export function useCurrency() {
  // Always default to USD to match Lemon Squeezy global checkout
  const [currency, setCurrency] = useState<Currency>("USD");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data.country_code === 'IN') {
            setCurrency("INR");
          } else if (['AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES'].includes(data.country_code)) {
            setCurrency("EUR");
          }
        }
      } catch (err) {
        // Silently fail and fallback to USD
      } finally {
        setIsLoaded(true);
      }
    };
    fetchCurrency();
  }, []);

  return { currency, isLoaded };
}
