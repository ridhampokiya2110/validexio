"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, UserCircle } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    phone: "",
    role: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!form.role) {
      setErrors({ role: "Please select your role" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.phone || undefined,
          profession: form.role,
        }),
      });

      if (!res.ok) {
        setErrors({ general: "Failed to update profile. Please try again." });
        return;
      }

      toast.success("Profile completed!");
      // Force a hard refresh so the session is updated with the new profession
      window.location.href = "/dashboard";
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="hero-orb-1 -top-20 -right-20 opacity-40" />
      <div className="hero-orb-2 -bottom-20 -left-20 opacity-30" />

      <div className="w-full max-w-md relative z-10">
        <div className="glass-card p-8 sm:p-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#75070C]/10 rounded-full flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-[#75070C]" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-[#1B1716] text-center mb-2">Complete Your Profile</h1>
          <p className="text-[#1B1716]/60 text-center text-sm mb-8">
            Tell us a bit more about yourself to personalize your experience.
          </p>

          {errors.general && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-field"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">
                I am a...
              </label>
              <div className="relative">
                <select
                  id="role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={`input-field appearance-none cursor-pointer ${errors.role ? "border-red-500/50" : ""}`}
                >
                  <option value="" disabled className="text-[#1B1716]/50">Select your role</option>
                  <option value="student">Student</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="business_owner">Business Owner</option>
                  <option value="ecommerce">E-commerce / Retail</option>
                  <option value="marketer">Marketer</option>
                  <option value="freelancer">Freelancer / Consultant</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-[#1B1716]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              {errors.role && <p className="text-red-600 text-xs mt-1">{errors.role}</p>}
            </div>

            <button aria-label="Button action"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-4 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Continue to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
