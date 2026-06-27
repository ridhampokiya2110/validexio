import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Users, Target, Activity, Zap, TrendingUp, FolderGit2 } from "lucide-react";

export const metadata = { title: "Customer Personas" };

async function getCachedReports(userId: string) {
  return await prisma.validationReport.findMany({
    where: { userId },
    select: { id: true, customerPersonas: true, idea: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export default async function PersonasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const reports = await getCachedReports(session.user.id);

  // Filter out reports that don't have personas yet
  const reportsWithPersonas = reports.filter((r) => {
    const personas = r.customerPersonas as Array<any> | null;
    return personas && personas.length > 0;
  });

  const totalPersonas = reportsWithPersonas.reduce((acc, r) => {
    const personas = r.customerPersonas as Array<any>;
    return acc + personas.length;
  }, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-12 bg-[#FAFAFA] min-h-screen">
      {/* Header Section (Left-aligned to match other sections) */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Customer Personas</h1>
          <p className="text-gray-500 text-sm">
            {totalPersonas} high-fidelity profiles mapped across {reportsWithPersonas.length} validated ideas
          </p>
        </div>
      </div>

      {reportsWithPersonas.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 max-w-2xl mx-auto">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No personas found</h3>
          <p className="text-gray-500">
            Validate an idea to automatically generate rich customer profiles.
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {reportsWithPersonas.map((report) => {
            const personas = report.customerPersonas as Array<{
              name: string; age: string; title: string;
              painPoints: string[]; goals: string[];
              buyingBehavior: string; channels: string[]; willingnessToPay: string;
            }>;

            return (
              <div key={report.id} className="space-y-6">
                {/* Report Group Header */}
                <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <FolderGit2 className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{report.idea.title}</h2>
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                    {personas.length} Personas
                  </span>
                </div>

                {/* Personas Grid for this Report */}
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {personas.map((persona, i) => (
                    <div 
                      key={i} 
                      className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full"
                    >
                      {/* Persona Header */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100/50 flex items-center justify-center border border-indigo-100/50">
                          <span className="text-2xl font-semibold text-indigo-600">{persona.name[0]}</span>
                        </div>
                        <div>
                          <h3 className="text-gray-900 font-bold text-xl tracking-tight">{persona.name}</h3>
                          <p className="text-indigo-600 text-sm font-medium">{persona.title}</p>
                        </div>
                      </div>

                      {/* Content Sections */}
                      <div className="space-y-8 flex-1">
                        
                        {/* Pain Points */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <h4 className="text-sm font-semibold text-gray-900">Pain Points</h4>
                          </div>
                          <ul className="space-y-2.5">
                            {persona.painPoints.slice(0, 2).map((p) => (
                              <li key={p} className="text-gray-600 text-sm flex items-start gap-2.5 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
                            <div className="flex items-center gap-1.5 mb-2">
                              <TrendingUp className="w-4 h-4 text-emerald-600" />
                              <span className="text-xs font-semibold text-emerald-800">Budget (WTP)</span>
                            </div>
                            <p className="text-emerald-700 font-bold text-lg">{persona.willingnessToPay}</p>
                          </div>
                          
                          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-xs font-semibold text-gray-500">Age Range</span>
                            </div>
                            <p className="text-gray-900 font-semibold">{persona.age}</p>
                          </div>
                        </div>

                        {/* Behavior */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-blue-500" />
                            <h4 className="text-sm font-semibold text-gray-900">Buying Behavior</h4>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{persona.buyingBehavior}</p>
                        </div>
                      </div>

                      {/* Channels */}
                      <div className="pt-6 mt-8 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                          <Target className="w-4 h-4 text-purple-500" />
                          <h4 className="text-sm font-semibold text-gray-900">Primary Channels</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {persona.channels.slice(0, 3).map((c) => (
                            <span 
                              key={c} 
                              className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100/50"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
