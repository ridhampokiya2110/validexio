import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Palette, Monitor, Smartphone, Layout } from "lucide-react";
import { prisma } from "@/lib/db";
import Link from "next/link";



export const metadata = { title: "Data Engine Mockups" };

async function getCachedReports(userId: string) {
    return await prisma.validationReport.findMany({
      where: { userId },
      select: {
        id: true,
        uiMockupDescriptions: true,
        uiMockupImages: true,
        landingPageCopy: true,
        idea: { select: { title: true, industry: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

export default async function MockupsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const reports = await getCachedReports(session.user.id);

  const hasMockups = reports.some((r) => r.uiMockupDescriptions || r.uiMockupImages);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1716] mb-1">Data Engine Mockup Concepts</h1>
        <p className="text-[#1B1716]/50 text-sm">UI and landing page concepts generated from your validations</p>
      </div>

      {!hasMockups ? (
        <div className="glass-card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-600/10 border border-orange-400/20 flex items-center justify-center mx-auto mb-4">
            <Palette className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-[#1B1716] mb-2">No mockup concepts yet</h3>
          <p className="text-[#1B1716]/45 text-sm mb-6">Validate an idea to get real-time data-backed UI concepts.</p>
          <Link href="/dashboard/validate" className="btn-primary text-sm">Validate an Idea</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {reports.map((report) => {
            const mockups = report.uiMockupDescriptions as Array<{
              screen: string; description: string; keyElements: string[]; userFlow: string;
            }> | null;
            
            const mockupImages = report.uiMockupImages as string[] | null;

            const copy = report.landingPageCopy as {
              headline: string; subheadline: string; valueProp: string; cta: string;
            } | null;

            if (!mockups && !copy && !mockupImages) return null;

            return (
              <div key={report.id}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-bold text-[#1B1716]">{report.idea.title}</h2>
                  <span className="badge badge-cherry">{report.idea.industry}</span>
                </div>

                {copy && (
                  <div className="glass-card p-5 mb-4 border-cherry/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Layout className="w-4 h-4 text-cherry" />
                      <h3 className="text-[#1B1716] font-semibold text-sm">Landing Page Copy</h3>
                    </div>

                    {/* Landing Page Preview */}
                    <div className="bg-[#FDFCF8] rounded-xl border border-[#1B1716]/10 shadow-sm overflow-hidden mt-4">
                      {/* Browser Chrome */}
                      <div className="bg-[#1B1716]/5 border-b border-[#1B1716]/10 px-4 py-2.5 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#1B1716]/20" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#1B1716]/20" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#1B1716]/20" />
                        </div>
                        <div className="mx-auto bg-white border border-[#1B1716]/10 rounded-md px-24 py-1 text-[10px] text-[#1B1716]/40 font-mono tracking-widest uppercase">
                          Preview Concept
                        </div>
                      </div>
                      
                      {/* Page Content */}
                      <div className="p-10 text-center max-w-2xl mx-auto">
                        <h4 className="text-3xl sm:text-4xl font-black text-[#1B1716] mb-4 tracking-tight leading-tight">
                          {copy.headline.split(' ').slice(0, -1).join(' ')}{' '}
                          <span className="text-[#75070C]">{copy.headline.split(' ').slice(-1)}</span>
                        </h4>
                        <p className="text-[#1B1716]/60 text-base mb-8 max-w-lg mx-auto leading-relaxed">{copy.subheadline}</p>
                        <button className="bg-[#1B1716] text-[#FDFCF8] font-medium text-sm px-8 py-3 rounded-full shadow-lg pointer-events-none opacity-90">
                          {copy.cta}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {mockups && mockups.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {mockups.map((mockup, i) => (
                      <div key={i} className="glass-card p-5 overflow-hidden">
                        <div className="flex items-center gap-2 mb-3">
                          {i % 2 === 0 ? (
                            <Monitor className="w-4 h-4 text-[#1B1716]/50" />
                          ) : (
                            <Smartphone className="w-4 h-4 text-[#1B1716]/50" />
                          )}
                          <h3 className="text-[#1B1716] font-semibold text-sm">{mockup.screen}</h3>
                        </div>

                        {/* Visual mockup representation OR Generated Image */}
                        {mockupImages && mockupImages[i] ? (
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-[#1B1716]/10 mb-4 bg-[#FDFCF8]">
                            <img 
                              src={mockupImages[i]} 
                              alt={`${mockup.screen} mockup`}
                              className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="bg-[#FFFFFF] rounded-xl p-5 border border-[#1B1716]/10 mb-5 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FDFCF8] to-transparent" />
                            
                            {/* Abstract wireframe header */}
                            <div className="flex items-center justify-between mb-5 opacity-60">
                              <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1B1716]/30" />
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1B1716]/30" />
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1B1716]/30" />
                              </div>
                              <div className="h-1.5 w-12 bg-[#1B1716]/10 rounded-full" />
                            </div>
                            
                            {/* Abstract wireframe grid */}
                            <div className="grid grid-cols-3 gap-3">
                              <div className="col-span-1 space-y-2">
                                <div className="h-1.5 bg-[#1B1716]/10 rounded-full w-full" />
                                <div className="h-1.5 bg-[#1B1716]/10 rounded-full w-4/5" />
                                <div className="h-1.5 bg-[#1B1716]/10 rounded-full w-3/4" />
                                <div className="h-12 bg-[#FFEDAB]/30 rounded-lg w-full mt-4 border border-[#D97706]/10" />
                              </div>
                              <div className="col-span-2 space-y-3">
                                <div className="h-12 bg-[#FDFCF8] rounded-lg w-full border border-[#1B1716]/5 relative overflow-hidden shadow-sm">
                                  <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-[#75070C]/5 to-transparent" />
                                </div>
                                <div className="flex gap-2">
                                  <div className="h-8 bg-[#1B1716]/5 rounded-md w-1/2" />
                                  <div className="h-8 bg-[#1B1716]/5 rounded-md w-1/2" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <p className="text-[#1B1716]/60 text-xs leading-relaxed mb-3">{mockup.description}</p>

                        <div className="mt-5 border-t border-[#1B1716]/5 pt-4">
                          <p className="text-[#1B1716]/40 text-[11px] font-semibold uppercase tracking-[0.15em] mb-3.5">Architecture & Elements</p>
                          <div className="flex flex-col gap-2.5">
                            {mockup.keyElements.map((el, idx) => (
                              <div key={el} className="flex items-start gap-3 group">
                                <div className="mt-[6px] w-1.5 h-1.5 rounded-full bg-[#1B1716]/20 group-hover:bg-[#75070C] transition-colors duration-300 shrink-0" />
                                <span className="text-[#1B1716]/80 text-[13px] font-medium leading-relaxed group-hover:text-[#1B1716] transition-colors duration-300">
                                  {el}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
