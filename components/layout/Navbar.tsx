"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      const isHome = window.location.pathname === "/";
      if (isHome) {
        e.preventDefault();
        const targetId = href.replace("/#", "");
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          setMenuOpen(false);
        }
      }
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-nav py-3 shadow-xl bg-white/80 backdrop-blur-md border-b border-[#1B1716]/5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link aria-label="Navigation link" href="/" className="flex items-center gap-2 group">
          <Image src="/logo-primary-noir.png" alt="Validexio" width={150} height={48} className="h-10 sm:h-12 w-auto object-contain" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Features", href: "/#features" },
            { label: "How It Works", href: "/#how-it-works" },
            { label: "Pricing", href: "/pricing" },
            { label: "Wall of Roasts", href: "/gallery" },
            { label: "About", href: "/about" },
            { label: "Blog", href: "/blog" },
          ].map((item) => (
            <Link aria-label="Navigation link"
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="px-4 py-2 text-sm font-medium text-[#1B1716]/60 hover:text-[#1B1716] rounded-lg hover:bg-[#1B1716]/5 transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link aria-label="Navigation link"
            href="/login"
            className="text-sm font-medium text-[#1B1716]/70 hover:text-[#1B1716] transition-colors px-4 py-2 rounded-lg hover:bg-[#1B1716]/5"
          >
            Log In
          </Link>
          <Link aria-label="Navigation link" href="/register" className="btn-primary flex items-center gap-1 text-sm px-5 py-2.5 rounded-lg bg-cherry text-white hover:bg-[#910505] transition-all shadow-[0_4px_12px_rgba(117,7,12,0.3)]">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button aria-label="Button action" type="button"
          className="md:hidden p-2 rounded-lg hover:bg-[#1B1716]/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-0.5 bg-[#1B1716] transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block h-0.5 bg-[#1B1716] transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 bg-[#1B1716] transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass-nav bg-white/95 backdrop-blur-md border-t border-[#1B1716]/5 px-4 py-4 flex flex-col gap-2">
          {[
            { label: "Features", href: "/#features" },
            { label: "How It Works", href: "/#how-it-works" },
            { label: "Pricing", href: "/pricing" },
            { label: "Wall of Roasts", href: "/gallery" },
            { label: "About", href: "/about" },
            { label: "Blog", href: "/blog" },
          ].map((item) => (
            <Link aria-label="Navigation link"
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="py-3 px-4 text-sm font-medium text-[#1B1716]/70 hover:text-[#1B1716] hover:bg-[#1B1716]/5 rounded-lg transition-all"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#1B1716]/5 mt-2">
            <Link aria-label="Navigation link" href="/login" className="flex items-center justify-center font-semibold text-sm py-2.5 rounded-lg border border-[#1B1716]/10 text-[#1B1716]">Log In</Link>
            <Link aria-label="Navigation link" href="/register" className="flex items-center justify-center font-semibold text-sm py-2.5 rounded-lg bg-cherry text-white">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
