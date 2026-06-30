import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  BarChart3,
  FileText,
  Rocket,
  TrendingUp,
  Users,
  Plus,
  ChevronRight,
  Clock,
  Zap,
  LineChart,
  Code,
  Scan,
  BrainCircuit,
  Activity,
  Magnet,
} from "lucide-react";
import { formatRelativeTime, getScoreColor, getScoreLabel } from "@/lib/utils";

export const metadata = {
  title: "Dashboard Overview",
};

async function getCachedDashboardData(userId: string) {
  const [ideas, recentReports, totalLeads, totalIdeas, completedReports] = await Promise.all([
    prisma.idea.findMany({
      where: { userId },
      include: { reports: { select: { validationScore: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.validationReport.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, validationScore: true, createdAt: true, idea: { select: { title: true, industry: true } } },
    }),
    prisma.lead.count({
      where: { report: { userId } },
    }),
    prisma.idea.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.validationReport.count({ where: { userId } }),
  ]);

  const avgScore =
    recentReports.length > 0
      ? Math.round(recentReports.reduce((acc, r) => acc + r.validationScore, 0) / recentReports.length)
      : 0;

  return { ideas, recentReports, totalLeads, totalIdeas, completedReports, avgScore };
}

async function getDashboardData(userId: string) {
  return getCachedDashboardData(userId);
}

async function DashboardContent({ userId, userName }: { userId: string, userName: string }) {
  const { recentReports, totalLeads, totalIdeas, completedReports, avgScore } =
    await getDashboardData(userId);

  const stats = [
    {
      label: "Concepts Validated",
      value: totalIdeas,
      icon: Scan,
      color: "text-cherry",
      bg: "bg-cherry/10",
    },
    {
      label: "Intelligence Reports",
      value: completedReports,
      icon: BrainCircuit,
      color: "text-[#1B1716]",
      bg: "bg-[#1B1716]/10",
    },
    {
      label: "Avg Rigor Score",
      value: avgScore > 0 ? avgScore : "—",
      icon: Activity,
      color: "text-emerald-700",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Lead Profiles",
      value: totalLeads,
      icon: Magnet,
      color: "text-purple-700",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-14 relative">
      {/* Background elegant flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-gradient-to-b from-[#FFEDAB]/20 to-transparent blur-3xl pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-6 bg-[#75070C]/30"></div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#75070C] uppercase">Executive Overview</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#1B1716] via-[#3A2E2C] to-[#1B1716] tracking-tight mb-3 drop-shadow-sm">
            Welcome back, {userName}.
          </h1>
          <p className="text-[#1B1716]/60 text-base font-medium max-w-xl">
            Review your startup intelligence and validate new concepts with algorithmic precision.
          </p>
        </div>
        <Link href="/dashboard/validate" className="relative group overflow-hidden rounded-xl shadow-[0_8px_20px_rgba(117,7,12,0.2)] hover:shadow-[0_12px_25px_rgba(117,7,12,0.3)] transition-all duration-500 hover:-translate-y-0.5 self-start sm:self-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-[#75070C] to-[#910505] transition-transform duration-500 group-hover:scale-[1.02]"></div>
          <div className="relative flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-white font-bold tracking-wide">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <span className="whitespace-nowrap">Initiate Validation</span>
          </div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 relative z-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#FDFCF8]/80 backdrop-blur-md p-4 sm:p-8 rounded-2xl border border-[#1B1716]/5 hover:border-[#1B1716]/15 hover:bg-white transition-all duration-500 group shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] relative overflow-hidden">
            {/* Subtle top border highlight on hover */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1B1716]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-8">
              <p className="text-[#1B1716]/50 text-[10px] font-bold uppercase tracking-widest leading-tight pr-1">{stat.label}</p>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#1B1716]/5 shadow-sm flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 flex-shrink-0`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-3xl sm:text-5xl font-black text-[#1B1716] tracking-tighter drop-shadow-sm">
                {stat.value}
              </div>
              {stat.label === "Avg Rigor Score" && stat.value !== "—" && (
                <span className="text-sm font-bold text-[#1B1716]/30 tracking-widest uppercase">/100</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reports */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1B1716] tracking-tight">Recent Intelligence</h2>
            <Link href="/dashboard/reports" className="text-xs font-bold text-cherry/70 hover:text-cherry flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentReports.length === 0 ? (
            <div className="glass-card p-16 text-center border-[#1B1716]/10">
              <div className="w-16 h-16 rounded-2xl bg-cherry/10 border border-cherry/20 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-cherry" />
              </div>
              <h3 className="text-lg font-bold text-[#1B1716] mb-3 tracking-tight">No reports yet</h3>
              <p className="text-[#1B1716]/60 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                Validate your first startup idea to unlock deep market intelligence, competitor analysis, and targeted leads.
              </p>
              <Link href="/dashboard/validate" className="btn-primary text-sm px-6">
                <Rocket className="w-4 h-4 mr-2" />
                Validate First Idea
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {recentReports.map((report) => (
                <Link
                  key={report.id}
                  href={`/dashboard/reports/${report.id}`}
                  className="glass-card p-6 flex items-center gap-6 hover:border-cherry/30 border-[#1B1716]/10 group transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-cherry/0 group-hover:bg-cherry transition-colors duration-300"></div>
                  
                  {/* Score Circle */}
                  <div className="relative flex-shrink-0">
                    <svg className="w-16 h-16" viewBox="0 0 56 56">
                      <circle
                        cx="28" cy="28" r="22"
                        fill="none" stroke="rgba(27, 23, 22,0.06)" strokeWidth="4"
                      />
                      <circle
                        cx="28" cy="28" r="22"
                        fill="none"
                        stroke={report.validationScore >= 70 ? "#10B981" : report.validationScore >= 50 ? "#F59E0B" : "#EF4444"}
                        strokeWidth="4"
                        strokeDasharray={`${(report.validationScore / 100) * 138.2} 138.2`}
                        strokeLinecap="round"
                        transform="rotate(-90 28 28)"
                        className="transition-all duration-1000 ease-out"
                      />
                      <text x="28" y="33" textAnchor="middle" className="fill-[#1B1716] font-black font-sans" fontSize="14">
                        {report.validationScore}
                      </text>
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1B1716] font-bold text-lg truncate group-hover:text-cherry transition-colors mb-1 tracking-tight">
                      {report.idea.title}
                    </p>
                    <p className="text-[#1B1716]/60 text-xs font-medium truncate mb-3">{report.idea.industry}</p>
                    
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md bg-[#1B1716]/5 ${getScoreColor(report.validationScore)}`}>
                        {getScoreLabel(report.validationScore)}
                      </span>
                      <span className="text-[#1B1716]/40 text-xs flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {formatRelativeTime(report.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-[#1B1716]/5 flex items-center justify-center group-hover:bg-cherry/10 transition-colors flex-shrink-0">
                    <ChevronRight className="w-5 h-5 text-[#1B1716]/40 group-hover:text-cherry transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#1B1716] tracking-tight">Quick Actions</h2>
          <div className="glass-card p-6 border-[#1B1716]/10">
            <div className="space-y-3">
              {[
                {
                  icon: Rocket,
                  label: "Validate New Idea",
                  href: "/dashboard/validate",
                  desc: "algorithmic analysis in 60 seconds",
                  color: "text-cherry",
                  bg: "bg-cherry/10",
                },
                {
                  icon: Users,
                  label: "View Personas",
                  href: "/dashboard/personas",
                  desc: "Customer insights",
                  color: "text-purple-700",
                  bg: "bg-purple-500/10",
                },
                {
                  icon: TrendingUp,
                  label: "Find Leads",
                  href: "/dashboard/leads",
                  color: "text-emerald-700",
                  bg: "bg-emerald-500/10",
                },
                {
                  icon: TrendingUp,
                  label: "Go-to-Market Strategy",
                  href: "/dashboard/strategy",
                  desc: "Launch roadmap",
                  color: "text-blue-700",
                  bg: "bg-blue-500/10",
                },
                {
                  icon: LineChart,
                  label: "Unit Economics",
                  href: "/dashboard/economics",
                  desc: "Financial projections",
                  color: "text-amber-700",
                  bg: "bg-amber-500/10",
                },
                {
                  icon: Code,
                  label: "Code Boilerplate",
                  href: "/dashboard/boilerplate",
                  desc: "Start building faster",
                  color: "text-slate-700",
                  bg: "bg-slate-500/10",
                },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#1B1716]/5 border border-transparent hover:border-[#1B1716]/10 transition-all duration-300 group"
                >
                  <div className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className={`w-4.5 h-4.5 ${action.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1B1716] text-sm font-bold tracking-tight mb-0.5">{action.label}</p>
                    <p className="text-[#1B1716]/60 text-xs font-medium">{action.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#1B1716]/20 group-hover:text-[#1B1716]/60 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  if (session.user.email === "ridhampokiya10@gmail.com" || session.user.role === "ADMIN") {
    return redirect("/admin");
  }

  return (
    <Suspense fallback={
      <div className="p-8 max-w-7xl mx-auto animate-pulse flex flex-col gap-12">
        <div className="h-12 bg-[#1B1716]/5 rounded-xl w-64"></div>
        <div className="grid grid-cols-4 gap-6">
          <div className="h-32 bg-[#1B1716]/5 rounded-2xl"></div>
          <div className="h-32 bg-[#1B1716]/5 rounded-2xl"></div>
          <div className="h-32 bg-[#1B1716]/5 rounded-2xl"></div>
          <div className="h-32 bg-[#1B1716]/5 rounded-2xl"></div>
        </div>
      </div>
    }>
      <DashboardContent userId={session.user.id} userName={session.user.name?.split(" ")[0] || "User"} />
    </Suspense>
  );
}
