"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { currency: hookCurrency } = useCurrency();
  const currency = currencyOverride || hookCurrency;
  const [affiliateCode, setAffiliateCode] = useState<string>("");
  const [isValidCode, setIsValidCode] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      const savedCode = sessionStorage.getItem("affiliate_code");
      if (savedCode) {
        setAffiliateCode(savedCode);
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
      
      const currentCode = sessionStorage.getItem("affiliate_code");
      const activeCode = isValidCode ? affiliateCode : (currentCode || undefined);
      
      if (currency === "INR") {
        const res = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            tier: tierName.toUpperCase(),
            affiliateCode: activeCode
          }),
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || "Failed to create order");
        
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          alert("Payment gateway failed to load. Please check your connection.");
          setLoading(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: data.amount,
          currency: data.currency,
          name: "Validexio",
          description: `Upgrade to ${tierName}`,
          order_id: data.orderId,
          handler: async function (response: any) {
             try {
               await fetch("/api/razorpay/verify", {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({
                   razorpay_payment_id: response.razorpay_payment_id,
                   razorpay_order_id: response.razorpay_order_id,
                   razorpay_signature: response.razorpay_signature,
                   tier: tierName.toUpperCase(),
                   affiliateCode: activeCode
                 })
               });
             } catch (err) {
               console.error("Verification failed:", err);
             }
             setIsSuccess(true);
             setTimeout(() => {
               router.push("/dashboard/reports");
             }, 1500);
          },
          prefill: {
            name: "",
            email: "",
            contact: ""
          },
          theme: { color: "#630102" },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
           setLoading(false);
           alert(`Payment failed: ${response.error.description}`);
        });
        rzp.open();
        return;
      }

      let finalDiscountCode: string | undefined = undefined;
      const lsPromo = sessionStorage.getItem("ls_promo");
      if (lsPromo) {
        finalDiscountCode = lsPromo;
      } else if (isValidCode && affiliateCode) {
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
      console.error("Checkout Error:", error);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  // Removed the disabled 'Current Plan' button block because 
  // users need to be able to buy credits again even if they are on that tier.

  return (
    <div className="w-full space-y-4">
      <button 
        aria-label="Button action" 
        type="button"
        onClick={handleCheckout}
        disabled={loading || isSuccess}
        className={`w-full flex items-center justify-center text-sm py-3 font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98] rounded-xl ${
          isSuccess 
            ? "bg-emerald-500 text-white border-transparent" 
            : isFeatured 
              ? "bg-gradient-to-r from-[#630102] to-[#8C0203] hover:from-[#7f0103] hover:to-[#a10203] text-white border border-[#910505]" 
              : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
        }`}
      >
        {isSuccess ? (
          <>
            <svg className="w-5 h-5 mr-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Payment Successful!
          </>
        ) : loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <span className="flex flex-wrap items-center justify-center gap-1.5 text-center px-2">
            <span>{isCurrentPlan ? `Buy ${tierName} Again` : `Upgrade to ${tierName}`}</span>
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
