"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCurrency } from "@/hooks/useCurrency";
import { CheckCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { GlobalPromoInput } from "@/components/dashboard/GlobalPromoInput";
import { PricingPriceLine } from "@/components/dashboard/PricingPriceLine";

const fullPlans = [
  {
    name: "Free",
    prices: { USD: "$0", INR: "₹0", EUR: "€0" },
    period: "forever",
    description: "Executive Validation Snapshot",
    features: [
      "Executive Validation Scorecard",
      "High-Level Strategic SWOT Analysis",
      "Launch Platforms (Locked)",
      "MVP Prioritization (Locked)",
      "Compliance Risk Check (Locked)",
      "Competitor Intelligence (Locked)",
      "Precision B2B Target Leads (Locked)",
      "High-Fidelity Data Engine UI Mockups (Locked)",
      "Advanced Financial Forecasting (Locked)",
      "Instantaneous Report Delivery"
    ],
    href: "/register",
    tierKey: "FREE",
    featured: false,
  },
  {
    name: "Starter",
    prices: { USD: "$19", INR: "₹499", EUR: "€19" },
    period: "per validation",
    description: "For solo indie hackers testing waters",
    features: [
      "1 Standard Execution Credit",
      "Basic Validation Score & Analysis",
      "Launch Platforms Strategy",
      "MVP Prioritization Matrix",
      "Compliance Risk Assessment",
      "Up to 3 Direct Competitors Analyzed",
      "Text-Only UI Components (No raw code)",
      "Standard Unit Economics Breakdown",
      "Customer Personas (Locked)",
      "Investor Simulator (1 Persona, 5 QA Rounds)",
      "Standard processing time (24h)",
      "7-Day access to the report"
    ],
    href: "/register?plan=starter",
    tierKey: "STARTER",
    featured: false,
  },
  {
    name: "Pro",
    prices: { USD: "$39", INR: "₹1499", EUR: "€39" },
    period: "per validation",
    description: "For founders who move fast",
    features: [
      "1 Full Execution Credit",
      "Comprehensive Validation Score",
      "Launch Platforms Strategy",
      "MVP Prioritization Matrix",
      "Compliance Risk Assessment",
      "Detailed Customer Personas",
      "Up to 5 Direct Competitors Analyzed",
      "Tech Architecture & Fake Door Code",
      "Early Adopter Psych & GTM Kit",
      "Unit Economics & Revenue Projections",
      "5 Verified Target B2B Leads",
      "2 High-Fidelity UI Mockups",
      "Lifetime access to the report",
      "Export to PDF",
      "Investor Simulator (All Personas, 10 QA Rounds)"
    ],
    href: "/register?plan=pro",
    tierKey: "PRO",
    featured: true,
  },
  {
    name: "Team",
    prices: { USD: "$89", INR: "₹2999", EUR: "€89" },
    period: "for 3 validations",
    description: "For serial entrepreneurs and agencies",
    features: [
      "3 Full Execution Credits (Save 25%)",
      "Everything in the Pro Plan",
      "Priority Processing Engine (Under 1h)",
      "Up to 7 Direct Competitors Analyzed",
      "8 Verified Target B2B Leads",
      "Export to PDF for Investors",

      "Dedicated account support manager",
      "White-label branding options (Your Logo)",
      "Shared Team Workspace (Coming soon)",
      "Investor Simulator (All Personas, 15 QA Rounds + PDF)"
    ],
    href: "/register?plan=team",
    tierKey: "TEAM",
    featured: false,
  },
  {
    name: "Enterprise",
    prices: { USD: "$249", INR: "₹14,999", EUR: "€249" },
    period: "for 15 validations",
    description: "For Incubators, E-Cells & VC Hubs",
    features: [
      "15 Deep Execution Credits",
      "Custom API Access via Webhooks",
      "Full White-labeling (Colors & Logo)",
      "Dedicated Multi-User Dashboard",
      "Deep Postgres Relational Schemas",
      "SSO & SAML Authentication",
      "Up to 10 Direct Competitors Analyzed",
      "8 Verified Target B2B Leads",
      "Priority 1-on-1 Onboarding Call",
      "24/7 Priority SLA Support",
      "Investor Simulator (All Personas, Unlimited QA + API)"
    ],
    href: "/register?plan=enterprise",
    tierKey: "ENTERPRISE",
    featured: false,
  },
];

function PricingCard({ plan, currency, handleCheckout, loading }: { plan: any; currency: string; handleCheckout: (plan: any) => void; loading: string | null }) {
  return (
    <div
      className={`relative p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center lg:items-stretch w-full rounded-[2rem] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${plan.featured
          ? "bg-gradient-to-r from-[#FFFDFD] to-[#FDF8F8] border-[1.5px] border-[#630102]/10 shadow-[0_20px_60px_-15px_rgba(99,1,2,0.1)] hover:shadow-[0_30px_80px_-20px_rgba(99,1,2,0.2)] hover:-translate-y-1 z-10 ring-1 ring-[#630102]/5 hover:border-[#630102]/30 group"
          : "bg-white border border-[#E5E7EB] shadow-sm hover:shadow-xl hover:border-[#D1D5DB] hover:-translate-y-1"
        }`}
    >
      {plan.featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 lg:left-10 lg:translate-x-0">
          <div className="relative">
            <div className="absolute inset-0 bg-[#630102] blur-md opacity-40 rounded-full animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-[#630102] to-[#8C0203] text-white px-5 py-1.5 rounded-full shadow-lg text-[11px] font-black uppercase tracking-[0.25em] flex items-center justify-center whitespace-nowrap border border-white/20">
              MOST POPULAR
            </div>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className={`flex-shrink-0 w-full lg:w-[320px] text-center lg:text-left flex flex-col justify-center ${plan.featured ? "pt-5 lg:pt-0" : ""}`}>
        <h3 className={`text-2xl lg:text-3xl font-black mb-2 ${plan.featured ? "text-[#630102]" : "text-[#111827]"}`}>{plan.name}</h3>
        <p className="text-[#6B7280] text-[14px] leading-relaxed mb-6 font-medium max-w-[280px] mx-auto lg:mx-0">{plan.description}</p>
        <div className="flex items-baseline justify-center lg:justify-start gap-1">
          <PricingPriceLine basePrice={plan.prices[currency]} period={plan.period} featured={plan.featured} />
        </div>
      </div>

      {/* Features List */}
      <div className="flex-1 w-full border-t lg:border-t-0 lg:border-l border-[#E5E7EB]/80 pt-8 mt-8 lg:pt-0 lg:mt-0 lg:pl-10 flex flex-col justify-center">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
          {plan.features.map((feature: string) => (
            <li key={feature} className="flex items-start gap-3 text-[14px] leading-tight text-[#111827]/80 font-semibold">
              <CheckCircle className={`w-[18px] h-[18px] mt-0.5 flex-shrink-0 ${plan.featured ? "text-[#630102]" : "text-emerald-500"}`} strokeWidth={2.5} />
              <span className="text-left">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-shrink-0 w-full lg:w-[240px] flex items-center justify-center border-t lg:border-t-0 border-[#E5E7EB]/80 pt-8 mt-8 lg:pt-0 lg:mt-0 lg:pl-8">
        <button aria-label="Button action" type="button"
          onClick={() => handleCheckout(plan)}
          disabled={loading === plan.tierKey}
          className={`w-full block text-center py-4 px-6 rounded-2xl font-semibold text-[16px] tracking-tight transition-all duration-700 overflow-hidden relative group/btn disabled:opacity-70 disabled:cursor-not-allowed ${plan.featured
              ? "bg-gradient-to-r from-[#630102] via-[#A80205] to-[#630102] bg-[length:200%_auto] text-white shadow-[0_8px_20px_-6px_rgba(99,1,2,0.5)] hover:shadow-[0_15px_30px_-8px_rgba(99,1,2,0.7)] hover:bg-[position:right_center] hover:-translate-y-1 ring-2 ring-transparent hover:ring-[#630102]/40 ring-offset-2 ring-offset-[#FDF8F8]"
              : "bg-gradient-to-b from-[#FFF8F8] to-[#FFF0F0] text-[#8C0203] border-[1.5px] border-[#FFE4E4] shadow-[0_4px_12px_-4px_rgba(99,1,2,0.1)] hover:shadow-[0_12px_24px_-6px_rgba(99,1,2,0.15)] hover:from-[#FFF0F0] hover:to-[#FFE4E4] hover:border-[#FFC2C2] hover:-translate-y-1"
            }`}
        >
          <div className={`absolute inset-0 w-full h-full transform -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent ${plan.featured ? "via-white/20" : "via-white/60"} to-transparent pointer-events-none`} />
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading === plan.tierKey ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              <>
                {plan.cta || (plan.tierKey === "FREE" ? "Get Started" : "Upgrade Now")}
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const { currency } = useCurrency();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [isPartner, setIsPartner] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasRef = urlParams.get("ref") || urlParams.get("via") || urlParams.get("partner") || urlParams.get("aff");
    if (hasRef) {
      localStorage.setItem("is_partner", "true");
      setIsPartner(true);
    } else if (localStorage.getItem("is_partner") === "true") {
      setIsPartner(true);
    }

    const promoCode = urlParams.get("promo");
    if (promoCode) {
      localStorage.setItem("ls_promo", promoCode);
    }
  }, []);

  const handleCheckout = async (plan: any) => {
    if (plan.tierKey === "FREE") {
      router.push(plan.href);
      return;
    }

    if (!session?.user) {
      router.push(`/register?plan=${plan.tierKey.toLowerCase()}`);
      return;
    }

    // Since they are logged in, send them to the actual billing dashboard 
    // which handles the complex routing for Indian vs Global payments
    router.push("/dashboard/billing");
  };

  return (
    <main className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <Navbar />

      <div className="flex-1 bg-[#FDFDFD] relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />

        {/* Dynamic bright shapes for premium visual appeal */}
        <div className="absolute top-1/4 left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-cherry/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] bg-gradient-to-tl from-orange-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-400/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="mb-8">
            <Link aria-label="Navigation link" href="/" className="inline-flex items-center text-sm font-semibold text-[#6B7280] hover:text-[#111827] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Home
            </Link>
          </div>

          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#630102]/30" />
              <span className="text-xs font-heading font-black uppercase tracking-[0.2em] text-[#630102]">
                Full Pricing
              </span>
              <div className="w-8 h-[1px] bg-[#630102]/30" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-[#1B1716] mb-6 tracking-tight leading-tight">
              A plan for every stage of <br />
              <span className="gradient-text">your journey.</span>
            </h1>
            <p className="text-[#1B1716]/60 text-lg max-w-lg mx-auto">
              From quick reality checks to deep enterprise validation schemas.
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:gap-8 w-full max-w-[1200px] mx-auto mt-12">

            {currency === "INR" && <GlobalPromoInput />}

            {fullPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} currency={currency} handleCheckout={handleCheckout} loading={loading} />
            ))}
          </div>


        </div>
      </div>

      <Footer />
    </main>
  );
}
