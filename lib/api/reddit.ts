/**
 * Reddit Public JSON API Integration
 * Totally free, unauthenticated endpoint for real user sentiment.
 */

export async function fetchRedditFrustrations(idea: string, industry: string): Promise<string> {
  try {
    // Search for pain points, complaints, or discussions related to the industry
    const query = encodeURIComponent(`${industry} (sucks OR problem OR help OR alternative OR ${idea})`);
    const url = `https://www.reddit.com/search.json?q=${query}&limit=5&sort=relevance`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        // Reddit blocks fake browser User-Agents. Use a compliant API format.
        "User-Agent": "validexio-market-research/1.0.0 (by /u/validexio_dev)",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || !data.data.children || data.data.children.length === 0) {
      return "No specific Reddit discussions found. This could indicate an untapped market or a highly offline industry.";
    }

    const insights = data.data.children
      .map((child: any) => {
        const post = child.data;
        return `- "${post.title}" (Upvotes: ${post.ups}, Subreddit: r/${post.subreddit})`;
      })
      .join("\n");

    return insights ? `Real User Frustrations & Discussions from Reddit:\n${insights}` : "No specific Reddit discussions found.";
  } catch (error: any) {
    console.log(`[Reddit API] Gracefully failing: ${error.message || "Unknown error"}`);
    return "Failed to fetch Reddit data. Proceeding without social proof.";
  }
}
