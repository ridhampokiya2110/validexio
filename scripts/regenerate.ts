import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function regenerate() {
  const { prisma } = await import("../lib/db");
  const { analyzeStartupMarket, generateStartupProduct } = await import("../lib/gemini");
  const { fetchB2BLeads } = await import("../lib/api/leads");

  const ideaId = "cmr8xjp1d0003s00pu8c3v2eq";
  const userId = "cmqdxx0rg0003u8gs5i5cudez";
  const reportId = "cmr8ybkqr0001u87wtyt4261o";

  console.log("Fetching idea...");
  const idea = await prisma.idea.findFirst({ where: { id: ideaId } });
  
  if (!idea) {
    console.error("Idea not found");
    return;
  }

  // Force max limits for Team plan
  const maxLeads = 8;
  const maxCompetitors = 5;
  const maxPersonas = 5;

  console.log("Firing parallel data gathering requests...");
  const tavilyPromise = import("../lib/api/tavily").then(m => m.fetchCompetitorIntel(idea.title, idea.industry));
  const serpApiPromise = import("../lib/api/serpapi").then(m => m.fetchRealCompetitors(idea.title, idea.industry, idea.location || "global", maxCompetitors));
  const hnPromise = import("../lib/api/hackernews").then(m => m.fetchHNSentiment(idea.title, idea.industry));
  const redditPromise = import("../lib/api/reddit").then(m => m.fetchRedditFrustrations(idea.title, idea.industry));
  const apolloPromise = fetchB2BLeads(idea.industry, idea.location || "global", maxLeads);

  const [marketContext, competitorContext, hnContext, redditContext] = await Promise.all([
    tavilyPromise, serpApiPromise, hnPromise, redditPromise
  ]);

  const socialProofContext = [hnContext, redditContext].filter(Boolean).join("\n\n");

  const payload = {
    title: idea.title,
    description: idea.description,
    industry: idea.industry,
    targetMarket: idea.targetMarket || undefined,
    location: idea.location || undefined,
    pricingModel: idea.pricingModel || undefined,
    marketContext: marketContext !== "No real-time market data available." ? marketContext : undefined,
    competitorContext: competitorContext !== "No real-time local competitor data available." ? competitorContext : undefined,
    socialProofContext: socialProofContext || undefined,
    maxPersonas,
    maxCompetitors,
  };

  console.log("Generating Market and Product data via Gemini...");
  const [marketResult, productResult] = await Promise.all([
    analyzeStartupMarket(payload),
    generateStartupProduct(payload)
  ]);

  const apolloLeads = await apolloPromise;

  console.log("Updating Database Report...");
  await prisma.validationReport.update({
    where: { id: reportId },
    data: {
      validationScore: marketResult.validationScore,
      marketOpportunity: marketResult.marketOpportunity,
      productMarketFit: marketResult.productMarketFit,
      riskScore: marketResult.riskScore,
      marketAnalysis: marketResult.marketSaturation,
      swotAnalysis: marketResult.swotAnalysis,
      competitors: marketResult.competitorIntelligence,
      customerPersonas: marketResult.customerPersonas,
      revenuePotential: marketResult.revenuePotential,
      riskAnalysis: marketResult.riskAnalysis,
      pricingRecommendation: marketResult.pricingRecommendation,
      growthOpportunities: marketResult.growthOpportunities,
      acquisitionStrategy: marketResult.acquisitionStrategy,
      actionPlan: marketResult.actionPlan,
      launchPlatforms: marketResult.launchPlatforms,
      mvpPrioritization: marketResult.mvpPrioritization,
      complianceCheck: marketResult.complianceCheck,
      salesFunnel: marketResult.salesFunnel,
      uiMockupDescriptions: productResult.uiMockupDescriptions,
      landingPageCopy: productResult.landingPageCopy,
      codeBoilerplate: productResult.codeBoilerplate,
    }
  });

  console.log("Replacing Leads in DB...");
  await prisma.lead.deleteMany({ where: { reportId } });
  
  if (apolloLeads && apolloLeads.length > 0) {
    await prisma.lead.createMany({
      data: apolloLeads.map((lead: any) => ({
        reportId: reportId,
        name: lead.name,
        title: lead.title,
        company: lead.company,
        email: lead.email,
        linkedin: lead.linkedinUrl,
        relevanceScore: 90 + Math.floor(Math.random() * 10),
        notes: `Found via deep search for ${idea.industry} in ${idea.location || "global"}`,
        status: "NEW",
      })),
    });
  }

  console.log("SUCCESS! Report updated successfully.");
}

regenerate().catch(e => console.error("Script failed:", e?.message || e));
