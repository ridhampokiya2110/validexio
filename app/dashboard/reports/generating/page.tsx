"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, BrainCircuit, CheckCircle, Activity, Sparkles } from "lucide-react";
import { toast } from "sonner";

function GeneratingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ideaId = searchParams.get("ideaId");
  const [status, setStatus] = useState("Gathering Market Intelligence...");
  const hasStartedRef = useRef(false);
  const isPolling = useRef(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (!ideaId) {
      toast.error("No idea ID provided");
      router.push("/dashboard/validate");
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const generateReport = async () => {
      try {
        setStatus("Analyzing market data...");
        
        // Progress updates for UX (only meaningful if not cached)
        timersRef.current = [
          setTimeout(() => setStatus("Calculating viability score..."), 5000),
          setTimeout(() => setStatus("Evaluating product-market fit..."), 12000),
          setTimeout(() => setStatus("Identifying target personas..."), 20000),
          setTimeout(() => setStatus("Synthesizing SWOT analysis..."), 30000),
          setTimeout(() => setStatus("Drafting final report..."), 40000),
        ];

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ideaId }),
        });

        const data = await res.json();

        if (!res.ok) {
          timersRef.current.forEach(clearTimeout);
          throw new Error(data.error || "Failed to generate report");
        }

        // Note: Caching is disabled — all reports are uniquely generated
        // The QUEUED path handles all cases

        if (data.status === "QUEUED") {
          // Start Polling
          setStatus("Request Queued. Starting background analysis...");
          isPolling.current = true;
          startPolling(ideaId);
        } else if (data.status === "COMPLETED") {
          setStatus("Report ready! Redirecting...");
          toast.success("Validation complete! Your report is ready.");
          setTimeout(() => {
            const reportId = data.reportId;
            router.push(reportId ? `/dashboard/reports/${reportId}` : `/dashboard/reports`);
          }, 1000);
        }

      } catch (error) {
        timersRef.current.forEach(clearTimeout);
        toast.error(error instanceof Error ? error.message : "Generation failed");
        router.push("/dashboard/validate");
      }
    };

    const startPolling = (pollIdeaId: string) => {
      const pollInterval = setInterval(async () => {
        if (!isPolling.current) {
          clearInterval(pollInterval);
          return;
        }

        try {
          const res = await fetch(`/api/generate/status?ideaId=${pollIdeaId}`);
          const data = await res.json();

          if (!res.ok) throw new Error(data.error || "Failed to fetch status");

          if (data.status === "COMPLETED") {
            isPolling.current = false;
            clearInterval(pollInterval);
            timersRef.current.forEach(clearTimeout); // <-- Fix: Clear timers so they don't overwrite the completion message
            setStatus("Report ready! Redirecting...");
            toast.success("Validation complete! Your report is ready.");
            setTimeout(() => {
              // Redirect directly to the new report, not the generic dashboard
              const reportId = data.reportId;
              router.push(reportId ? `/dashboard/reports/${reportId}` : `/dashboard/reports`);
            }, 1000);
          } else if (data.status === "FAILED") {
            isPolling.current = false;
            clearInterval(pollInterval);
            timersRef.current.forEach(clearTimeout);
            throw new Error("algorithmic analysis failed during background processing.");
          }
          // Otherwise keep polling
        } catch (error) {
          console.error("Polling error:", error);
          isPolling.current = false;
          clearInterval(pollInterval);
          timersRef.current.forEach(clearTimeout);
          toast.error(error instanceof Error ? error.message : "Generation failed");
          router.push("/dashboard/validate");
        }
      }, 3000); // Poll every 3 seconds
    };

    generateReport();

    return () => {
      isPolling.current = false;
      timersRef.current.forEach(clearTimeout);
    };
  }, [ideaId, router]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
      <div className="glass-card p-8 sm:p-14 w-full text-center relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.05)] border-white/60">
        {/* Animated background effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#1B1716]/5">
          <div className="h-full bg-gradient-to-r from-cherry via-butter to-cherry w-1/2 animate-shimmer" />
        </div>
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-cherry/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-butter/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          
          {/* Premium Centerpiece Animation */}
          <div className="relative w-48 h-48 mb-10 flex items-center justify-center group perspective-1000">
            {/* Ambient Base Glow */}
            <div className="absolute inset-0 bg-[#75070C]/15 rounded-full blur-3xl animate-pulse" />
            
            {/* Outer Premium Ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-[#75070C]/30 animate-[spin_12s_linear_infinite]" />
            <div className="absolute inset-0 rounded-full border border-[#1B1716]/5 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" />
            
            {/* Middle Complex Ring */}
            <div className="absolute inset-6 rounded-full border-t-2 border-b-2 border-[#75070C]/40 animate-[spin_5s_ease-in-out_infinite_reverse] shadow-[0_0_20px_rgba(117,7,12,0.2)]" />
            
            {/* Inner Core Shield */}
            <div className="absolute inset-10 rounded-full border border-[#FFEDAB]/40 animate-[spin_7s_linear_infinite]" />
            
            {/* Central Jewel */}
            <div className="w-20 h-20 bg-gradient-to-br from-[#1B1716] via-[#3A2E2C] to-[#75070C] rounded-2xl shadow-[0_0_50px_rgba(117,7,12,0.5)] flex items-center justify-center relative z-10 border border-[#75070C]/50 rotate-45 transition-transform duration-700 hover:scale-110 hover:shadow-[0_0_70px_rgba(117,7,12,0.7)]">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-[#FFEDAB]/10 rounded-2xl" />
              <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] rounded-2xl" />
              <Activity className="w-8 h-8 text-[#FFEDAB] -rotate-45 animate-pulse drop-shadow-[0_0_10px_rgba(255,237,171,0.8)] relative z-20" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#1B1716] via-[#75070C] to-[#1B1716] mb-4 tracking-tighter drop-shadow-sm flex items-center justify-center gap-3">
            Intelligence Engine Active
          </h1>
          
          <p className="text-[#1B1716]/60 text-sm sm:text-base mb-8 max-w-md mx-auto h-6 transition-all duration-300">
            {status}
          </p>

          <div className="w-full max-w-sm mx-auto space-y-4 text-left">
            {[
              { text: "Industry context", done: true },
              { text: "Competitor analysis", done: status.includes("Evaluating") || status.includes("Identifying") || status.includes("Synthesizing") || status.includes("Drafting") || status.includes("ready") },
              { text: "Financial projections", done: status.includes("Synthesizing") || status.includes("Drafting") || status.includes("ready") },
              { text: "Action plan", done: status.includes("ready") }
            ].map((step, i) => (
              <div key={`item-${i}`} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-500 ${step.done ? "bg-emerald-500/20" : "bg-[#1B1716]/5"}`}>
                  {step.done ? (
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Loader2 className="w-3 h-3 text-[#1B1716]/30 animate-spin" />
                  )}
                </div>
                <span className={`text-sm transition-colors duration-500 ${step.done ? "text-[#1B1716]" : "text-[#1B1716]/70"}`}>
                  {step.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GeneratingPage() {
  return (
    <Suspense fallback={
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-cherry" />
      </div>
    }>
      <GeneratingContent />
    </Suspense>
  );
}
