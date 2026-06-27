/**
 * Generates highly realistic UI/UX mockups using Pollinations.ai
 * (100% Free, No API Key or Authentication Required)
 *
 * @param idea - The core idea of the startup
 * @param industry - The industry context
 * @param count - Number of mockups to generate (default 2)
 * @returns Array of generated image URLs
 */
export async function generateUIMockups(
  idea: string,
  industry: string,
  count: number = 1
): Promise<string[]> {
  try {
    // Force count to 1 to prevent "Queue full (max: 1)" errors on Pollinations' free tier
    const safeCount = 1;
    
    const basePrompt = `High fidelity modern UI UX web application dashboard mockup, premium dark mode SaaS platform for ${idea} in ${industry} industry, ultra clean design, dribbble style, 4k resolution`;
    const encodedPrompt = encodeURIComponent(basePrompt);
    
    const mockups: string[] = [];
    
    for (let i = 0; i < safeCount; i++) {
      const seed = Math.floor(Math.random() * 1000000) + 1;
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;
      
      try {
        console.log(`Fetching mockup from Pollinations (Seed: ${seed})...`);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Pollinations API returned ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64}`;
        
        mockups.push(dataUrl);
      } catch (fetchError) {
        console.error("Failed to fetch image buffer:", fetchError);
        mockups.push("https://placehold.co/1024x1024/1B1716/EDEBDE?text=Generating+Mockup...");
      }
    }

    return mockups;
  } catch (error) {
    console.error("Error generating UI mockups with Pollinations:", error);
    return Array(count).fill("https://placehold.co/1024x1024/1B1716/EDEBDE?text=Generating+Mockup...");
  }
}
