import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const examples = [
  {
    slug: "heeratrack",
    projectName: "Heeratrack",
    tagline: "B2B Diamond Logistics & Reconciliation",
    rigorScore: 92,
    tamValuation: "INR 18,000Cr",
    targetPricing: "INR 149,000 / yr",
    blueprint: {
      architectureTier: "Enterprise High-Compliance",
      infrastructureComponents: {
        alb: {
          scheme: "internet-facing",
          listeners: [{ port: 443, protocol: "HTTPS", sslPolicy: "ELBSecurityPolicy-TLS-1-2-2017-01" }],
          rules: [{ type: "forward", targetGroup: "heeratrack-tg" }]
        },
        autoScaling: {
          minSize: 2,
          maxSize: 10,
          targetTrackingConfiguration: { predefinedMetricType: "ASGAverageCPUUtilization", targetValue: 60.0 }
        },
        database: {
          engine: "PostgreSQL 15",
          instanceClass: "db.r6g.large",
          multiAZ: true,
          storageEncrypted: true
        }
      },
      sqlSchemaDdl: `CREATE TABLE shipments (
  id UUID PRIMARY KEY,
  tracking_id VARCHAR(50) UNIQUE NOT NULL,
  origin_vault VARCHAR(100),
  destination_vault VARCHAR(100),
  carat_weight DECIMAL(10,3),
  insurance_value_inr BIGINT,
  status VARCHAR(20) DEFAULT 'IN_TRANSIT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
      reactComponentRaw: `export default function ShipmentDashboard() {
  return (
    <div className="bg-[#1B1716] p-6 rounded-xl border border-[#75070C]">
      <h2 className="text-[#EDEBDE] font-bold text-xl mb-4">Active Transit Routes</h2>
      <div className="glass-card p-4">
        <p className="text-[#EDEBDE]/80 text-sm">Tracking ID: HT-99281-DB</p>
        <p className="text-[#FFEDAB] font-bold">Status: Secure Transit (Surat - Mumbai)</p>
      </div>
    </div>
  );
}`
    },
    gtm: {
      apolloSearchCriteria: `("Logistics Director" OR "Head of Security") AND ("Diamond" OR "Jewelry") AND (company_headcount > 50) AND (country: "India")`,
      sampleLeads: [
        { name: "Rajesh K.", title: "Head of Operations", company: "Surat Diamond Bourse", domain: "sdb.in" },
        { name: "Anil P.", title: "VP Logistics", company: "Kiran Gems", domain: "kirangems.com" },
        { name: "Meera S.", title: "Chief Security Officer", company: "Dharmanandan Diamonds", domain: "ddpl.com" }
      ],
      outboundCopy: `Subject: Reconciling High-Value Transit (Surat to BKC)\n\nHi {{first_name}},\n\nI noticed {{company}} handles significant volume between Surat and Mumbai. Most directors I speak with lose sleep over manual reconciliation and insurance gaps during transit.\n\nWe built Heeratrack to automate multi-point verification for high-value logistics. It connects directly with your vault sensors.\n\nWorth a 10-minute technical review next Tuesday?`,
      n8nWebhookJson: {
        name: "Incoming Shipment Trigger",
        nodes: [
          { type: "n8n-nodes-base.webhook", parameters: { path: "heeratrack/inbound", httpMethod: "POST" } },
          { type: "n8n-nodes-base.postgres", parameters: { operation: "insert", table: "shipments" } }
        ]
      }
    }
  },
  {
    slug: "laminar-clone",
    projectName: "Laminar Clone",
    tagline: "AI Dev Tool Observability",
    rigorScore: 88,
    tamValuation: "INR 4,500Cr",
    targetPricing: "INR 24,000 / mo",
    blueprint: {
      architectureTier: "High-Throughput Ingestion",
      infrastructureComponents: {
        ingestion: { type: "AWS Kinesis Data Streams", shardCount: 4, retentionPeriodHours: 24 },
        compute: { type: "AWS Lambda", runtime: "Node.js 20.x", memorySize: 1024, timeout: 30 },
        storage: { type: "ClickHouse Cloud", tier: "Production", replicas: 2 }
      },
      sqlSchemaDdl: `CREATE TABLE llm_traces (
  trace_id UUID,
  project_id UUID,
  prompt_tokens INT,
  completion_tokens INT,
  latency_ms INT,
  model_name VARCHAR(50),
  timestamp DateTime
) ENGINE = MergeTree()
ORDER BY (project_id, timestamp);`,
      reactComponentRaw: `export default function LatencyChart() {
  return (
    <div className="bg-white p-6 border border-[#1B1716]/10 rounded-xl">
      <h3 className="text-[#1B1716] font-bold">P99 Latency Metrics</h3>
      <div className="h-48 flex items-end gap-2 mt-4">
        {[40, 65, 30, 85, 45, 90, 50].map((h, i) => (
          <div key={i} className="w-10 bg-[#75070C]/80" style={{ height: \`\${h}%\` }} />
        ))}
      </div>
    </div>
  );
}`
    },
    gtm: {
      apolloSearchCriteria: `("CTO" OR "VP Engineering" OR "Head of AI") AND (technologies: "OpenAI" OR "Anthropic") AND (company_funding > 1000000)`,
      sampleLeads: [
        { name: "David C.", title: "CTO", company: "Jasper", domain: "jasper.ai" },
        { name: "Sarah L.", title: "VP Eng", company: "Copy.ai", domain: "copy.ai" },
        { name: "Alex M.", title: "Head of AI", company: "Writesonic", domain: "writesonic.com" }
      ],
      outboundCopy: `Subject: LLM latency spikes in production\n\nHi {{first_name}},\n\nWith {{company}} scaling its AI features, tracking token usage and P99 latency across different models usually becomes a massive blind spot.\n\nWe built a high-throughput observability pipeline specifically for GenAI apps (backed by ClickHouse). Drop-in integration in 2 lines of code.\n\nOpen to testing it on your staging environment?`,
      n8nWebhookJson: {
        name: "Alert Routing",
        nodes: [
          { type: "n8n-nodes-base.webhook", parameters: { path: "alerts/latency", httpMethod: "POST" } },
          { type: "n8n-nodes-base.slack", parameters: { channel: "#ai-ops-alerts", text: "Latency spike detected in Model: {{ $json.model }}" } }
        ]
      }
    }
  },
  {
    slug: "cleanops-ai",
    projectName: "CleanOps AI",
    tagline: "Micro-SaaS Fleet Management for Commercial Cleaning",
    rigorScore: 95,
    tamValuation: "INR 2,200Cr",
    targetPricing: "INR 9,999 / mo",
    blueprint: {
      architectureTier: "Standard B2B SaaS",
      infrastructureComponents: {
        frontend: "Vercel + Next.js App Router",
        database: "Supabase (PostgreSQL + PostGIS for tracking)",
        auth: "Supabase Auth (Magic Links)"
      },
      sqlSchemaDdl: `CREATE TABLE fleet_locations (
  id UUID PRIMARY KEY,
  crew_id UUID REFERENCES crews(id),
  location GEOGRAPHY(POINT, 4326),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX fleet_locations_gix ON fleet_locations USING GIST (location);`,
      reactComponentRaw: `export default function CrewTracker() {
  return (
    <div className="p-4 border border-[#75070C] bg-[#FDFCF8] rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-[#1B1716]">Crew Alpha</h4>
        <span className="text-xs bg-[#FFEDAB] text-[#1B1716] px-2 py-1 rounded">On Site</span>
      </div>
      <p className="text-[#1B1716]/60 text-sm">Site: TechPark Tower B</p>
      <p className="text-[#1B1716]/60 text-sm">ETA Completion: 14:30</p>
    </div>
  );
}`
    },
    gtm: {
      apolloSearchCriteria: `("Owner" OR "Operations Manager") AND (industry: "Facilities Services") AND (employees: 10-50)`,
      sampleLeads: [
        { name: "John D.", title: "Owner", company: "Pristine Commercial", domain: "pristinecleaning.com" },
        { name: "Mike T.", title: "Ops Manager", company: "Metro Facility Services", domain: "metrofac.com" }
      ],
      outboundCopy: `Subject: Where are your crews right now?\n\nHi {{first_name}},\n\nManaging 10+ cleaning crews via WhatsApp groups is a nightmare when clients ask for ETAs.\n\nCleanOps AI gives you a live dashboard of every crew, automated client ETAs, and geo-fenced clock-ins.\n\nCan I show you a 2-min demo of how it works?`,
      n8nWebhookJson: {
        name: "End of Shift Report",
        nodes: [
          { type: "n8n-nodes-base.cron", parameters: { rule: { type: "cron", value: "0 18 * * *" } } },
          { type: "n8n-nodes-base.postgres", parameters: { operation: "executeQuery", query: "SELECT * FROM shift_logs WHERE date = CURRENT_DATE" } },
          { type: "n8n-nodes-base.email", parameters: { to: "manager@company.com", subject: "Daily Shift Report" } }
        ]
      }
    }
  },
  {
    slug: "openfx",
    projectName: "OpenFX",
    tagline: "Fintech Cross-Border Settlement Rails",
    rigorScore: 82,
    tamValuation: "INR 45,000Cr",
    targetPricing: "0.2% per txn",
    blueprint: {
      architectureTier: "PCI-DSS Compliant Financial",
      infrastructureComponents: {
        network: { vpc: "Private subnets only", natGateway: "Dedicated per AZ" },
        database: { engine: "Aurora PostgreSQL Serverless v2", encryption: "AWS KMS Customer Managed Keys" },
        secrets: "AWS Secrets Manager with automatic rotation"
      },
      sqlSchemaDdl: `CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  sender_id UUID,
  receiver_id UUID,
  source_currency CHAR(3),
  target_currency CHAR(3),
  exchange_rate DECIMAL(15,6),
  amount_settled DECIMAL(15,2),
  aml_cleared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
      reactComponentRaw: `export default function SettlementQueue() {
  return (
    <div className="glass-card p-6 border-l-4 border-[#75070C]">
      <h3 className="font-black text-[#1B1716]">Pending Settlements (T+1)</h3>
      <div className="mt-4 flex justify-between border-b border-[#1B1716]/10 pb-2">
        <span className="text-[#1B1716]/60">USD to INR</span>
        <span className="font-bold text-[#1B1716]">$1,240,000.00</span>
      </div>
      <button className="mt-4 w-full bg-[#1B1716] text-[#EDEBDE] py-2 rounded font-bold hover:bg-[#630102] transition-colors">
        Execute Batch
      </button>
    </div>
  );
}`
    },
    gtm: {
      apolloSearchCriteria: `("CFO" OR "VP Finance" OR "Head of Treasury") AND (industry: "Information Technology") AND (country: "India")`,
      sampleLeads: [
        { name: "Vikram B.", title: "CFO", company: "Infosys", domain: "infosys.com" },
        { name: "Priya R.", title: "VP Finance", company: "TCS", domain: "tcs.com" }
      ],
      outboundCopy: `Subject: Slashing your USD to INR conversion spread\n\nHi {{first_name}},\n\nMost IT service firms are losing 1-2% on hidden FX spreads when repatriating US revenue.\n\nOpenFX connects directly to wholesale liquidity providers, guaranteeing interbank rates + a flat 0.2% fee. We integrate directly with your ERP.\n\nAre you open to comparing our rates against your current banking partner?`,
      n8nWebhookJson: {
        name: "AML Screening Trigger",
        nodes: [
          { type: "n8n-nodes-base.webhook", parameters: { path: "transaction/new", httpMethod: "POST" } },
          { type: "n8n-nodes-base.httpRequest", parameters: { url: "https://api.complyadvantage.com/screen", method: "POST" } }
        ]
      }
    }
  },
  {
    slug: "nicheledger",
    projectName: "NicheLedger",
    tagline: "Productized AI Bookkeeping for Agencies",
    rigorScore: 89,
    tamValuation: "INR 1,200Cr",
    targetPricing: "INR 45,000 / mo",
    blueprint: {
      architectureTier: "Standard B2B SaaS + AI Worker Queue",
      infrastructureComponents: {
        app: "Next.js App Router on Vercel",
        queue: "BullMQ + Redis (Upstash)",
        workers: "Render Background Workers (Node.js)",
        ai: "OpenAI GPT-4o API for receipt OCR & categorization"
      },
      sqlSchemaDdl: `CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY,
  agency_id UUID,
  raw_description TEXT,
  ai_categorized_account VARCHAR(100),
  confidence_score DECIMAL(4,3),
  amount DECIMAL(12,2),
  human_reviewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
      reactComponentRaw: `export default function AILedgerReview() {
  return (
    <div className="p-6 bg-white border border-[#1B1716]/10 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
        <h4 className="font-bold text-[#1B1716]">Needs Human Review</h4>
      </div>
      <p className="text-sm text-[#1B1716]/60">Adobe Creative Cloud - $54.99</p>
      <p className="text-sm font-bold text-[#630102]">AI Suggested: Software Subscriptions (92% confidence)</p>
      <div className="flex gap-2 mt-4">
        <button className="flex-1 bg-[#FFEDAB] text-[#1B1716] py-2 rounded font-bold">Approve</button>
        <button className="flex-1 bg-[#1B1716]/5 text-[#1B1716] py-2 rounded font-bold">Edit</button>
      </div>
    </div>
  );
}`
    },
    gtm: {
      apolloSearchCriteria: `("CEO" OR "Founder" OR "Managing Director") AND (industry: "Marketing & Advertising") AND (employees: 10-50)`,
      sampleLeads: [
        { name: "Emily W.", title: "Founder", company: "Digital Spark Agency", domain: "digitalspark.co" },
        { name: "James H.", title: "CEO", company: "Growth Drivers", domain: "growthdrivers.io" }
      ],
      outboundCopy: `Subject: Your agency's messy books\n\nHi {{first_name}},\n\nMost agency founders hate month-end reconciliation. Traditional bookkeepers don't understand SaaS expenses, ad spend, and contractor payouts.\n\nNicheLedger uses AI to auto-categorize 95% of your agency transactions, with human CPAs handling the rest. Close your books in 2 days, not 2 weeks.\n\nWorth a quick chat?`,
      n8nWebhookJson: {
        name: "Receipt OCR Pipeline",
        nodes: [
          { type: "n8n-nodes-base.webhook", parameters: { path: "receipt/upload", httpMethod: "POST" } },
          { type: "n8n-nodes-base.httpRequest", parameters: { url: "https://api.openai.com/v1/chat/completions", method: "POST" } }
        ]
      }
    }
  }
];

async function main() {
  console.log("Seeding Database via Prisma...");
  for (const ex of examples) {
    const { blueprint, gtm, ...reportData } = ex;
    
    // Upsert the main report
    const report = await prisma.sampleReport.upsert({
      where: { slug: ex.slug },
      update: reportData,
      create: reportData,
    });

    // Upsert the blueprint
    await prisma.technicalBlueprint.upsert({
      where: { reportId: report.id },
      update: {
        architectureTier: blueprint.architectureTier,
        infrastructureComponents: blueprint.infrastructureComponents,
        sqlSchemaDdl: blueprint.sqlSchemaDdl,
        reactComponentRaw: blueprint.reactComponentRaw,
      },
      create: {
        reportId: report.id,
        architectureTier: blueprint.architectureTier,
        infrastructureComponents: blueprint.infrastructureComponents,
        sqlSchemaDdl: blueprint.sqlSchemaDdl,
        reactComponentRaw: blueprint.reactComponentRaw,
      },
    });

    // Upsert the GTM asset
    await prisma.gtmAsset.upsert({
      where: { reportId: report.id },
      update: {
        apolloSearchCriteria: gtm.apolloSearchCriteria,
        sampleLeads: gtm.sampleLeads,
        outboundCopy: gtm.outboundCopy,
        n8nWebhookJson: gtm.n8nWebhookJson,
      },
      create: {
        reportId: report.id,
        apolloSearchCriteria: gtm.apolloSearchCriteria,
        sampleLeads: gtm.sampleLeads,
        outboundCopy: gtm.outboundCopy,
        n8nWebhookJson: gtm.n8nWebhookJson,
      },
    });

    console.log("Seeded: " + ex.slug);
  }
  console.log("Seeding Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
