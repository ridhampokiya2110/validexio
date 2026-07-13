export const DUMMY_REPORTS: Record<string, any> = {
  "heeratrack": {
    id: "ex-heeratrack",
    idea: {
      title: "HEERATRACK - B2B Diamond Logistics",
      industry: "Logistics & Supply Chain"
    },
    createdAt: new Date(),
    processingTime: 14500,
    validationScore: 92,
    marketAnalysis: {
      summary: "The diamond logistics market in Surat and Mumbai is highly fragmented and reliant on legacy systems, presenting a massive opportunity for a modern, tech-enabled reconciliation engine.",
      tam: "INR 18,000Cr",
      sam: "INR 5,000Cr",
      som: "INR 500Cr",
      growth: "12% CAGR",
      trends: ["Digital Reconciliation", "High-Value Asset Tracking", "Automated Audits"],
      score: 85,
      reasoning: "High need for digitization in a traditionally opaque market.",
    },
    swotAnalysis: {
      strengths: ["Domain expertise", "Niche focus", "High entry barrier"],
      weaknesses: ["Requires high trust", "Long sales cycles"],
      opportunities: ["Expand to other precious stones", "Integrate with insurance providers"],
      threats: ["Incumbents modernizing", "Regulatory changes"],
    },
    competitors: [
      {
        name: "Legacy Trackers Inc",
        description: "Traditional barcode scanners used by angadias.",
        pricing: "High Enterprise",
        differentiator: "Automated reconciliation vs manual checking",
        strengths: ["Trust network", "Established"],
        weaknesses: ["Manual", "Prone to errors"],
        weakness: "No real-time analytics"
      }
    ],
    customerPersonas: [
      {
        name: "Rajesh Bhai",
        title: "Head of Operations",
        age: "45",
        painPoints: ["Missing parcels", "Reconciliation takes days"],
        goals: ["Zero loss", "Real-time tracking"],
        buyingBehavior: "Relationship-driven",
        channels: ["Industry networks", "Direct Outreach"],
        willingnessToPay: "High"
      }
    ],
    revenuePotential: {
      year1: "$500k ARR",
      year2: "$2M ARR",
      year3: "$10M ARR",
      revenueStreams: ["SaaS subscriptions", "Per-parcel tracking fee"],
      assumptions: ["Capture 5% of Surat market in Year 1", "Low churn due to high switching cost"],
      unitEconomics: {
        competitorPricingTiers: [{ competitorName: "Legacy Systems", price: "$5,000/mo", billingModel: "Flat" }],
        suggestedPricingStrategy: { recommendedPrice: "$2,000/mo + $0.50/parcel", justification: "Lowers entry barrier while capturing upside." },
        projectedMargins: "80%"
      }
    },
    salesFunnel: {
      awareness: { channels: ["Diamond associations", "LinkedIn"], content: ["Case studies on lost parcels", "Security whitepapers"] },
      consideration: { touchpoints: ["Live demo", "ROI calculator"], objections: ["Data privacy", "Trusting a new system"] },
      conversion: { triggers: ["A major loss event", "Audit season"], incentives: ["Free pilot", "Data migration help"] },
      retention: { strategies: ["Quarterly business reviews", "Custom reporting"], metrics: ["Parcels tracked", "Time saved"] }
    },
    riskAnalysis: [
      { risk: "Lack of trust from traditional brokers", probability: "High", impact: "High", mitigation: "Partner with respected industry veterans for endorsement." }
    ],
    pricingRecommendation: {
      strategy: "Hybrid SaaS + Usage",
      rationale: "Aligns cost with value derived from volume.",
      tiers: [
        { name: "Starter", price: "$500/mo", features: ["1,000 parcels", "Basic reporting"], target: "Small brokers" },
        { name: "Enterprise", price: "Custom", features: ["Unlimited", "API Access"], target: "Large export houses" }
      ]
    },
    growthOpportunities: [
      { tactic: "Insurance Integration", description: "Offer instant insurance for tracked parcels.", effort: "High", impact: "HIGH", timeframe: "12 months" }
    ],
    acquisitionStrategy: {
      primaryChannels: ["Direct Sales", "Industry Partnerships"],
      firstCustomerTactics: ["Offer free pilot to top 5 brokers in Surat.", "Host an exclusive dinner for operations heads."],
      communityBuilding: "Create a private WhatsApp group for diamond ops managers.",
      contentStrategy: "Publish reports on supply chain efficiency.",
      partnershipOpportunities: ["Secure transit companies", "Insurance firms"]
    },
    actionPlan: {
      day30: [
        { title: "Build MVP tracker", details: "Develop core barcode scanning functionality and secure database.", metric: "Launch v1 to staging" },
        { title: "Sign 2 pilot customers", details: "Onboard two trusted brokers to test the system in real-world scenarios.", metric: "2 active accounts" }
      ],
      day60: [
        { title: "Refine reconciliation engine", details: "Optimize matching algorithms based on pilot feedback.", metric: "Reduce sync time to <5s" },
        { title: "Onboard 5 more customers", details: "Expand pilot to medium-sized brokers.", metric: "7 total active accounts" }
      ],
      day90: [
        { title: "Launch pricing model", details: "Transition pilot users to paid tiers and implement billing system.", metric: "First $1k revenue" },
        { title: "Hire first SDR", details: "Recruit sales rep for direct outreach in Surat.", metric: "1 SDR hired" }
      ]
    },
    landingPageCopy: {
      headline: "Stop Losing Diamonds in Transit.",
      subheadline: "The first automated reconciliation engine built specifically for the Surat-Mumbai diamond corridor.",
      valueProp: "Zero Loss Guarantee",
      cta: "Book a Demo",
      socialProof: "Trusted by top 10 export houses.",
      features: [{ title: "Real-time Tracking", description: "Know exactly where every parcel is." }, { title: "Automated Reconciliation", description: "End-of-day matching in seconds." }]
    },
    codeBoilerplate: `// Shipment Dashboard Component
export default function ShipmentDashboard() {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    fetch('/api/transit/high-value')
      .then(res => res.json())
      .then(data => setShipments(data));
  }, []);

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl">
      <h2 className="text-xl font-bold text-gray-900">Active Reconciliations</h2>
      <div className="mt-4 grid gap-4">
        {shipments.map(s => (
          <TransitCard key={s.id} data={s} />
        ))}
      </div>
    </div>
  );
}`
  },
  "laminar-clone": {
    id: "ex-laminar-clone",
    idea: {
      title: "LAMINAR CLONE - Data Engine Observability",
      industry: "Developer Tools"
    },
    createdAt: new Date(),
    processingTime: 12400,
    validationScore: 88,
    marketAnalysis: {
      summary: "As Data Engine adoption grows, the need for LLM observability and tracing is exploding. Developers need tools to understand token usage, latency, and hallucination rates.",
      tam: "$5B",
      sam: "$1B",
      som: "$50M",
      growth: "45% CAGR",
      trends: ["LLMOps", "Prompt Engineering", "Cost Optimization"],
      score: 90,
      reasoning: "High growth market with urgent developer pain points.",
    },
    swotAnalysis: {
      strengths: ["Open-source approach", "Developer-first UX"],
      weaknesses: ["Resource intensive to process logs", "High competition"],
      opportunities: ["Enterprise compliance features", "Automated prompt optimization"],
      threats: ["OpenAI building native observability", "LangSmith dominating"],
    },
    competitors: [
      {
        name: "LangSmith",
        description: "Observability by the LangChain team.",
        pricing: "Usage based",
        differentiator: "Framework agnostic, lightweight SDK",
        strengths: ["Ecosystem integration", "First-mover"],
        weaknesses: ["Vendor lock-in", "Complex UI"],
        weakness: "Heavy dependency on LangChain"
      }
    ],
    customerPersonas: [
      {
        name: "Data Engine Engineer Alex",
        title: "Senior Data Engine Engineer",
        age: "28",
        painPoints: ["Debugging prompts is a nightmare", "Costs are spiraling"],
        goals: ["Ship reliable Data Engine apps", "Reduce token spend"],
        buyingBehavior: "Self-serve, open-source first",
        channels: ["Twitter/X", "GitHub", "HackerNews"],
        willingnessToPay: "Medium"
      }
    ],
    revenuePotential: {
      year1: "$200k ARR",
      year2: "$1M ARR",
      year3: "$5M ARR",
      revenueStreams: ["Cloud hosting", "Enterprise support"],
      assumptions: ["1000 active OSS users", "5% conversion to paid cloud"],
      unitEconomics: {
        competitorPricingTiers: [{ competitorName: "LangSmith", price: "$39/mo + usage", billingModel: "Hybrid" }],
        suggestedPricingStrategy: { recommendedPrice: "$20/mo + $0.001/trace", justification: "Undercut incumbents to gain market share." },
        projectedMargins: "75%"
      }
    },
    salesFunnel: {
      awareness: { channels: ["GitHub trending", "Dev.to"], content: ["Open-source repo", "Technical deep-dives"] },
      consideration: { touchpoints: ["Readme.md", "Local quickstart"], objections: ["Data privacy", "Integration effort"] },
      conversion: { triggers: ["Reaching free tier limit", "Need for team collaboration"], incentives: ["Free startup credits"] },
      retention: { strategies: ["Continuous SDK updates", "Community support"], metrics: ["Traces ingested/day"] }
    },
    riskAnalysis: [
      { risk: "High infrastructure costs", probability: "Medium", impact: "High", mitigation: "Use ClickHouse for efficient log storage." }
    ],
    pricingRecommendation: {
      strategy: "Open-Core Freemium",
      rationale: "Developers demand self-hosting options.",
      tiers: [
        { name: "Hobby", price: "$0", features: ["10k traces", "1 day retention"], target: "Indie hackers" },
        { name: "Pro", price: "$50/mo", features: ["1M traces", "30 day retention"], target: "Startups" }
      ]
    },
    growthOpportunities: [
      { tactic: "Automated Evaluations", description: "Build an LLM-as-a-judge feature.", effort: "Medium", impact: "HIGH", timeframe: "3 months" }
    ],
    acquisitionStrategy: {
      primaryChannels: ["Product Hunt", "GitHub"],
      firstCustomerTactics: ["Launch on HackerNews", "Sponsor Data Engine newsletters"],
      communityBuilding: "Discord server for Data Engine Engineers.",
      contentStrategy: "Write about advanced RAG debugging.",
      partnershipOpportunities: ["Vector Databases", "Model Providers"]
    },
    actionPlan: {
      day30: [
        { title: "Release OSS core", details: "Publish the open-source trace ingestion API to GitHub.", metric: "OSS Launch" },
        { title: "Get 100 GitHub stars", details: "Promote repository on HackerNews and Dev.to.", metric: "100 Stars" }
      ],
      day60: [
        { title: "Launch managed cloud offering", details: "Release hosted version with Stripe billing integration.", metric: "Cloud GA" },
        { title: "Get first paying customer", details: "Convert a high-usage OSS user to the managed cloud.", metric: "1 Paid Customer" }
      ],
      day90: [
        { title: "Implement automated evals", details: "Ship LLM-as-a-judge features for quality testing.", metric: "Feature Launch" },
        { title: "Reach $1k MRR", details: "Focus on organic growth and community support to drive revenue.", metric: "$1k MRR" }
      ]
    },
    landingPageCopy: {
      headline: "See What Your LLM is Actually Doing.",
      subheadline: "The open-source observability platform for Data Engine engineers. Debug prompts, trace calls, and optimize costs in minutes.",
      valueProp: "Open Source LLMOps",
      cta: "Start Tracing for Free",
      socialProof: "Used by 500+ Data Engine startups.",
      features: [{ title: "Visual Trace Viewer", description: "Inspect every step of your chain." }, { title: "Cost Tracking", description: "Monitor token usage in real-time." }]
    },
    codeBoilerplate: `// Trace Initialization
import { initTracing } from '@laminar/sdk';

initTracing({
  apiKey: process.env.LAMINAR_API_KEY,
  projectId: 'prod-api'
});

export async function generateResponse(prompt) {
  // Traces are automatically collected for this span
  const response = await llm.chat(prompt);
  return response;
}`
  }
};

// Default fallback data for any other slug
export const DEFAULT_DUMMY_REPORT = {
  ...DUMMY_REPORTS["heeratrack"],
  id: "ex-default",
  idea: {
    title: "Example Project",
    industry: "SaaS / Software"
  }
};
