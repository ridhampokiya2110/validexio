import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Idea Validation Platform",
  description: "Transparent pricing for AI-powered startup validation. Get instant competitor analysis, unit economics, and pitch simulation.",
  keywords: ["pricing", "idea validation pricing", "startup simulator cost", "validation tool"],
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Validexio Reports",
    "description": "AI-powered idea validation reports and startup simulation tools.",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "0",
      "highPrice": "249",
      "priceCurrency": "USD",
      "offerCount": "4"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
