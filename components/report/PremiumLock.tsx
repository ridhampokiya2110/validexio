"use client";


import Link from "next/link";
import { Lock } from "lucide-react";
import { useSession } from "next-auth/react";

interface PremiumLockProps {
  isLocked: boolean;
  title: string;
  description: string;
}

export function PremiumLock({ isLocked, title, description }: PremiumLockProps) {
  const { data: session } = useSession();
  
  if (!isLocked) return null;

  const targetHref = session?.user ? "/dashboard/billing" : "/pricing";

  return (
    <div className="relative group w-full flex flex-col items-center justify-center py-10 my-2">
      {/* Fake blurred content skeleton */}
      <div className="absolute inset-0 flex flex-col gap-4 p-4 opacity-20 blur-[3px] pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="h-6 bg-gray-400 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-400 rounded w-full"></div>
        <div className="h-4 bg-gray-400 rounded w-5/6"></div>
        <div className="h-4 bg-gray-400 rounded w-4/6"></div>
        <div className="h-20 bg-gray-400 rounded w-full mt-4"></div>
      </div>

      {/* Overlay CTA */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full max-w-lg mx-auto">
        <div className="w-12 h-12 bg-gradient-to-br from-[#630102] to-[#8C0203] text-white rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-[#630102]/10">
          <Lock className="w-5 h-5" />
        </div>
        <h3 className="font-black text-[#1B1716] text-xl sm:text-2xl mb-3 tracking-tight">{title}</h3>
        <p className="text-[#1B1716]/60 mb-6 font-medium text-sm sm:text-base leading-relaxed">
          {description}
        </p>
        <Link aria-label="Navigation link"
          href={targetHref}
          className="inline-flex items-center justify-center px-8 py-3 bg-[#111827] text-white rounded-xl font-bold hover:bg-[#2A313C] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
        >
          Upgrade to Premium
        </Link>
      </div>
    </div>
  );
}
