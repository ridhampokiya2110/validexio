"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function VerifyEmailButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email/send", { method: "POST" });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Verification email sent! Please check your inbox.");
      } else {
        toast.error(data.error || "Failed to send verification email");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleVerify}
      disabled={isLoading}
      className="mt-2 text-xs font-semibold text-white bg-cherry/90 hover:bg-cherry px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
    >
      {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
      Verify Email Now
    </button>
  );
}
