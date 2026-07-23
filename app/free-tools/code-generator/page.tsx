"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCookieConsent, CookieConsentModal } from "@/components/CookieConsent";

export default function FreeCodeGenerator() {
  const router = useRouter();
  const { consent } = useCookieConsent();
  const [showCookieModal, setShowCookieModal] = useState(false);

  const [idea, setIdea] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const loadingMessages = [
    "Validating Market...",
    "Generating UI Components...",
    "Writing React Code...",
    "Finalizing Export..."
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (consent !== "accepted") {
      setShowCookieModal(true);
      toast.error("Please accept cookies to generate your code.");
      return;
    }
    if (!idea || !email) return;

    setStatus("loading");

    // Simulate terminal steps
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingMessages.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    try {
      const res = await fetch("/api/generate-free-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saas_idea: idea, email })
      });

      const data = await res.json();
      if (data.codeSnippet) {
        setGeneratedCode(data.codeSnippet);
      } else {
        // Fallback for safety
        setGeneratedCode("export default function Waitlist() { return <div>Waitlist</div>; }");
      }
      
      clearInterval(interval);
      setStatus("success");
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setStatus("idle");
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 font-sans text-[#1B1716] selection:bg-[#75070C]/20 selection:text-[#75070C]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="badge badge-cherry mb-4 inline-block">Free Execution Tool</span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-[#1B1716]">
            Instant React Waitlist
          </h1>
          <p className="text-lg text-[#1B1716]/70 max-w-xl mx-auto">
            Stop drawing wireframes. Describe your SaaS idea, and we will write the actual Next.js waitlist code so you can start capturing leads today.
          </p>
        </div>

        <div className="glass-card p-6 md:p-10 border border-[#1B1716]/10 relative overflow-hidden bg-white/50 backdrop-blur-sm shadow-xl rounded-2xl">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.form 
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-[#1B1716]/60 mb-2">
                    Describe your SaaS Idea
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="An data-driven CRM for freelance graphic designers..."
                    className="w-full bg-white border border-[#1B1716]/20 rounded-lg px-4 py-3 text-[#1B1716] focus:border-[#75070C] focus:ring-1 focus:ring-[#75070C] outline-none transition-all resize-none placeholder:text-[#1B1716]/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-[#1B1716]/60 mb-2">
                    Where should we send the code?
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="founder@startup.com"
                    className="w-full bg-white border border-[#1B1716]/20 rounded-lg px-4 py-3 text-[#1B1716] focus:border-[#75070C] focus:ring-1 focus:ring-[#75070C] outline-none transition-all placeholder:text-[#1B1716]/30"
                  />
                </div>

                <button aria-label="Button action"
                  type="submit"
                  className="w-full bg-[#FFEDAB] text-[#1B1716] font-black text-lg py-4 rounded-lg flex items-center justify-center hover:bg-[#ffe175] transition-colors border border-[#1B1716]/10 shadow-sm"
                >
                  Generate Next.js Code <Code className="w-5 h-5 ml-2" />
                </button>
              </motion.form>
            )}

            {status === "loading" && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 border-4 border-[#1B1716]/10 border-t-[#75070C] rounded-full animate-spin mb-8" />
                <div className="font-mono text-sm font-bold text-[#1B1716]/80 flex flex-col items-center gap-2">
                  {loadingMessages.map((msg, idx) => (
                    <motion.div 
                      key={`item-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: idx <= loadingStep ? 1 : 0.3,
                        x: 0,
                        color: idx === loadingStep ? "#75070C" : "#1B1716"
                      }}
                      className="flex items-center gap-2"
                    >
                      {idx < loadingStep ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <span className="w-4" />}
                      {msg}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="bg-[#1B1716] border border-[#75070C] rounded-lg overflow-hidden relative">
                  <div className="bg-[#2a2422] px-4 py-2 flex items-center gap-2 border-b border-[#75070C]/30">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    <span className="text-xs font-mono text-white/50 ml-2">page.tsx</span>
                  </div>
                  
                  <div className="p-6 font-mono text-sm text-[#EDEBDE] overflow-hidden relative h-[300px]">
                    <pre className="opacity-80">
                      {generatedCode?.split('\n').slice(0, 15).join('\n')}
                    </pre>
                    
                    {/* Blur overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1B1716] via-[#1B1716]/80 to-transparent flex flex-col items-center justify-end pb-10 px-6 text-center">
                      <div className="bg-[#630102] border border-[#75070C] p-6 rounded-xl shadow-2xl max-w-sm w-full backdrop-blur-md">
                        <h3 className="text-white font-bold text-lg mb-2 flex items-center justify-center gap-2">
                          <CheckCircle2 className="text-[#FFEDAB] w-5 h-5" /> Code Sent to Inbox
                        </h3>
                        <p className="text-white/80 text-sm mb-4">
                          Want the complete scalable backend architecture and B2B leads for this idea?
                        </p>
                        <Link aria-label="Navigation link" 
                          href="https://your-store.lemonsqueezy.com/checkout/buy/placeholder"
                          className="w-full bg-[#FFEDAB] text-[#1B1716] font-black py-3 rounded flex items-center justify-center hover:bg-white transition-colors text-sm"
                        >
                          Unlock Execution (INR 1499) <Zap className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <CookieConsentModal 
        isOpen={showCookieModal} 
        onClose={() => setShowCookieModal(false)} 
      />
    </main>
  );
}
