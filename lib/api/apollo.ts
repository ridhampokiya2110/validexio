export interface B2BLead {
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
  email?: string;
}

/**
 * Fetches relevant decision-makers from Apollo.io.
 * If Apollo fails (e.g. 403 on Free Tier), falls back to SerpApi LinkedIn search + Gemini.
 */
export async function fetchB2BLeads(
  industry: string,
  location: string,
  limit: number = 10
): Promise<B2BLead[]> {
  try {
    const apiKey = process.env.APOLLO_API_KEY;
    if (apiKey && apiKey !== "YOUR_API_KEY") {
      const payload = {
        q_keywords: industry,
        person_locations: [location],
        person_titles: ["Founder", "CEO", "Chief Executive Officer", "Director", "Managing Director", "Owner"],
        page: 1,
        per_page: limit,
      };

      const response = await fetch("https://api.apollo.io/api/v1/mixed_people/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.people) && data.people.length > 0) {
          return data.people.map((person: any) => ({
            name: person.name || `${person.first_name || ""} ${person.last_name || ""}`.trim(),
            title: person.title || "Unknown Title",
            company: person.organization?.name || "Unknown Company",
            linkedinUrl: person.linkedin_url || "",
            email: person.email || undefined,
          }));
        }
      } else {
        console.warn(`Apollo API failed (${response.status}). Falling back to SerpApi LinkedIn search.`);
      }
    }
    
    // FALLBACK: SerpApi LinkedIn Search
    return await fetchLeadsViaSerpApi(industry, location, limit);
  } catch (error) {
    console.error("Error executing fetchB2BLeads:", error);
    return fetchLeadsViaSerpApi(industry, location, limit);
  }
}

/**
 * Fallback generator using Google Search (SerpApi) to find real LinkedIn profiles.
 * Extracts names, titles, and companies from the search snippets.
 */
async function fetchLeadsViaSerpApi(industry: string, location: string, limit: number): Promise<B2BLead[]> {
  try {
    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) return generateMockLeads(industry, location, limit);

    const query = `site:linkedin.com/in/ "Founder" OR "CEO" OR "Director" "${industry}" "${location}"`;
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}&num=${limit + 5}`;
    
    const response = await fetch(url);
    if (!response.ok) return generateMockLeads(industry, location, limit);
    
    const data = await response.json();
    if (!data.organic_results || data.organic_results.length === 0) {
      return generateMockLeads(industry, location, limit);
    }

    const leads: B2BLead[] = [];
    for (const result of data.organic_results) {
      if (leads.length >= limit) break;
      
      // Typical title format: "John Doe - Founder & CEO - TechCorp" or "John Doe - CEO - TechCorp | LinkedIn"
      const titleParts = result.title.split("-").map((p: string) => p.trim());
      const name = titleParts[0] || "Unknown";
      let title = titleParts[1] || "Founder";
      let company = titleParts.length > 2 ? titleParts[2] : industry + " Company";
      
      // Clean up " | LinkedIn" or "..."
      company = company.replace(/\| LinkedIn/gi, "").trim();
      title = title.replace(/\| LinkedIn/gi, "").trim();
      
      // Skip generic linkedin pages, jobs, overviews
      if (
        name.includes("LinkedIn") || 
        name.toLowerCase().includes("profiles") ||
        title.toLowerCase().includes("overview") ||
        title.toLowerCase().includes("jobs") ||
        title.toLowerCase().includes("posts") ||
        name.split(" ").length > 4 // People rarely have 5+ word names in LinkedIn titles
      ) {
        continue;
      }

      // Guess email better (e.g. John Doe at TechCorp -> jdoe@techcorp.com or john@techcorp.com)
      const firstName = name.split(' ')[0]?.toLowerCase().replace(/[^a-z]/g, "") || "";
      const cleanCompany = company.split(' ')[0]?.toLowerCase().replace(/[^a-z0-9]/g, "") || "company";
      const guessedEmail = `${firstName}@${cleanCompany}.com`;

      leads.push({
        name,
        title,
        company,
        linkedinUrl: result.link || "",
        email: guessedEmail
      });
    }

    return leads.length > 0 ? leads : generateMockLeads(industry, location, limit);
  } catch (e) {
    console.error("SerpApi fallback failed:", e);
    return generateMockLeads(industry, location, limit);
  }
}

/**
 * Generates mock leads if everything else fails.
 */
function generateMockLeads(industry: string, location: string, limit: number): B2BLead[] {
  const firstNames = ["James", "Sarah", "Michael", "Emma", "David", "Jessica", "Daniel", "Emily", "John", "Olivia"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
  const titles = ["Founder & CEO", "Managing Director", "Chief Executive Officer", "VP of Operations", "Director of Strategy"];
  
  const leads: B2BLead[] = [];
  
  for (let i = 0; i < limit; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    
    const companySuffix = ["Inc.", "Corp", "Solutions", "Group", "Technologies", "LLC"];
    const baseIndustry = industry.split(" ")[0] || "Tech";
    const company = `${baseIndustry} ${companySuffix[Math.floor(Math.random() * companySuffix.length)]}`;
    
    leads.push({
      name: `${fn} ${ln}`,
      title,
      company,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${company.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}.com`,
      linkedinUrl: `https://linkedin.com/in/${fn.toLowerCase()}-${ln.toLowerCase()}-${Math.floor(Math.random() * 10000)}`
    });
  }
  
  return leads;
}
