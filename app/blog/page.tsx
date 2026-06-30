import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      title: "Why 90% of Startups Fail (And How to Be in the 10%)",
      excerpt: "The most common mistake founders make isn't writing bad code—it's writing good code for a product nobody wants. Here's how to avoid the trap.",
      category: "Startup Strategy",
      date: "Jun 12, 2026",
      author: "Validexio Team",
      readTime: "5 min read",
      slug: "why-90-percent-fail"
    },
    {
      title: "Stop Building Features, Start Validating Markets",
      excerpt: "Your MVP shouldn't take 6 months to build. In fact, your MVP might not need to be a product at all. Learn how to use 'Smoke Test' validation.",
      category: "Product Management",
      date: "May 28, 2026",
      author: "Validexio Team",
      readTime: "7 min read",
      slug: "stop-building-features"
    },
    {
      title: "The Danger of 'Yes Men' in Startup Validation",
      excerpt: "Friends and family will almost always tell you your idea is great. Here is why you need brutal, unbiased Data Engine feedback before quitting your day job.",
      category: "Founder Psychology",
      date: "May 15, 2026",
      author: "Validexio Team",
      readTime: "4 min read",
      slug: "danger-of-yes-men"
    },
    {
      title: "How to Calculate Unit Economics Before You Launch",
      excerpt: "If your CAC is higher than your LTV, your startup is doomed. We break down the math you must do before writing a single line of code.",
      category: "Economics",
      date: "Apr 30, 2026",
      author: "Validexio Team",
      readTime: "8 min read",
      slug: "calculate-unit-economics"
    },
    {
      title: "B2B vs B2C: Which is easier to validate?",
      excerpt: "Selling to businesses requires a completely different validation strategy than selling to consumers. Which path is right for your next idea?",
      category: "Market Research",
      date: "Apr 18, 2026",
      author: "Validexio Team",
      readTime: "6 min read",
      slug: "b2b-vs-b2c"
    },
    {
      title: "The 'Anti-Roadmap': What NOT to Build",
      excerpt: "Success is often defined by what you choose not to do. Learn how to create an anti-roadmap to stay focused on what actually matters.",
      category: "Product Strategy",
      date: "Apr 02, 2026",
      author: "Validexio Team",
      readTime: "5 min read",
      slug: "anti-roadmap"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1B1716] font-sans selection:bg-cherry/40 selection:text-[#1B1716] flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-maroon/5 rounded-full blur-[100px] pointer-events-none" />
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-[#1B1716] relative z-10">
            Insights & <span className="text-cherry">Writings</span>
          </h1>
          <p className="text-lg md:text-xl text-[#1B1716]/60 mx-auto relative z-10 leading-relaxed max-w-2xl">
            Hard truths, unit economics, and brutal reality checks for founders. Dive into our latest strategies for building startups that survive.
          </p>
        </section>

        {/* Featured Post (Latest) */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="group relative overflow-hidden rounded-2xl bg-[#1B1716] p-8 md:p-12 flex flex-col shadow-2xl hover:shadow-[0_20px_50px_rgba(117,7,12,0.15)] transition-all duration-500 border border-[#1B1716]/10">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cherry/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className="badge badge-butter">{posts[0].category}</span>
                <span className="text-sm text-[#EDEBDE]/50 font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {posts[0].date}
                </span>
                <span className="text-sm text-[#EDEBDE]/50 font-mono flex items-center gap-1.5 border-l border-[#EDEBDE]/20 pl-4">
                  <BookOpen className="w-3.5 h-3.5" />
                  {posts[0].readTime}
                </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight group-hover:text-cherry transition-colors">
                <Link aria-label="Navigation link" href={`/blog/${posts[0].slug}`} className="before:absolute before:inset-0">
                  {posts[0].title}
                </Link>
              </h2>
              
              <p className="text-[#EDEBDE]/80 text-lg md:text-xl mb-10 leading-relaxed max-w-3xl font-medium">
                {posts[0].excerpt}
              </p>
              
              <div className="flex items-center text-cherry font-bold gap-2">
                <span>Read Full Article</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        {/* List Posts */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {posts.slice(1).map((post, idx) => (
              <div key={`item-${idx}`} className="group relative bg-white border border-[#1B1716]/10 rounded-2xl p-6 md:p-8 hover:border-cherry/30 hover:shadow-[0_8px_30px_rgba(27,23,22,0.06)] transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-cherry bg-cherry/5 px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-[#1B1716] mb-3 group-hover:text-cherry transition-colors leading-tight">
                      <Link aria-label="Navigation link" href={`/blog/${post.slug}`} className="before:absolute before:inset-0">
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-[#1B1716]/60 text-base leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-[#1B1716]/40 font-mono">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-[#1B1716]/10 text-[#1B1716]/30 group-hover:border-cherry group-hover:bg-cherry group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
