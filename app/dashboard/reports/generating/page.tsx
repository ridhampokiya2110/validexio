"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Brain, CheckCircle } from "lucide-react";
import { toast } from "sonner";

function GeneratingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ideaId = searchParams.get("ideaId");
  const [status, setStatus] = useState("Gathering Market Intelligence...");
  const hasStartedRef = useRef(false);
  const isPolling = useRef(false);

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
        const timers = [
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
          timers.forEach(clearTimeout);
          throw new Error(data.error || "Failed to generate report");
        }

        // Note: Caching is disabled — all reports are uniquely generated
        // The QUEUED path handles all cases

        if (data.status === "QUEUED") {
          // Start Polling
          setStatus("Request Queued. Starting background analysis...");
          isPolling.current = true;
          startPolling(ideaId);
        }

      } catch (error) {
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
            throw new Error("algorithmic analysis failed during background processing.");
          }
          // Otherwise keep polling
        } catch (error) {
          console.error("Polling error:", error);
          isPolling.current = false;
          clearInterval(pollInterval);
          toast.error(error instanceof Error ? error.message : "Generation failed");
          router.push("/dashboard/validate");
        }
      }, 3000); // Poll every 3 seconds
    };

    generateReport();

    return () => {
      isPolling.current = false;
    };
  }, [ideaId, router]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <div className="glass-card p-8 sm:p-12 w-full text-center relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#1B1716]/5">
          <div className="h-full bg-gradient-to-r from-cherry via-butter to-cherry w-1/2 animate-shimmer" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-cherry/20 rounded-full animate-ping opacity-50" />
            <div className="w-20 h-20 rounded-full bg-cherry/10 border-2 border-cherry/30 flex items-center justify-center relative z-10">
              <Brain className="w-10 h-10 text-cherry animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1716] mb-3">
            Generating Report
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
