"use client";

import { SessionProvider } from "next-auth/react";
import { UserStatusChecker } from "./UserStatusChecker";
import { GlobalErrorBoundary } from "./GlobalErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlobalErrorBoundary>
      <SessionProvider>
        {children}
        <UserStatusChecker />
      </SessionProvider>
    </GlobalErrorBoundary>
  );
}
