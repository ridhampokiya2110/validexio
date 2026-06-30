import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Validexio Data Engine Startup Validator | Free, Pro ₹1499, Team ₹2999",
  description: "Simple one-time pricing. Free startup validation forever. Pro plan at ₹1499 ($39) includes React code, 10 B2B leads, UI mockups, and full market analysis.",
  keywords: [
    "Validexio pricing",
    "startup validator India rupees",
    "startup validator INR pricing",
    "free startup idea validation",
    "Data Engine startup validator free",
    "validate business idea cost"
  ],
  alternates: {
    canonical: "https://validexio.com/pricing",
  }
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Validexio Validation Execution Engine",
  "description": "data-driven startup validation that generates production-ready code, B2B leads, and UI mockups.",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "0",
    "highPrice": "249",
    "priceCurrency": "USD",
    "offerCount": "4"
  }
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Validexio Validation Execution Engine",
  "description": "data-driven startup validation that generates production-ready code, B2B leads, and UI mockups.",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "0",
    "highPrice": "249",
    "priceCurrency": "USD",
    "offerCount": "4"
  }
}` }}
      />
      {children}
    </>
  );
}
