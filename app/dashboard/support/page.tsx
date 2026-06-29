"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, ChevronDown, Loader2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const ticketSchema = z.object({
  category: z.enum(["BILLING", "GENERATION", "ACCESS", "OTHER"]),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(150, "Subject is too long"),
  message: z.string().min(20, "Please provide at least 20 characters of detail").max(2000, "Message is too long"),
});

const faqs = [
  {
    question: "How do I manage my billing and download invoices?",
    answer: "You can manage your active subscription, payment methods, and download past invoices directly from the Settings > Billing & Credits page. We use Lemon Squeezy for secure processing.",
  },
  {
    question: "Where are my Mockups?",
    answer: "Your generated UI mockups are permanently stored in the Gallery section. If you encounter a generation failure, please verify you have sufficient credits remaining.",
  },
  {
    question: "Refund Policy (Strictly Enforced)",
    answer: "Due to the high compute costs associated with Data Engine generation, all purchases are final. We do not offer refunds once credits have been consumed to generate a validation report.",
  },
  {
    question: "Credit Consumption",
    answer: "A standard Validation Report consumes 1 credit. Deep Analysis reports consume 3 credits. Your available balance is displayed on your Hub and Settings pages.",
  },
];

export default function SupportPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    category: "BILLING",
    subject: "",
    message: "",
  });
  
  const [loading, setLoading] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      ticketSchema.parse(formData);
    } catch (error: any) {
      toast.error(error.errors[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit ticket");

      toast.success("Ticket submitted successfully. Our engineering team will review it shortly.");
      setFormData({ category: "BILLING", subject: "", message: "" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[#1B1716] font-sans">
      
      {/* HEADER */}
      <header className="glass-nav sticky top-0 z-40 h-16 flex items-center px-6">
        <div className="flex-1 flex items-center gap-4">
          <Link href="/dashboard" className="w-8 h-8 rounded-lg hover:bg-[#1B1716]/5 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#1B1716]" />
          </Link>
          <span className="font-bold text-lg text-[#1B1716] tracking-tight">Support</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-16 text-center animate-fade-in-scale">
          <div className="w-16 h-16 bg-cherry/10 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <Zap className="w-8 h-8 text-cherry" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Founder Support & Resolution
          </h1>
          <p className="text-[#1B1716]/60 max-w-2xl mx-auto font-medium">
            Enterprise-grade support for billing, account access, and Data Engine generation issues. 
            Check our FAQ before opening a ticket.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* LEFT COLUMN: FAQ ACCORDION */}
          <section className="animate-fade-in delay-100">
            <h2 className="text-xl font-bold text-[#1B1716] mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isActive = activeFaq === index;
                return (
                  <div 
                    key={index}
                    className={`border transition-all duration-300 overflow-hidden rounded-xl ${
                      isActive 
                        ? "bg-white border-cherry shadow-lg shadow-cherry/5" 
                        : "bg-white border-[#1B1716]/10 hover:border-[#1B1716]/20"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cherry rounded-xl"
                    >
                      <span className={`font-semibold text-sm transition-colors ${
                        isActive ? "text-cherry" : "text-[#1B1716]"
                      }`}>
                        {faq.question}
                      </span>
                      <ChevronDown 
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isActive ? "text-cherry rotate-180" : "text-[#1B1716]/70"
                        }`} 
                      />
                    </button>
                    
                    <div 
                      className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                        isActive ? "max-h-48 pb-5 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-[#1B1716]/70 leading-relaxed text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* RIGHT COLUMN: TICKETING FORM */}
          <section className="animate-fade-in delay-200">
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-[#1B1716] mb-8">
                Open a Support Ticket
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1B1716]/80 mb-2">
                    Issue Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field appearance-none cursor-pointer"
                    required
                  >
                    <option value="BILLING">Billing Issue</option>
                    <option value="GENERATION">Generation Failed</option>
                    <option value="ACCESS">Account Access</option>
                    <option value="OTHER">Other Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1B1716]/80 mb-2">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief summary of the issue"
                    className="input-field"
                    required
                    minLength={5}
                    maxLength={150}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1B1716]/80 mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please provide steps to reproduce, error codes, or invoice numbers..."
                    className="input-field min-h-[150px] resize-y"
                    required
                    minLength={20}
                    maxLength={2000}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Submit Ticket to Engineering"
                  )}
                </button>
              </form>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
