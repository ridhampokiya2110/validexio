import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";
import { blogs } from "@/lib/blog-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Startup Strategies & Insights | Validexio Blog",
  description: "Hard truths, unit economics, and brutal reality checks for founders. Dive into our latest strategies for building startups that survive and thrive.",
  openGraph: {
    title: "Startup Strategies & Insights | Validexio Blog",
    description: "Hard truths, unit economics, and brutal reality checks for founders.",
    type: "website",
  }
};

export default function BlogPage() {
  const featuredPost = blogs[0];
  const listPosts = blogs.slice(1);

  // Generate JSON-LD Schema for the blog index
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Validexio Startup Blog',
    description: 'Hard truths, unit economics, and brutal reality checks for founders.',
    publisher: {
      '@type': 'Organization',
      name: 'Validexio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://validexio.com/logo.png',
      }
    },
    blogPost: blogs.slice(0, 5).map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: post.date,
      url: `https://validexio.com/blog/${post.slug}`
    }))
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1B1716] font-sans selection:bg-cherry/40 selection:text-[#1B1716] flex flex-col overflow-x-hidden">
      {/* Inject JSON-LD Schema for SEO / AEO / GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-maroon/5 rounded-full blur-[100px] pointer-events-none" />
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-[#1B1716] relative z-10">
            Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cherry to-maroon">Writings</span>
          </h1>
          <p className="text-lg md:text-xl text-[#1B1716]/60 mx-auto relative z-10 leading-relaxed max-w-2xl">
            Hard truths, unit economics, and brutal reality checks for founders. Dive into our latest strategies for building startups that survive.
          </p>
        </section>

        {/* Featured Post (Latest) */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="group relative overflow-hidden rounded-3xl bg-white p-8 md:p-14 flex flex-col shadow-2xl hover:shadow-[0_30px_60px_rgba(117,7,12,0.15)] transition-all duration-500 border border-[#1B1716]/10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cherry/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 md:gap-5 mb-10 text-[13px] md:text-sm font-medium tracking-wide">
                <span className="text-cherry font-bold uppercase tracking-widest border-b border-cherry/30 pb-0.5">
                  {featuredPost.category}
                </span>
                <span className="text-[#1B1716]/20 hidden sm:block">•</span>
                <span className="text-[#1B1716]/60 flex items-center gap-2">
                  <Calendar className="w-4 h-4 opacity-60" />
                  {featuredPost.date}
                </span>
                <span className="text-[#1B1716]/20 hidden sm:block">•</span>
                <span className="text-[#1B1716]/60 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 opacity-60" />
                  {featuredPost.readTime}
                </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black text-[#1B1716] mb-6 leading-tight group-hover:text-cherry transition-colors duration-300">
                <Link aria-label="Navigation link" href={`/blog/${featuredPost.slug}`} className="before:absolute before:inset-0">
                  {featuredPost.title}
                </Link>
              </h2>
              
              <p className="text-[#1B1716]/70 text-lg md:text-xl mb-10 leading-relaxed max-w-3xl font-medium">
                {featuredPost.content.substring(0, 180).replace(/<[^>]+>/g, '')}...
              </p>
              
              <div className="flex items-center text-cherry font-bold gap-2 text-lg">
                <span>Read Full Article</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        {/* List Posts */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {listPosts.map((post, idx) => (
              <div key={`item-${idx}`} className="group relative bg-white border border-[#1B1716]/10 rounded-3xl p-8 hover:border-cherry/30 hover:shadow-[0_12px_40px_rgba(27,23,22,0.08)] transition-all duration-300 flex flex-col h-full">
                <div className="flex flex-wrap items-center gap-3 mb-5 text-xs font-medium tracking-wide">
                  <span className="text-cherry font-bold uppercase tracking-widest border-b border-cherry/30 pb-0.5">
                    {post.category}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-[#1B1716] mb-4 group-hover:text-cherry transition-colors leading-tight line-clamp-2">
                  <Link aria-label="Navigation link" href={`/blog/${post.slug}`} className="before:absolute before:inset-0">
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-[#1B1716]/60 text-base leading-relaxed mb-8 line-clamp-3 flex-grow">
                  {post.content.substring(0, 150).replace(/<[^>]+>/g, '')}...
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#1B1716]/5">
                  <div className="flex items-center gap-3 text-xs text-[#1B1716]/60 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 opacity-70" /> {post.date}</span>
                    <span className="text-[#1B1716]/20">•</span>
                    <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 opacity-70" /> {post.readTime}</span>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#1B1716]/10 text-[#1B1716]/30 group-hover:border-cherry group-hover:bg-cherry group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
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
