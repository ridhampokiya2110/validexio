"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";
import { Eye, EyeOff, Zap, Github, ArrowRight, CheckCircle, AlertCircle, User, Mail, Lock, Loader2 } from "lucide-react";
import { getPasswordStrength } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Valid phone number is required").optional().or(z.literal('')),
  role: z.string().min(1, "Please select your role"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const email = searchParams.get("email");
    const name = searchParams.get("name");

    setForm(prev => ({
      ...prev,
      email: email || prev.email,
      name: name || prev.name,
    }));
  }, [searchParams]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordStrength = getPasswordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
          profession: form.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "EMAIL_EXISTS") {
          setErrors({ email: "An account with this email already exists" });
        } else {
          setErrors({ general: data.error || "Registration failed" });
        }
        return;
      }

      // Auto sign in after registration
      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInRes?.ok) {
        toast.success("Account created! Welcome to Validexio.");
        router.push("/dashboard");
        router.refresh();
      } else {
        setSuccess(true);
      }
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoadingProvider(provider);
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#FDFCF8] flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-cherry animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[100dvh] bg-[#FDFCF8] flex items-center justify-center p-4">
        <div className="glass-card p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1B1716] mb-3">Account Created!</h2>
          <p className="text-[#1B1716]/55 mb-6">
            Check your email to verify your account, then sign in to start validating your ideas.
          </p>
          <Link href="/login" className="btn-primary w-full justify-center">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FDFCF8] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="hero-orb-1 -top-20 -right-20 opacity-40" />
      <div className="hero-orb-2 -bottom-20 -left-20 opacity-30" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <img src="/logo-icon-noir.png" alt="Validexio" className="w-20 h-20 object-contain" />
          </Link>
          <span className="font-bold text-xl text-[#1B1716]">Validexio</span>
          <h1 className="text-2xl font-bold text-[#1B1716] mt-6 mb-1">Create your account</h1>
          <p className="text-[#1B1716]/50 text-sm">Start validating ideas for free</p>
        </div>

        <div className="glass-card p-6 sm:p-8">
          {/* Social Login */}
          <div className="mb-6">
            <button
              onClick={() => handleSocialLogin("google")}
              disabled={!!loadingProvider}
              className="btn-secondary w-full text-sm py-2.5 justify-center gap-2 disabled:opacity-50"
            >
              {loadingProvider === "google" ? (
                <div className="w-4 h-4 border-2 border-[#1B1716]/30 border-t-cotton rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 12 4.9c1.83 0 3.48.68 4.76 1.8L20.54 3A11.84 11.84 0 0 0 12 .1 11.95 11.95 0 0 0 1.28 7.3l3.99 2.46Z"/>
                  <path fill="#34A853" d="M16.04 18.01A7.12 7.12 0 0 1 12 19.1c-3 0-5.58-1.87-6.73-4.56l-4 2.45A11.95 11.95 0 0 0 12 23.9c3.05 0 5.96-1.12 8.14-3.18l-4.1-2.71Z"/>
                  <path fill="#FBBC05" d="M19.1 12c0-.64-.06-1.26-.16-1.86H12v3.73h4.01a3.46 3.46 0 0 1-1.47 2.26l4.1 2.71A11.76 11.76 0 0 0 19.1 12Z"/>
                  <path fill="#4285F4" d="M5.27 14.54a7.18 7.18 0 0 1 0-4.78L1.28 7.3A11.95 11.95 0 0 0 .05 12c0 1.65.33 3.22.93 4.7l4.29-2.16Z"/>
                </svg>
              )}
              Continue with Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#1B1716]/10" />
            <span className="text-[#1B1716]/35 text-xs">or sign up with email</span>
            <div className="flex-1 h-px bg-[#1B1716]/10" />
          </div>

          {errors.general && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B1716]/30" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`input-field !pl-10 ${errors.name ? "border-red-500/50" : ""}`}
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`input-field ${errors.phone ? "border-red-500/50" : ""}`}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">
                I am a...
              </label>
              <div className="relative">
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={`input-field appearance-none cursor-pointer ${errors.role ? "border-red-500/50" : ""}`}
                >
                  <option value="" disabled className="text-[#1B1716]/50">Select your role</option>
                  <option value="student">Student</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="business_owner">Business Owner</option>
                  <option value="freelancer">Freelancer / Consultant</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-[#1B1716]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              {errors.role && <p className="text-red-600 text-xs mt-1">{errors.role}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B1716]/30" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`input-field !pl-10 ${errors.email ? "border-red-500/50" : ""}`}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B1716]/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`input-field !pl-10 !pr-10 ${errors.password ? "border-red-500/50" : ""}`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1B1716]/35 hover:text-[#1B1716]/70"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength meter */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                          i < passwordStrength.score ? passwordStrength.color : "bg-[#1B1716]/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#1B1716]/40">
                    Strength: <span className="text-[#1B1716]/70">{passwordStrength.label}</span>
                  </p>
                </div>
              )}
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B1716]/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className={`input-field !pl-10 ${errors.confirmPassword ? "border-red-500/50" : ""}`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <p className="text-xs text-[#1B1716]/35">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-cherry/60 hover:text-cherry">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-cherry/60 hover:text-cherry">Privacy Policy</Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#1B1716]/30 border-t-cotton rounded-full animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Free Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#1B1716]/40 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-cherry/80 hover:text-cherry font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFCF8]" />}>
      <RegisterPageContent />
    </Suspense>
  );
}
