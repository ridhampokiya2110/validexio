"use client";

import { useState, useEffect } from "react";

interface PricingPriceLineProps {
  basePrice: string;
  period: string;
  featured?: boolean;
}

export function PricingPriceLine({ basePrice, period, featured }: PricingPriceLineProps) {
  const [isValidPromo, setIsValidPromo] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(10);

  useEffect(() => {
    // Check initial state from local storage or wait for event
    const handlePromo = (e: any) => {
      setIsValidPromo(e.detail.isValid);
      if (e.detail.discountPercentage !== undefined) {
        setDiscountPercentage(e.detail.discountPercentage);
      }
    };
    window.addEventListener("promo_code_update", handlePromo);
    
    // Fire a quick check in case component mounted after the event was fired
    const initialCode = localStorage.getItem("affiliate_code");
    if (initialCode) {
      // It's safer to just rely on the event from GlobalPromoInput 
      // which fires immediately on mount if there's a saved code.
    }

    return () => window.removeEventListener("promo_code_update", handlePromo);
  }, []);

  const getDiscountedPrice = (priceStr: string) => {
    if (priceStr.includes("0")) return priceStr;
    const match = priceStr.match(/^([^\d]+)?([\d,]+(\.\d+)?)([^\d]+)?$/);
    if (!match) return priceStr;

    const currencySymbol = match[1] || match[4] || "";
    const numStr = match[2].replace(/,/g, '');
    const num = parseFloat(numStr);
    if (isNaN(num)) return priceStr;

    const discount = num * (1 - (discountPercentage / 100));
    const rounded = Math.round(discount);
    return `${currencySymbol}${rounded.toLocaleString()}`;
  };

  const isFree = basePrice.includes("0");

  return (
    <div className="flex items-baseline gap-2 mt-4 transition-all duration-500">
      {isValidPromo && !isFree ? (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-400 line-through decoration-red-500/50 decoration-2">
            {basePrice}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-emerald-600 animate-in fade-in zoom-in">
              {getDiscountedPrice(basePrice)}
            </span>
            <span className="text-[#1B1716]/70 text-sm">/{period}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-black ${featured ? "text-[#1B1716]" : "text-[#1B1716]"}`}>
            {basePrice}
          </span>
          <span className="text-[#1B1716]/70 text-sm">/{period}</span>
        </div>
      )}
    </div>
  );
}
