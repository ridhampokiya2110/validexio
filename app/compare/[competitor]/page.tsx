import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, X, Shield, BarChart3, Zap, Layers, Rocket, Info } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ComparisonTracker } from "@/components/compare/ComparisonTracker";
import { competitors } from "@/lib/data/competitors";
import { DeepComparison } from "./DeepComparison";
import { LaunchPipeline } from "./LaunchPipeline";
import { CompetitorFAQ } from "@/components/compare/CompetitorFAQ";
import { FairAssessment } from "@/components/compare/FairAssessment";
import { PricingReveal } from "@/components/compare/PricingReveal";
import { Verdict } from "@/components/compare/Verdict";

interface PageProps {
  params: Promise<{ competitor: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const competitorSlug = resolvedParams.competitor.toLowerCase();
  
  const competitor = competitors.find(c => c.slug === competitorSlug);
  
  if (!competitor) {
    return {
      title: "Compare Startup Tools | Validexio",
      description: "Compare Validexio vs other startup ideation and validation tools.",
    };
  }

  const title = `${competitor.name} Alternative & Competitor - Validexio`;
  const description = `Looking for a ${competitor.name} alternative? ${competitor.heroSubheadline} Stop validating, start building with Validexio.`;
  
  return {
    title,
    description,
    keywords: [
      `${competitor.name} alternative`,
      `${competitor.name} vs validexio`,
      `better than ${competitor.name}`,
      `${competitor.name} review`,
      `${competitor.name} pricing`,
      `startup validation tool`,
      `Data Engine startup generator`,
      `idea to code platform`,
      `startup builder`,
      `MVP development platform`,
      `B2B lead generation for startups`
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://validexio.com/compare/${competitor.slug}`,
      siteName: 'Validexio',
      images: [
        {
          url: 'https://validexio.com/og-compare.png', // Fallback, would normally use a dynamic API route
          width: 1200,
          height: 630,
          alt: `${competitor.name} vs Validexio Comparison`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@validexio',
    },
    alternates: {
      canonical: `https://validexio.com/compare/${competitor.slug}`,
    }
  };
}

// ==========================================
// CTA COMPONENT
// ==========================================
function CTAWrapper({ text }: { text: string }) {
  // In a server component, we can just render the link. 
  // Advanced tracking passthrough can be handled client-side if needed, 
  // but a simple link is fine here since tracking is handled globally.
  return (
    <Link 
      href="https://your-store.lemonsqueezy.com/checkout/buy/placeholder"
      className="btn-primary inline-flex items-center justify-center px-8 py-4 text-lg"
    >
      {text}
      <Zap className="w-5 h-5 ml-2" />
    </Link>
  );
}

// ==========================================
// LEGAL DISCLAIMER
// ==========================================
function LegalDisclaimer({ competitorName, website }: { competitorName: string, website?: string }) {
  return (
    <div className="bg-[#1B1716]/5 border border-[#1B1716]/10 rounded-xl p-4 text-xs text-[#1B1716]/60 flex items-start gap-3 max-w-4xl mx-auto mt-12 mb-20">
      <Info className="w-4 h-4 mt-0.5 shrink-0 text-[#1B1716]/40" />
      <p>
        <strong>Legal Disclaimer:</strong> All product and company names, logos, and brands are property of their respective owners. 
        All company, product and service names used in this website are for identification purposes only. 
        Use of these names, logos, and brands does not imply endorsement. {competitorName} is a trademark of its respective owner. 
        {website && <span>Official website: <a href={website} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#75070C]">{website}</a>. </span>}
        The comparisons presented are based on publicly available information and our own objective analysis at the time of publication.
      </p>
    </div>
  );
}

// ==========================================
// MAIN PAGE EXPORT
// ==========================================
export default async function ComparePage({ params }: PageProps) {
  const resolvedParams = await params;
  const competitorSlug = resolvedParams.competitor.toLowerCase();
  
  const competitor = competitors.find(c => c.slug === competitorSlug);

  if (!competitor) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#1B1716] font-sans selection:bg-[#75070C]/20 selection:text-[#75070C] overflow-hidden">
      <Navbar />
      <ComparisonTracker competitorSlug={competitor.slug} />
      
      {/* JSON-LD Structured Data for GEO/SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${competitor.name} Alternative - Validexio`,
            "description": `Comparison between Validexio and ${competitor.name}. ${competitor.heroSubheadline}`,
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "Validexio",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "1499",
                "priceCurrency": "INR"
              },
              "description": "Validexio is an elite execution engine that translates your startup idea into live React code, UI designs, and B2B leads."
            }
          }).replace(/</g, '\\u003c')
        }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
          <span className="badge badge-cherry mb-6">
            The Brutal Truth
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-[#1B1716] tracking-tight leading-tight mb-6">
            {competitor.heroHeadline}<br />
            <span 
              className="text-[#1B1716]" 
              dangerouslySetInnerHTML={{ __html: competitor.validexioHeadline || 'Validexio <span className="gradient-text">Executes</span>.' }} 
            />
          </h1>
          <p className="text-lg md:text-xl text-[#1B1716]/80 max-w-3xl mx-auto leading-relaxed mb-10">
            {competitor.heroSubheadline}
          </p>
          
          <CTAWrapper text="Build Your SaaS for INR 1499" />
        </div>
      </section>

      {/* The Launch Pipeline */}
      <LaunchPipeline 
        competitorName={competitor.name} 
        description={competitor.pipeline?.description || "Most platforms give you a PDF and leave you to figure out the rest. Validexio executes the entire pipeline."}
        stages={competitor.pipeline?.stages || []}
      />

      {/* Deep Feature Comparison */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#75070C] mb-3">Side by side</p>
          <h2 className="text-3xl md:text-5xl font-black text-[#1B1716] mb-4 tracking-tight">Feature comparison at a glance</h2>
        </div>

        <DeepComparison 
          competitorName={competitor.name} 
          sections={competitor.sections}
        />
        
        <div className="mt-16 flex justify-center">
          <CTAWrapper text="Get The Ultimate Advantage" />
        </div>
      </section>

      {competitor.fairAssessment && (
        <FairAssessment competitorName={competitor.name} data={competitor.fairAssessment} />
      )}

      {competitor.pricingReveal && (
        <PricingReveal competitorName={competitor.name} data={competitor.pricingReveal} />
      )}

      {competitor.verdict && (
        <Verdict competitorName={competitor.name} data={competitor.verdict} />
      )}

      {/* GEO/SEO Optimized FAQ Section */}
      <section className="py-24 px-6 relative">
        {/* Expensive decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-[#75070C]/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="badge badge-cherry mb-4">Common Questions</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#1B1716] tracking-tight">
              {competitor.name} vs Validexio
            </h2>
          </div>
          
          <div className="bg-white/40 backdrop-blur-md border border-[#1B1716]/10 rounded-[2rem] p-4 md:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
            <CompetitorFAQ 
              competitorName={competitor.name} 
              targetOutput={competitor.targetOutputCompetitor} 
            />
          </div>
        </div>
      </section>

      <LegalDisclaimer competitorName={competitor.name} website={competitor.website} />
      <Footer />
    </main>
  );
}
