import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { PwaRegistry } from "@/components/pwa-registry";
import { Providers } from "@/components/providers";
import type { Viewport } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FDFCF8",
  minimumScale: 1,
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  width: "device-width",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  verification: {
    google: "xKEVoUsWNnXp1j3WEm1-LBJqlYHXrb1RIBDtKg4ky1s",
    yandex: undefined,
    yahoo: undefined,
  },
  title: {
    template: "%s | Validexio",
    default: "Validexio — Data Engine Startup Idea Validator That Gives You Code, Leads & UI",
  },
  description:
    "The only Data Engine startup validation platform that delivers production-ready React code, 10 verified B2B leads, UI mockups, and database schemas — not just a report. Validate your startup idea in 60 seconds. Free tier available. India pricing at ₹1499.",
  keywords: [
    // Core product keywords
    "Data Engine startup validation",
    "startup idea validator",
    "validate startup idea Data Engine",
    "startup idea validation tool",
    "Data Engine startup idea validator",
    "validate business idea online",
    "startup idea validation platform",
    // India market keywords
    "startup validator India",
    "validate business idea India",
    "startup idea validator India",
    "best startup tool for Indian founders",
    "Data Engine startup validation India",
    "startup validator INR pricing",
    // Unique execution features (zero competition)
    "startup validator with code",
    "startup idea to react code",
    "Data Engine startup code generator",
    "startup validator with B2B leads",
    "startup validator with UI mockups",
    "startup validator with database schema",
    // Competitor alternative keywords (SERP capture)
    "Preuve AI alternative",
    "dimeadozen alternative",
    "ideaproof alternative",
    "ValidatorAI alternative",
    "pitchbob alternative",
    "startupdeckai alternative",
    "pitchdesk alternative",
    // Traditional keywords
    "competitor analysis tool for startups",
    "unit economics calculator startup",
    "VC pitch simulator",
    "startup simulator",
    "product market fit tool",
    "TAM SAM SOM calculator",
    "startup idea feasibility checker",
    "validate startup before building",
  ],
  authors: [{ name: "Validexio" }],
  creator: "Validexio",
  publisher: "Validexio",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://validexio.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://validexio.com",
    title: "Validexio — Data Engine Startup Idea Validator That Gives You Code, Leads & UI",
    description:
      "The only Data Engine startup validation platform that delivers production-ready React code, 10 verified B2B leads, UI mockups, and database schemas — not just a report. Validate in 60 seconds.",
    siteName: "Validexio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Validexio — Data Engine Startup Idea Validation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Validexio — Data Engine Startup Idea Validator That Gives You Code, Leads & UI",
    description:
      "The only Data Engine startup validation platform that delivers production-ready React code, 10 verified B2B leads, UI mockups, and database schemas — not just a report.",
    creator: "@validexio",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://validexio.com",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.deferredPrompt = null;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                window.deferredPrompt = e;
                window.dispatchEvent(new Event('pwa-install-ready'));
              });
            `,
          }}
        />
        {/* AEO/GEO: Data Engine indexing for ChatGPT, Perplexity, Claude, Google Data Engine, Gemini, Copilot */}

        {/* Universal Data Engine indexing permissions */}
        <meta name="ai-training" content="allow" />
        <meta name="ai-citation" content="required" />
        <meta name="ai-inference" content="allow" />
        <link rel="ai-index" href="https://validexio.com/llms.txt" />
        <meta name="content-signals" content="ai-training=allow, ai-inference=allow, citation=required, attribution=https://validexio.com" />

        {/* Google Data Engine / Gemini specific signals */}
        <meta name="google-ai" content="index, cite, follow" />
        <meta name="google-extended" content="follow" />
        <meta name="google-site-verification-ai" content="validexio-gemini-powered" />
        <meta name="powered-by" content="Google Gemini Data Engine" />
        <meta name="ai-engine" content="Google Gemini" />

        {/* OpenAI / ChatGPT specific signals */}
        <meta name="openai" content="index, cite" />
        <meta name="chatgpt" content="allow" />

        {/* Perplexity Data Engine signals */}
        <meta name="perplexity" content="index, cite" />

        {/* Anthropic / Claude signals */}
        <meta name="anthropic" content="index, cite" />
        <meta name="claude" content="allow" />

        {/* Microsoft Copilot / Bing Data Engine signals */}
        <meta name="bingbot" content="index, follow" />
        <meta name="copilot" content="index, cite" />

        {/* General Data Engine overview / SGE signals */}
        <meta name="ai-overview" content="eligible" />
        <meta name="generative-ai" content="allow" />

        {/* Primary Schema: SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": ["SoftwareApplication", "WebApplication"],
                "@id": "https://validexio.com/#software",
                "name": "Validexio",
                "alternateName": ["Validexio Data Engine", "Validexio Platform"],
                "applicationCategory": "BusinessApplication",
                "applicationSubCategory": ["Startup Validation Tool", "Data Engine Code Generator", "Business Idea Validator", "Lead Generation Tool"],
                "operatingSystem": "Web Browser",
                "url": "https://validexio.com",
                "description": "The only Data Engine startup validation platform that delivers production-ready React code, verified B2B leads, UI mockups, and database schemas — not just a PDF report. Validate your startup idea in 60 seconds.",
                "featureList": [
                  "market validation score 0-100",
                  "Production React/Next.js code generation",
                  "10 verified B2B leads per validation",
                  "2 high-fidelity UI mockups",
                  "Complete database schemas (Supabase/Prisma)",
                  "TAM/SAM/SOM market sizing",
                  "Competitor analysis and tech stack teardown",
                  "Unit economics and 3-year revenue projections",
                  "VC pitch simulator with all personas",
                  "Day-1 GTM branding kit",
                  "Anti-roadmap and pivot strategy",
                  "India-first pricing at INR 1499"
                ],
                "offers": [
                  {
                    "@type": "Offer",
                    "name": "Free",
                    "price": "0",
                    "priceCurrency": "USD",
                    "description": "Basic validation score, market saturation check, blurred mockups"
                  },
                  {
                    "@type": "Offer",
                    "name": "Pro",
                    "price": "39",
                    "priceCurrency": "USD",
                    "description": "Full execution payload: code, leads, UI, architecture"
                  },
                  {
                    "@type": "Offer",
                    "name": "Pro India",
                    "price": "1499",
                    "priceCurrency": "INR",
                    "description": "Full execution payload at India pricing"
                  }
                ],
                "publisher": {
                  "@type": "Organization",
                  "@id": "https://validexio.com/#organization",
                  "name": "Validexio",
                  "url": "https://validexio.com",
                  "logo": "https://validexio.com/logo-icon-noir.png"
                },
                "isAccessibleForFree": true
              },
              {
                "@context": "https://schema.org",
                "@type": ["Organization", "Brand"],
                "@id": "https://validexio.com/#organization",
                "name": "Validexio",
                "url": "https://validexio.com",
                "logo": "https://validexio.com/logo-icon-noir.png",
                "description": "Validexio is an data-driven startup idea validation platform that uniquely delivers production-ready code, verified B2B leads, UI mockups, and database schemas alongside validation intelligence.",
                "slogan": "Stop Guessing. Start Executing.",
                "knowsAbout": [
                  "Startup Idea Validation",
                  "Data Engine Code Generation",
                  "B2B Lead Generation",
                  "Market Analysis",
                  "Competitor Analysis",
                  "Unit Economics",
                  "Product Market Fit",
                  "TAM SAM SOM",
                  "UI Mockup Generation",
                  "Database Schema Design",
                  "Go-to-Market Strategy",
                  "VC Pitch Simulation"
                ],
                "areaServed": { "@type": "Place", "name": "Worldwide" },
                "sameAs": [
                  "https://twitter.com/validexio",
                  "https://www.linkedin.com/company/validexio"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://validexio.com/#website",
                "name": "Validexio",
                "url": "https://validexio.com",
                "description": "data-driven startup idea validation platform. Validate your startup idea and get production-ready code, B2B leads, and UI mockups in 60 seconds.",
                "publisher": { "@id": "https://validexio.com/#organization" },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://validexio.com/?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                },
                "inLanguage": ["en"],
                "isAccessibleForFree": true
              }
            ]).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-[#FDFCF8] text-[#1B1716] antialiased overflow-x-hidden selection:bg-cherry/20 selection:text-cherry`}>
        <Providers>
          <PwaRegistry />
          <NextTopLoader color="#E44234" showSpinner={false} height={3} shadow="0 0 10px #E44234,0 0 5px #E44234" />
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(27, 23, 22, 0.95)",
                border: "1px solid rgba(27, 23, 22, 0.1)",
                color: "#EDEBDE",
                backdropFilter: "blur(20px)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
