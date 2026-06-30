import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Mail, Linkedin, Globe, CheckCircle2, Copy, ExternalLink, Target } from "lucide-react";

export const metadata = { title: "Lead Generation" };

async function getLeads(userId: string) {
  const reports = await prisma.validationReport.findMany({
    where: { userId },
    select: {
      id: true,
      idea: { select: { title: true } },
      leads: {
        orderBy: { relevanceScore: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return reports.filter((r) => r.leads.length > 0);
}

export default async function LeadsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const reportsWithLeads = await getLeads(session.user.id);
  const totalLeads = reportsWithLeads.reduce((sum, r) => sum + r.leads.length, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1716] mb-1">Lead Generation</h1>
          <p className="text-[#1B1716]/50 text-sm">
            {totalLeads} high-probability prospects targeted specifically for your validated ideas
          </p>
        </div>
      </div>

      {reportsWithLeads.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1B1716]/5 border border-[#1B1716]/10 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-[#1B1716]/40" />
          </div>
          <h3 className="text-lg font-bold text-[#1B1716] mb-2">No leads generated yet</h3>
          <p className="text-[#1B1716]/50 text-sm max-w-md mx-auto mb-6">
            When you validate a new startup idea, our engine will automatically research and generate specific, actionable contacts for your cold outreach campaigns.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {reportsWithLeads.map((report) => (
            <div key={report.id} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-[#1B1716]/5 pb-2">
                <div className="w-2 h-2 rounded-full bg-cherry"></div>
                <h2 className="text-lg font-bold text-[#1B1716]">{report.idea.title}</h2>
                <span className="badge badge-butter text-xs">{report.leads.length} Prospects</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {report.leads.map((lead) => (
                  <div key={lead.id} className="glass-card p-5 hover:border-cherry/20 transition-all group flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-[#1B1716] font-bold text-base">{lead.name || "Unknown Name"}</h3>
                        <p className="text-cherry text-xs font-semibold">{lead.title}</p>
                        <p className="text-[#1B1716]/60 text-xs">{lead.company}</p>
                      </div>
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <span className="text-emerald-700 text-xs font-bold">{lead.relevanceScore}%</span>
                      </div>
                    </div>

                    <p className="text-[#1B1716]/70 text-xs flex-1 mb-4 leading-relaxed">
                      {lead.notes}
                    </p>

                    <div className="pt-4 border-t border-[#1B1716]/5 space-y-2 mt-auto">
                      {lead.email && (
                        <div className="flex items-center justify-between group/action p-2 rounded-md hover:bg-[#1B1716]/5 transition-colors">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Mail className="w-3.5 h-3.5 text-[#1B1716]/40 flex-shrink-0" />
                            <span className="text-xs text-[#1B1716] font-medium truncate">{lead.email}</span>
                          </div>
                          <button aria-label="Button action" type="button" className="text-[#1B1716]/30 hover:text-cherry opacity-0 group-hover/action:opacity-100 transition-all">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      
                      {lead.linkedin && (
                        <div className="flex items-center justify-between group/action p-2 rounded-md hover:bg-[#1B1716]/5 transition-colors">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Linkedin className="w-3.5 h-3.5 text-[#0077b5] flex-shrink-0" />
                            <span className="text-xs text-[#1B1716] font-medium truncate">
                              {lead.linkedin.replace("https://", "").replace("www.", "")}
                            </span>
                          </div>
                          <a aria-label="Link action" href={lead.linkedin.startsWith("http") ? lead.linkedin : `https://${lead.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-[#1B1716]/30 hover:text-cherry opacity-0 group-hover/action:opacity-100 transition-all">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
