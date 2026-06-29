import { Metadata } from "next";
import ReportContent from "./ReportContent";

export const metadata: Metadata = {
  title: "Validation Report | Validexio",
  description: "View your real-time data-backed startup validation report and unlock full execution assets.",
};

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-[#FDFCF8] flex flex-col relative overflow-hidden">
      
      {/* Background Effects matching landing page */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="hero-orb-1 top-0 -left-32 opacity-50" />
      <div className="hero-orb-2 bottom-0 -right-32 opacity-50" />
      
      <div className="flex-grow pt-24 pb-16 relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6">
        <ReportContent />
      </div>
    </main>
  );
}
