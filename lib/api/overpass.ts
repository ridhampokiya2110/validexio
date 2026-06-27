/**
 * Fetches real, ground-level competitor data using the free OpenStreetMap Overpass API.
 * This is highly accurate for city-based local business discovery.
 * 
 * @param industry The industry of the startup (used to find related OpenStreetMap tags)
 * @param location Geographic location to find local competitors (e.g., "San Francisco")
 * @param limit Maximum number of competitors to return
 * @returns A summarized string containing competitor info
 */
export async function fetchOverpassCompetitors(industry: string, location: string, limit: number): Promise<string> {
  try {
    if (!location || location.toLowerCase() === "global") {
      return "No local city provided for Overpass API.";
    }

    // Map common industries to OSM tags (simplified for demonstration)
    let tag = 'amenity';
    let value = 'cafe'; // default fallback

    const ind = industry.toLowerCase();
    if (ind.includes('restaurant') || ind.includes('food')) {
      tag = 'amenity'; value = 'restaurant';
    } else if (ind.includes('coffee') || ind.includes('cafe')) {
      tag = 'amenity'; value = 'cafe';
    } else if (ind.includes('gym') || ind.includes('fitness')) {
      tag = 'leisure'; value = 'fitness_centre';
    } else if (ind.includes('salon') || ind.includes('hair')) {
      tag = 'shop'; value = 'hairdresser';
    } else if (ind.includes('retail') || ind.includes('clothing')) {
      tag = 'shop'; value = 'clothes';
    } else if (ind.includes('tech') || ind.includes('software')) {
      tag = 'office'; value = 'it';
    } else if (ind.includes('clinic') || ind.includes('health') || ind.includes('doctor')) {
      tag = 'amenity'; value = 'clinic';
    } else if (ind.includes('hotel') || ind.includes('hospitality')) {
      tag = 'tourism'; value = 'hotel';
    } else if (ind.includes('agency') || ind.includes('consulting')) {
      tag = 'office'; value = 'company';
    } else if (ind.includes('education') || ind.includes('school') || ind.includes('tutor')) {
      tag = 'amenity'; value = 'school';
    } else {
      // Fallback: search for office or shop generally if industry is not specifically mapped
      tag = 'shop'; value = 'yes';
    }

    // Overpass QL Query to find nodes in the given area
    // Note: Overpass area search requires formatting the city name, e.g. "San Francisco" -> "San Francisco"
    const query = `
      [out:json][timeout:25];
      area[name~"${location}", i]->.searchArea;
      (
        node["${tag}"="${value}"](area.searchArea);
        way["${tag}"="${value}"](area.searchArea);
        relation["${tag}"="${value}"](area.searchArea);
      );
      out center ${limit};
    `;

    const url = "https://overpass-api.de/api/interpreter";
    console.log(`Fetching real competitors from Overpass API (OSM) for "${industry}" in "${location}"...`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "data=" + encodeURIComponent(query)
    });

    if (!response.ok) {
      console.warn(`Overpass API request failed with status ${response.status}`);
      return "No real-time local competitor data available from Overpass API.";
    }

    const data = await response.json();

    if (data.elements && data.elements.length > 0) {
      const competitors = data.elements
        .filter((element: any) => element.tags && element.tags.name) // Only keep elements with a name
        .slice(0, limit)
        .map((element: any, index: number) => {
          const tags = element.tags;
          let details = `Competitor ${index + 1}: ${tags.name}`;
          if (tags.website) details += ` | Website: ${tags.website}`;
          if (tags.phone) details += ` | Phone: ${tags.phone}`;
          if (tags['addr:street']) details += ` | Address: ${tags['addr:housenumber'] || ''} ${tags['addr:street']}, ${tags['addr:city'] || location}`;
          return details;
        });

      if (competitors.length > 0) {
        return `Real Local Competitors found via OpenStreetMap in ${location}:\n\n` + competitors.join('\n\n');
      }
    }

    return "No prominent local competitors found in this specific location via OpenStreetMap.";
  } catch (error) {
    console.error("Error fetching competitor intel from Overpass API:", error);
    return "No real-time local competitor data available from Overpass API.";
  }
}
