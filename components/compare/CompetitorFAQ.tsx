"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

export function CompetitorFAQ({ 
  competitorName, 
  targetOutput 
}: { 
  competitorName: string;
  targetOutput: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQ[] = [
    {
      question: `Is Validexio the best ${competitorName} alternative for startup founders?`,
      answer: `Yes, especially if your goal is to build a product rather than just research it. While ${competitorName} specializes in providing ${targetOutput.toLowerCase()} and market validation, Validexio is a complete execution engine. We move beyond PDF reports to directly generate production-ready React/Next.js source code, scalable database schemas, and a targeted list of 5 verified B2B leads so you can launch and sell immediately.`
    },
    {
      question: `How does the pricing of ${competitorName} compare to Validexio?`,
      answer: `Validexio operates on a transparent, one-time flat fee of INR 1499 for our complete execution payload (source code, UI layouts, database architecture, and leads). In contrast, ${competitorName} and similar platforms often rely on recurring monthly subscriptions or pay-per-report models that deliver market analysis rather than tangible software engineering assets.`
    },
    {
      question: `Where does Validexio's market and competitor intelligence come from?`,
      answer: `We dynamically aggregate real-time market signals from high-intent platforms like Reddit, Quora, ProductHunt, G2, HackerNews, Crunchbase, Trustpilot, Capterra, and specialized niche forums. This ensures that the generated codebase, user psychology profiles, and go-to-market strategies are deeply rooted in actual user frustrations and verified market gaps, rather than static industry templates.`
    },
    {
      question: `Can I use my existing ${competitorName} research with Validexio?`,
      answer: `Absolutely. You can take the market insights, audience data, or business plans you've already validated using ${competitorName} and feed those precise parameters into Validexio. Our engine will instantly translate your validated research into the actual React codebase and architectural blueprints needed to bring the product to life.`
    },
    {
      question: `Do I need technical or coding experience to use Validexio instead of ${competitorName}?`,
      answer: `No coding experience is required. Validexio is designed to bridge the gap between idea and execution for non-technical founders. We provide fully written, modular code alongside step-by-step deployment instructions. You can easily launch your MVP on Vercel yourself, or hand our precise technical blueprints over to a developer to save thousands of dollars and weeks of time.`
    },
    {
      question: `How quickly can I go to market using Validexio vs ${competitorName}?`,
      answer: `With ${competitorName}, you receive validation metrics but still face a multi-week development cycle to build your initial MVP. Validexio compresses this timeline entirely. In under 60 seconds, your entire product foundation, high-fidelity user interface layouts, and initial sales prospect list are generated, allowing you to go from concept to live execution on day one.`
    }
  ];

  return (
    <div className="w-full">
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={index}
              initial={false}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                isOpen 
                  ? "bg-white border-[#75070C]/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" 
                  : "bg-white/50 border-[#1B1716]/10 hover:border-[#1B1716]/20 hover:bg-white"
              }`}
            >
              <button
                className="flex items-center justify-between w-full p-6 text-left"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <h3 
                  className={`text-lg md:text-xl font-bold transition-colors duration-300 pr-8 ${
                    isOpen ? "text-[#75070C]" : "text-[#1B1716]"
                  }`}
                  itemProp="name"
                >
                  {faq.question}
                </h3>
                <div 
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isOpen ? "bg-[#75070C]/10 text-[#75070C]" : "bg-[#1B1716]/5 text-[#1B1716]/50"
                  }`}
                >
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </div>
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div 
                      className="px-6 pb-6 pt-0"
                      itemScope 
                      itemProp="acceptedAnswer" 
                      itemType="https://schema.org/Answer"
                    >
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1B1716]/10 to-transparent mb-6"></div>
                      <p 
                        className="text-[#1B1716]/70 leading-relaxed text-lg" 
                        itemProp="text"
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
