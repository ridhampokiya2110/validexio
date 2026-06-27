"use client";

import { useState, useEffect } from "react";

export type Currency = "USD" | "INR" | "EUR";

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    // 1. Instantly check timezone for India/Europe without network requests (Adblocker-proof)
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz === 'Asia/Calcutta' || tz === 'Asia/Kolkata') {
        setCurrency('INR');
        setIsLoaded(true);
        return; 
      } else if (tz.startsWith('Europe/')) {
        setCurrency('EUR');
        setIsLoaded(true);
        return; 
      }
    } catch (e) {}

    // 2. Fallback to IP detection if timezone isn't clear
    const fetchCurrency = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) {
           if (mounted) setIsLoaded(true);
           return;
        }
        const data = await res.json();
        if (data && data.currency && mounted) {
          if (data.currency === 'INR') {
            setCurrency('INR');
          } else if (data.currency === 'EUR') {
            setCurrency('EUR');
          } else {
            setCurrency('USD');
          }
        }
      } catch (err) {
        // Silently fallback to USD if fetch fails (e.g., adblocker)
      } finally {
        if (mounted) setIsLoaded(true);
      }
    };

    fetchCurrency();

    return () => {
      mounted = false;
    };
  }, []);

  return { currency, isLoaded };
}
