import { seoFaqs, seoKeywords } from "@/lib/data/seo-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Startup Idea Validation FAQ - India | Validexio",
  description: "Get answers to the top 100 questions about validating your startup idea in India. Learn about market research, competitor analysis, and checking business viability with live market data.",
  keywords: seoKeywords.join(", "),
  alternates: {
    canonical: "https://validexio.com/startup-validation-faq",
  }
};

export default function StartupValidationFaq() {
  // Generate FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": seoFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <main className="min-h-screen bg-[#F5F5F7] dark:bg-[#111111] text-slate-900 dark:text-slate-100 py-24 px-6 md:px-12 selection:bg-rose-500/30">
      
      {/* Inject JSON-LD Schema for Google & Search Bots */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Startup Validation FAQ
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about testing and validating your business idea before writing a single line of code, specifically optimized for the Indian market.
          </p>
        </div>

        {/* Semantic HTML for SEO */}
        <div className="space-y-8">
          {seoFaqs.map((faq, index) => (
            <article 
              key={index} 
              className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 md:p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-200 dark:border-slate-800 transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)]"
            >
              <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                {faq.q}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.a}
              </p>
            </article>
          ))}
        </div>

        {/* Subtly integrate the keywords at the bottom to boost Geo-targeting without looking like spam */}
        <section className="mt-24 pt-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-6">Popular Validation Searches in India</h2>
          <div className="flex flex-wrap gap-2">
            {seoKeywords.map((keyword, index) => (
              <span 
                key={index} 
                className="text-xs px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
