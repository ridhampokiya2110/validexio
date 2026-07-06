export async function fetchIndustryBackground(industry: string): Promise<string> {
  try {
    const query = industry.trim();
    if (!query) return "";

    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&srlimit=1`;
    const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(5000) });
    if (!searchRes.ok) return "";
    const searchData = await searchRes.json();
    
    if (!searchData.query || !searchData.query.search || searchData.query.search.length === 0) {
      return "";
    }
    
    const title = searchData.query.search[0].title;
    const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(title)}&format=json`;
    const extractRes = await fetch(extractUrl, { signal: AbortSignal.timeout(5000) });
    if (!extractRes.ok) return "";
    const extractData = await extractRes.json();
    
    const pages = extractData.query.pages;
    const pageId = Object.keys(pages)[0];
    
    if (!pageId || pageId === "-1") return "";
    
    const extract = pages[pageId].extract;
    
    if (!extract) return "";
    
    // Limit to ~1000 characters to save tokens while keeping context rich
    let cleanExtract = extract.replace(/\s+/g, ' ').trim();
    if (cleanExtract.length > 1000) {
      cleanExtract = cleanExtract.substring(0, 1000) + "...";
    }
    
    return `Wikipedia Industry Background (${title}):\n${cleanExtract}`;
  } catch (error) {
    console.error("Wikipedia API Error:", error);
    return "";
  }
}
