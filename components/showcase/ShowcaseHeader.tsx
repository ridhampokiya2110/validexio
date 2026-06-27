"use client";

import Link from "next/link";

export function ShowcaseHeader({ projectName }: { projectName?: string }) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#FDFCF8]/80 border-b border-[#1B1716]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side: Branding and Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cherry text-white flex items-center justify-center font-bold">
            V
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-sm tracking-tight text-[#1B1716]">Validexio Execution Vault</span>
            <span className="text-[#1B1716]/40 mx-2">/</span>
            <span className="text-sm font-medium text-[#1B1716]/80">Shared analysis: {projectName || "Example Project"}</span>
          </div>
        </div>

        {/* Right Side: CTA */}
        <Link
          href="/dashboard/validate"
          className="btn-primary bg-cherry hover:bg-cherry/90 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-transform hover:scale-105 shadow-[0_0_15px_rgba(117,7,12,0.2)]"
        >
          Test your idea now &rarr;
        </Link>
        
      </div>
    </header>
  );
}
