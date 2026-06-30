"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { ReportContent } from "@/components/report/ReportContent";
import { DUMMY_REPORTS, DEFAULT_DUMMY_REPORT } from "@/lib/data/examples";

export default function ExampleDashboardRoute() {
  const params = useParams();
  const slug = params.slug as string;
  const data = DUMMY_REPORTS[slug] || { ...DEFAULT_DUMMY_REPORT, idea: { ...DEFAULT_DUMMY_REPORT.idea, title: slug.toUpperCase() } };

  if (!data) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Top Banner & Navigation */}
      <div className="bg-[#FFFFFF] border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link aria-label="Navigation link" 
            href="/examples" 
            className="inline-flex items-center gap-1.5 text-[#6B7280] hover:text-[#111827] text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Link>
          
          <div className="flex items-center gap-3">
            <Link aria-label="Navigation link" 
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[#630102] hover:bg-[#75070C] text-[#FFFFFF] px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Your Own Validation
            </Link>
          </div>
        </div>
      </div>

      {/* Render the exact same ReportContent component as the real dashboard */}
      <div className="pt-4">
        <ReportContent report={data} isReadOnly={true} />
      </div>
    </div>
  );
}
