import { fetchOverpassCompetitors } from "./overpass";
import { fetchGoogleMapsCompetitors } from "./googlemaps";
import { extractCompetitorWebsites } from "./tavily";

/**
 * Fetches real, ground-level competitor data.
 * Hybrid Routing Logic:
 * 1. Local Search -> Google Maps API (Verified local businesses)
 * 2. Local Fallback -> Overpass API (Free OpenStreetMap businesses)
 * 3. Global/Digital Search -> SerpAPI (Google Organic Search)
 * 
 * @param idea The startup idea description
 * @param industry The industry of the startup
 * @param location Geographic location to find local or global competitors
 * @param limit Maximum number of competitors to return based on the user's plan
 * @returns A summarized string containing competitor info
 */
export async function fetchRealCompetitors(idea: string, industry: string, location: string, limit: number = 3): Promise<string> {
  try {
    const isGlobal = !location || location.toLowerCase() === "global";
    let localResults = "";

    // 1. If it's a local search, try Google Maps API first for 100% verified businesses
    if (!isGlobal) {
      localResults = await fetchGoogleMapsCompetitors(industry, location, limit);
      
      // If Google Maps returned verified data, return immediately
      if (localResults && !localResults.includes("No verified local competitors found")) {
        return localResults;
      }

      // 2. Fallback to Overpass API if Google Maps failed or no API key
      console.log("Falling back to Overpass API for local search...");
      localResults = await fetchOverpassCompetitors(industry, location, limit);
      if (!localResults.includes("No prominent local competitors") && !localResults.includes("No real-time local competitor data available")) {
        return localResults;
      }
    }

    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) {
      console.warn("SERPAPI_API_KEY is not defined. Skipping SerpAPI competitor search.");
      return localResults ? localResults : "No real-time local competitor data available from SerpAPI.";
    }

    // 2. Fallback to SerpAPI (Google Search)
    let query = `top ${industry} competitors companies`;
    if (!isGlobal) {
      query = `${industry} companies businesses in ${location}`;
    }

    // Build SerpAPI URL
    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.append('q', query);
    url.searchParams.append('api_key', apiKey);
    url.searchParams.append('num', limit.toString()); // respect limit
    if (!isGlobal) {
      url.searchParams.append('location', location);
    }

    console.log(`Fetching real competitors from SerpAPI. Query: "${query}" with limit: ${limit}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json",
      }
    });

    if (!response.ok) {
      console.warn(`SerpAPI request failed with status ${response.status}`);
      return localResults ? localResults : "No real-time local competitor data available from SerpAPI.";
    }

    const data = await response.json();
    
    if (data.organic_results && data.organic_results.length > 0) {
      const topResults = data.organic_results.slice(0, limit);
      
      // Gather URLs to scrape
      const urlsToScrape: string[] = [];
      topResults.forEach((result: any) => {
        if (result.link) urlsToScrape.push(result.link);
      });

      // Scrape them in parallel using Tavily Extract
      const scrapedWebsites = await extractCompetitorWebsites(urlsToScrape);

      const competitors = topResults.map((result: any, index: number) => {
        let details = `Competitor ${index + 1}: ${result.title} | Website: ${result.link} | Description: ${result.snippet}`;
        
        // Append scraped website content if available
        if (result.link && scrapedWebsites.has(result.link)) {
          details += `\n   -> Scraped Website Content (USE THIS FOR ANALYSIS): ${scrapedWebsites.get(result.link)}`;
        }
        
        return details;
      });
      return `Real Competitors found via Google Search in ${location}:\n\n` + competitors.join('\n\n');
    }

    return localResults ? localResults : "No prominent organic competitors found in this specific location.";
  } catch (error) {
    console.error("Error fetching competitor intel from APIs:", error);
    return "No real-time local competitor data available.";
  }
}
