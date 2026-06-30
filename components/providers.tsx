"use client";

import { SessionProvider } from "next-auth/react";
import { UserStatusChecker } from "./UserStatusChecker";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <UserStatusChecker />
    </SessionProvider>
  );
}
