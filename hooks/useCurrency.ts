"use client";

import { useState, useEffect } from "react";

export type Currency = "USD" | "INR" | "EUR";

export function useCurrency() {
  // Always default to USD to match Lemon Squeezy global checkout
  const [currency, setCurrency] = useState<Currency>("USD");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchCurrency = async () => {
      const applyCountry = (countryCode: string) => {
        if (countryCode === 'IN') {
          setCurrency("INR");
        } else if (['AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES'].includes(countryCode)) {
          setCurrency("EUR");
        }
        setIsLoaded(true);
      };

      // 1. Try ipapi.co (reliable HTTPS)
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data.country_code) {
            applyCountry(data.country_code);
            return;
          }
        }
      } catch (err) {
        // Ignore and try fallback
      }

      // 2. Try api.country.is
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

      // 3. Try ipwho.is
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

      // 4. Bulletproof fallback using Timezone & Currency formatting
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localeCurrency = new Intl.NumberFormat().resolvedOptions().currency;
        if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta' || localeCurrency === 'INR') {
          setCurrency("INR");
        } else if (tz.startsWith('Europe/') || localeCurrency === 'EUR') {
          setCurrency("EUR");
        }
      } catch (err) {
        // Ignore
      } finally {
        setIsLoaded(true);
      }
    };

    fetchCurrency();
  }, []);

  return { currency, isLoaded };
}
