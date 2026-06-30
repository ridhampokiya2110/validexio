import Link from "next/link";
import { Globe, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="py-16 bg-gradient-to-b from-white to-[#FDFCF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link aria-label="Navigation link" href="/" className="inline-block mb-6">
              <Image src="/logo-wordmark-noir.png" alt="Validexio" width={150} height={40} className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-[#1B1716]/60 text-sm mb-6 leading-relaxed max-w-[280px] font-medium">
              data-driven startup validation platform. From concept to customer in 60 seconds. Stop guessing, start executing.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              <a aria-label="Link action" 
                href="https://www.instagram.com/validexio?igsh=MXVlZW5kNm53Zm84MQ%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors"
              >
                <Instagram className="w-4 h-4" />
                Follow us on Instagram
              </a>
              <a aria-label="Link action" 
                href="https://www.linkedin.com/company/validexio/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors"
              >
                <Link aria-label="Navigation link"edin className="w-4 h-4" />
                Follow us on LinkedIn
              </a>
            </div>
            <div className="flex items-center gap-2 text-[#1B1716]/50 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              Execution Engine: Active
            </div>
          </div>

          {/* Product */}
          <div className="col-span-1">
            <h4 className="text-[#1B1716] text-xs font-bold uppercase tracking-widest mb-6">
              Product
            </h4>
            <ul className="space-y-4">
              <li><Link aria-label="Navigation link" href="/#features" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Idea Validation</Link></li>
              <li><Link aria-label="Navigation link" href="/#features" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Competitor Intelligence</Link></li>
              <li><Link aria-label="Navigation link" href="/#features" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Investor Simulator</Link></li>
              <li><Link aria-label="Navigation link" href="/#features" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Anti-Roadmap Strategy</Link></li>
              <li><Link aria-label="Navigation link" href="/#features" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Fake Door Code</Link></li>
              <li><Link aria-label="Navigation link" href="/gallery" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Wall of Roasts</Link></li>
              <li><Link aria-label="Navigation link" href="/pricing" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h4 className="text-[#1B1716] text-xs font-bold uppercase tracking-widest mb-6">
              Resources
            </h4>
            <ul className="space-y-4">
              <li><Link aria-label="Navigation link" href="/hub" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Founder Hub</Link></li>
              <li><Link aria-label="Navigation link" href="/blog" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Validation Blog</Link></li>
              <li><Link aria-label="Navigation link" href="/register" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Startup Idea Generator</Link></li>
              <li><Link aria-label="Navigation link" href="/register" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Buyer Persona Builder</Link></li>
              <li><Link aria-label="Navigation link" href="/register" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Validation Checklist</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h4 className="text-[#1B1716] text-xs font-bold uppercase tracking-widest mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              <li><Link aria-label="Navigation link" href="/about" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">About Us</Link></li>
              <li><Link aria-label="Navigation link" href="/about" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Security</Link></li>
              <li><Link aria-label="Navigation link" href="/pricing" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Lifetime Access</Link></li>
              <li><Link aria-label="Navigation link" href="/hub" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Referral Program</Link></li>
              <li><Link aria-label="Navigation link" href="/contact" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h4 className="text-[#1B1716] text-xs font-bold uppercase tracking-widest mb-6">
              Legal
            </h4>
            <ul className="space-y-4">
              <li><Link aria-label="Navigation link" href="/legal" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Privacy Policy</Link></li>
              <li><Link aria-label="Navigation link" href="/legal" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Terms of Service</Link></li>
              <li><Link aria-label="Navigation link" href="/legal" className="text-[#1B1716]/60 text-sm font-medium hover:text-[#630102] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="w-full h-px bg-[#1B1716]/10 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#1B1716]/40">
          <p>© {new Date().getFullYear()} Validexio. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Built for founders worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
