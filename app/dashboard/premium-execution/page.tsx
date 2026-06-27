import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { FileDown, ChevronRight, Clock, Plus, Lock } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Premium Blueprint (PDF)" };

async function getValidationSessions(userId: string) {
  return await prisma.validationSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { 
      id: true, 
      createdAt: true, 
      businessIdea: true, 
      industry: true,
      isUnlocked: true,
      viabilityScore: true,
      status: true
    },
  });
}

async function PremiumExecutionContent({ userId }: { userId: string }) {
  const sessions = await getValidationSessions(userId);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1716] mb-1">Premium Blueprint (PDF)</h1>
          <p className="text-[#1B1716]/50 text-sm">Access your deeply technical, single-pass analytical execution documents.</p>
        </div>
        <Link href="/dashboard/validate" className="btn-primary text-sm px-4 py-2.5 whitespace-nowrap">
          <Plus className="w-4 h-4 mr-1" />
          New Idea
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cherry/10 border border-cherry/20 flex items-center justify-center mx-auto mb-4">
            <FileDown className="w-8 h-8 text-cherry" />
          </div>
          <h3 className="text-lg font-bold text-[#1B1716] mb-2">No validations yet</h3>
          <p className="text-[#1B1716]/45 text-sm mb-6">Validate an idea first to generate your premium blueprint.</p>
          <Link href="/dashboard/validate" className="btn-primary text-sm">
            Validate Your First Idea
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="glass-card p-6 border-l-4 border-l-cherry hover:shadow-md transition-shadow relative overflow-hidden group">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                
                {/* Content Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="badge badge-cherry text-xs">{session.industry}</span>
                    <span className="text-[#1B1716]/40 text-xs flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {formatRelativeTime(session.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-[#1B1716] font-bold text-lg mb-1 truncate">{session.businessIdea.substring(0, 50)}...</h3>
                  <p className="text-[#1B1716]/60 text-sm line-clamp-2 max-w-2xl">
                    {session.businessIdea}
                  </p>
                </div>

                {/* Actions Right */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  {session.status !== "COMPLETED" ? (
                    <span className="text-xs font-bold text-[#1B1716]/40 uppercase tracking-widest bg-[#1B1716]/5 px-3 py-1.5 rounded">
                      Processing...
                    </span>
                  ) : (
                    <div className="flex flex-col items-end gap-2">
                      <Link 
                        href={`/report/${session.id}`} 
                        className="bg-[#1B1716] text-[#FFEDAB] hover:bg-[#630102] hover:text-[#FDFCF8] transition-colors font-bold text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-sm"
                      >
                        {!session.isUnlocked && <Lock className="w-3.5 h-3.5" />}
                        View Premium PDF
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                      {!session.isUnlocked && (
                        <span className="text-[10px] uppercase font-bold text-cherry tracking-widest flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import DashboardLoading from "../loading";

export default async function PremiumExecutionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <Suspense fallback={<DashboardLoading />}>
      <PremiumExecutionContent userId={session.user.id} />
    </Suspense>
  );
}
