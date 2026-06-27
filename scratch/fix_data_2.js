const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/data/competitors.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const enrichments = {
  "preuve": {
    fairAssessment: {
      description: "Preuve AI has built a solid validation engine focused on extensive market research and detailed reporting.",
      pros: [
        { title: "Deep Research", description: "Scans over 50 live sources including Crunchbase and Reddit to provide verifiable claims." },
        { title: "Honest Scoring", description: "Only passes around 18% of ideas, preventing founders from pursuing dead ends." },
        { title: "Investor Readiness", description: "Provides pitch decks and financial models suitable for early-stage due diligence." }
      ]
    },
    pricingReveal: {
      competitorTiers: [
        { name: "Free Tier", price: "$0", validatesIdea: "No. Preview only." },
        { name: "Standard Report", price: "$29", validatesIdea: "Yes. Basic validation report." },
        { name: "Investor Package", price: "$499", validatesIdea: "Yes. Full due diligence package." }
      ],
      validexioPricing: "INR 1499 one-time for full execution assets (Code, UI, Leads, Architecture)."
    },
    verdict: {
      validexioBestFor: [
        "You want to immediately start building your product.",
        "You need production-ready React code and database schemas.",
        "You want verified B2B leads to start selling on day one.",
        "You prefer shipping over endless research."
      ],
      competitorBestFor: [
        "You are strictly in the research phase.",
        "You need to present a detailed PDF report to stakeholders.",
        "You are looking for traditional pitch decks and business plans."
      ]
    }
  },
  "dimeadozen": {
    fairAssessment: {
      description: "DimeADozen excels at generating comprehensive business plans and providing high-level business validation scores.",
      pros: [
        { title: "Extensive Documentation", description: "Generates massive 50-page business plans covering all traditional aspects." },
        { title: "Risk Analysis", description: "Provides detailed theoretical risk reports and mitigation strategies." },
        { title: "Market Profiling", description: "Offers broad demographic profiling and competitor analysis." }
      ]
    },
    pricingReveal: {
      competitorTiers: [
        { name: "Single Idea", price: "$39", validatesIdea: "Yes. One detailed report." },
        { name: "Pro Plan", price: "$99/mo", validatesIdea: "Yes. Unlimited validation reports." }
      ],
      validexioPricing: "INR 1499 one-time for full execution assets (Code, UI, Leads, Architecture)."
    },
    verdict: {
      validexioBestFor: [
        "You need technical execution over theoretical planning.",
        "You want to launch a live MVP this weekend.",
        "You need actual UI mockups and deployable code."
      ],
      competitorBestFor: [
        "You need a formal business plan for a bank loan.",
        "You prefer reading extensive market theory.",
        "You want a high-level validation score before doing any work."
      ]
    }
  },
  "pitchbob": {
    fairAssessment: {
      description: "PitchBob is a strong tool for founders who are heavily focused on the fundraising circuit and need to polish their pitch.",
      pros: [
        { title: "Slide Generation", description: "Automatically creates structured pitch decks formatted for investors." },
        { title: "Elevator Pitches", description: "Helps refine the core message and value proposition of your startup." },
        { title: "Fundraising Focus", description: "Tailored specifically for impressing early-stage venture capitalists." }
      ]
    },
    pricingReveal: {
      competitorTiers: [
        { name: "Basic", price: "$19.90", validatesIdea: "Partial. Basic deck generation." },
        { name: "Pro", price: "$59.90", validatesIdea: "Yes. Full pitch deck export." }
      ],
      validexioPricing: "INR 1499 one-time for full execution assets (Code, UI, Leads, Architecture)."
    },
    verdict: {
      validexioBestFor: [
        "You want to show investors a live product instead of a slide deck.",
        "You need to prove traction with real B2B leads.",
        "You want to bypass the pitch phase and go straight to building revenue."
      ],
      competitorBestFor: [
        "You are participating in a pitch competition.",
        "You need a traditional slide deck for angel investors.",
        "You are still working on your high-level story."
      ]
    }
  },
  "ideaproof": {
    fairAssessment: {
      description: "IdeaProof is an effective solution for capturing early interest and building a pre-launch audience.",
      pros: [
        { title: "Waitlist Creation", description: "Quickly deploys 'Coming Soon' pages to capture email addresses." },
        { title: "Passive Validation", description: "Measures interest based on how many people sign up for the waitlist." },
        { title: "Simple Setup", description: "Easy to use for non-technical founders wanting to gauge initial interest." }
      ]
    },
    pricingReveal: {
      competitorTiers: [
        { name: "Starter", price: "$15/mo", validatesIdea: "Yes. 1 active waitlist." },
        { name: "Pro", price: "$49/mo", validatesIdea: "Yes. Multiple waitlists." }
      ],
      validexioPricing: "INR 1499 one-time for full execution assets (Code, UI, Leads, Architecture)."
    },
    verdict: {
      validexioBestFor: [
        "You want to build the actual application your waitlist is waiting for.",
        "You need an outbound sales push with verified leads.",
        "You want full backend SQL schemas, not just an email capture form."
      ],
      competitorBestFor: [
        "You only want to capture emails for a future launch.",
        "You are heavily relying on organic SEO traffic.",
        "You have no intention of building the product immediately."
      ]
    }
  },
  "verdikt": {
    fairAssessment: {
      description: "FounderVerdict provides a structured, academic approach to scoring startup ideas based on user input.",
      pros: [
        { title: "Viability Scoring", description: "Outputs a clear 1-100 grade to assess general idea strength." },
        { title: "Qualitative Feedback", description: "Provides text-based critiques on potential flaws in the business model." },
        { title: "Survey Driven", description: "Forces founders to answer tough questions about their concept." }
      ]
    },
    pricingReveal: {
      competitorTiers: [
        { name: "Single Report", price: "$15", validatesIdea: "Yes. One PDF scorecard." },
        { name: "Unlimited", price: "$45/mo", validatesIdea: "Yes. Unlimited scorings." }
      ],
      validexioPricing: "INR 1499 one-time for full execution assets (Code, UI, Leads, Architecture)."
    },
    verdict: {
      validexioBestFor: [
        "You want technical blueprints over a numerical grade.",
        "You need API specifications and database schemas to start coding.",
        "You want to validate by selling to 10 real leads."
      ],
      competitorBestFor: [
        "You want a quick 'good or bad' grade on your idea.",
        "You prefer taking surveys to evaluate your business model.",
        "You need a simple PDF to share with advisors."
      ]
    }
  },
  "validatorai": {
    fairAssessment: {
      description: "ValidatorAI offers a conversational, frictionless way to bounce ideas off an AI to get immediate feedback.",
      pros: [
        { title: "Conversational Interface", description: "Easy chat-based interaction to discuss your startup idea." },
        { title: "Immediate Feedback", description: "Instant text critiques generated by an LLM." },
        { title: "Accessibility", description: "Free and simple to use for very early-stage brainstorming." }
      ]
    },
    pricingReveal: {
      competitorTiers: [
        { name: "Basic Chat", price: "$0", validatesIdea: "Partial. Chatbot feedback." },
        { name: "Premium API", price: "Usage based", validatesIdea: "Yes. Deep conversational context." }
      ],
      validexioPricing: "INR 1499 one-time for full execution assets (Code, UI, Leads, Architecture)."
    },
    verdict: {
      validexioBestFor: [
        "You are ready to move past chatting and start shipping.",
        "You need hard technical assets like React code and UI layouts.",
        "You want to acquire your first customers immediately."
      ],
      competitorBestFor: [
        "You just want to brainstorm with a chatbot.",
        "You are in the very early ideation phase with zero budget.",
        "You prefer conversational advice over technical deliverables."
      ]
    }
  },
  "painmap": {
    fairAssessment: {
      description: "PainMap is excellent at discovering market gaps by analyzing user complaints across various platforms.",
      pros: [
        { title: "Review Mining", description: "Effectively scrapes negative reviews from Reddit and G2 to find pain points." },
        { title: "Problem Identification", description: "Helps founders pinpoint exactly what users dislike about existing tools." },
        { title: "Product Briefs", description: "Summarizes findings into actionable PDF product briefs." }
      ]
    },
    pricingReveal: {
      competitorTiers: [
        { name: "Starter Bundle", price: "$49", validatesIdea: "Yes. 3 Product Briefs." },
        { name: "Pro Bundle", price: "$99", validatesIdea: "Yes. 10 Product Briefs." }
      ],
      validexioPricing: "INR 1499 one-time for full execution assets (Code, UI, Leads, Architecture)."
    },
    verdict: {
      validexioBestFor: [
        "You know the problem and need the code to fix it.",
        "You want live database schemas to build the solution.",
        "You want a direct list of 10 target buyers to pitch your solution to."
      ],
      competitorBestFor: [
        "You don't have an idea and want to find a problem first.",
        "You want to read through aggregated customer complaints.",
        "You need a text brief on what to build before you hire a developer."
      ]
    }
  },
  "startupdeckai": {
    fairAssessment: {
      description: "StartupDeck focuses on creating structured, visual presentation outlines for founders raising capital.",
      pros: [
        { title: "Automated Outlines", description: "Generates the standard 11-slide structure expected by investors." },
        { title: "Time Saving", description: "Reduces the time spent formatting and structuring a pitch." },
        { title: "Financial Forecasts", description: "Includes generic 3-year P&L slides for basic financial modeling." }
      ]
    },
    pricingReveal: {
      competitorTiers: [
        { name: "Basic", price: "₹199/mo", validatesIdea: "Partial. Basic outlines." },
        { name: "Pro", price: "₹499/mo", validatesIdea: "Yes. Full pitch decks." }
      ],
      validexioPricing: "INR 1499 one-time for full execution assets (Code, UI, Leads, Architecture)."
    },
    verdict: {
      validexioBestFor: [
        "You want to launch a functioning product, not just present one.",
        "You need exact AWS/Supabase blueprints.",
        "You want to own your codebase forever without recurring fees."
      ],
      competitorBestFor: [
        "You are strictly focused on creating PowerPoint presentations.",
        "You need a cheap way to outline a deck for a meeting.",
        "You are not ready to build the actual software yet."
      ]
    }
  },
  "bizplanaiprofocus": {
    fairAssessment: {
      description: "BizPlanAI Pro is a robust tool for generating traditional, long-form business plans required by banks and traditional investors.",
      pros: [
        { title: "Comprehensive Documents", description: "Generates massive 40-page DOCX files covering all standard business plan sections." },
        { title: "Traditional Formats", description: "Perfectly formatted for SBA loans or traditional banking requirements." },
        { title: "SWOT Analysis", description: "Includes standard text-based SWOT and market positioning analysis." }
      ]
    },
    pricingReveal: {
      competitorTiers: [
        { name: "Starter", price: "₹499", validatesIdea: "Yes. One basic plan." },
        { name: "Professional", price: "₹1499", validatesIdea: "Yes. Full comprehensive plan." }
      ],
      validexioPricing: "INR 1499 one-time for full execution assets (Code, UI, Leads, Architecture)."
    },
    verdict: {
      validexioBestFor: [
        "You want to bypass theoretical planning and start coding.",
        "You need high-fidelity UI layouts and database schemas.",
        "You want a product that can be deployed to Vercel immediately."
      ],
      competitorBestFor: [
        "You are applying for a traditional small business loan.",
        "You need a 40-page text document for formal stakeholders.",
        "You prefer planning every detail before building anything."
      ]
    }
  },
  "pitchdesk-in": {
    fairAssessment: {
      description: "PitchDesk offers a unique angle by simulating the investor pitch experience and providing an 'AI Judge'.",
      pros: [
        { title: "Pitch Simulation", description: "Allows founders to practice their pitch against an AI persona." },
        { title: "Q&A Prep", description: "Generates potential questions an investor might ask based on your script." },
        { title: "Delivery Feedback", description: "Provides feedback on the content and structure of your presentation." }
      ]
    },
    pricingReveal: {
      competitorTiers: [
        { name: "Practice Session", price: "Free", validatesIdea: "No. Just practice." },
        { name: "Pro Feedback", price: "$29/mo", validatesIdea: "Yes. Detailed AI critique." }
      ],
      validexioPricing: "INR 1499 one-time for full execution assets (Code, UI, Leads, Architecture)."
    },
    verdict: {
      validexioBestFor: [
        "You want to prove traction with real software, not just practice a script.",
        "You need 10 verified B2B leads to show investors actual market demand.",
        "You want the technical foundations to start generating revenue."
      ],
      competitorBestFor: [
        "You have a big VC meeting tomorrow and need to practice.",
        "You want an AI to critique your spoken presentation.",
        "You don't need any actual code or technical deliverables."
      ]
    }
  }
};

const newCompetitors = [
  {
    id: "ideabrowser",
    name: "IdeaBrowser",
    slug: "ideabrowser",
    website: "https://ideabrowser.com",
    heroHeadline: "IdeaBrowser Finds Ideas.",
    validexioHeadline: "Validexio <span class='gradient-text'>Proves They Work</span>.",
    heroSubheadline: "Great for finding ideas. Not built to prove yours works. IdeaBrowser is a curated catalog of 1,000+ startup ideas. Validexio translates your specific idea into live React code, DB schemas, and actual B2B leads to launch the product.",
    targetOutputCompetitor: "Curated Startup Idea Catalogs",
    targetOutputValidexio: "Live Application Architecture",
    pipeline: {
      title: "Catalogs vs Execution Engines",
      description: "IdeaBrowser gives you a directory of ideas to browse. Validexio gives you the code and leads to execute your own specific idea.",
      stages: [
        { id: 1, name: "Idea Discovery", iconName: "Lightbulb", competitorHas: true, validexioHas: true, description: "Finding or defining a startup concept." },
        { id: 2, name: "Market Context", iconName: "FileText", competitorHas: true, validexioHas: true, description: "Understanding the market landscape." },
        { id: 3, name: "Production Code", iconName: "Code2", competitorHas: false, validexioHas: true, description: "Live Next.js React codebase ready to deploy." },
        { id: 4, name: "Verified Sales Leads", iconName: "Users", competitorHas: false, validexioHas: true, description: "Selling directly to 10 verified target buyers." }
      ]
    },
    sections: [
      {
        id: "01",
        title: "Validation Approach",
        subtitle: "Browsing vs Building.",
        features: [
          { name: "Core Job", pill: "Actionable", validexio: { title: "Validate your specific idea with live code", impact: "→ We don't just give you an idea. We give you the AWS/Vercel architecture to build yours." }, competitor: { title: "Browse 1,000+ pre-researched startup ideas" } },
          { name: "Data Source", pill: "Precision", validexio: { title: "Live Code Generation & Lead Scraping", impact: "→ Your assets reflect the market right now, custom-built for your concept." }, competitor: { title: "Curated research team + AI analysis" } },
          { name: "Competitor Data", pill: "Deep Technical", validexio: { title: "Tech Stack Teardowns", impact: "→ We analyze what tech your competitors use so you can code a better product." }, competitor: { title: "Market analysis included in catalog entries" } }
        ]
      },
      {
        id: "02",
        title: "The Execution Payload",
        subtitle: "Inspiration vs Production.",
        features: [
          { name: "Software Engineering", pill: "Production-Ready", validexio: { title: "Next.js / React Codebase", impact: "→ Don't just read about an idea. Deploy it today." }, competitor: { title: "None. Only provides idea descriptions." } },
          { name: "Customer Acquisition", pill: "Verified Leads", validexio: { title: "10 B2B Decision Makers", impact: "→ Start selling immediately with a verified lead list." }, competitor: { title: "Provides general market sizing." } },
          { name: "User Interface Design", pill: "High-Fidelity", validexio: { title: "2 Fully Designed UI Layouts", impact: "→ Stunning, expensive-looking designs ready for production." }, competitor: { title: "No UI/UX deliverables." } }
        ]
      }
    ],
    fairAssessment: {
      description: "IdeaBrowser has built a real idea-discovery platform with a lot of thought behind it. It's excellent for founders who don't know what to build yet.",
      pros: [
        { title: "The Catalog", description: "1,000+ pre-researched ideas with market sizing, competitor context, and trend signals." },
        { title: "Ecosystem", description: "Built by a trusted team (ex-Reddit, ex-TikTok) with a strong builder community." },
        { title: "Daily Idea Cadence", description: "Creates a habit loop with a fresh idea walkthrough every day." }
      ]
    },
    pricingReveal: {
      competitorTiers: [
        { name: "Free", price: "$0", validatesIdea: "No. Daily Idea of the Day only." },
        { name: "Starter", price: "$499/yr", validatesIdea: "No. Browse the catalog and trends." },
        { name: "Pro", price: "$1,499/yr", validatesIdea: "Yes. 3 Research reports/month." },
        { name: "Empire", price: "$2,999/yr", validatesIdea: "Yes. 9 reports/month + coaching." }
      ],
      validexioPricing: "INR 1499 one-time. No annual commitment. That is 51x less than IdeaBrowser Pro for execution assets."
    },
    verdict: {
      validexioBestFor: [
        "You have a specific idea and need to start building.",
        "You need hard technical assets like React code and DB schemas.",
        "You want 10 verified B2B leads to prove real traction.",
        "You want a flat fee without recurring $1,499/yr subscriptions."
      ],
      competitorBestFor: [
        "You don't know what to build yet and want to browse ideas.",
        "You want daily inspiration and trend signals.",
        "You value coaching, AMAs, and community access.",
        "You have the budget for a premium annual subscription."
      ]
    }
  },
  {
    id: "venturai",
    name: "Ventur.ai",
    slug: "venturai",
    website: "https://ventur.ai",
    heroHeadline: "Ventur Generates Reports.",
    validexioHeadline: "Validexio <span class='gradient-text'>Generates Startups</span>.",
    heroSubheadline: "Ventur.ai generates lengthy PDF market analysis reports based on your idea. Validexio skips the paperwork and hands you the React code, API architecture, and verified B2B leads to actually launch.",
    targetOutputCompetitor: "PDF Market Analysis Reports",
    targetOutputValidexio: "Complete Technical Stack",
    pipeline: {
      title: "PDFs vs Live Deployments",
      description: "Ventur.ai is great for market analysis. We are built for technical execution and revenue generation.",
      stages: [
        { id: 1, name: "Idea Input", iconName: "Lightbulb", competitorHas: true, validexioHas: true, description: "Describing your startup concept." },
        { id: 2, name: "Market Analysis", iconName: "FileText", competitorHas: true, validexioHas: true, description: "Generating a comprehensive market report." },
        { id: 3, name: "React Codebase", iconName: "Code2", competitorHas: false, validexioHas: true, description: "Actual production-ready frontend code." },
        { id: 4, name: "Outreach Leads", iconName: "Users", competitorHas: false, validexioHas: true, description: "10 B2B buyers ready to purchase." }
      ]
    },
    sections: [
      {
        id: "01",
        title: "Intelligence & Validation",
        subtitle: "Analysis vs Execution.",
        features: [
          { name: "Output Strategy", pill: "Actionable", validexio: { title: "Technical Blueprints", impact: "→ We tell you the exact AWS services and DB schemas you need to build." }, competitor: { title: "Provides qualitative feedback and market analysis." } },
          { name: "Idea Roadmapping", pill: "Execution", validexio: { title: "API Spec Generation", impact: "→ We map out the exact endpoints your developer needs to code." }, competitor: { title: "Provides a standard business canvas model." } },
          { name: "Customer Discovery", pill: "Real Data", validexio: { title: "Verified Target Buyers", impact: "→ We give you 10 real companies to email today." }, competitor: { title: "Provides high-level demographic data." } }
        ]
      },
      {
        id: "02",
        title: "The Execution Payload",
        subtitle: "Reading vs Shipping.",
        features: [
          { name: "Engineering Assets", pill: "Production-Ready", validexio: { title: "Live Developer Dashboard", impact: "→ Get the actual React code to launch to Vercel immediately." }, competitor: { title: "None. Strictly report-based." } },
          { name: "Design Assets", pill: "High-Fidelity", validexio: { title: "2 Complete UI Layouts", impact: "→ Professionally designed application interfaces." }, competitor: { title: "Zero design deliverables." } },
          { name: "Sales Pipeline", pill: "Verified Leads", validexio: { title: "10 Target Buyers", impact: "→ Start selling immediately." }, competitor: { title: "Zero lead generation." } }
        ]
      }
    ],
    fairAssessment: {
      description: "Ventur.ai provides detailed and structured market reports, making it a good tool for founders who need to present formal research.",
      pros: [
        { title: "Detailed Reports", description: "Generates comprehensive PDF reports analyzing the market landscape." },
        { title: "Business Canvas", description: "Automatically populates a Business Model Canvas for your idea." },
        { title: "Professional Formatting", description: "Outputs highly polished documents suitable for stakeholders." }
      ]
    },
    pricingReveal: {
      competitorTiers: [
        { name: "Single Report", price: "$19", validatesIdea: "Yes. One detailed report." },
        { name: "Pro Plan", price: "$49/mo", validatesIdea: "Yes. Unlimited reports." }
      ],
      validexioPricing: "INR 1499 one-time. No recurring fees, and you get complete execution assets."
    },
    verdict: {
      validexioBestFor: [
        "You want technical blueprints over a PDF report.",
        "You need API specifications and database schemas to start coding.",
        "You want to validate by selling to 10 real leads.",
        "You want to launch a live MVP this weekend."
      ],
      competitorBestFor: [
        "You need a formal market analysis report to share.",
        "You prefer reading extensive market theory.",
        "You are strictly in the planning and research phase."
      ]
    }
  }
];

// Add data to existing competitors
for (const [slug, data] of Object.entries(enrichments)) {
        const injection = `
    "fairAssessment": ${JSON.stringify(data.fairAssessment, null, 6).trim()},
    "pricingReveal": ${JSON.stringify(data.pricingReveal, null, 6).trim()},
    "verdict": ${JSON.stringify(data.verdict, null, 6).trim()},`;

        const searchString = '"slug": "' + slug + '",';
        const searchIndex = content.indexOf(searchString);
        
        if (searchIndex !== -1) {
            const pipelineIndex = content.indexOf('"pipeline":', searchIndex);
            if (pipelineIndex !== -1) {
                const slice = content.slice(searchIndex, pipelineIndex);
                if (!slice.includes('"fairAssessment"')) {
                    content = content.slice(0, pipelineIndex) + injection + '\n    ' + content.slice(pipelineIndex);
                }
            }
        }
}

// Ensure the new fields use quotes
content = content.replace(/fairAssessment:/g, '"fairAssessment":');
content = content.replace(/pricingReveal:/g, '"pricingReveal":');
content = content.replace(/verdict:/g, '"verdict":');

// Add new competitors at the bottom
if (!content.includes('ideabrowser')) {
    const newCompetitorsStr = newCompetitors.map(c => JSON.stringify(c, null, 4)).join(',\\n  ');
    content = content.replace(/\\n\\];/, ',\\n  ' + newCompetitorsStr + '\\n];');
}

fs.writeFileSync(filePath, content);
console.log("Data fixed robustly.");
