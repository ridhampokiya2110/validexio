"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

interface ExecutionLockProps {
  children: ReactNode;
  isReadOnly?: boolean;
}

export function ExecutionLock({ children, isReadOnly }: ExecutionLockProps) {
  if (!isReadOnly) {
    return <>{children}</>;
  }

  return (
    <div className="relative group">
      {/* Container cuts off visually to show just the top half properly */}
      <div className="max-h-[250px] overflow-hidden relative">
        {children}
        
        {/* Gradient fade to blur out the bottom text */}
        <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-[#FDFCF8] via-[#FDFCF8]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-full backdrop-blur-[2px] z-10 pointer-events-none" style={{ maskImage: 'linear-gradient(to top, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 40%, transparent 100%)' }} />
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-8">
        <div className="bg-[#FFFFFF] border border-cherry/20 shadow-xl rounded-2xl p-6 text-center max-w-md mx-auto transform transition-transform group-hover:scale-105">
          <div className="w-12 h-12 bg-cherry/10 text-cherry rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#1B1716] text-lg mb-2">Execution Assets Locked</h3>
          <p className="text-sm text-[#1B1716]/60 mb-5">
            Unlock the full MVP boilerplate and execution assets for your own idea.
          </p>
          <Link
            href="/dashboard/validate"
            className="btn-primary w-full block py-3 bg-cherry text-white rounded-xl font-bold hover:bg-cherry/90 transition-colors shadow-[0_0_15px_rgba(117,7,12,0.3)]"
          >
            Start Validation Now
          </Link>
        </div>
      </div>
    </div>
  );
}
