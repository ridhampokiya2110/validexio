"use client";

import { useState, useEffect } from "react";

export type Currency = "USD" | "INR" | "EUR";

export function useCurrency() {
  // Always default to USD to match Lemon Squeezy global checkout
  const [currency, setCurrency] = useState<Currency>("USD");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchCurrency = async () => {
      // 1. Try api.country.is
      try {
        const res = await fetch('https://api.country.is/');
        if (res.ok) {
          const data = await res.json();
          if (data.country) {
            applyCountry(data.country);
            return;
          }
        }
      } catch (err) {
        // Ignore and try fallback
      }

      // 2. Try ipwho.is
      try {
        const res = await fetch('https://ipwho.is/');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.country_code) {
            applyCountry(data.country_code);
            return;
          }
        }
      } catch (err) {
        // Ignore and try fallback
      }

      // 3. Bulletproof fallback using Timezone
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') {
          setCurrency("INR");
        } else if (tz.startsWith('Europe/')) {
          setCurrency("EUR");
        }
      } catch (err) {
        // Ignore
      } finally {
        setIsLoaded(true);
      }
    };

    const applyCountry = (countryCode: string) => {
      if (countryCode === 'IN') {
        setCurrency("INR");
      } else if (['AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES'].includes(countryCode)) {
        setCurrency("EUR");
      }
      // If it's another country, it stays USD
      setIsLoaded(true);
    };

    fetchCurrency();
  }, []);

  return { currency, isLoaded };
}
