"use client";

import { useEffect, useState, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";

export function UserStatusChecker() {
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const initialStatusRef = useRef<{ tier?: string; credits?: number } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Don't run polling on admin pages
    if (pathname?.startsWith("/admin")) {
      return;
    }

    // Initial fetch to establish baseline
    fetch("/api/v1/auth/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          initialStatusRef.current = { tier: data.tier, credits: data.availableCredits };
        }
      })
      .catch(() => {});

    // Poll every 15 seconds for changes
    const interval = setInterval(() => {
      fetch("/api/v1/auth/status")
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && initialStatusRef.current) {
            if (
              data.tier !== initialStatusRef.current.tier ||
              data.availableCredits !== initialStatusRef.current.credits
            ) {
              setNeedsRefresh(true);
            }
          }
        })
        .catch(() => {});
    }, 15000);

    return () => clearInterval(interval);
  }, [pathname]);

  if (!needsRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-white border border-[#E44234] rounded-xl shadow-2xl p-4 max-w-sm animate-fade-in-scale">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#E44234]/10 rounded-full">
          <RefreshCw className="w-5 h-5 text-[#E44234] animate-spin-slow" />
        </div>
        <div>
          <h4 className="font-bold text-[#1B1716]">Account Updated</h4>
          <p className="text-sm text-[#1B1716]/70 mt-1">
            An administrator has modified your account plan or credits. Please refresh the page to apply the changes.
          </p>
          <button aria-label="Button action" type="button" 
            onClick={() => window.location.reload()}
            className="mt-3 w-full bg-[#E44234] text-white py-2 rounded-lg font-bold text-sm hover:bg-[#C23528] transition-colors"
          >
            Refresh Now
          </button>
        </div>
      </div>
    </div>
  );
}
