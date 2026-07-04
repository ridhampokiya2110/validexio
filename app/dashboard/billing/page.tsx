import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { CreditCard, CheckCircle, Zap, Star } from "lucide-react";
import { CheckoutButton } from "@/components/dashboard/CheckoutButton";
import { ManageSubscriptionButton } from "@/components/dashboard/ManageSubscriptionButton";


export const metadata = { title: "Billing" };

async function getCountryCode() {
  const headersList = await headers();
  
  // Try Vercel edge header
  const vercelCountry = headersList.get("x-vercel-ip-country");
  if (vercelCountry) return vercelCountry;
  
  // Try Cloudflare header
  const cfCountry = headersList.get("cf-ipcountry");
  if (cfCountry) return cfCountry;
  
  // Extract client IP
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp?.trim();
  
  if (!ip) return "US";
  
  // Fallback if not on Vercel or running locally
  try {
    const res = await fetch(`https://api.country.is/${ip}`);
    if (!res.ok) return "US";
    const data = await res.json();
    return data.country || "US";
  } catch {
    return "US";
  }
}

async function getCachedUser(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");



  const user = await getCachedUser(session.user.id);

  const tier = user?.tier || "FREE";
  const countryCode = await getCountryCode();

  // Europe country codes
  const euCountries = ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE"];

  let starterPrice = "$19";
  let proPrice = "$39";
  let teamPrice = "$89";
  let enterprisePrice = "$249";

  if (countryCode === "IN") {
    starterPrice = "₹499";
    proPrice = "₹1499";
    teamPrice = "₹2999";
    enterprisePrice = "₹14,999";
  } else if (euCountries.includes(countryCode)) {
    starterPrice = "€19";
    proPrice = "€39";
    teamPrice = "€89";
    enterprisePrice = "€249";
  }

  const plans = [
    {
      name: "Free",
      price: countryCode === "IN" ? "₹0" : countryCode && euCountries.includes(countryCode) ? "€0" : "$0",
      period: "forever",
      description: "Perfect for a quick reality check",
      features: [
        "1 Basic Validation Score",
        "Market Saturation Check",
        "Anti-Roadmap & Pivot Strategy",
        "Investor Simulator (1 Persona, 3 QA Rounds)",
        "Blurred Mockups & Tech Stack",
        "Blurred Leads & GTM Kit",
        "Standard processing time"
      ],
      current: tier === "FREE",
    },
    {
      name: "Starter",
      price: starterPrice,
      period: "per validation",
      description: "For solo indie hackers testing waters",
      features: [
        "1 Standard Execution Credit",
        "Basic Validation Score & Analysis",
        "Up to 3 Direct Competitors Analyzed",
        "Text-Only UI Components (No raw code)",
        "Standard Unit Economics Breakdown",
        "Investor Simulator (1 Persona, 5 QA Rounds)",
        "Standard processing time (24h)",
        "7-Day access to the report"
      ],
      current: tier === ("STARTER" as any),
    },
    {
      name: "Pro",
      price: proPrice,
      period: "per validation",
      description: "For founders who move fast",
      features: [
        "1 Full Execution Credit",
        "Comprehensive Validation Score",
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
      current: tier === "PRO",
      featured: true,
    },
    {
      name: "Team",
      price: teamPrice,
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
      current: tier === "TEAM",
    },
    {
      name: "Enterprise",
      price: enterprisePrice,
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
      current: tier === ("ENTERPRISE" as any),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1716] mb-1">Billing</h1>
        <p className="text-[#1B1716]/50 text-sm">Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <div className="glass-card p-6 mb-6 border-cherry/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cherry/15 border border-cherry/30 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-cherry" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1B1716]">Current Plan</h2>
            <p className="text-[#1B1716]/45 text-xs">
              {tier === "FREE" ? "Free tier · 1 validation/month" :
               tier === "PRO" ? "Pro · Active" :
               tier === "TEAM" ? "Team · Unlimited" :
               `${tier} · Active`}
            </p>
          </div>
          <div className="ml-auto">
            <span className={`badge text-sm px-3 ${tier === "FREE" ? "badge-cherry" : "badge-butter"}`}>
              {tier}
            </span>
          </div>
        </div>

        {tier !== "FREE" && (
          <div className="flex gap-3 mt-4 pt-4 border-t border-[#1B1716]/8">
            <ManageSubscriptionButton />
          </div>
        )}
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl p-8 transition-all duration-300 hover:transform hover:-translate-y-1 ${
              plan.featured
                ? "bg-gradient-to-b from-cherry/20 to-maroon/10 border-2 border-cherry/50 shadow-2xl shadow-cherry/20"
                : "glass-card"
            } ${plan.current ? "ring-2 ring-emerald-500/30" : ""}`}
          >
            {plan.featured && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <div className="bg-cherry text-white px-4 py-1 rounded-full shadow-[0_4px_12px_rgba(117,7,12,0.3)] text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-[#910505] z-10 whitespace-nowrap">
                  <Star className="w-3 h-3 fill-current" />
                  Most Popular
                </div>
              </div>
            )}
            
            {plan.current && (
              <div className="absolute top-4 right-4">
                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Zap className="w-3 h-3 fill-current" />
                  Current
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#1B1716] mb-1">{plan.name}</h3>
              <p className="text-[#1B1716]/50 text-sm mb-4">{plan.description}</p>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-black text-[#1B1716]">{plan.price}</span>
                <span className="text-[#1B1716]/70 text-sm">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-[#1B1716]/70">
                  <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.featured ? "text-cherry" : "text-emerald-600"}`} />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4">
              {plan.current ? (
                <button aria-label="Button action" type="button" disabled className="btn-secondary w-full justify-center text-sm py-3 opacity-50 cursor-not-allowed">
                  Current Plan
                </button>
              ) : plan.name === "Free" ? (
                <button aria-label="Button action" type="button" disabled className="btn-secondary w-full justify-center text-sm py-3 opacity-50 cursor-not-allowed">
                  Downgrade to Free
                </button>
              ) : (
                <CheckoutButton
                  isCurrentPlan={plan.current}
                  tierName={plan.name}
                  isFeatured={plan.featured}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {countryCode === "IN" && (
        <div className="mt-8 text-center text-sm text-[#1B1716]/70 bg-orange-50/50 border border-orange-200/50 p-4 rounded-xl">
          🇮🇳 Based in India? Please ensure <strong>International Transactions</strong> are enabled on your Visa/Mastercard. Having trouble? <Link aria-label="Navigation link" href="/contact" className="text-cherry font-bold hover:underline">Contact us for UPI options</Link>.
        </div>
      )}
    </div>
  );
}
