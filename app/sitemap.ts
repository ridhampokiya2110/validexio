import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://validexio.com';
  const now = new Date();

  // All 9 confirmed competitors — each /compare page is a SERP/GEO capture opportunity
  const competitors = [
    'preuve-ai',
    'dimeadozen',
    'pitchbob',
    'ideaproof',
    'verdikt',
    'ValidatorAI',
    'painmap',
    'startupdeckai',
    'bizplanaiprofocus',
    'pitchdesk',
    'ideabrowser',
    'venturai'
  ];

  const comparePages: MetadataRoute.Sitemap = competitors.map((slug) => ({
    url: `${baseUrl}/compare/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  // Blog posts (high-value SEO content pages)
  const blogSlugs = [
    'how-to-validate-startup-idea',
    'startup-idea-validation-guide-2025',
    'why-80-percent-startups-fail',
    'preuve-ai-vs-validexio',
    'dimeadozen-vs-validexio',
    'ideaproof-vs-validexio',
    'best-startup-validators-india',
    'ai-startup-tools-comparison-2025',
  ];

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [
    // Priority 1: Homepage
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    // Priority 2: Register / Conversion
    {
      url: `${baseUrl}/register`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    // Priority 3: Pricing
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // High priority: Examples (social proof)
    {
      url: `${baseUrl}/examples`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    // Competitor compare pages (SEO/GEO goldmine)
    ...comparePages,
    // Blog
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...blogPages,
    // Free tools
    {
      url: `${baseUrl}/free-tools`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.78,
    },
    {
      url: `${baseUrl}/free-tools/code-generator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    // Hub
    {
      url: `${baseUrl}/hub`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // About / Contact / Legal
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
