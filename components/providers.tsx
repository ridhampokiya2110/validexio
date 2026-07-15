"use client";

import { SessionProvider } from "next-auth/react";
import { GlobalErrorBoundary } from "./GlobalErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlobalErrorBoundary>
      <SessionProvider>
        {children}
      </SessionProvider>
    </GlobalErrorBoundary>
  );
}
