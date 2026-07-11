"use client";

import { ShieldCheck } from "lucide-react";
import { FaStripe } from "react-icons/fa";
import { useCurrency } from "@/hooks/useCurrency";
import SvgRazorpay from "@/components/icons/Razorpay";
import SvgUpi from "@/components/icons/Upi";
import SvgPhonepe from "@/components/icons/Phonepe";
import SvgRupay from "@/components/icons/Rupay";

// Simple inline SVG payment icons — no external lib, works on all iOS Safari versions
function VisaIcon() {
  return (
    <svg width="44" height="28" viewBox="0 0 44 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
      <rect width="44" height="28" rx="4" fill="#1A1F71"/>
      <text x="22" y="20" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">VISA</text>
    </svg>
  );
}
function MastercardIcon() {
  return (
    <svg width="44" height="28" viewBox="0 0 44 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
      <rect width="44" height="28" rx="4" fill="#252525"/>
      <circle cx="16" cy="14" r="9" fill="#EB001B"/>
      <circle cx="28" cy="14" r="9" fill="#F79E1B"/>
      <path d="M22 7.5a9 9 0 0 1 0 13A9 9 0 0 1 22 7.5z" fill="#FF5F00"/>
    </svg>
  );
}
function ApplePayIcon() {
  return (
    <svg width="44" height="28" viewBox="0 0 44 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Apple Pay">
      <rect width="44" height="28" rx="4" fill="#000000"/>
      <text x="22" y="19" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="Arial"> Pay</text>
      <text x="14" y="19" textAnchor="middle" fill="white" fontSize="11" fontFamily="Arial">🍎</text>
    </svg>
  );
}
function GooglePayIcon() {
  return (
    <svg width="44" height="28" viewBox="0 0 44 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google Pay">
      <rect width="44" height="28" rx="4" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1"/>
      <text x="22" y="18" textAnchor="middle" fill="#3c4043" fontSize="8" fontWeight="bold" fontFamily="Arial">G Pay</text>
    </svg>
  );
}

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
      
      {/* Right Side: Payment Methods */}
      <div className="flex items-center gap-3.5">
        {isIndia ? (
          <>
            <SvgRupay style={{ width: 56, height: "auto" }} />
            <SvgPhonepe style={{ width: 68, height: "auto" }} />
            <SvgUpi style={{ width: 52, height: "auto" }} />
          </>
        ) : (
          <>
            <VisaIcon />
            <MastercardIcon />
            <ApplePayIcon />
            <GooglePayIcon />
          </>
        )}
      </div>
    </div>
  );
}
