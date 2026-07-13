"use client";

import { useState, useEffect } from "react";
import { Loader2, Ticket, CheckCircle2 } from "lucide-react";

export function GlobalPromoInput() {
  const [affiliateCode, setAffiliateCode] = useState("");
  const [isValidCode, setIsValidCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const hasRef = urlParams.get("ref") || urlParams.get("via") || urlParams.get("partner") || urlParams.get("aff");
      const initialCode = hasRef || sessionStorage.getItem("affiliate_code") || "";
      if (initialCode) {
        setAffiliateCode(initialCode);
        if (hasRef) sessionStorage.setItem("affiliate_code", hasRef);
      }
    } catch (err) {
      console.warn("sessionStorage is not available", err);
    }
  }, []);

  useEffect(() => {
    if (!affiliateCode) {
      setIsValidCode(false);
      window.dispatchEvent(new CustomEvent("promo_code_update", { detail: { code: "", isValid: false, discountPercentage: 0 } }));
      return;
    }
    const checkCode = async () => {
      setIsVerifying(true);
      try {
        const res = await fetch(`/api/v1/affiliate/verify?code=${encodeURIComponent(affiliateCode)}`);
        const data = await res.json();
        setIsValidCode(data.valid === true);
        window.dispatchEvent(new CustomEvent("promo_code_update", { detail: { code: affiliateCode, isValid: data.valid === true, discountPercentage: data.discountPercentage || 10 } }));
      } catch (e) {
        setIsValidCode(false);
        window.dispatchEvent(new CustomEvent("promo_code_update", { detail: { code: affiliateCode, isValid: false, discountPercentage: 0 } }));
      } finally {
        setIsVerifying(false);
      }
    };
    
    const timeout = setTimeout(checkCode, 600);
    return () => clearTimeout(timeout);
  }, [affiliateCode]);

  const handleCodeChange = (val: string) => {
    const upperVal = val.toUpperCase();
    setAffiliateCode(upperVal);
    try {
      if (typeof window !== "undefined") {
        if (upperVal) {
          sessionStorage.setItem("affiliate_code", upperVal);
        } else {
          sessionStorage.removeItem("affiliate_code");
        }
        // Dispatch custom event to notify checkout buttons
        window.dispatchEvent(new Event("affiliateCodeChanged"));
      }
    } catch (err) {
      console.warn("sessionStorage is not available", err);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 mb-8 max-w-lg mx-auto shadow-sm transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-rose-50 rounded-lg">
          <Ticket className="w-5 h-5 text-rose-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Have a Promo/Partner Code?</h3>
          <p className="text-sm text-gray-500">Apply a promo code to get a discount across all plans</p>
        </div>
      </div>
      <div className="relative group">
        <input 
          type="text" 
          placeholder="Enter Partner Code" 
          value={affiliateCode}
          onChange={(e) => handleCodeChange(e.target.value)}
          className={`w-full bg-gray-50 border ${isValidCode ? 'border-emerald-500/50 focus:border-emerald-500' : 'border-gray-200 focus:border-[#630102]'} text-gray-900 text-[16px] md:text-sm rounded-xl focus:ring-[#630102] block p-3.5 pr-24 uppercase font-bold tracking-widest transition-all`}
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          {isVerifying ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-200/50 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-wider">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verify
            </div>
          ) : isValidCode ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-3.5 h-3.5" /> Applied
            </div>
          ) : affiliateCode && !isVerifying && !isValidCode ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold uppercase tracking-wider animate-in fade-in zoom-in duration-300">
              Invalid
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
