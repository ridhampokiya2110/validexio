import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calendar, BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DOMPurify from 'isomorphic-dompurify';
import { blogs } from "@/lib/blog-data";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogs.find(p => p.slug === resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - Validexio',
    };
  }

  // Extract a short description from content (strip HTML tags)
  const plainTextContent = post.content.replace(/<[^>]+>/g, '');
  const description = plainTextContent.substring(0, 160).trim() + '...';

  return {
    title: `${post.title} | Validexio Startup Strategies`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.date, // In a real app, use ISO date string
      authors: ['Validexio Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = blogs.find(p => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Generate JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.content.replace(/<[^>]+>/g, '').substring(0, 160).trim() + '...',
    author: {
      '@type': 'Organization',
      name: 'Validexio',
    },
    datePublished: post.date, // Convert to ISO in production ideally
    articleSection: post.category,
    wordCount: post.content.split(' ').length,
    publisher: {
      '@type': 'Organization',
      name: 'Validexio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://validexio.com/logo.png', // Fallback URL
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#0A0A0A] text-[#1B1716] dark:text-[#E5E7EB] font-sans selection:bg-cherry/40 selection:text-[#1B1716] dark:selection:text-[#FDFCF8] flex flex-col transition-colors duration-300">
      {/* Inject JSON-LD Schema for SEO / AEO / GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-maroon/5 dark:bg-cherry/5 rounded-full blur-[120px] pointer-events-none transition-colors duration-500" />
          
          <Link aria-label="Navigation link" href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-[#1B1716]/50 dark:text-[#9CA3AF] hover:text-cherry dark:hover:text-red-400 transition-colors mb-12 relative z-10">
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </Link>

          <header className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 md:gap-5 mb-10 text-[13px] md:text-sm font-medium tracking-wide">
              <span className="text-cherry dark:text-red-400 font-bold uppercase tracking-widest border-b border-cherry/30 dark:border-red-400/30 pb-0.5">
                {post.category}
              </span>
              <span className="text-[#1B1716]/20 dark:text-white/20 hidden sm:block">•</span>
              <span className="text-[#1B1716]/60 dark:text-white/60 flex items-center gap-2">
                <Calendar className="w-4 h-4 opacity-60" />
                {post.date}
              </span>
              <span className="text-[#1B1716]/20 dark:text-white/20 hidden sm:block">•</span>
              <span className="text-[#1B1716]/60 dark:text-white/60 flex items-center gap-2">
                <BookOpen className="w-4 h-4 opacity-60" />
                {post.readTime}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[#1B1716] dark:text-white leading-[1.1] mb-12">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 py-8 border-y border-[#1B1716]/10 dark:border-white/10">
              <div className="w-12 h-12 rounded-full bg-cherry/10 dark:bg-cherry/20 border border-cherry/20 dark:border-cherry/30 flex items-center justify-center shadow-inner">
                <span className="text-cherry dark:text-red-400 font-black text-lg">V</span>
              </div>
              <div>
                <p className="font-bold text-[#1B1716] dark:text-white text-lg">{post.author}</p>
                <p className="text-sm text-[#1B1716]/60 dark:text-[#9CA3AF] font-mono tracking-wide">Validexio Editorial</p>
              </div>
            </div>
          </header>
        </div>

        {/* Content Section */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="prose prose-lg md:prose-xl max-w-none 
              prose-headings:font-black prose-headings:text-[#1B1716] dark:prose-headings:text-white prose-headings:tracking-tight 
              prose-p:text-[#1B1716]/80 dark:prose-p:text-[#D1D5DB] prose-p:leading-[1.8] prose-p:font-medium
              prose-a:text-cherry dark:prose-a:text-red-400 prose-a:font-bold hover:prose-a:text-[#910505] dark:hover:prose-a:text-red-300 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#1B1716] dark:prose-strong:text-white prose-strong:font-bold
              prose-li:text-[#1B1716]/80 dark:prose-li:text-[#D1D5DB] prose-li:font-medium prose-ul:list-disc prose-ol:list-decimal
              prose-blockquote:border-l-4 prose-blockquote:border-cherry dark:prose-blockquote:border-red-500 prose-blockquote:bg-cherry/5 dark:prose-blockquote:bg-cherry/10 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:text-[#1B1716]/70 dark:prose-blockquote:text-[#9CA3AF] prose-blockquote:font-serif prose-blockquote:italic
              first-letter:text-7xl first-letter:font-black first-letter:text-cherry dark:first-letter:text-red-500 first-letter:mr-3 first-letter:float-left first-letter:leading-none
              transition-colors duration-300"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />

          <div className="mt-32 pt-16 border-t border-[#1B1716]/10 dark:border-white/10">
            <div className="bg-[#1B1716] dark:bg-gradient-to-br dark:from-[#1A1A1A] dark:to-[#0A0A0A] border border-transparent dark:border-white/10 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cherry/20 dark:bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-butter/10 dark:bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
              
              <h3 className="text-3xl md:text-4xl font-black mb-6 relative z-10 tracking-tight">Stop Reading. Start Validating.</h3>
              <p className="text-[#EDEBDE]/80 dark:text-[#9CA3AF] mb-10 max-w-xl mx-auto relative z-10 text-lg md:text-xl font-medium leading-relaxed">
                Don't become another statistic. Get a comprehensive breakdown of your startup idea's viability in 60 seconds with Validexio.
              </p>
              <Link aria-label="Navigation link" href="/dashboard" className="inline-flex items-center gap-3 bg-cherry hover:bg-[#910505] dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-4 px-10 rounded-xl transition-all hover:scale-105 hover:shadow-[0_10px_30px_rgba(117,7,12,0.3)] dark:hover:shadow-[0_10px_30px_rgba(220,38,38,0.3)] relative z-10 text-lg">
                Validate Your Idea Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
