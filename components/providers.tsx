"use client";

import { SessionProvider } from "next-auth/react";
import { GlobalErrorBoundary } from "./GlobalErrorBoundary";
import { CookieConsentProvider } from "./CookieConsent";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlobalErrorBoundary>
      <SessionProvider>
        <CookieConsentProvider>
          {children}
        </CookieConsentProvider>
      </SessionProvider>
    </GlobalErrorBoundary>
  );
}
