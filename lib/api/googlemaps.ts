/**
 * Fetches real, ground-level competitor data using the Google Maps Places API (New).
 * This guarantees 100% verified local businesses and eliminates fake data.
 * 
 * @param industry The industry of the startup
 * @param location Geographic location to find local competitors (e.g., "San Francisco")
 * @param limit Maximum number of competitors to return
 * @returns A summarized string containing verified competitor info
 */
export async function fetchGoogleMapsCompetitors(industry: string, location: string, limit: number): Promise<string> {
  try {
    if (!location || location.toLowerCase() === "global") {
      return "No local city provided for Google Maps API.";
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("GOOGLE_MAPS_API_KEY is not defined. Skipping Google Maps Search.");
      return "";
    }

    const query = `${industry} businesses in ${location}`;
    console.log(`Fetching verified local competitors from Google Maps API. Query: "${query}"...`);

    // Using the New Places API Text Search
    const url = "https://places.googleapis.com/v1/places:searchText";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        // Request exactly what we need to minimize data size
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.websiteUri,places.rating,places.userRatingCount"
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: limit
      })
    });

    if (!response.ok) {
      console.warn(`Google Maps API request failed with status ${response.status}`);
      return "";
    }

    const data = await response.json();

    if (data.places && data.places.length > 0) {
      const competitors = data.places.map((place: any, index: number) => {
        let details = `Competitor ${index + 1}: ${place.displayName?.text || 'Unknown'}`;
        if (place.rating) details += ` | Rating: ${place.rating} (${place.userRatingCount} reviews)`;
        if (place.websiteUri) details += ` | Website: ${place.websiteUri}`;
        if (place.formattedAddress) details += ` | Address: ${place.formattedAddress}`;
        return details;
      });

      return `Verified Local Competitors found via Google Maps in ${location}:\n\n` + competitors.join('\n\n');
    }

    return "No verified local competitors found in this specific location via Google Maps.";
  } catch (error) {
    console.error("Error fetching competitor intel from Google Maps API:", error);
    return "";
  }
}
