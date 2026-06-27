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
