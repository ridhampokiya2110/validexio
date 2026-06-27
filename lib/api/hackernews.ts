/**
 * HackerNews Algolia API Integration
 * Completely free, real-time public endpoint. No API keys required.
 */

export async function fetchHNSentiment(idea: string, industry: string): Promise<string> {
  try {
    const query = encodeURIComponent(`${industry} OR ${idea}`);
    // We search for recent or relevant posts
    const url = `https://hn.algolia.com/api/v1/search?query=${query}&hitsPerPage=5`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Validexio-Execution-Engine/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HN API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.hits || data.hits.length === 0) {
      return "No specific HackerNews discussions found for this niche. The market might be nascent or highly specialized.";
    }

    const insights = data.hits
      .filter((hit: any) => hit.title || hit.story_title)
      .map((hit: any) => {
        const title = hit.title || hit.story_title;
        const points = hit.points || 0;
        const comments = hit.num_comments || 0;
        return `- "${title}" (Score: ${points}, Comments: ${comments})`;
      })
      .join("\n");

    return insights ? `Recent HackerNews Discussions & Validation Signals:\n${insights}` : "No specific HackerNews discussions found.";
  } catch (error) {
    console.error("Error fetching HackerNews intel:", error);
    return "Failed to fetch HackerNews data.";
  }
}
