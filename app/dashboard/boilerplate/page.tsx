import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Code, TerminalSquare, Lock } from "lucide-react";
import Link from "next/link";
import CodePreviewBlock from "@/components/dashboard/CodePreviewBlock";
import BoilerplateDownloadButton from "@/components/dashboard/BoilerplateDownloadButton";


export const metadata = { title: "Code Boilerplate" };

async function getCachedReports(userId: string) {
    return await prisma.validationReport.findMany({
      where: { userId },
      select: { id: true, codeBoilerplate: true, idea: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

export default async function BoilerplatePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userTier = (session.user as any).tier || "FREE";
  const isPremium = userTier === "PRO" || userTier === "TEAM" || userTier === "ENTERPRISE";

  const reports = await getCachedReports(session.user.id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1716] mb-1">Code Boilerplate</h1>
        <p className="text-[#1B1716]/50 text-sm">Download your customized starter code to begin building immediately</p>
      </div>

      {reports.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cherry/10 border border-cherry/20 flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-cherry" />
          </div>
          <h3 className="text-lg font-bold text-[#1B1716] mb-2">No code generated yet</h3>
          <p className="text-[#1B1716]/45 text-sm mb-6">Validate an idea to get a customized code boilerplate.</p>
          <Link aria-label="Navigation link" href="/dashboard/validate" className="btn-primary text-sm">Validate an Idea</Link>
        </div>
      ) : (
        reports.map((r, i) => {
          // Some old reports might not have codeBoilerplate if the schema was updated later.
          const bp = r.codeBoilerplate as any;

          return (
            <div key={`item-${i}`} className="glass-card p-6 border border-[#1B1716]/10 mb-8">
              <div className="flex items-center justify-between gap-3 mb-6 border-b border-[#1B1716]/10 pb-4">
                <div className="flex items-center gap-3">
                  <TerminalSquare className="w-6 h-6 text-cherry" />
                  <h2 className="text-xl font-bold text-[#1B1716]">{r.idea.title} Boilerplate</h2>
                </div>
                
                {isPremium ? (
                  <BoilerplateDownloadButton reportId={r.id} ideaTitle={r.idea.title} />
                ) : (
                  <Link aria-label="Navigation link"
                    href="/pricing"
                    className="flex items-center justify-center gap-2 bg-[#1B1716]/5 text-[#1B1716]/50 hover:bg-[#1B1716]/10 hover:text-[#1B1716]/70 transition-colors duration-200 text-sm font-semibold py-1.5 px-4 rounded-full border border-[#1B1716]/10"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Unlock .ZIP
                  </Link>
                )}
              </div>
              
              {!bp ? (
                <div className="text-center py-8">
                  <p className="text-[#1B1716]/50 text-sm">Code boilerplate generation is available for newer validations. Please re-validate your idea to generate the code.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tech Stack Summary */}
                    <div className="lg:col-span-1 space-y-4 border border-[#1B1716]/10 rounded-xl p-5 bg-white/50 backdrop-blur-sm">
                      <h3 className="font-bold text-[#1B1716] mb-2">Tech Stack</h3>
                      <div>
                        <p className="font-bold text-[#1B1716]/50 uppercase text-xs mb-1">Frontend</p>
                        <p className="text-[#1B1716]/80 text-sm font-medium">Next.js + Tailwind CSS</p>
                      </div>
                      <div>
                        <p className="font-bold text-[#1B1716]/50 uppercase text-xs mb-1">Components</p>
                        <p className="text-[#1B1716]/80 text-sm font-medium">Lucide React Icons</p>
                      </div>
                      <div>
                        <p className="font-bold text-[#1B1716]/50 uppercase text-xs mb-1">Architecture</p>
                        <p className="text-[#1B1716]/80 text-sm font-medium">React Functional Component</p>
                      </div>
                    </div>

                    {/* Architecture Preview */}
                    <div className="lg:col-span-2 border border-[#1B1716]/10 rounded-xl bg-[#1B1716] text-[#EDEBDE] overflow-hidden flex flex-col">
                      <div className="bg-[#1B1716]/90 px-4 py-3 border-b border-[#EDEBDE]/10 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <span className="text-xs text-[#EDEBDE]/50 font-mono ml-2">Project Structure</span>
                      </div>
                      <div className="p-5 overflow-auto text-sm font-mono text-[#EDEBDE]/80 flex-1 whitespace-pre">
                        {`app/
  api/
  dashboard/
components/
lib/
prisma/
  schema.prisma
public/
package.json`}
                      </div>
                    </div>
                  </div>

                  {/* Actual Code Boilerplate */}
                  <CodePreviewBlock code={bp} title={`${r.idea.title.replace(/\s+/g, '')}App.tsx`} />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
