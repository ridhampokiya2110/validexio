import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch different types of recent activity concurrently
    const [loginHistory, reports, audits] = await Promise.all([
      prisma.loginHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.validationReport.findMany({
        where: { userId },
        include: { idea: { select: { title: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.auditLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      })
    ]);

    // Map everything to a standardized "activity" format
    const activities: any[] = [];

    // Map Logins
    loginHistory.forEach((login) => {
      activities.push({
        id: `login-${login.id}`,
        type: login.success ? "login_success" : "login_failed",
        title: login.success ? "Successful Login" : "Failed Login Attempt",
        description: `Login from ${login.browser || 'Unknown Browser'} ${login.location ? `in ${login.location}` : ''}`,
        timestamp: login.createdAt,
        link: "/dashboard/security",
      });
    });

    // Map Reports
    reports.forEach((report) => {
      activities.push({
        id: `report-${report.id}`,
        type: "report_generated",
        title: "Validation Report Generated",
        description: `Report for idea: ${report.idea?.title || 'Unknown Idea'}`,
        timestamp: report.createdAt,
        link: `/dashboard/reports/${report.id}`,
      });
    });

    // Map Audits
    audits.forEach((audit) => {
      activities.push({
        id: `audit-${audit.id}`,
        type: "audit_log",
        title: audit.action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
        description: `Action on ${audit.resource}`,
        timestamp: audit.createdAt,
        link: "/dashboard/security",
      });
    });

    // Sort by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Return the top 20 recent activities
    return NextResponse.json({ activities: activities.slice(0, 20) });
  } catch (error) {
    console.error("Failed to fetch activity:", error);
    return NextResponse.json({ error: "Failed to load activity" }, { status: 500 });
  }
}
