import { tavily } from "@tavily/core";

/**
 * Initializes the Tavily client using the API key from environment variables.
 */
const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY || "",
});

/**
 * Fetches real-time competitor intelligence and market context using the Tavily API.
 * 
 * @param idea The startup idea description
 * @param industry The industry of the startup
 * @returns A summarized string containing market context and competitor info
 */
export async function fetchCompetitorIntel(idea: string, industry: string): Promise<string> {
  try {
    if (!process.env.TAVILY_API_KEY) {
      console.warn("TAVILY_API_KEY is not defined. Returning generic fallback.");
      return "No real-time competitor data available.";
    }

    const query = `Current top competitors and market saturation for ${idea} in ${industry} startup`;
    
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

    if (sourceData) {
      return sourceData;
    }

    return "No real-time competitor data available.";
  } catch (error) {
    console.error("Error fetching competitor intel from Tavily:", error);
    return "No real-time competitor data available.";
  }
}

/**
 * Extracts content from an array of website URLs to provide deep competitor analysis.
 * Uses Tavily Extract API to parse and return clean text from the websites.
 * 
 * @param urls Array of website URLs to scrape
 * @returns A Map of URL to their scraped, truncated content
 */
export async function extractCompetitorWebsites(urls: string[]): Promise<Map<string, string>> {
  const websiteData = new Map<string, string>();
  
  if (!urls || urls.length === 0) return websiteData;
  if (!process.env.TAVILY_API_KEY) return websiteData;

  // Filter out obviously bad URLs and limit to max 5 to save credits/time
  const validUrls = urls
    .filter(url => url && (url.startsWith('http://') || url.startsWith('https://')))
    .slice(0, 5);

  if (validUrls.length === 0) return websiteData;

  console.log(`Extracting content from ${validUrls.length} competitor websites using Tavily...`);

  try {
    const extractResponse = await tvly.extract(validUrls);
    
    if (extractResponse && extractResponse.results) {
      for (const result of extractResponse.results) {
        if (result.rawContent) {
          // Clean up the text: remove excessive newlines and whitespace
          let cleanContent = result.rawContent.replace(/\s+/g, ' ').trim();
          // Truncate to ~1000 characters to prevent blowing up the LLM context window
          if (cleanContent.length > 1000) {
            cleanContent = cleanContent.substring(0, 1000) + "... [Truncated]";
          }
          websiteData.set(result.url, cleanContent);
        }
      }
    }
  } catch (error) {
    console.error("Error extracting websites with Tavily:", error);
  }

  return websiteData;
}
