"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface CheckoutButtonProps {
  isCurrentPlan: boolean;
  tierName: string;
  isFeatured?: boolean;
}

export function CheckoutButton({ isCurrentPlan, tierName, isFeatured }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierName.toUpperCase() }),
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
      <button aria-label="Button action" type="button" disabled className="btn-secondary w-full justify-center text-sm py-2.5 opacity-50 cursor-not-allowed">
        Current Plan
      </button>
    );
  }

  return (
    <button aria-label="Button action" type="button"
      onClick={handleCheckout}
      disabled={loading}
      className={`w-full justify-center text-sm py-2.5 ${isFeatured ? "btn-primary" : "btn-secondary"}`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Upgrade to ${tierName}`}
    </button>
  );
}
