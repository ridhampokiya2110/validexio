"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          setStatus("success");
          setMessage("Your email has been verified successfully");
        } else {
          const data = await res.json();
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An unexpected error occurred");
      }
    };

    verify();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-cherry animate-spin mb-4" />
        <h1 className="text-xl font-bold text-[#1B1716] mb-2">Verifying Email...</h1>
        <p className="text-[#1B1716]/50 text-sm">Please wait while we verify your email address</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-[#1B1716] mb-2">Email Verified</h1>
        <p className="text-[#1B1716]/60 text-sm mb-8">{message}</p>
        <Link aria-label="Navigation link" href="/login" className="btn-primary w-full">
          Sign In to Continue
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
        <XCircle className="w-8 h-8 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-[#1B1716] mb-2">Verification Failed</h1>
      <p className="text-red-600/80 text-sm mb-8">{message}</p>
      <Link aria-label="Navigation link" href="/login" className="btn-secondary w-full">
        Return to Login
      </Link>
    </div>
  );
}
