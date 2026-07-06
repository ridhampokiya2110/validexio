import { prisma } from "../db";
import { analyzeStartupMarket, generateStartupProduct } from "../gemini";
import { fetchB2BLeads } from "../api/apollo";

export interface GenerateJobPayload {
  ideaId: string;
  userId: string;
}

export async function processValidationJob(data: GenerateJobPayload, jobId: string = "local-sync") {
  const { ideaId, userId } = data;
  console.log(`[Job ${jobId}] Processing generate job for Idea: ${ideaId}`);

  const [idea, user] = await Promise.all([
    prisma.idea.findFirst({
      where: { id: ideaId, userId },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { tier: true },
    })
  ]);

  if (!idea) {
    throw new Error(`Idea not found: ${ideaId}`);
  }

  // Calculate limits based on user tier
  const tier = user?.tier || "FREE";
  let maxLeads = 0;
  let maxCompetitors = 3;
  let maxPersonas = 3;

  if ((tier as string) === "PRO") {
    maxLeads = 5;
    maxCompetitors = 5;
    maxPersonas = 5;
  } else if ((tier as string) === "TEAM") {
    maxLeads = 8;
    maxCompetitors = 5;
    maxPersonas = 5;
  } else if ((tier as string) === "ENTERPRISE") {
    maxLeads = 8;
    maxCompetitors = 7;
    maxPersonas = 7;
  } else if ((tier as string) === "STARTER") {
    maxLeads = 0;
    maxCompetitors = 3;
    maxPersonas = 3;
  }

  try {
    const startTime = Date.now();

    // 1. Fire off all external independent API calls in PARALLEL to minimize loading time
    console.log(`[Job ${jobId}] Firing parallel data gathering requests...`);
    
    const isLite = idea.isLite || false;
    
    const tavilyPromise = (async () => {
      if (isLite) return "No real-time market data available.";
      try {
        const { fetchCompetitorIntel } = await import("../api/tavily");
        return await fetchCompetitorIntel(idea.title, idea.industry);
      } catch (e) {
        console.error(`[Job ${jobId}] Tavily search failed:`, e);
        return "No real-time market data available.";
      }
    })();

    const serpApiPromise = (async () => {
      if (isLite) return "No real-time local competitor data available.";
      try {
        const { fetchRealCompetitors } = await import("../api/serpapi");
        return await fetchRealCompetitors(idea.title, idea.industry, idea.location || "global", maxCompetitors);
      } catch (e) {
        console.error(`[Job ${jobId}] SerpAPI/Overpass search failed:`, e);
        return "No real-time local competitor data available.";
      }
    })();

    const hnPromise = (async () => {
      if (isLite) return "";
      try {
        const { fetchHNSentiment } = await import("../api/hackernews");
        return await fetchHNSentiment(idea.title, idea.industry);
      } catch (e) {
        console.error(`[Job ${jobId}] HackerNews search failed:`, e);
        return "";
      }
    })();

    const redditPromise = (async () => {
      if (isLite) return "";
      try {
        const { fetchRedditFrustrations } = await import("../api/reddit");
        return await fetchRedditFrustrations(idea.title, idea.industry);
      } catch (e) {
        console.error(`[Job ${jobId}] Reddit search failed:`, e);
        return "";
      }
    })();

    const apolloPromise = (async () => {
      try {
        if (isLite) return [];
        if (maxLeads > 0) {
          return await fetchB2BLeads(idea.industry, idea.location || "global", maxLeads);
        }
        return [];
      } catch (e) {
        console.error(`[Job ${jobId}] Failed to fetch Apollo leads:`, e);
        return [];
      }
    })();

    const mockupPromise = (async () => {
      if (isLite || (tier as string) === "STARTER") return [];
      try {
        const { generateUIMockups } = await import("../api/mockupEngine");
        return await generateUIMockups(idea.title, idea.industry, 2);
      } catch (e) {
        console.error(`[Job ${jobId}] Failed to generate UI mockups:`, e);
        return [];
      }
    })();

    // Wait for the context needed for Gemini
    const [marketContext, competitorContext, hnContext, redditContext] = await Promise.all([
      tavilyPromise, 
      serpApiPromise,
      hnPromise,
      redditPromise
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
      // Pass uploaded document context if exists
      documentContext: (idea as any).documentContext || undefined,
      maxPersonas,
      maxCompetitors,
    };
    
    // 3. Call Gemini in PARALLEL (Market Analysis & Product Strategy)
    let marketResult: any;
    let productResult: any = {
      uiMockupDescriptions: [],
      landingPageCopy: null,
      codeBoilerplate: "/* Locked - Upgrade to Premium */"
    };

    if (isLite) {
      console.log(`[Job ${jobId}] Calling generateFreeStartupMarket for LITE tier...`);
      const { generateFreeStartupMarket } = await import("../gemini");
      marketResult = await generateFreeStartupMarket(payload);
    } else {
      console.log(`[Job ${jobId}] Firing Gemini calls (Market & Product) in parallel...`);
      
      const [marketRes, productRes] = await Promise.all([
        analyzeStartupMarket(payload),
        generateStartupProduct(payload)
      ]);
      
      marketResult = marketRes;
      productResult = productRes;
      
      // Enforce Starter tier limitations on code
      if ((tier as string) === "STARTER") {
        productResult.codeBoilerplate = "/* Code Boilerplate is locked on the Starter plan. Upgrade to Pro to get full Fake Door code. */";
      }
    }

    // Wait for the remaining parallel tasks to finish (they usually finish while Gemini is thinking)
    const [uiMockupImages, apolloLeads] = await Promise.all([mockupPromise, apolloPromise]);

    const processingTime = Date.now() - startTime;

    // 6. Save Report
    console.log(`[Job ${jobId}] Saving Validation Report...`);
    const createdReport = await prisma.validationReport.create({
      data: {
        ideaId: idea.id,
        userId,
        // From Market Analysis
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
        
        // From Product Strategy
        uiMockupDescriptions: productResult.uiMockupDescriptions,
        landingPageCopy: productResult.landingPageCopy,
        codeBoilerplate: productResult.codeBoilerplate,
        
        // Others
        uiMockupImages: uiMockupImages,
        processingTime,
        geminiModel: "gemini-flash-latest",
        isLite: isLite,
      },
    });

    // 7. Insert Real Leads from Apollo
    if (apolloLeads && apolloLeads.length > 0) {
      await prisma.lead.createMany({
        data: apolloLeads.map((lead: any) => ({
          reportId: createdReport.id,
          name: lead.name,
          title: lead.title,
          company: lead.company,
          email: lead.email || `${lead.name.split(' ')[0].toLowerCase()}@${lead.company.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}.com`,
          linkedin: lead.linkedinUrl,
          relevanceScore: 90 + Math.floor(Math.random() * 10),
          notes: `Found via Apollo.io search for ${idea.industry} in ${idea.location || "global"}`,
          status: "NEW",
        })),
      });
    }

    // 8. Update Idea Status
    await prisma.idea.update({
      where: { id: idea.id },
      data: { status: "COMPLETED" },
    });

    // 9. Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId,
        action: "IDEA_VALIDATED",
        resource: "idea",
        resourceId: idea.id,
        details: {
          score: marketResult.validationScore,
          industry: idea.industry,
          processingTime,
          cached: false
        },
      },
    }).catch(() => {});

    console.log(`[Job ${jobId}] Completed successfully in ${processingTime}ms`);
    return { success: true, ideaId };
  } catch (error) {
    console.error(`[Job ${jobId}] Failed with error message:`, error?.message || 'Unknown error');
    try {
      console.error(`[Job ${jobId}] Stack:`, error?.stack);
    } catch(e) {}
    
    // Refund the credit on failure only if it's not a lite validation
    if (!idea.isLite) {
      await prisma.user.update({
        where: { id: userId },
        data: { availableCredits: { increment: 1 } },
      }).catch(() => {});
    }

    await prisma.idea.update({
      where: { id: idea.id },
      data: { status: "FAILED" },
    });
    throw error;
  }
}
