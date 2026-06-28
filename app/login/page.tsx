"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Zap, AlertCircle, ChevronDown } from "lucide-react";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  role: z.string().min(1, "Please select your role"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ 
    email: "", 
    password: "",
    name: "",
    phone: "",
    role: ""
  });
  const [show2FA, setShow2FA] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const tab = searchParams.get("tab");
    const email = searchParams.get("email");
    const name = searchParams.get("name");

    if (tab === "signup") setActiveTab("signup");
    
    setForm(prev => ({
      ...prev,
      email: email || prev.email,
      name: name || prev.name,
    }));
  }, [searchParams]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const schema = activeTab === "signin" ? signinSchema : signupSchema;
    const result = schema.safeParse(form);
    
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
      if (activeTab === "signin") {
        const res = await signIn("credentials", {
          email: form.email,
          password: form.password,
          code: show2FA ? code : undefined,
          redirect: false,
        });

        if (res?.error) {
          if (res.error.includes("Requires2FA")) {
            try {
              await fetch("/api/auth/2fa/login-send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email }),
              });
              setShow2FA(true);
              setErrors({ general: "We've sent a 6-digit code to your email." });
            } catch (err) {
              setErrors({ general: "Failed to send 2FA code. Please try again." });
            }
          } else if (res.error.includes("Invalid2FACode")) {
            setErrors({ general: "Invalid 2FA code. Please try again." });
          } else {
            setErrors({ general: "Invalid credentials or login failed." });
          }
          setLoading(false);
        } else {
          toast.success("Welcome back!");
          router.push("/dashboard");
          router.refresh();
          return; // Exit early to keep loading state true during navigation
        }
      } else {
        // Real sign up flow
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
          setLoading(false);
          return;
        }

        // Auto sign in after registration
        const signInRes = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });

        if (signInRes?.ok) {
          toast.success("Account created successfully! Welcome to Validexio.");
          router.push("/dashboard");
          router.refresh();
          return; // Exit early to keep loading state true during navigation
        } else {
          toast.success("Account created! Please sign in.");
          setActiveTab("signin");
          setLoading(false);
        }
      }
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch {
      toast.error("Failed to sign in. Please try again.");
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#FDFCF8] flex flex-col lg:flex-row overflow-hidden font-sans relative text-[#1B1716]">
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(27,23,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(27,23,22,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50 pointer-events-none z-0"></div>

      {/* Left Side: Auth Card Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10 min-h-[100dvh]">
        
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center text-center w-full mb-10">
            <Link href="/" className="inline-block mb-5 relative group mx-auto">
              <div className="absolute inset-0 bg-gradient-to-b from-[#75070C]/10 to-transparent rounded-full blur-xl group-hover:bg-[#75070C]/20 transition-all duration-500"></div>
              <img src="/logo-icon-noir.png" alt="Validexio" className="w-24 h-24 object-contain relative z-10 drop-shadow-md group-hover:scale-105 transition-transform duration-500" />
            </Link>
            <h2 className="text-3xl font-black uppercase tracking-[0.25em] text-[#1B1716] ml-3 drop-shadow-sm">
              Validexio
            </h2>
            <div className="flex items-center justify-center w-full gap-3 mt-3">
              <div className="h-px w-6 bg-[#1B1716]/10"></div>
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#75070C]/70 uppercase">Founder's Portal</span>
              <div className="h-px w-6 bg-[#1B1716]/10"></div>
            </div>
          </div>

          {/* Solid White Card */}
          <div className="bg-white border border-[#1B1716]/10 rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
            
            <h1 className="text-2xl font-bold text-[#1B1716] mb-8 tracking-tight">
              {activeTab === "signin" ? "Welcome Back, Founder." : "Join the Elite."}
            </h1>

            {/* Toggle Tabs */}
            <div className="flex border-b border-[#1B1716]/10 mb-8">
              <button 
                onClick={() => { setActiveTab("signin"); setErrors({}); }}
                className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${activeTab === "signin" ? "border-[#75070C] text-[#75070C]" : "border-transparent text-[#1B1716]/40 hover:text-[#1B1716]"}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setActiveTab("signup"); setErrors({}); }}
                className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${activeTab === "signup" ? "border-[#75070C] text-[#75070C]" : "border-transparent text-[#1B1716]/40 hover:text-[#1B1716]"}`}
              >
                Create Account
              </button>
            </div>

            {errors.general && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg p-3 mb-6">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-red-600 text-sm font-medium">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {activeTab === "signup" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#1B1716]/60 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full px-4 py-3 bg-[#FDFCF8] text-[#1B1716] border ${errors.name ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : "border-[#1B1716]/10 focus:border-[#75070C] focus:ring-[#75070C]/20"} rounded-lg focus:outline-none focus:ring-2 transition-all font-medium`}
                      placeholder="Jane Doe"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B1716]/60 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`w-full px-4 py-3 bg-[#FDFCF8] text-[#1B1716] border ${errors.phone ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : "border-[#1B1716]/10 focus:border-[#75070C] focus:ring-[#75070C]/20"} rounded-lg focus:outline-none focus:ring-2 transition-all font-medium`}
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B1716]/60 uppercase tracking-wider mb-1.5">
                      I am a...
                    </label>
                    <div className="relative">
                      <select
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className={`w-full px-4 py-3 bg-[#FDFCF8] text-[#1B1716] border ${errors.role ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : "border-[#1B1716]/10 focus:border-[#75070C] focus:ring-[#75070C]/20"} rounded-lg focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer font-medium`}
                      >
                        <option value="" disabled className="text-[#1B1716]/50">Select your role</option>
                        <option value="student">Student</option>
                        <option value="entrepreneur">Entrepreneur</option>
                        <option value="business_owner">Business Owner</option>
                        <option value="freelancer">Freelancer / Consultant</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B1716]/40 pointer-events-none" />
                    </div>
                    {errors.role && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.role}</p>}
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1B1716]/60 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full px-4 py-3 bg-[#FDFCF8] text-[#1B1716] border ${errors.email ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : "border-[#1B1716]/10 focus:border-[#75070C] focus:ring-[#75070C]/20"} rounded-lg focus:outline-none focus:ring-2 transition-all font-medium`}
                  placeholder="founder@startup.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-[#1B1716]/60 uppercase tracking-wider">
                    Password
                  </label>
                  {activeTab === "signin" && (
                    <Link href="/forgot-password" className="text-xs text-[#75070C]/80 hover:text-[#75070C] font-semibold transition-colors">
                      Forgot Password?
                    </Link>
                  )}
                </div>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`w-full px-4 py-3 bg-[#FDFCF8] text-[#1B1716] border ${errors.password ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : "border-[#1B1716]/10 focus:border-[#75070C] focus:ring-[#75070C]/20"} rounded-lg focus:outline-none focus:ring-2 transition-all font-medium`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</p>}
              </div>

              {show2FA && activeTab === "signin" && (
                <div>
                  <label className="block text-xs font-bold text-[#1B1716]/60 uppercase tracking-wider mb-1.5">
                    Email Security Code (2FA)
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={6}
                    className={`w-full px-4 py-3 bg-[#FDFCF8] text-[#1B1716] border ${errors.code ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : "border-[#1B1716]/10 focus:border-[#75070C] focus:ring-[#75070C]/20"} rounded-lg focus:outline-none focus:ring-2 transition-all font-mono tracking-widest text-center text-lg`}
                    placeholder="000000"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (show2FA && code.length !== 6)}
                className="w-full py-3.5 mt-4 bg-[#75070C] hover:bg-[#810100] text-white font-bold rounded-lg transition-all duration-200 shadow-[0_4px_12px_rgba(117,7,12,0.2)] hover:shadow-[0_6px_16px_rgba(117,7,12,0.3)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  activeTab === "signin" ? "Access Founder's Hub" : "Create My Account"
                )}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#1B1716]/10" />
              <span className="text-xs font-bold text-[#1B1716]/30 tracking-widest uppercase">OR</span>
              <div className="flex-1 h-px bg-[#1B1716]/10" />
            </div>

            <button
              onClick={() => handleSocialLogin("google")}
              disabled={loadingProvider === "google"}
              className="w-full py-3 bg-white border border-[#1B1716]/10 hover:bg-[#FDFCF8] text-[#1B1716] font-bold rounded-lg transition-colors flex justify-center items-center gap-3 disabled:opacity-70 shadow-sm"
            >
              {loadingProvider === "google" ? (
                <div className="w-5 h-5 border-2 border-[#1B1716]/30 border-t-[#1B1716] rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 12 4.9c1.83 0 3.48.68 4.76 1.8L20.54 3A11.84 11.84 0 0 0 12 .1 11.95 11.95 0 0 0 1.28 7.3l3.99 2.46Z"/>
                  <path fill="#34A853" d="M16.04 18.01A7.12 7.12 0 0 1 12 19.1c-3 0-5.58-1.87-6.73-4.56l-4 2.45A11.95 11.95 0 0 0 12 23.9c3.05 0 5.96-1.12 8.14-3.18l-4.1-2.71Z"/>
                  <path fill="#FBBC05" d="M19.1 12c0-.64-.06-1.26-.16-1.86H12v3.73h4.01a3.46 3.46 0 0 1-1.47 2.26l4.1 2.71A11.76 11.76 0 0 0 19.1 12Z"/>
                  <path fill="#4285F4" d="M5.27 14.54a7.18 7.18 0 0 1 0-4.78L1.28 7.3A11.95 11.95 0 0 0 .05 12c0 1.65.33 3.22.93 4.7l4.29-2.16Z"/>
                </svg>
              )}
              Continue with Google
            </button>

          </div>
          
          <div className="mt-8 text-center relative z-10">
            <p className="text-xs text-[#1B1716]/40 font-medium">
              Protected by enterprise-grade security. SOC 2 compliant.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Graphic/Pattern - Lightened to Masterpiece Theme */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-white via-[#FDFCF8] to-[#F5F3EB] items-center justify-center overflow-hidden border-l border-[#1B1716]/5 z-20">
        
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-1/4 w-[40rem] h-[40rem] bg-[#75070C]/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-[#FFEDAB]/30 rounded-full blur-[100px] pointer-events-none"></div>
        </div>

        {/* Quote */}
        <div className="relative z-10 px-12 max-w-lg">
          <div className="w-12 h-1 bg-[#75070C] mb-8"></div>
          <h2 className="text-4xl font-black text-[#1B1716] leading-tight tracking-tight">
            &quot;Execution is the only metric that matters.&quot;
          </h2>
          <p className="mt-6 text-[#1B1716]/60 text-lg font-medium">
            Join thousands of visionary founders scaling with Validexio.
          </p>
        </div>
      </div>

    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFCF8]" />}>
      <AuthPageContent />
    </Suspense>
  );
}
