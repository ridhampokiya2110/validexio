"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy" | "refund">("terms");

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-[#1B1716] flex flex-col selection:bg-cherry/20 selection:text-cherry overflow-x-hidden">
      
      {/* Global Navigation */}
      <Navbar />

      {/* Page Header */}
      <section className="pt-20 pb-16 px-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cherry/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-[#1B1716]">
            Legal & <span className="gradient-text">Compliance</span>
          </h1>
          <p className="text-lg md:text-xl text-[#1B1716]/60 max-w-2xl mx-auto font-medium">
            Transparency, privacy, and our commitment to founders.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 pb-24 flex flex-col md:flex-row gap-8 lg:gap-16 relative z-10">
        
        {/* Sidebar Menu */}
        <aside className="w-full md:w-64 flex-shrink-0 md:sticky md:top-32 h-fit z-20">
          <nav className="flex md:flex-col overflow-x-auto md:overflow-visible pb-4 md:pb-0 gap-2 bg-[#F5F3EB] rounded-xl p-2.5 border border-[#1B1716]/10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button aria-label="Button action" type="button" 
              onClick={() => setActiveTab("terms")}
              className={`snap-start whitespace-nowrap text-left px-5 py-3.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === "terms" 
                  ? "bg-white text-[#75070C] border-l-[3px] border-l-[#75070C] shadow-sm" 
                  : "text-[#1B1716]/60 hover:text-[#1B1716] hover:bg-white/60 border-l-[3px] border-l-transparent"
              }`}
            >
              Terms of Service
            </button>
            <button aria-label="Button action" type="button" 
              onClick={() => setActiveTab("privacy")}
              className={`snap-start whitespace-nowrap text-left px-5 py-3.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === "privacy" 
                  ? "bg-white text-[#75070C] border-l-[3px] border-l-[#75070C] shadow-sm" 
                  : "text-[#1B1716]/60 hover:text-[#1B1716] hover:bg-white/60 border-l-[3px] border-l-transparent"
              }`}
            >
              Privacy Policy
            </button>
            <button aria-label="Button action" type="button" 
              onClick={() => setActiveTab("refund")}
              className={`snap-start whitespace-nowrap text-left px-5 py-3.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === "refund" 
                  ? "bg-white text-[#75070C] border-l-[3px] border-l-[#75070C] shadow-sm" 
                  : "text-[#1B1716]/60 hover:text-[#1B1716] hover:bg-white/60 border-l-[3px] border-l-transparent"
              }`}
            >
              Refund Policy
            </button>
          </nav>
        </aside>

        {/* Right Column (Text Area) */}
        <article className="flex-grow max-w-3xl w-full">
          
          {activeTab === "terms" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-[#1B1716] border-b border-[#1B1716]/10 pb-5 mb-8">Terms of Service</h2>
              <p className="text-sm text-[#75070C] font-bold mb-10 uppercase tracking-widest">Last Updated: June 2026</p>
              
              <div className="space-y-8 text-[#1B1716]/80 leading-[1.7]">
                <p className="font-medium">Welcome to Validexio. By accessing or using our premium SaaS application, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                
                <section>
                  <h3 className="text-xl font-bold text-[#1B1716] mb-4">1. Acceptance of Terms</h3>
                  <p>Validexio provides data-driven validation reports and market analysis tools designed specifically for founders. Your access to and use of the platform is conditioned on your acceptance of and compliance with these Terms.</p>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold text-[#1B1716] mb-4">2. User Accounts & Security</h3>
                  <p className="mb-5">To access the Founder&apos;s Hub, you must register for an account. You agree to:</p>
                  <ul className="space-y-4 pl-0">
                    <li className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 bg-[#75070C] mt-2.5 flex-shrink-0 rounded-full"></div>
                      <span className="font-medium">Provide accurate, current, and complete information during registration.</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 bg-[#75070C] mt-2.5 flex-shrink-0 rounded-full"></div>
                      <span className="font-medium">Maintain the absolute security of your password and identification.</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 bg-[#75070C] mt-2.5 flex-shrink-0 rounded-full"></div>
                      <span className="font-medium">Accept responsibility for all activities that occur under your account.</span>
                    </li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold text-[#1B1716] mb-4">3. Usage Restrictions</h3>
                  <p>You are strictly prohibited from utilizing the platform to engage in any unlawful activities, distribute malware, or attempt to reverse-engineer our proprietary validation algorithms. Any breach of this clause will result in immediate termination of your access without notice.</p>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold text-[#1B1716] mb-4">4. Intellectual Property</h3>
                  <p>All content, features, algorithms, and functionality are owned by Validexio and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
                </section>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-[#1B1716] border-b border-[#1B1716]/10 pb-5 mb-8">Privacy Policy</h2>
              <p className="text-sm text-[#75070C] font-bold mb-10 uppercase tracking-widest">Last Updated: June 2026</p>
              
              <div className="space-y-8 text-[#1B1716]/80 leading-[1.7]">
                <p className="font-medium">At Validexio, we treat your business ideas and personal data with the highest level of confidentiality. This Privacy Policy details how we collect, use, and protect your information.</p>
                
                <section>
                  <h3 className="text-xl font-bold text-[#1B1716] mb-4">1. Information We Collect</h3>
                  <p className="mb-5">We only collect the absolute minimum information required to deliver our validation reports securely:</p>
                  <ul className="space-y-4 pl-0">
                    <li className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 bg-[#75070C] mt-2.5 flex-shrink-0 rounded-full"></div>
                      <span className="font-medium"><strong className="text-[#1B1716] font-bold">Account Details:</strong> Name, email address, and authentication credentials.</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 bg-[#75070C] mt-2.5 flex-shrink-0 rounded-full"></div>
                      <span className="font-medium"><strong className="text-[#1B1716] font-bold">Validation Data:</strong> The business ideas, target markets, and parameters you input for analysis.</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 bg-[#75070C] mt-2.5 flex-shrink-0 rounded-full"></div>
                      <span className="font-medium"><strong className="text-[#1B1716] font-bold">Usage Metrics:</strong> Anonymous analytical data to improve our proprietary algorithms.</span>
                    </li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold text-[#1B1716] mb-4">2. Data Protection</h3>
                  <p>We employ enterprise-grade security architecture, including AES-256 encryption at rest and TLS 1.3 in transit. Your startup ideas are never shared with third parties or used to train public language models.</p>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold text-[#1B1716] mb-4">3. Data Retention & Deletion</h3>
                  <p>You own your data. You may request complete erasure of your account and associated validation reports at any time from your account settings.</p>
                </section>
              </div>
            </div>
          )}

          {activeTab === "refund" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-[#1B1716] border-b border-[#1B1716]/10 pb-5 mb-8">Refund Policy</h2>
              <p className="text-sm text-[#75070C] font-bold mb-10 uppercase tracking-widest">Last Updated: June 2026</p>
              
              <div className="space-y-8 text-[#1B1716]/80 leading-[1.7]">
                <p className="font-medium">We are committed to delivering the highest quality market validation reports. However, due to the compute-intensive nature of our data architecture, we maintain a strict policy regarding credits and report purchases.</p>
                
                <section>
                  <h3 className="text-xl font-bold text-[#1B1716] mb-4">1. Digital Goods & Reports</h3>
                  
                  <div className="my-8 bg-[#75070C]/5 border-l-[3px] border-l-[#75070C] p-6 md:p-8 rounded-r-xl shadow-sm border-t border-r border-b border-[#1B1716]/5">
                    <p className="text-[#75070C] font-black text-lg mb-3 tracking-wide uppercase">
                      Pay-Per-Report Digital Goods Final Sale
                    </p>
                    <p className="text-[#1B1716]/80 m-0 leading-[1.7] font-medium">
                      All validation reports generated via Validexio are considered final digital goods. Because our platform expends significant computational resources the moment a report request is initiated, we cannot issue refunds for completed or actively generating reports under any circumstances.
                    </p>
                  </div>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold text-[#1B1716] mb-4">2. Credit Subscriptions</h3>
                  <p>Monthly and annual subscription charges for report credits are non-refundable. If you cancel your subscription, you will retain access to your accumulated credits until the end of your current billing cycle.</p>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold text-[#1B1716] mb-4">3. System Errors</h3>
                  <p>If a critical system error prevents the successful generation of a report, the credits utilized for that specific request will be automatically refunded to your account balance within 24 hours.</p>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold text-[#1B1716] mb-4">4. Contact Support</h3>
                  <p>If you believe there has been a billing error, please contact our support team immediately. All billing disputes must be submitted within 14 days of the charge date.</p>
                </section>
              </div>
            </div>
          )}

        </article>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
