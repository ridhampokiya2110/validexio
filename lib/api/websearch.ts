import { fetchOverpassCompetitors } from "./overpass";
import { fetchGoogleMapsCompetitors } from "./googlemaps";
import { extractCompetitorWebsites } from "./tavily";

/**
 * Fetches real, ground-level competitor data.
 * Hybrid Routing Logic:
 * 1. Local Search -> Google Maps API (Verified local businesses)
 * 2. Local Fallback -> Overpass API (Free OpenStreetMap businesses)
 * 3. Global/Digital Search -> Google Custom Search API (Official Google Search)
 * 
 * @param idea The startup idea description
 * @param industry The industry of the startup
 * @param location Geographic location to find local or global competitors
 * @param limit Maximum number of competitors to return based on the user's plan
 * @returns A summarized string containing competitor info
 */
export async function fetchRealCompetitors(idea: string, industry: string, location: string, limit: number = 3, userTier: string = "FREE"): Promise<string> {
  try {
    const isGlobal = !location || location.toLowerCase() === "global";
    let localResults = "";

    // 1. If it's a local search, try Google Maps API first for 100% verified businesses
    if (!isGlobal) {
      if (userTier === "PRO" || userTier === "TEAM" || userTier === "ENTERPRISE") {
        localResults = await fetchGoogleMapsCompetitors(industry, location, limit);
      
        // If Google Maps returned verified data, return immediately
        if (localResults && !localResults.includes("No verified local competitors found")) {
          return localResults;
        }
      }

      // 2. Fallback to Overpass API if Google Maps failed or no API key
      console.log("Falling back to Overpass API for local search...");
      localResults = await fetchOverpassCompetitors(industry, location, limit);
      if (!localResults.includes("No prominent local competitors") && !localResults.includes("No real-time local competitor data available")) {
        return localResults;
      }
    }

    const tavilyKey = process.env.TAVILY_API_KEY;

    if (!tavilyKey) {
      console.warn("TAVILY_API_KEY is missing. Skipping Global Search fallback.");
      return localResults ? localResults : "No real-time global competitor data available due to missing search keys.";
    }

    // 3. Fallback to Tavily Search API
    let query = `top ${industry} competitors companies`;
    if (!isGlobal) {
      query = `${industry} companies businesses in ${location}`;
    }

    console.log(`Fetching real competitors from Tavily. Query: "${query}" with limit: ${limit}`);

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: tavilyKey,
        query: query,
        search_depth: "basic",
        include_images: false,
        max_results: limit
      })
    });

    if (!response.ok) {
      console.warn(`Tavily Search request failed with status ${response.status}`);
      return localResults ? localResults : "No real-time global competitor data available from Web Search.";
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const topResults = data.results.slice(0, limit);
      
      // Gather URLs to scrape
      const urlsToScrape: string[] = [];
      topResults.forEach((result: any) => {
        if (result.url) urlsToScrape.push(result.url);
      });

      // Scrape them in parallel using Tavily Extract
      const scrapedWebsites = await extractCompetitorWebsites(urlsToScrape);

      const competitors = topResults.map((result: any, index: number) => {
        let details = `Competitor ${index + 1}: ${result.title} | Website: ${result.url} | Description: ${result.content}`;
        
        // Append scraped website content if available
        if (result.url && scrapedWebsites.has(result.url)) {
          details += `\n   -> Scraped Website Content (USE THIS FOR ANALYSIS): ${scrapedWebsites.get(result.url)}`;
        }
        
        return details;
      });
      return `Real Competitors found via Web Search in ${location}:\n\n` + competitors.join('\n\n');
    }

    return localResults ? localResults : "No prominent organic competitors found in this specific location.";
  } catch (error) {
    console.error("Error fetching competitor intel from Web Search API:", error);
    return "No real-time global competitor data available.";
  }
}
