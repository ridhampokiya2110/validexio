"use client";

import { ShieldCheck } from "lucide-react";
import { FaStripe } from "react-icons/fa";
import { Visa, Mastercard, Applepay, Googlepay } from "react-pay-icons";
import { useCurrency } from "@/hooks/useCurrency";
import SvgRazorpay from "@/components/icons/Razorpay";
import SvgUpi from "@/components/icons/Upi";
import SvgPhonepe from "@/components/icons/Phonepe";
import SvgRupay from "@/components/icons/Rupay";

export function SecureCheckoutBadge() {
  const { currency } = useCurrency();
  const isIndia = currency === "INR";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 py-3.5 px-8 bg-white/80 backdrop-blur-xl border border-[#1B1716]/5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-white/60 w-full max-w-fit mx-auto my-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-500">
      {/* Left Side: Stripe/Razorpay & Secure Checkout */}
      <div className="flex items-center gap-3">
        {isIndia ? (
          <SvgRazorpay style={{ width: 100, height: "auto" }} className="-my-1" />
        ) : (
          <FaStripe className="text-[3rem] text-[#635BFF] -my-2" />
        )}
        <div className="flex items-center gap-2">
          <div className="bg-[#00D26A]/10 p-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-[#00D26A]" strokeWidth={2.5} />
          </div>
          <span className="text-[#1B1716] font-black text-xs tracking-[0.15em] uppercase mt-0.5">
            Secure Checkout
          </span>
        </div>
      </div>
      
      {/* Divider */}
      <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-[#1B1716]/10 to-transparent"></div>
      
      {/* Right Side: Payment Methods (Real Colored Logos via inline SVG) */}
      <div className="flex items-center gap-3.5">
        {isIndia ? (
          <>
            <SvgRupay style={{ width: 56, height: "auto" }} />
            <Visa style={{ width: 44 }} />
            <SvgPhonepe style={{ width: 68, height: "auto" }} />
            <SvgUpi style={{ width: 52, height: "auto" }} />
          </>
        ) : (
          <>
            <Visa style={{ width: 44 }} />
            <Mastercard style={{ width: 44 }} />
            <Applepay style={{ width: 44 }} />
            <Googlepay style={{ width: 44 }} />
          </>
        )}
      </div>
    </div>
  );
}
