import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Shield, CheckCircle, AlertTriangle, Globe, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import VerifyEmailButton from "@/components/security/VerifyEmailButton";
import EnableMfaModal from "@/components/security/EnableMfaModal";
import AnimatedSecurityScore from "@/components/security/AnimatedSecurityScore";

export const metadata = { title: "Security Center" };

export default async function SecurityPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [loginHistory, auditLogs, user] = await Promise.all([
    prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true, emailVerified: true, createdAt: true, lastLoginAt: true },
    }),
  ]);

  const securityScore = [
    user?.emailVerified ? 25 : 0,
    user?.twoFactorEnabled ? 35 : 0,
    loginHistory.filter((l) => !l.success).length === 0 ? 20 : 10,
    20, // Base score
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1716] mb-1">Security Center</h1>
        <p className="text-[#1B1716]/50 text-sm">Monitor and manage your account security</p>
      </div>

      {/* Animated Bright Theme Security Score */}
      <AnimatedSecurityScore score={securityScore} />

      {/* Security Checklist */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-5 blur-3xl group-hover:opacity-10 transition-opacity duration-500"></div>
        <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight relative z-10">Security Checklist</h2>
        <div className="grid sm:grid-cols-2 gap-4 relative z-10">
          {[
            {
              label: "Email Verified",
              done: !!user?.emailVerified,
              desc: user?.emailVerified ? "Your email address is verified" : "Please verify your email address",
              actionComponent: !user?.emailVerified ? <VerifyEmailButton /> : null,
            },
            {
              label: "Two-Factor Authentication",
              done: !!user?.twoFactorEnabled,
              desc: user?.twoFactorEnabled ? "Two-Factor Authentication is active" : "Enable for extra account protection",
              actionComponent: !user?.twoFactorEnabled ? <EnableMfaModal /> : null,
            },
            {
              label: "Recent Login Activity",
              done: loginHistory.filter((l) => !l.success).length === 0,
              desc: loginHistory.filter((l) => !l.success).length === 0
                ? "No suspicious activity detected"
                : `${loginHistory.filter((l) => !l.success).length} failed login attempts`,
            },
            {
              label: "Account Age",
              done: true,
              desc: `Member since ${user?.createdAt ? formatDate(user.createdAt) : "—"}`,
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-gray-200/40 hover:-translate-y-0.5">
              <div className="mt-0.5 p-2 bg-white rounded-full shadow-sm border border-gray-100">
                {item.done ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm font-bold">{item.label}</p>
                <p className="text-gray-500 text-xs font-medium mt-0.5">{item.desc}</p>
                <div className="mt-2">
                  {(item as any).actionComponent && (item as any).actionComponent}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Login History */}
      {loginHistory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 mb-8 relative overflow-hidden group">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-purple-400 to-pink-500 opacity-5 blur-3xl group-hover:opacity-10 transition-opacity duration-500"></div>
          <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight relative z-10">Recent Login History</h2>
          <div className="space-y-3 relative z-10">
            {loginHistory.map((login) => (
              <div key={login.id} className="flex items-center gap-4 py-3 px-4 rounded-xl bg-gray-50/50 border border-transparent hover:bg-white hover:border-gray-100 hover:shadow-sm transition-all duration-200">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 shadow-sm ${login.success ? "bg-emerald-400 shadow-emerald-400/50" : "bg-rose-400 shadow-rose-400/50"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-gray-900 text-sm font-bold">
                      {login.success ? "Successful login" : "Failed attempt"}
                    </p>
                    {login.browser && (
                      <span className="text-gray-500 text-xs font-medium px-2 py-0.5 bg-gray-100 rounded-md">{login.browser}</span>
                    )}
                    {login.os && (
                      <span className="text-gray-500 text-xs font-medium px-2 py-0.5 bg-gray-100 rounded-md">{login.os}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 font-medium">
                    {login.ipAddress && <span className="flex items-center gap-1"><Globe className="w-3 h-3"/> {login.ipAddress}</span>}
                  </div>
                </div>
                <p className="text-gray-400 text-xs font-medium flex-shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3"/> {formatDate(login.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Log */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 relative overflow-hidden group">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-5 blur-3xl group-hover:opacity-10 transition-opacity duration-500"></div>
        <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight relative z-10">Security Audit Log</h2>
        {auditLogs.length === 0 ? (
          <p className="text-gray-500 text-sm font-medium relative z-10">No audit events yet.</p>
        ) : (
          <div className="space-y-3 relative z-10">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-4 py-3 px-4 rounded-xl bg-gray-50/50 border border-transparent hover:bg-white hover:border-gray-100 hover:shadow-sm transition-all duration-200">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 shadow-sm ${
                  log.severity === "CRITICAL" ? "bg-rose-500 shadow-rose-500/50" :
                  log.severity === "WARNING" ? "bg-amber-400 shadow-amber-400/50" :
                  log.severity === "ERROR" ? "bg-orange-500 shadow-orange-500/50" :
                  "bg-blue-400 shadow-blue-400/50"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-bold font-mono tracking-tight">
                    {log.action.replace(/_/g, " ").toLowerCase()}
                  </p>
                  <p className="text-gray-500 text-xs font-medium mt-0.5">{log.resource}</p>
                </div>
                <p className="text-gray-400 text-xs font-medium flex-shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3"/> {formatDate(log.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
