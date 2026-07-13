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
    <div className="relative group w-full overflow-hidden h-[300px] rounded-xl flex flex-col items-center justify-center mt-2">
      {/* Fake blurred content background */}
      <div className="absolute inset-0 bg-[#FDFCF8] flex flex-col gap-4 p-8 opacity-40 blur-sm pointer-events-none">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded w-full"></div>
      </div>
      
      {/* Gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCF8] via-[#FDFCF8]/90 to-[#FDFCF8]/40 z-10 pointer-events-none" />

      {/* Overlay CTA */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-[#630102] to-[#8C0203] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="font-black text-[#1B1716] text-2xl mb-2 tracking-tight">{title}</h3>
        <p className="text-[#1B1716]/60 mb-6 max-w-md font-medium">
          {description}
        </p>
        <Link aria-label="Navigation link"
          href={targetHref}
          className="inline-flex items-center justify-center px-8 py-3.5 bg-[#111827] text-white rounded-xl font-bold hover:bg-[#2A313C] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
        >
          Upgrade to Premium
        </Link>
      </div>
    </div>
  );
}
