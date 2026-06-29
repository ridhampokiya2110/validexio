"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1B1716] font-sans selection:bg-cherry/40 selection:text-[#1B1716] flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cherry/10 rounded-full blur-[100px] pointer-events-none" />
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-[#1B1716] relative z-10">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#630102] to-[#CE202A]">Touch</span>.
            </h1>
            <p className="text-lg md:text-xl text-[#1B1716]/60 max-w-2xl mx-auto font-medium relative z-10">
              Have questions about Validexio? Need help interpreting your validation report? We're here to help you execute.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto relative z-10">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white border border-[#1B1716]/10 shadow-[0_8px_30px_rgba(27,23,22,0.04)] p-8 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-cherry/10 flex items-center justify-center mb-6 border border-cherry/20">
                  <Mail className="w-6 h-6 text-cherry" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#1B1716]">Email Us</h3>
                <p className="text-[#1B1716]/60 text-sm font-medium mb-4">For general inquiries and support.</p>
                <a href="mailto:support@validexio.com" className="text-cherry font-semibold hover:underline">support@validexio.com</a>
              </div>

              <div className="bg-white border border-[#1B1716]/10 shadow-[0_8px_30px_rgba(27,23,22,0.04)] p-8 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#1B1716]">Enterprise Sales</h3>
                <p className="text-[#1B1716]/60 text-sm font-medium mb-4">Looking for bulk reports or API access?</p>
                <a href="mailto:support@validexio.com" className="text-emerald-600 font-semibold hover:underline">support@validexio.com</a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white border border-[#1B1716]/10 shadow-[0_8px_30px_rgba(27,23,22,0.04)] p-8 sm:p-10 rounded-2xl">
              {status === "success" ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#1B1716] mb-4">Message Sent!</h3>
                  <p className="text-[#1B1716]/70 font-medium">We've received your inquiry and our support team will get back to you within 24 hours.</p>
                  <button 
                    onClick={() => setStatus("idle")}
                    className="mt-8 px-6 py-2 bg-[#1B1716] text-white rounded-lg font-medium hover:bg-[#1B1716]/80 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-[#1B1716] mb-2 uppercase tracking-wide">First Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-[#FDFCF8] border border-[#1B1716]/10 rounded-xl px-4 py-3 text-[#1B1716] placeholder:text-[#1B1716]/30 focus:outline-none focus:ring-2 focus:ring-cherry/50 focus:border-cherry"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#1B1716] mb-2 uppercase tracking-wide">Last Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-[#FDFCF8] border border-[#1B1716]/10 rounded-xl px-4 py-3 text-[#1B1716] placeholder:text-[#1B1716]/30 focus:outline-none focus:ring-2 focus:ring-cherry/50 focus:border-cherry"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#1B1716] mb-2 uppercase tracking-wide">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#FDFCF8] border border-[#1B1716]/10 rounded-xl px-4 py-3 text-[#1B1716] placeholder:text-[#1B1716]/30 focus:outline-none focus:ring-2 focus:ring-cherry/50 focus:border-cherry"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#1B1716] mb-2 uppercase tracking-wide">How can we help?</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-[#FDFCF8] border border-[#1B1716]/10 rounded-xl px-4 py-3 text-[#1B1716] placeholder:text-[#1B1716]/30 focus:outline-none focus:ring-2 focus:ring-cherry/50 focus:border-cherry resize-none"
                      placeholder="Tell us what you need assistance with..."
                    />
                  </div>

                  {status === "error" && (
                    <div className="p-4 rounded-xl bg-cherry/10 border border-cherry/20 text-cherry text-sm font-medium">
                      Something went wrong. Please try again or email us directly.
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full bg-gradient-to-r from-[#630102] to-[#CE202A] text-white py-4 rounded-xl font-bold text-[15px] tracking-wide hover:shadow-[0_8px_20px_rgba(99,1,2,0.4)] transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {status === "submitting" ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
