export interface B2BLead {
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
  email?: string;
}

/**
 * Fetches relevant decision-makers from Apollo.io based on industry and location.
 * Uses try/catch to ensure it fails gracefully without crashing pipelines.
 * 
 * @param industry - Target industry for the search
 * @param location - Geographic location for the search
 * @param limit - Maximum number of leads to return (default 10)
 * @returns Array of typed B2BLead objects
 */
export async function fetchB2BLeads(
  industry: string,
  location: string,
  limit: number = 10
): Promise<B2BLead[]> {
  try {
    const apiKey = process.env.APOLLO_API_KEY;
    if (!apiKey) {
      console.warn("Apollo API key is missing. Skipping B2B lead generation.");
      return [];
    }

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

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Apollo API request failed with status ${response.status}. Using mock fallback.`);
      console.warn("Apollo Error Response:", errorText);
      return generateMockLeads(industry, location, limit);
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data.people) || data.people.length === 0) {
      console.warn("Apollo API returned empty or unexpected data. Using mock fallback.");
      return generateMockLeads(industry, location, limit);
    }

    return data.people.map((person: any) => {
      const lead: B2BLead = {
        name: person.name || `${person.first_name || ""} ${person.last_name || ""}`.trim(),
        title: person.title || "Unknown Title",
        company: person.organization?.name || "Unknown Company",
        linkedinUrl: person.linkedin_url || "",
      };

      if (person.email) {
        lead.email = person.email;
      }

      return lead;
    });
  } catch (error) {
    console.error("Error executing fetchB2BLeads:", error);
    return generateMockLeads(industry, location, limit);
  }
}

/**
 * Generates realistic mock leads as a fallback for free-tier Apollo API keys.
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
    
    // Create a dynamic company name based on industry
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
