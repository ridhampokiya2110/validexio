import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { PwaRegistry } from "@/components/pwa-registry";
import { Providers } from "@/components/providers";
import type { Viewport } from "next";
import { GlobalSEO } from "@/components/seo/GlobalSEO";

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
    // Core Global Product Keywords (30)
    "data-driven startup validation", "startup idea validator", "startup idea validation tool", "validate business idea online", "startup idea validation platform", "best startup validation software 2025", "algorithmic market analysis for startups", "startup idea tester", "evaluate startup idea", "business viability checker", "startup validation engine", "data backed startup validator", "verify business idea data", "startup validation score", "market validation tool", "product market fit validation", "idea validation framework", "startup idea checker online", "business idea evaluation software", "startup success probability calculator", "data engine startup validator", "algorithmic business idea validator", "startup market research tool", "automated startup validation", "startup idea scoring system", "validate app idea online", "validate saas idea", "saas validation platform", "startup validation services", "business idea rater",

    // Worldwide Market & Geo Keywords (30)
    "startup validator India", "validate business idea USA", "startup validation tool Europe", "global startup idea tester", "startup validator INR pricing", "affordable startup validation global", "best startup tool for Indian founders", "validate startup idea UK", "startup validator Canada", "startup validator Australia", "validate business idea Germany", "validate startup idea Singapore", "startup validator UAE", "startup validator Dubai", "validate tech startup global", "international startup validation", "startup validator pricing in rupees", "startup validation tool cheap India", "best business validator Asia", "startup validator for LATAM founders", "global market analysis for startups", "worldwide startup viability checker", "validate local business idea globally", "startup validator localized pricing", "best startup tool for African founders", "validate startup idea online worldwide", "startup validator without borders", "global saas validation", "validate business model internationally", "startup idea tester globally",

    // Execution & Asset Generation (Zero Competition) (30)
    "startup validator with code generation", "startup idea to react code", "generate nextjs code from startup idea", "startup validator with B2B leads", "automated B2B lead generation for startups", "startup validator with UI mockups", "generate wireframes from business idea", "startup validator with database schema", "prisma schema generator for startups", "startup idea to postgresql schema", "startup idea to tailwind css", "generate saas frontend code", "validate idea and get leads", "startup validator with tech stack", "generate ui mockups for startup", "startup idea to fullstack app", "validate idea and get sales leads", "startup validator with buyer personas", "generate marketing copy from idea", "startup validator with pitch deck assets", "generate business plan from idea", "startup validator with revenue projections", "startup idea to financial model", "generate supabase schema from idea", "startup validator with code export", "validate idea and deploy code", "startup idea to vercel deployment", "generate react components for startup", "startup validator with actionable assets", "data engine code generator",

    // Answer Engine / Natural Language Queries (AEO) (30)
    "how to validate a startup idea without coding", "is my startup idea good or bad", "how to test business idea viability", "what is the TAM SAM SOM of my idea", "how to get first 10 customers for startup", "how to analyze competitors automatically", "how to find gaps in the market", "how to calculate startup unit economics", "what should be in my saas ui mockup", "how to generate a database schema for my startup", "is my app idea already taken", "how to write a go to market strategy for b2b saas", "how to prepare for a y combinator interview", "should i use a no code builder or hire a developer", "fastest way to build an mvp without coding", "how to find b2b leads for my saas", "is there a tool that writes react code and does market research", "validate my saas idea online", "how to test if people will buy my product", "how to calculate customer acquisition cost automatically", "how to estimate lifetime value of a customer", "how to build a saas mvp fast", "how to validate a micro saas idea", "what are the best indie hacker tools", "how to bootstrap a startup without a technical cofounder", "how to simulate a vc pitch", "what questions will investors ask me", "how to create a data driven pitch deck", "how to find my target audience for a startup", "how to know if a market is saturated",

    // Competitor Alternative Keywords (SERP Capture) (30)
    "Preuve AI alternative", "dimeadozen alternative", "ideaproof alternative", "ValidatorAI alternative", "pitchbob alternative", "startupdeckai alternative", "pitchdesk alternative", "better than preuve ai for coding", "preuve ai vs validexio", "dimeadozen vs validexio", "ideaproof vs validexio", "validatorai vs validexio", "pitchbob vs validexio", "startupdeckai vs validexio", "pitchdesk vs validexio", "free alternative to dimeadozen", "free alternative to preuve ai", "preuve ai review", "dimeadozen review", "is preuve ai worth it", "is dimeadozen worth it", "tools like preuve ai", "tools like dimeadozen", "tools like validatorai", "cheaper alternative to ideaproof", "best alternative to preuve ai 2025", "dimeadozen competitor", "preuve ai competitor", "validatorai competitor", "startup validation tools comparison",

    // Traditional Financial & VC Keywords (30)
    "competitor analysis tool for startups", "unit economics calculator startup", "VC pitch simulator", "algorithmic investor simulator", "startup simulator", "product market fit tool", "TAM SAM SOM calculator", "startup idea feasibility checker", "validate startup before building", "startup financial modeling tool", "revenue projection generator", "customer acquisition cost calculator", "lifetime value estimator", "startup valuation calculator", "venture capital pitch preparation", "angel investor pitch simulator", "startup burn rate calculator", "saas metrics dashboard generator", "startup break even analysis", "market sizing tool", "total addressable market calculator", "serviceable available market calculator", "serviceable obtainable market calculator", "startup competitor matrix generator", "swot analysis generator for startups", "porter's five forces startup tool", "lean canvas generator", "business model canvas creator", "startup risk assessment tool", "go to market strategy template generator",

    // Future-Proofing & Tech Trends Keywords (30)
    "saas validation tool 2025", "nextjs startup validator", "supabase schema generator", "tailwind boilerplate generator", "react frontend code generator", "automated business planning software", "data driven pitch simulator", "startup idea viability tester", "is my saas idea profitable", "automated competitive analysis software", "best validator for micro saas", "solopreneur startup tool", "indie hacker business validator", "validate dropshipping idea", "validate ecommerce idea online", "startup metrics dashboard generator", "predictive analytics for startups", "startup survival rate calculator", "b2b saas market validation", "b2c app validation tool", "mobile app idea validator", "startup idea ranking tool", "automated business model canvas", "lean startup validation tool", "agile startup validation platform", "data backed mvp builder", "zero to one startup tool", "startup launchpad platform", "automated cofounder tool", "startup execution platform",

    // Deep Niche & Problem-Specific Keywords (40)
    "validate hardware startup idea", "validate fintech startup idea", "validate edtech startup idea", "validate healthtech startup idea", "validate marketplace startup idea", "validate proptech startup idea", "validate web3 startup idea", "validate crypto startup idea", "validate ai wrapper startup", "validate saas wrapper startup", "b2b saas pricing calculator", "startup idea validation checklist", "how to validate a startup idea on reddit", "how to validate a startup idea on twitter", "startup validation framework 2025", "y combinator startup validation", "500 startups idea validation", "techstars idea validation", "startup weekend idea validation", "product hunt launch strategy", "startup pre-launch marketing", "startup waitlist generator", "startup landing page generator", "business model canvas template", "lean startup methodology software", "mom test questions generator", "startup interview questions generator", "customer development software", "startup user research tool", "startup idea generator and validator", "how to pivot a startup idea", "startup post-mortem analysis", "startup failure rate calculator", "startup success metrics", "saas metrics calculator", "mrr arr calculator", "churn rate calculator startup", "startup burn rate optimization", "startup funding readiness check", "startup investor database generator",

    // Long-Tail & High-Intent Conversational Keywords (40)
    "best tool to validate saas idea before coding", "how to find out if my app idea is stupid", "is my startup idea worth pursuing", "how to validate an app idea without building it", "tool that writes react code from business idea", "generate postgres schema from app idea", "how to get b2b leads for unlaunched saas", "startup validator that gives real code", "dimeadozen vs preuve ai vs validexio", "why is validexio better than ideaproof", "automated technical cofounder for non technical founders", "how to build a saas mvp in one day", "how to generate a pitch deck with data", "algorithmic startup validation engine", "data engine for startup founders", "startup market research automation", "how to analyze competitors in 60 seconds", "tool to find market gaps automatically", "startup idea scoring algorithm", "predictive startup success software", "startup idea feasibility analysis online", "how to test product market fit fast", "automated swot analysis for startups", "generate buyer personas for b2b saas", "how to calculate tam sam som easily", "startup revenue projection tool", "startup unit economics calculator free", "validate business idea india", "startup validation software rupees", "best validation tool for solopreneurs", "startup validation score methodology", "how to measure startup market demand", "saas business idea validator", "startup idea validation tool free", "validate business idea before building", "is there a market for my app", "startup market validation process", "how to check market saturation", "startup competitor tracking tool", "automated business viability test",

    // B2B & Enterprise Validation Keywords (40)
    "enterprise saas validation platform",
    "b2b saas idea tester",
    "validate b2b startup idea",
    "b2b market sizing tool",
    "enterprise software validation tool",
    "b2b competitor analysis automation",
    "b2b saas lead generation software",
    "validate enterprise tech startup",
    "b2b product market fit analysis",
    "enterprise startup valuation calculator",
    "b2b startup financial modeling",
    "b2b go to market strategy generator",
    "enterprise buyer persona generator",
    "b2b saas pricing strategy tool",
    "enterprise sales cycle estimator",
    "b2b churn rate prediction tool",
    "enterprise customer acquisition cost calculator",
    "b2b saas ltv calculator",
    "enterprise startup pitch simulator",
    "b2b startup funding readiness",
    "enterprise market validation engine",
    "b2b idea scoring algorithm",
    "enterprise startup feasibility analysis",
    "b2b swot analysis generator",
    "enterprise lean canvas creator",
    "b2b startup risk assessment",
    "enterprise saas metrics dashboard",
    "b2b startup burn rate calculator",
    "enterprise idea viability tester",
    "b2b startup success probability",
    "enterprise market research automation",
    "b2b startup idea validation checklist",
    "enterprise startup pivot analysis",
    "b2b startup pre launch marketing",
    "enterprise startup landing page generator",
    "b2b waitlist generator",
    "enterprise startup user research tool",
    "b2b customer development software",
    "enterprise mom test questions",
    "b2b startup interview questions",

    // Technical Cofounder & Architecture Keywords (40)
    "automated technical cofounder platform",
    "ai technical cofounder for startups",
    "startup architecture generator",
    "saas boilerplate code generator",
    "startup backend architecture planner",
    "frontend code generator for startups",
    "database schema designer for startups",
    "api documentation generator startup",
    "startup infrastructure as code generator",
    "cloud architecture planner for startups",
    "startup tech stack selector",
    "automated devops setup for startups",
    "startup ci cd pipeline generator",
    "startup security architecture planner",
    "compliance checklist generator startup",
    "startup data privacy planner",
    "startup scalability architecture",
    "microservices architecture generator",
    "serverless architecture planner startup",
    "startup performance testing simulator",
    "startup load testing planner",
    "automated code review for startup mvp",
    "startup technical debt estimator",
    "startup engineering hiring plan generator",
    "startup cto dashboard",
    "automated product manager for startups",
    "startup agile sprint planner",
    "startup feature prioritization matrix",
    "startup user story generator",
    "startup product roadmap creator",
    "automated qa testing for startups",
    "startup bug tracking setup",
    "startup release management planner",
    "startup documentation generator",
    "startup api design tool",
    "startup webhook architecture",
    "startup event driven architecture",
    "startup graphql schema generator",
    "startup rest api planner",
    "startup grpc architecture planner",

    // High-Intent "Desperation" Keywords (40)
    "i have an idea for an app but don't know how to code",
    "how to get an app built without money",
    "my startup failed because of no product market fit",
    "how to code a saas fast",
    "how to start a tech company as a non technical founder",
    "how to find out if my app is a good idea",
    "what to do after having a startup idea",
    "i need a developer for my startup idea",
    "how much does it cost to build a saas mvp",
    "how to build an mvp in a weekend",
    "startup idea validation step by step",
    "tool to build my app idea for me",
    "how to write react code without knowing how to code",
    "how to get customers before launching",
    "how to find first users for app",
    "how to test an app idea without coding",
    "how to build a waitlist page in 5 minutes",
    "what is the easiest way to start a saas",
    "saas boilerplate generator with database",
    "how to generate a prisma schema instantly",
    "where to find b2b leads for free",
    "startup tools for broke founders",
    "how to stop wasting time on market research",
    "i have a business idea now what",
    "how to validate an idea on product hunt",
    "how to test startup idea with landing page",
    "is my startup idea too saturated",
    "how to know if my niche is profitable",
    "b2b saas ideas that make money",
    "how to start a micro saas today",
    "how to evaluate software startup ideas",
    "how to avoid startup failure",
    "how to pitch an idea to investors without a product",
    "how to raise money with just an idea",
    "angel investor pitch generator",
    "y combinator application generator",
    "how to calculate startup costs automatically",
    "best free tools for startup founders 2025",
    "how to become a solo founder",
    "indie hacker marketing automation",

    // Competitor & "Versus" Comparatives (40)
    "validexio vs preuve ai",
    "preuve ai alternative reddit",
    "is dimeadozen a scam",
    "dimeadozen alternatives free",
    "validatorai vs dimeadozen",
    "validexio vs validatorai",
    "ideaproof alternative free",
    "validexio vs ideaproof",
    "startupdeckai vs validexio",
    "pitchbob vs validexio",
    "pitchdesk vs validexio",
    "best tool like preuve ai but cheaper",
    "preuve ai pricing compared",
    "dimeadozen vs chatgpt for startup validation",
    "validexio vs chatgpt for market research",
    "preuve ai review 2025",
    "is preuve ai legit",
    "dimeadozen review 2025",
    "is dimeadozen accurate",
    "startup validation tools reddit",
    "what is the best startup validation software",
    "validexio vs manual market research",
    "validexio vs hiring a business consultant",
    "validexio vs mckinsey report",
    "validexio vs gartner report",
    "validexio vs no code builders",
    "validexio vs bubble for mvp",
    "validexio vs flutterflow for startup",
    "validexio vs v0 dev",
    "preuve ai vs v0 dev",
    "dimeadozen vs v0 dev",
    "validexio vs bolt new",
    "preuve ai vs bolt new",
    "dimeadozen vs cursor ai",
    "validexio vs cursor ai for founders",
    "validexio vs lovable dev",
    "preuve ai vs lovable dev",
    "validexio vs claude for startup research",
    "why validexio is the best ai founder tool",
    "validexio vs other ai business tools",

    // Growth & Scale Keywords (50)
    "startup growth strategy automation",
    "automated user acquisition for saas",
    "how to scale a b2b saas quickly",
    "automated market expansion strategy",
    "startup traction tracker",
    "saas growth hacking tools 2025",
    "viral loop generator for startups",
    "how to optimize onboarding for saas",
    "b2b saas sales funnel generator",
    "startup conversion rate optimization tool",
    "automated email marketing strategy startup",
    "how to reduce churn in b2b saas",
    "predictive churn modeling startup",
    "customer retention strategy generator",
    "saas referral program builder",
    "startup customer success automation",
    "how to upsell enterprise saas",
    "b2b saas cross selling tool",
    "automated pricing optimization saas",
    "startup profit margin calculator",
    "how to improve ltv to cac ratio",
    "saas cohort analysis automation",
    "startup monthly recurring revenue booster",
    "how to hit 10k mrr fast",
    "path to 1m arr for saas",
    "b2b saas enterprise sales strategy",
    "how to close enterprise deals faster",
    "automated rfp responder startup",
    "startup outbound sales automation",
    "inbound marketing strategy generator saas",
    "b2b saas content strategy planner",
    "startup seo automation tool",
    "programmatic seo strategy generator",
    "startup social media marketing planner",
    "automated influencer outreach for startups",
    "b2b saas partner program generator",
    "startup affiliate marketing setup",
    "how to launch on appsumo",
    "startup lifetime deal calculator",
    "saas freemium vs premium modeling",
    "startup free trial optimization",
    "b2b saas reverse trial strategy",
    "automated product led growth planner",
    "startup sales led growth modeling",
    "how to build a saas sales team",
    "startup compensation plan generator",
    "saas customer support strategy",
    "automated knowledge base generator",
    "startup feedback loop automation",
    "b2b saas net promoter score tracker"
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
    icon: "/logo-icon-cherry.png",
    shortcut: "/logo-icon-cherry.png",
    apple: "/logo-icon-cherry.png",
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
        {/* PWA Init */}
        <Script
          id="pwa-install"
          strategy="afterInteractive"
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
                <GlobalSEO />
      </head>
      <body className={inter.variable + " " + outfit.variable + " font-sans bg-[#FDFCF8] text-[#1B1716] antialiased overflow-x-hidden selection:bg-cherry/20 selection:text-cherry"}>
        <Providers>
          <PwaRegistry />
          <NextTopLoader color="#E44234" showSpinner={false} height={3} shadow="0 0 10px #E44234,0 0 5px #E44234" />
          <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
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
