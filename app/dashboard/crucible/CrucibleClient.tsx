"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Briefcase, ChevronRight, Zap, Target, AlertCircle, CheckCircle2, Lock, Download, Shield } from "lucide-react";

interface CrucibleClientProps {
  tier: string;
  maxQuestions: number;
  reportExists: boolean;
}

type Track = "TECHNICAL_ARCHITECT" | "INVESTOR_VC";
type ViewState = "SELECTION" | "INTERROGATION" | "SCORECARD";

interface Evaluation {
  question: string;
  answer: string;
  score: number;
  critique: string;
  idealAnswer: string;
}

export default function CrucibleClient({ tier, maxQuestions, reportExists }: CrucibleClientProps) {
  const [view, setView] = useState<ViewState>("SELECTION");
  const [track, setTrack] = useState<Track | null>(null);
  
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  // State for the interrogation view: are we waiting for user input, or showing the evaluation?
  const [interrogationState, setInterrogationState] = useState<"ASKING" | "EVALUATING">("ASKING");
  
  const scorecardRef = useRef<HTMLDivElement>(null);

  if (!reportExists) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-3xl font-bold text-[#111827] mb-4 tracking-tight">Data Exhausted.</h2>
        <p className="text-[#6B7280] max-w-md mx-auto mb-8">
          The Investor Simulator requires a generated Validation Report to interrogate you. Run your idea through the engine first.
        </p>
        <a href="/dashboard" className="px-6 py-3 bg-[#111827] text-white font-bold tracking-wide uppercase text-sm border-[1.5px] border-[#111827] hover:bg-white hover:text-[#111827] transition-colors">
          Return to Dashboard
        </a>
      </div>
    );
  }

  const startTrack = async (selectedTrack: Track) => {
    setTrack(selectedTrack);
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/v1/dashboard/crucible", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "GENERATE_QUESTION",
          track: selectedTrack,
          previousQuestions: [],
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate question");
      
      setCurrentQuestion(data.question);
      setView("INTERROGATION");
      setInterrogationState("ASKING");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/v1/dashboard/crucible", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "EVALUATE_ANSWER",
          track,
          currentQuestion,
          currentAnswer,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to evaluate answer");
      
      setEvaluations(prev => [...prev, {
        question: currentQuestion,
        answer: currentAnswer,
        score: data.score,
        critique: data.critique,
        idealAnswer: data.idealAnswer
      }]);
      
      setInterrogationState("EVALUATING");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    if (evaluations.length >= maxQuestions) {
      setView("SCORECARD");
      return;
    }

    setLoading(true);
    setError("");
    setCurrentAnswer("");
    
    try {
      const res = await fetch("/api/v1/dashboard/crucible", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "GENERATE_QUESTION",
          track,
          previousQuestions: evaluations.map(e => e.question),
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate question");
      
      setCurrentQuestion(data.question);
      setInterrogationState("ASKING");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (tier !== "TEAM" && tier !== "ENTERPRISE") return;
    if (!scorecardRef.current) return;
    
    // Temporarily strip gradients that break html2canvas in Tailwind v4
    const gradientElements = Array.from(scorecardRef.current.querySelectorAll('*')).filter(el => 
      Array.from(el.classList).some(c => c.startsWith('bg-gradient') || c.includes('gradient-text'))
    );
    
    const originalClasses = new Map();
    gradientElements.forEach(el => {
      originalClasses.set(el, el.className);
      const safeClasses = Array.from(el.classList).filter(c => 
        !c.startsWith('bg-gradient') && !c.startsWith('from-') && !c.startsWith('via-') && !c.startsWith('to-') && !c.includes('gradient-text')
      );
      
      if (Array.from(el.classList).some(c => c.startsWith('bg-gradient'))) {
        safeClasses.push('bg-[#FDFCF8]');
      } else if (Array.from(el.classList).some(c => c.includes('gradient-text'))) {
        safeClasses.push('text-cherry');
      }
      
      el.className = safeClasses.join(' ');
    });

    try {
      // Dynamically import html2pdf so it doesn't block initial page load/compile!
      const html2pdf = (await import("html2pdf.js")).default;
      
      const opt = {
        margin:       0.5,
        filename:     'Investor_Simulator_Brief.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(scorecardRef.current).save();
    } catch (error: any) {
      console.error("PDF Export Error:", error);
      alert(`PDF Export Failed: ${error.message || "Check console for details"}`);
    } finally {
      // Restore gradients
      gradientElements.forEach(el => {
        if (originalClasses.has(el)) {
          el.className = originalClasses.get(el);
        }
      });
    }
  };

  const renderSelection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cherry/10 via-purple-500/10 to-cherry/10 blur-3xl -z-10" />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 drop-shadow-sm gradient-text">
          Investor Simulator
        </h1>
        <p className="text-[#1B1716]/60 max-w-2xl mx-auto text-lg font-medium">
          Subject your validated idea to a brutal stress test. Choose your interrogator.
        </p>
        <div className="mt-8 inline-flex items-center gap-3 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cherry via-purple-500 to-cherry rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-2 border border-white/20 bg-[#1B1716]/5 backdrop-blur-md px-5 py-2.5 rounded-full shadow-inner">
            <Zap className="w-4 h-4 text-cherry animate-pulse" />
            <span className="text-sm font-black text-[#1B1716] tracking-widest uppercase">
              {tier} TIER <span className="text-cherry mx-2">|</span> {maxQuestions} QUESTIONS
            </span>
          </div>
        </div>
        {error && (
          <div className="mt-6 flex items-center justify-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100 max-w-md mx-auto">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
        <button 
          onClick={() => startTrack("TECHNICAL_ARCHITECT")}
          disabled={loading}
          className="group relative text-left glass-card p-8 md:p-10 hover:border-cherry/30 border-[#1B1716]/10 transition-all duration-500 disabled:opacity-50 flex flex-col hover:shadow-2xl hover:shadow-cherry/5 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110 group-hover:rotate-12">
            <Cpu className="w-32 h-32 text-cherry" />
          </div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#1B1716]/5 flex items-center justify-center mb-6 group-hover:bg-cherry/10 transition-colors duration-500 shadow-inner">
              <Cpu className="w-7 h-7 text-[#1B1716]/70 group-hover:text-cherry transition-colors duration-500" />
            </div>
            
            <div className="text-xs font-bold text-cherry tracking-widest uppercase mb-2">Track 01</div>
            <h3 className="text-2xl font-black text-[#1B1716] tracking-tight mb-4">Technical Architect</h3>
            <p className="text-[#1B1716]/60 leading-relaxed flex-grow font-medium">
              Tests extreme scalability, latency bottlenecks, database limits, and infrastructure resilience against a Principal Cloud Architect.
            </p>
            
            <div className="mt-8 pt-6 border-t border-[#1B1716]/5 flex items-center justify-between group-hover:border-cherry/10 transition-colors">
              <span className="text-[#1B1716] font-bold text-sm flex items-center gap-2">
                Enter Track
              </span>
              <div className="w-8 h-8 rounded-full bg-[#1B1716]/5 flex items-center justify-center group-hover:bg-cherry group-hover:text-white text-[#1B1716]/40 transition-all duration-300">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </button>

        <button 
          onClick={() => startTrack("INVESTOR_VC")}
          disabled={loading}
          className="group relative text-left glass-card p-8 md:p-10 hover:border-cherry/30 border-[#1B1716]/10 transition-all duration-500 disabled:opacity-50 flex flex-col hover:shadow-2xl hover:shadow-cherry/5 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110 group-hover:-rotate-12">
            <Briefcase className="w-32 h-32 text-cherry" />
          </div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#1B1716]/5 flex items-center justify-center mb-6 group-hover:bg-cherry/10 transition-colors duration-500 shadow-inner">
              <Briefcase className="w-7 h-7 text-[#1B1716]/70 group-hover:text-cherry transition-colors duration-500" />
            </div>
            
            <div className="text-xs font-bold text-cherry tracking-widest uppercase mb-2">Track 02</div>
            <h3 className="text-2xl font-black text-[#1B1716] tracking-tight mb-4">Investor & VC</h3>
            <p className="text-[#1B1716]/60 leading-relaxed flex-grow font-medium">
              Tests unit economics, customer acquisition costs, churn mathematics, and competitive moats against an aggressive B2B VC.
            </p>
            
            <div className="mt-8 pt-6 border-t border-[#1B1716]/5 flex items-center justify-between group-hover:border-cherry/10 transition-colors">
              <span className="text-[#1B1716] font-bold text-sm flex items-center gap-2">
                Enter Track
              </span>
              <div className="w-8 h-8 rounded-full bg-[#1B1716]/5 flex items-center justify-center group-hover:bg-cherry group-hover:text-white text-[#1B1716]/40 transition-all duration-300">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </button>
      </div>
    </motion.div>
  );

  const renderInterrogation = () => {
    const currentEval = evaluations[evaluations.length - 1];

    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[80vh] flex flex-col relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cherry/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
        
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-[#1B1716]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B1716]/5 flex items-center justify-center">
              {track === "TECHNICAL_ARCHITECT" ? (
                <Cpu className="w-5 h-5 text-cherry" />
              ) : (
                <Briefcase className="w-5 h-5 text-cherry" />
              )}
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#1B1716]/40 tracking-widest uppercase mb-0.5">
                {track === "TECHNICAL_ARCHITECT" ? "ARCHITECT INTERROGATION" : "VC INTERROGATION"}
              </div>
              <div className="text-sm font-black text-[#1B1716] tracking-tight">
                Question {evaluations.length + (interrogationState === "ASKING" ? 1 : 0)} of {maxQuestions}
              </div>
            </div>
          </div>
          
          {/* Progress Bar (Visual) */}
          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: maxQuestions }).map((_, i) => {
              const isPast = i < evaluations.length;
              const isCurrent = i === evaluations.length && interrogationState === "ASKING";
              return (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isPast ? 'w-8 bg-cherry' : isCurrent ? 'w-8 bg-cherry/40 animate-pulse' : 'w-4 bg-[#1B1716]/10'
                  }`} 
                />
              );
            })}
          </div>
        </div>

        <motion.div 
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <div className="relative p-8 md:p-10 rounded-2xl bg-[#1B1716]/[0.03] border border-[#1B1716]/10 shadow-inner overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cherry to-purple-600 opacity-80"></div>
            <div className="flex items-start gap-4">
              <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-cherry text-white font-black text-sm shadow-md shadow-cherry/20">
                Q
              </div>
              <h2 className="text-lg md:text-xl font-normal text-cherry leading-loose tracking-wider">
                {currentQuestion}
              </h2>
            </div>
          </div>
        </motion.div>

        {interrogationState === "ASKING" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-grow flex flex-col"
          >
            <div className="relative flex-grow flex flex-col">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Construct your defense strategy here..."
                className="w-full flex-grow min-h-[240px] p-6 text-lg text-[#1B1716] placeholder-[#1B1716]/30 bg-white/50 backdrop-blur-sm border-2 border-[#1B1716]/10 focus:outline-none focus:border-cherry/50 focus:bg-white rounded-2xl transition-all resize-none shadow-sm"
              />
              <div className="absolute bottom-4 right-4 text-xs font-bold text-[#1B1716]/30 tracking-widest uppercase">
                {currentAnswer.length} chars
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              {error ? (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-bold">{error}</span>
                </div>
              ) : <div />}
              
              <button 
                onClick={submitAnswer}
                disabled={loading || !currentAnswer.trim()}
                className="w-full sm:w-auto px-8 py-4 bg-cherry text-white rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-[#8C0203] hover:shadow-lg hover:shadow-cherry/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Zap className="w-4 h-4 animate-pulse" />
                    Analyzing Defense...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    Execute Defense
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {interrogationState === "EVALUATING" && currentEval && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mt-4 bg-[#1B1716] rounded-2xl border border-[#1B1716] p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cherry via-purple-500 to-cherry opacity-50"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10 border-b border-white/10 pb-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    {currentEval.score >= 7 ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-cherry" />
                    )}
                    <div className="text-[10px] font-bold text-white/50 tracking-widest uppercase">Verdict Analysis</div>
                  </div>
                  <div className="text-white text-xl font-medium leading-relaxed">
                    {currentEval.critique}
                  </div>
                </div>
                
                <div className="shrink-0 flex flex-col items-end">
                  <div className="text-[10px] font-bold text-white/50 tracking-widest uppercase mb-2">Defense Score</div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-6xl font-black tracking-tighter ${currentEval.score >= 7 ? 'text-emerald-400' : 'text-cherry'}`}>
                      {currentEval.score}
                    </span>
                    <span className="text-2xl font-bold text-white/30">/10</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-cherry" />
                  <div className="text-[10px] font-bold text-cherry tracking-widest uppercase">Ideal Defense Strategy</div>
                </div>
                <div className="text-white/70 text-sm leading-relaxed">
                  {currentEval.idealAnswer}
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button 
                  onClick={nextQuestion}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-[#1B1716] rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-gray-100 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {evaluations.length >= maxQuestions ? "View Final Scorecard" : "Next Question"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderScorecard = () => {
    const totalScore = evaluations.reduce((acc, curr) => acc + curr.score, 0);
    const maxPossible = maxQuestions * 10;
    const percentage = Math.round((totalScore / maxPossible) * 100);
    
    let statusText = "Vulnerable";
    let statusColor = "text-cherry";
    if (percentage >= 80) {
      statusText = "Execution Ready";
      statusColor = "text-emerald-600";
    } else if (percentage >= 60) {
      statusText = "Proceed with Caution";
      statusColor = "text-amber-500";
    }

    const canExport = tier === "TEAM" || tier === "ENTERPRISE";

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cherry/5 to-transparent blur-3xl -z-10" />

        <div ref={scorecardRef} className="glass-card p-8 md:p-12 mb-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cherry via-purple-500 to-cherry opacity-80" data-html2canvas-ignore="true" />
          
          <div className="border-b border-[#1B1716]/10 pb-10 mb-10 text-center relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cherry/10 mb-6">
              <Shield className="w-8 h-8 text-cherry" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 gradient-text">Execution Brief</h1>
            <div className="text-xs font-bold text-[#1B1716]/50 tracking-widest uppercase">
              {track === "TECHNICAL_ARCHITECT" ? "Technical Architect Track" : "Investor & VC Track"} | Validexio
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="md:col-span-1 bg-white border border-[#1B1716]/10 rounded-2xl p-8 text-center flex flex-col justify-center shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-cherry/5 rounded-full blur-xl" />
              <div className="text-[10px] font-bold text-[#1B1716]/40 tracking-widest uppercase mb-4 relative z-10">Readiness Score</div>
              <div className="text-7xl font-black text-[#1B1716] tracking-tighter mb-2 relative z-10">{percentage}<span className="text-3xl text-[#1B1716]/30">%</span></div>
              <div className={`text-sm font-bold tracking-wide uppercase ${statusColor} relative z-10`}>{statusText}</div>
            </div>
            
            <div className="md:col-span-2 bg-[#1B1716]/[0.02] border border-[#1B1716]/10 rounded-2xl p-8 flex flex-col justify-center">
              <div className="text-[10px] font-bold text-[#1B1716]/40 tracking-widest uppercase mb-4">Simulator Summary</div>
              <p className="text-[#1B1716]/80 text-lg leading-relaxed font-medium">
                {percentage >= 80 
                  ? "Your defenses held under extreme interrogation. You have a solid grasp of the unit economics and technical scaling required for this venture. Ready for execution."
                  : "Critical vulnerabilities detected. The execution plan relies heavily on unproven assumptions. Review the specific failures below before committing capital or engineering resources."}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#1B1716] tracking-widest uppercase mb-6 border-b border-[#1B1716]/10 pb-3">
              <Target className="w-4 h-4 text-cherry" />
              Interrogation Log
            </div>
            <div className="space-y-6">
              {evaluations.map((evalItem, idx) => (
                <div key={idx} className="bg-white border border-[#1B1716]/10 rounded-2xl p-6 md:p-8 shadow-sm">
                  <div className="flex justify-between items-start gap-6 mb-6">
                    <div className="text-[#1B1716] font-bold text-xl leading-snug tracking-tight">
                      <span className="text-cherry mr-2">Q{idx + 1}.</span>{evalItem.question}
                    </div>
                    <div className="shrink-0 flex flex-col items-end">
                      <div className="text-[10px] font-bold text-[#1B1716]/40 tracking-widest uppercase mb-1">Score</div>
                      <div className="text-2xl font-black text-[#1B1716]">{evalItem.score}<span className="text-sm text-[#1B1716]/40">/10</span></div>
                    </div>
                  </div>
                  
                  <div className="relative mb-8">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1B1716]/10 rounded-full" />
                    <div className="text-[#1B1716]/60 text-base pl-6 italic leading-relaxed">
                      "{evalItem.answer}"
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50/50 border border-red-100 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-4 h-4 text-cherry" />
                        <div className="text-[10px] font-bold text-cherry tracking-widest uppercase">Critique</div>
                      </div>
                      <div className="text-[#1B1716]/80 text-sm leading-relaxed">{evalItem.critique}</div>
                    </div>
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase">Ideal Defense</div>
                      </div>
                      <div className="text-[#1B1716]/80 text-sm leading-relaxed">{evalItem.idealAnswer}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          {canExport ? (
            <button 
              onClick={downloadPDF}
              className="px-10 py-4 bg-cherry text-white rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-[#8C0203] hover:shadow-lg hover:shadow-cherry/20 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Full Execution Brief
            </button>
          ) : (
            <div className="relative group cursor-not-allowed">
              <button 
                disabled
                className="px-10 py-4 bg-[#1B1716]/5 text-[#1B1716]/40 rounded-xl font-bold tracking-widest uppercase text-sm border border-[#1B1716]/10 flex items-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Download Full Execution Brief
              </button>
              <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-[320px] text-center p-4 bg-[#1B1716] text-white rounded-xl text-xs font-medium shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                <div className="text-cherry mb-2"><Lock className="w-6 h-6 mx-auto" /></div>
                <div className="font-bold tracking-wide uppercase mb-1">Export Locked</div>
                <div className="text-white/70">PDF Export requires Team or Enterprise Tier. Upgrade to generate sharable reports.</div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1B1716] rotate-45" />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent font-sans selection:bg-cherry/20 selection:text-cherry pb-20">
      {view === "SELECTION" && renderSelection()}
      {view === "INTERROGATION" && renderInterrogation()}
      {view === "SCORECARD" && renderScorecard()}
    </div>
  );
}
