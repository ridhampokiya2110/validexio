import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calendar, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DOMPurify from 'isomorphic-dompurify';

// Mock data matching the blog index
const posts = [
  {
    title: "Why 90% of Startups Fail (And How to Be in the 10%)",
    category: "Startup Strategy",
    date: "Jun 12, 2026",
    author: "Validexio Team",
    readTime: "5 min read",
    slug: "why-90-percent-fail",
    content: `
      <h2>The Cult of the "Builder"</h2>
      <p>In the startup world, there is a dangerous cult of the "Builder." We glorify the late-night coding sessions, the thousands of commits, and the pursuit of the perfect architecture. But we completely ignore the most important metric: <strong>Does anybody actually care?</strong></p>
      <p>Most startups fail because founders spend 6 months building a product in isolation, launch it, and are met with complete silence. They built something nobody wanted.</p>
      
      <h2>Validation Over Features</h2>
      <p>Your MVP (Minimum Viable Product) is probably too big. In fact, your MVP shouldn't even be a product. It should be a test to see if people have the problem you think they have, and if they are willing to pay for your solution.</p>
      <ul>
        <li>Create a landing page describing the product.</li>
        <li>Put a "Buy Now" button on it.</li>
        <li>Drive traffic to it.</li>
        <li>If nobody clicks the button, you don't have a business. You just saved yourself 6 months of coding.</li>
      </ul>

      <h2>The Anti-Roadmap</h2>
      <p>Stop thinking about what you need to build, and start thinking about what you need to validate. If your core assumption is that people want a data engine tool to write their emails, don't build the Data Engine tool. Build a concierge service where you manually write the emails for them. If they won't pay for that, they won't pay for the Data Engine tool either.</p>
    `
  },
  {
    title: "Stop Building Features, Start Validating Markets",
    category: "Product Management",
    date: "May 28, 2026",
    author: "Validexio Team",
    readTime: "7 min read",
    slug: "stop-building-features",
    content: `
      <h2>The Feature Trap</h2>
      <p>We've all been there. The launch is coming up, but you think, "If we just add this one more feature, people will definitely buy it." This is the feature trap.</p>
      <p>Features don't sell products. Solving painful problems sells products.</p>
      
      <h2>How to Validate Without Writing Code</h2>
      <p>You can validate almost any idea without writing a single line of code. Use tools like Figma to create realistic mockups. Use no-code tools like Webflow and Lemon Squeezy to take pre-orders. Do whatever it takes to prove that someone will hand over their credit card for the value you're promising.</p>
    `
  },
  {
    title: "The Danger of 'Yes Men' in Startup Validation",
    category: "Founder Psychology",
    date: "May 15, 2026",
    author: "Validexio Team",
    readTime: "4 min read",
    slug: "danger-of-yes-men",
    content: `
      <h2>Friends Lie</h2>
      <p>When you ask your friends and family if your startup idea is good, they will almost always say yes. They don't want to hurt your feelings. But this fake validation is incredibly dangerous.</p>
      
      <h2>Seeking Brutal Honesty</h2>
      <p>You need brutal, unbiased feedback. You need to talk to strangers who have the problem you're trying to solve. Better yet, ask them to pay for it right now. If they say no, ask them why. That "why" is the most valuable data you will ever get.</p>
    `
  },
  {
    title: "How to Calculate Unit Economics Before You Launch",
    category: "Economics",
    date: "Apr 30, 2026",
    author: "Validexio Team",
    readTime: "8 min read",
    slug: "calculate-unit-economics",
    content: `
      <h2>Math > Optimism</h2>
      <p>Optimism is a requirement for founders, but it's toxic when applied to unit economics. If your Customer Acquisition Cost (CAC) is higher than your Lifetime Value (LTV), your startup is doomed, no matter how good the product is.</p>
      
      <h2>The Basic Equation</h2>
      <p>Before you build, estimate your CAC. How will you get customers? Ads? SEO? Cold email? Figure out the cost. Then estimate your LTV. If LTV is not at least 3x your CAC, you need to rethink your pricing or your acquisition strategy.</p>
    `
  },
  {
    title: "B2B vs B2C: Which is easier to validate?",
    category: "Market Research",
    date: "Apr 18, 2026",
    author: "Validexio Team",
    readTime: "6 min read",
    slug: "b2b-vs-b2c",
    content: `
      <h2>The B2B Advantage</h2>
      <p>B2B (Business to Business) is generally much easier to validate than B2C (Business to Consumer). Businesses have clear budgets and are actively looking for tools that save them time or make them money.</p>
      
      <h2>The B2C Trap</h2>
      <p>Consumers are fickle. They say they want a new social network, but they won't actually switch from Instagram. Validating B2C requires massive scale and deep behavioral understanding.</p>
    `
  },
  {
    title: "The 'Anti-Roadmap': What NOT to Build",
    category: "Product Strategy",
    date: "Apr 02, 2026",
    author: "Validexio Team",
    readTime: "5 min read",
    slug: "anti-roadmap",
    content: `
      <h2>Addition by Subtraction</h2>
      <p>The best products are defined by what they omit. When you are validating an idea, create an "Anti-Roadmap." Write down explicitly what your product will NOT do.</p>
      
      <h2>Focus is a Weapon</h2>
      <p>By defining what you won't build, you force yourself to focus entirely on the core value proposition. This makes your messaging clearer and your validation much faster.</p>
    `
  }
];

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = posts.find(p => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1B1716] font-sans selection:bg-cherry/40 selection:text-[#1B1716] flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link aria-label="Navigation link" href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-[#1B1716]/50 hover:text-cherry transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </Link>

          <header className="mb-16">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="badge badge-butter">{post.category}</span>
              <span className="text-sm text-[#1B1716]/50 font-mono flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span className="text-sm text-[#1B1716]/50 font-mono flex items-center gap-1.5 border-l border-[#1B1716]/10 pl-4">
                <BookOpen className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#1B1716] leading-tight mb-8">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-3 py-6 border-y border-[#1B1716]/10">
              <div className="w-10 h-10 rounded-full bg-cherry/10 flex items-center justify-center">
                <span className="text-cherry font-bold">V</span>
              </div>
              <div>
                <p className="font-bold text-[#1B1716]">{post.author}</p>
                <p className="text-sm text-[#1B1716]/50">Editorial Team</p>
              </div>
            </div>
          </header>

          <div 
            className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-[#1B1716] prose-p:text-[#1B1716]/80 prose-p:leading-relaxed prose-a:text-cherry hover:prose-a:text-[#910505] prose-strong:text-[#1B1716] prose-li:text-[#1B1716]/80"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />

          <div className="mt-20 pt-10 border-t border-[#1B1716]/10">
            <div className="bg-[#1B1716] rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cherry/20 rounded-full blur-[80px]" />
              <h3 className="text-2xl font-black mb-4 relative z-10">Stop Reading. Start Validating.</h3>
              <p className="text-[#EDEBDE]/80 mb-8 max-w-lg mx-auto relative z-10">
                Don't become another statistic. Get a comprehensive breakdown of your startup idea's viability in 60 seconds.
              </p>
              <Link aria-label="Navigation link" href="/dashboard" className="inline-block bg-cherry hover:bg-[#910505] text-white font-bold py-3 px-8 rounded-lg transition-colors relative z-10">
                Validate Your Idea
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
