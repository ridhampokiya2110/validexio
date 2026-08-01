"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle } from "lucide-react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm text-center mb-6">
          {error || "No token provided"}
        </div>
        <Link href="/forgot-password" className="btn-secondary w-full">
          Request new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-lg font-bold text-[#1B1716] mb-2">Password reset successfully!</h2>
        <p className="text-[#1B1716]/60 text-sm mb-6">
          You can now log in with your new password. Redirecting to login...
        </p>
        <Link href="/login" className="btn-secondary w-full">
          Go to login now
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-[#1B1716]/80 block">
          New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-[#1B1716]/30" />
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field !pl-10"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-[#1B1716]/80 block">
          Confirm New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-[#1B1716]/30" />
          </div>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field !pl-10"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
            Resetting...
          </>
        ) : (
          "Reset Password"
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden bg-[#FDFCF8]">
      <div className="hero-orb-1 top-0 right-0 opacity-20"></div>
      <div className="hero-orb-2 bottom-0 left-0 opacity-20 bg-cherry"></div>

      <div className="glass-card w-full max-w-md p-8 relative z-10 animate-fade-in-scale">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1B1716] mb-2">Create New Password</h1>
          <p className="text-[#1B1716]/50 text-sm">
            Please enter your new password below.
          </p>
        </div>

        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-[#75070C]" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
