"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import {
  ChevronRight,
  ChevronLeft,
  Rocket,
  Globe,
  DollarSign,
  Lightbulb,
  CheckCircle,
  Loader2,
  Brain,
} from "lucide-react";
import { INDUSTRIES, PRICING_MODELS, cn } from "@/lib/utils";

const step1Schema = z.object({
  industry: z.string().min(1, "Please select an industry"),
});

const step2Schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z
    .string()
    .min(100, "Description must be at least 100 characters for accurate analysis.")
    .max(4000),
  targetMarket: z.string().min(1, "Target Market is required"),
  targetScope: z.string().optional(),
});

const step3Schema = z.object({
  pricingModel: z.string().min(1, "Please select a pricing model"),
  priceTarget: z.string().optional(),
  billingFrequency: z.string().optional(),
});

const DRAFT_KEY = "validexio_draft";

interface FormData {
  industry: string;
  title: string;
  description: string;
  targetMarket: string;
  targetScope: string;
  targetCountry: string;
  targetState: string;
  targetCity: string;
  pricingModel: string;
  priceTarget: string;
  billingFrequency: string;
}

const initialForm: FormData = {
  industry: "",
  title: "",
  description: "",
  targetMarket: "",
  targetScope: "GLOBAL",
  targetCountry: "",
  targetState: "",
  targetCity: "",
  pricingModel: "",
  priceTarget: "",
  billingFrequency: "",
};

const steps = [
  { number: 1, label: "Industry", icon: Lightbulb },
  { number: 2, label: "Your Idea", icon: Globe },
  { number: 3, label: "Pricing", icon: DollarSign },
];

export default function ValidatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [userTier, setUserTier] = useState<string>("FREE");
  const [isOtherIndustry, setIsOtherIndustry] = useState(false);

  // Geography lists fetched from backend to prevent Turbopack client bundler crash
  const [countriesList, setCountriesList] = useState<{name: string, isoCode: string}[]>([]);
  const [statesList, setStatesList] = useState<{name: string, isoCode: string}[]>([]);
  const [citiesList, setCitiesList] = useState<{name: string}[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");

  useEffect(() => {
    fetch("/api/v1/geo?type=countries")
      .then(r => r.json())
      .then(d => { if (d.data) setCountriesList(d.data); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedCountryCode) {
      fetch(`/api/v1/geo?type=states&countryCode=${selectedCountryCode}`)
        .then(r => r.json())
        .then(d => { if (d.data) setStatesList(d.data); else setStatesList([]); })
        .catch(console.error);
    } else {
      setStatesList([]);
    }
  }, [selectedCountryCode]);

  useEffect(() => {
    if (selectedCountryCode && selectedStateCode) {
      fetch(`/api/v1/geo?type=cities&countryCode=${selectedCountryCode}&stateCode=${selectedStateCode}`)
        .then(r => r.json())
        .then(d => { if (d.data) setCitiesList(d.data); else setCitiesList([]); })
        .catch(console.error);
    } else {
      setCitiesList([]);
    }
  }, [selectedCountryCode, selectedStateCode]);

  // Restore codes from draft form data once lists are loaded
  useEffect(() => {
    if (form.targetCountry && countriesList.length > 0 && !selectedCountryCode) {
      const code = countriesList.find(c => c.name === form.targetCountry)?.isoCode;
      if (code) setSelectedCountryCode(code);
    }
  }, [form.targetCountry, countriesList]);

  useEffect(() => {
    if (form.targetState && statesList.length > 0 && !selectedStateCode) {
      const code = statesList.find(s => s.name === form.targetState)?.isoCode;
      if (code) setSelectedStateCode(code);
    }
  }, [form.targetState, statesList]);

  // Handle geo scope
  useEffect(() => {
    if (form.targetScope === "GLOBAL") {
      setForm(f => ({ ...f, targetCountry: "", targetState: "", targetCity: "" }));
    } else if (form.targetScope === "COUNTRY") {
      setForm(f => ({ ...f, targetState: "", targetCity: "" }));
    } else if (form.targetScope === "STATE") {
      setForm(f => ({ ...f, targetCity: "" }));
    }
  }, [form.targetScope]);

  // Fetch credits
  useEffect(() => {
    fetch("/api/user/credits")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUserCredits(data.availableCredits);
          setUserTier(data.tier);
        }
      })
      .catch(console.error);
  }, []);

  // Load draft on mount
  useEffect(() => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        const parsed = JSON.parse(draft);
        setForm(parsed);
        if (parsed.industry && !INDUSTRIES.includes(parsed.industry)) {
          setIsOtherIndustry(true);
        }
        setHasDraft(true);
        toast.info("Draft recovered. Continue where you left off.");
      }
    } catch {}
  }, []);

  // Autosave on form change
  useEffect(() => {
    if (form.title || form.description || form.industry) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    }
  }, [form]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
  };

  const validateStep = (currentStep: number): boolean => {
    let result;
    setErrors({});
    const fieldErrors: Record<string, string> = {};

    if (currentStep === 1) {
      result = step1Schema.safeParse({ industry: form.industry });
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          fieldErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(fieldErrors);
        return false;
      }
    } else if (currentStep === 2) {
      result = step2Schema.safeParse({
        title: form.title,
        description: form.description,
        targetMarket: form.targetMarket,
        targetScope: form.targetScope,
      });

      let isValid = true;
      if (!result.success) {
        isValid = false;
        result.error.issues.forEach((issue) => {
          fieldErrors[issue.path[0] as string] = issue.message;
        });
      }

      if (form.targetScope !== "GLOBAL" && !form.targetCountry) {
        fieldErrors["targetCountry"] = "Please select a country";
        isValid = false;
      }
      if ((form.targetScope === "STATE" || form.targetScope === "CITY") && !form.targetState) {
        fieldErrors["targetState"] = "Please select a state";
        isValid = false;
      }
      if (form.targetScope === "CITY" && !form.targetCity) {
        fieldErrors["targetCity"] = "Please select a city";
        isValid = false;
      }

      if (!isValid) {
        setErrors(fieldErrors);
        return false;
      }
    } else {
      result = step3Schema.safeParse({ pricingModel: form.pricingModel });
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          fieldErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(fieldErrors);
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    const isUnlimited = userTier === "PRO" || userTier === "TEAM";
    if (!isUnlimited && userCredits !== null && userCredits <= 0) {
      toast.error("You don't have enough credits to validate this idea.", {
        action: {
          label: "Buy Credits",
          onClick: () => router.push("/dashboard/billing"),
        },
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          toast.error(data.message || "Insufficient credits", {
            action: {
              label: "Buy Credits",
              onClick: () => router.push("/dashboard/billing"),
            },
          });
          return;
        }
        throw new Error(data.error || data.message || "Validation failed");
      }

      clearDraft();
      toast.success("Idea submitted! Generating report...");
      router.push(`/dashboard/reports/generating?ideaId=${data.ideaId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1716] mb-1">
          Validate Your Idea
        </h1>
        <p className="text-[#1B1716]/50 text-sm sm:text-base">
          Get AI-powered validation in under 60 seconds.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                    step > s.number
                      ? "bg-emerald-500/20 border border-emerald-500/40"
                      : step === s.number
                      ? "bg-cherry/20 border border-cherry/50"
                      : "bg-[#1B1716]/5 border border-[#1B1716]/10"
                  )}
                >
                  {step > s.number ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <s.icon
                      className={cn(
                        "w-5 h-5",
                        step === s.number ? "text-cherry" : "text-[#1B1716]/60"
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors",
                    step === s.number ? "text-[#1B1716]" : "text-[#1B1716]/35"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 mx-3 mt-[-14px]">
                  <div className="h-px bg-[#1B1716]/10">
                    <div
                      className="h-px bg-gradient-to-r from-cherry to-butter transition-all duration-500"
                      style={{ width: step > s.number ? "100%" : "0%" }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="progress-bar mt-2">
          <div
            className="progress-fill"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-[#1B1716]/35">Step {step} of {steps.length}</span>
          <span className="text-xs text-[#1B1716]/35">{Math.round(progress)}% complete</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-card p-6 sm:p-8">
        {/* Step 1: Industry */}
        {step === 1 && (
          <div className="animate-fade-in-scale">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cherry/10 border border-cherry/20 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-cherry" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1B1716]">Select Your Industry</h2>
                <p className="text-[#1B1716]/50 text-sm">What sector does your idea operate in?</p>
              </div>
            </div>

            {errors.industry && (
              <p className="text-red-600 text-sm mb-4 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-xs">!</span>
                {errors.industry}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INDUSTRIES.map((industry) => {
                const isSelected = industry === "Other" ? isOtherIndustry : (!isOtherIndustry && form.industry === industry);
                return (
                  <button
                    key={industry}
                    onClick={() => {
                      if (industry === "Other") {
                        setIsOtherIndustry(true);
                        setForm({ ...form, industry: "" });
                      } else {
                        setIsOtherIndustry(false);
                        setForm({ ...form, industry });
                      }
                    }}
                    className={cn(
                      "px-3 py-3 rounded-xl text-sm font-medium text-left transition-all duration-200",
                      isSelected
                        ? "bg-cherry/20 border-2 border-cherry/60 text-[#1B1716]"
                        : "bg-[#1B1716]/5 border border-[#1B1716]/10 text-[#1B1716]/60 hover:bg-[#1B1716]/10 hover:border-[#1B1716]/20 hover:text-[#1B1716]"
                    )}
                  >
                    {isSelected && (
                      <CheckCircle className="w-3.5 h-3.5 text-cherry inline mr-1.5 mb-0.5" />
                    )}
                    {industry}
                  </button>
                );
              })}
            </div>

            {isOtherIndustry && (
              <div className="mt-4 animate-fade-in">
                <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">
                  Specify Your Industry <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className={cn("input-field", errors.industry ? "border-red-500/50" : "")}
                  placeholder="e.g., Space Mining, DeepTech, Quantum Computing..."
                  autoFocus
                />
              </div>
            )}
          </div>
        )}

        {/* Step 2: Idea & Location */}
        {step === 2 && (
          <div className="animate-fade-in-scale space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-400/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1B1716]">Describe Your Idea</h2>
                <p className="text-[#1B1716]/50 text-sm">Be specific — better input = better analysis</p>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">
                Idea Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={cn("input-field", errors.title ? "border-red-500/50" : "")}
                placeholder="e.g., AI-powered invoice management for freelancers"
                maxLength={100}
              />
              <div className="flex justify-between mt-1">
                {errors.title ? (
                  <p className="text-red-600 text-xs">{errors.title}</p>
                ) : (
                  <span />
                )}
                <span className="text-[#1B1716]/60 text-xs">{form.title.length}/100</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">
                Describe Your Idea <span className="text-red-600">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={cn("input-field min-h-32 resize-y", errors.description ? "border-red-500/50" : "")}
                placeholder="Describe what your product does, who it helps, and what problem it solves. Include any unique insights you have about the market or customer pain points..."
                maxLength={4000}
                rows={5}
              />
              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <p className="text-red-600 text-xs">{errors.description}</p>
                ) : (
                  <p className="text-[#1B1716]/60 text-xs">Minimum 100 characters for best results</p>
                )}
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-[#1B1716]/60 text-xs">{form.description.length}/4000</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Target Market */}
              <div>
                <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">
                  Target Market <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={form.targetMarket}
                  onChange={(e) => setForm({ ...form, targetMarket: e.target.value })}
                  className={cn("input-field", errors.targetMarket ? "border-red-500/50" : "")}
                  placeholder="e.g., Freelancers, SMBs, Enterprise"
                />
                {errors.targetMarket && <p className="text-red-600 text-xs mt-1">{errors.targetMarket}</p>}
              </div>

              {/* Location (Cascading Geography) */}
              <div className="col-span-1 sm:col-span-2 mt-2">
                <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-3 border-t border-[#1B1716]/10 pt-4">
                  Geography <span className="text-red-600">*</span>
                </label>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <button onClick={() => setForm({...form, targetScope: "GLOBAL"})} className={cn("px-4 py-2 rounded-lg text-sm transition-all", form.targetScope === "GLOBAL" ? "bg-cherry text-white" : "bg-[#1B1716]/5 text-[#1B1716]/60")}>Global</button>
                  <button onClick={() => setForm({...form, targetScope: "COUNTRY"})} className={cn("px-4 py-2 rounded-lg text-sm transition-all", form.targetScope === "COUNTRY" ? "bg-cherry text-white" : "bg-[#1B1716]/5 text-[#1B1716]/60")}>Country</button>
                  <button onClick={() => setForm({...form, targetScope: "STATE"})} className={cn("px-4 py-2 rounded-lg text-sm transition-all", form.targetScope === "STATE" ? "bg-cherry text-white" : "bg-[#1B1716]/5 text-[#1B1716]/60")}>State</button>
                  <button onClick={() => setForm({...form, targetScope: "CITY"})} className={cn("px-4 py-2 rounded-lg text-sm transition-all", form.targetScope === "CITY" ? "bg-cherry text-white" : "bg-[#1B1716]/5 text-[#1B1716]/60")}>City</button>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {form.targetScope !== "GLOBAL" && (
                    <div>
                      <select
                        value={selectedCountryCode}
                        onChange={(e) => {
                          const code = e.target.value;
                          const name = countriesList.find(c => c.isoCode === code)?.name || "";
                          setSelectedCountryCode(code);
                          setForm({ ...form, targetCountry: name, targetState: "", targetCity: "" });
                          setSelectedStateCode("");
                        }}
                        className={cn("input-field", errors.targetCountry ? "border-red-500/50" : "")}
                      >
                        <option value="">Select Country</option>
                        {countriesList.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                      </select>
                      {errors.targetCountry && <p className="text-red-600 text-xs mt-1">{errors.targetCountry}</p>}
                    </div>
                  )}
                  
                  {(form.targetScope === "STATE" || form.targetScope === "CITY") && (
                    <div>
                      <select
                        value={selectedStateCode}
                        onChange={(e) => {
                          const code = e.target.value;
                          const name = statesList.find(s => s.isoCode === code)?.name || "";
                          setSelectedStateCode(code);
                          setForm({ ...form, targetState: name, targetCity: "" });
                        }}
                        className={cn("input-field", errors.targetState ? "border-red-500/50" : "")}
                        disabled={!form.targetCountry}
                      >
                        <option value="">Select State</option>
                        {statesList.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                      </select>
                      {errors.targetState && <p className="text-red-600 text-xs mt-1">{errors.targetState}</p>}
                    </div>
                  )}
                  
                  {form.targetScope === "CITY" && (
                    <div>
                      <select
                        value={form.targetCity}
                        onChange={(e) => setForm({ ...form, targetCity: e.target.value })}
                        className={cn("input-field", errors.targetCity ? "border-red-500/50" : "")}
                        disabled={!form.targetState}
                      >
                        <option value="">Select City</option>
                        {citiesList.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                      {errors.targetCity && <p className="text-red-600 text-xs mt-1">{errors.targetCity}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Pricing Model */}
        {step === 3 && (
          <div className="animate-fade-in-scale">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-400/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1B1716]">Pricing Model</h2>
                <p className="text-[#1B1716]/50 text-sm">How do you plan to monetize?</p>
              </div>
            </div>

            {errors.pricingModel && (
              <p className="text-red-600 text-sm mb-4">{errors.pricingModel}</p>
            )}

            <div className="grid sm:grid-cols-2 gap-2 mb-6">
              {PRICING_MODELS.map((model) => (
                <button
                  key={model}
                  onClick={() => setForm({ ...form, pricingModel: model })}
                  className={cn(
                    "px-4 py-3.5 rounded-xl text-sm font-medium text-left transition-all duration-200",
                    form.pricingModel === model
                      ? "bg-cherry/20 border-2 border-cherry/60 text-[#1B1716]"
                      : "bg-[#1B1716]/5 border border-[#1B1716]/10 text-[#1B1716]/60 hover:bg-[#1B1716]/10 hover:border-[#1B1716]/20 hover:text-[#1B1716]"
                  )}
                >
                  {form.pricingModel === model && (
                    <CheckCircle className="w-3.5 h-3.5 text-cherry inline mr-1.5 mb-0.5" />
                  )}
                  {model}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">
                  Target Price
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[#1B1716]/40 pointer-events-none">$</span>
                  <input
                    type="text"
                    value={form.priceTarget}
                    onChange={(e) => setForm({ ...form, priceTarget: e.target.value })}
                    className="input-field"
                    style={{ paddingLeft: '1.75rem' }}
                    placeholder="e.g., 29 (or leave blank)"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">
                  Billing Frequency
                </label>
                <select
                  value={form.billingFrequency}
                  onChange={(e) => setForm({ ...form, billingFrequency: e.target.value })}
                  className="input-field"
                >
                  <option value="">Let data decide</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="One-Time">One-Time</option>
                </select>
              </div>
            </div>

            {/* Summary */}
            <div className="glass-cherry p-5 rounded-xl mb-2">
              <h3 className="text-cherry font-semibold text-sm mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Ready to Analyze
              </h3>
              <div className="space-y-1.5 text-xs text-[#1B1716]/60">
                <div className="flex justify-between">
                  <span>Industry:</span>
                  <span className="text-[#1B1716] font-medium">{form.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pricing Model:</span>
                  <span className="text-[#1B1716] font-medium">{form.pricingModel || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Price:</span>
                  <span className="text-[#1B1716] font-medium">
                    {form.priceTarget ? `$${form.priceTarget}` : "AI decides"} {form.billingFrequency && form.priceTarget ? `(${form.billingFrequency})` : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-[#1B1716] font-medium">
                    {form.targetScope === "GLOBAL" ? "Global" : 
                     `${form.targetCity && form.targetCity !== "All Cities" ? form.targetCity + ", " : ""}${form.targetState && form.targetState !== "All States" ? form.targetState + ", " : ""}${form.targetCountry}`}
                  </span>
                </div>
              </div>
              <p className="text-[#1B1716]/70 text-xs mt-3 border-t border-[#1B1716]/10 pt-3">
                Gemini will analyze your idea and generate a comprehensive report in under 60 seconds.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 gap-4">
        <button
          onClick={handleBack}
          disabled={step === 1 || loading}
          className="btn-secondary text-sm px-6 py-2.5 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <div className="flex items-center gap-1">
          {steps.map((s) => (
            <div
              key={s.number}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                step === s.number ? "bg-cherry w-6" : step > s.number ? "bg-emerald-500" : "bg-[#1B1716]/20"
              )}
            />
          ))}
        </div>

        {step < steps.length ? (
          <button onClick={handleNext} className="btn-primary text-sm px-6 py-2.5">
            Continue
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary text-sm px-8 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Validate Now
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
