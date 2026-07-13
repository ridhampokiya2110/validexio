"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

interface CheckoutButtonProps {
  isCurrentPlan: boolean;
  tierName: string;
  isFeatured?: boolean;
  currencyOverride?: string;
  basePrice?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CheckoutButton({ isCurrentPlan, tierName, isFeatured, currencyOverride, basePrice }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { currency: hookCurrency } = useCurrency();
  const currency = currencyOverride || hookCurrency;
  const [affiliateCode, setAffiliateCode] = useState<string>("");
  const [isValidCode, setIsValidCode] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [isVerifying, setIsVerifying] = useState(false);

  // Compute discounted price if basePrice is passed
  let originalValue = 0;
  let currencySymbol = "";
  let isFree = false;

  if (basePrice) {
    const match = basePrice.match(/^([^\d]+)?([\d,]+(\.\d+)?)([^\d]+)?$/);
    if (match) {
      currencySymbol = match[1] || match[4] || "";
      const numStr = match[2].replace(/,/g, '');
      originalValue = parseFloat(numStr);
      if (originalValue === 0) isFree = true;
    }
  }

  const discountedValue = isFree ? 0 : originalValue * (1 - (discountPercentage / 100));
  const showDiscount = isValidCode && originalValue > 0 && discountPercentage > 0;

  useEffect(() => {
    try {
      // Initial check from session storage in case the event fired before we mounted
      const savedCode = sessionStorage.getItem("affiliate_code");
      if (savedCode) {
        setAffiliateCode(savedCode);
        // We assume it's valid if they got to checkout, but we'll re-verify if needed, 
        // or we can wait for the event. Actually, we can just fire the verification again
        // or better: let the GlobalPromoInput handle the verification and broadcast the event.
      }
    } catch (err) {
      console.warn("sessionStorage is not available", err);
    }

    const handlePromo = (e: any) => {
      setAffiliateCode(e.detail.code);
      setIsValidCode(e.detail.isValid);
      if (e.detail.discountPercentage !== undefined) {
        setDiscountPercentage(e.detail.discountPercentage);
      }
    };

    window.addEventListener("promo_code_update", handlePromo);
    return () => window.removeEventListener("promo_code_update", handlePromo);
  }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      // Razorpay Flow for INR
      if (currency === "INR") {
        const res = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            tier: tierName.toUpperCase(),
            affiliateCode: isValidCode ? affiliateCode : undefined
          }),
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || "Failed to create order");
        
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          alert("Payment gateway failed to load. Please check your connection.");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: data.amount,
          currency: data.currency,
          name: "Validexio",
          description: `Upgrade to ${tierName}`,
          order_id: data.orderId,
          handler: function (response: any) {
             window.location.href = `/dashboard/billing?success=true`;
          },
          prefill: {
            name: "",
            email: "",
            contact: ""
          },
          theme: {
            color: "#FF5C35"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
           alert("Payment failed: " + response.error.description);
        });
        rzp.open();
        return;
      }

      // Lemon Squeezy Flow for non-INR
      let finalDiscountCode: string | undefined = undefined;
      
      const lsPromo = sessionStorage.getItem("ls_promo");
      if (lsPromo) {
        finalDiscountCode = lsPromo;
      } else if (isValidCode && affiliateCode) {
        // Fallback just in case, though this is mostly for Indian UI
        finalDiscountCode = affiliateCode;
      }

      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tier: tierName.toUpperCase(),
          discountCode: finalDiscountCode
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create checkout");
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (isCurrentPlan) {
    return (
      <button aria-label="Button action" type="button" disabled className="btn-secondary w-full justify-center text-sm py-2.5 opacity-50 cursor-not-allowed rounded-xl">
        Current Plan
      </button>
    );
  }

  return (
    <div className="space-y-4 mt-auto">
      <button aria-label="Button action" type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full flex items-center justify-center text-sm py-3 font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98] rounded-xl ${isFeatured ? "bg-gradient-to-r from-[#630102] to-[#8C0203] hover:from-[#7f0103] hover:to-[#a10203] text-white border border-[#910505]" : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"}`}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <span className="flex flex-wrap items-center justify-center gap-1.5 text-center px-2">
            <span>Upgrade to {tierName}</span>
            {showDiscount && (
              <span className={`whitespace-nowrap font-bold ${isFeatured ? "text-emerald-300" : "text-emerald-600"}`}>
                (-{discountPercentage}%)
              </span>
            )}
          </span>
        )}
      </button>
    </div>
  );
}
