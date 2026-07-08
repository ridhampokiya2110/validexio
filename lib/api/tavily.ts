import { tavily } from "@tavily/core";

/**
 * Initializes the Tavily client using the API key from environment variables.
 */
const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY || "",
});

/**
 * Fetches real-time competitor intelligence and market context.
 * It attempts to use Tavily first. If Tavily fails (e.g., 401 Unauthorized, out of credits),
 * it seamlessly falls back to SerpApi to guarantee the data is retrieved.
 */
export async function fetchCompetitorIntel(idea: string, industry: string): Promise<string> {
  try {
    if (!process.env.TAVILY_API_KEY) {
      throw new Error("TAVILY_API_KEY is not defined.");
    }

    const query = `Current top competitors and market saturation for ${idea} in ${industry} startup`;
    console.log("Attempting to fetch market data via Tavily...");
    
    // Perform advanced search
    const searchResult = await tvly.search(query, {
      searchDepth: "advanced",
      includeAnswer: true,
    });

    let sourceData = "";
    if (searchResult && searchResult.results && searchResult.results.length > 0) {
      sourceData = searchResult.results.slice(0, 3).map((r: any) => `Content: ${r.content} | Source: ${r.url}`).join("\n\n");
    }

    if (searchResult && searchResult.answer) {
      return sourceData ? `${searchResult.answer}\n\nSources:\n${sourceData}` : searchResult.answer;
    }

    if (sourceData) return sourceData;
    
    throw new Error("Tavily returned empty results.");
  } catch (error: any) {
    console.warn("⚠️ Tavily failed (likely out of credits or invalid key). Falling back to SerpApi...", error?.message || error);
    return fallbackMarketResearchViaSerpApi(idea, industry);
  }
}

/**
 * Fallback to SerpApi for competitor intelligence when Tavily fails or is unavailable.
 */
async function fallbackMarketResearchViaSerpApi(idea: string, industry: string): Promise<string> {
  try {
    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) {
      return "No real-time competitor data available. Both Tavily and SerpApi failed.";
    }

    const query = `Top competitors and market analysis for ${idea} in ${industry} startup`;
    console.log(`Fetching fallback market data via SerpApi. Query: "${query}"...`);

    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}&engine=google&num=5`;
    const response = await fetch(url);
    const data = await response.json();

    const organicResults = data.organic_results || [];
    if (organicResults.length === 0) {
      return "No market data found via search fallback.";
    }

    let context = "Market Research (via Google Search Fallback):\n\n";
    organicResults.slice(0, 5).forEach((res: any, i: number) => {
      context += `Source ${i + 1}: ${res.title}\nSnippet: ${res.snippet}\nLink: ${res.link}\n\n`;
    });

    return context;
  } catch (error) {
    console.error("Error in SerpApi fallback:", error);
    return "No real-time competitor data available.";
  }
}

/**
 * Extracts content from an array of website URLs to provide deep competitor analysis.
 * Attempts Tavily first, falls back to native node-fetch.
 */
export async function extractCompetitorWebsites(urls: string[]): Promise<Map<string, string>> {
  const websiteData = new Map<string, string>();
  
  if (!urls || urls.length === 0) return websiteData;

  const validUrls = urls
    .filter(url => url && (url.startsWith('http://') || url.startsWith('https://')))
    .slice(0, 5);

  if (validUrls.length === 0) return websiteData;

  // Attempt 1: Tavily
  if (process.env.TAVILY_API_KEY) {
    try {
      console.log(`Extracting content from ${validUrls.length} websites using Tavily...`);
      const extractResponse = await tvly.extract(validUrls);
      
      if (extractResponse && extractResponse.results) {
        for (const result of extractResponse.results) {
          if (result.rawContent) {
            let cleanContent = result.rawContent.replace(/\s+/g, ' ').trim();
            if (cleanContent.length > 1000) cleanContent = cleanContent.substring(0, 1000) + "... [Truncated]";
            websiteData.set(result.url, cleanContent);
          }
        }
        return websiteData; // Success, return early
      }
    } catch (error) {
      console.warn("⚠️ Tavily Extract failed. Falling back to native fetch scraper...");
    }
  }

  // Attempt 2: Native fetch fallback (basic)
  for (const url of validUrls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(5000) });
      if (!res.ok) continue;
      const html = await res.text();
      
      // Basic regex to strip HTML tags and get text
      let cleanContent = html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
      
      if (cleanContent.length > 1000) cleanContent = cleanContent.substring(0, 1000) + "... [Truncated]";
      if (cleanContent) websiteData.set(url, cleanContent);
    } catch (error) {
      console.warn(`Failed to scrape ${url} directly.`);
    }
  }

  return websiteData;
}
