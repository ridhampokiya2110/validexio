"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Palette,
  BarChart3,
  Users,
  TrendingUp,
  LineChart,
  Settings,
  CreditCard,
  Shield,
  Zap,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Plus,
  Rocket,
  LifeBuoy,
  ChevronLeft,
  FileDown
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { NotificationsDropdown } from "./NotificationsDropdown";

const navItems = [
  {
    group: "Main",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
      { href: "/dashboard/validate", icon: Rocket, label: "Validate Idea" },
      { href: "/dashboard/reports", icon: FileText, label: "Validation Reports" },
      { href: "/dashboard/mockups", icon: Palette, label: "AI Mockups" },
      { href: "/dashboard/crucible", icon: Shield, label: "Investor Simulator" },
      { href: "/dashboard/competitors", icon: BarChart3, label: "Competitors" },
    ],
  },
  {
    group: "Execution & Strategy",
    items: [
      { href: "/dashboard/strategy", icon: TrendingUp, label: "Go-to-Market Strategy" },
      { href: "/dashboard/economics", icon: LineChart, label: "Unit Economics" },
      { href: "/dashboard/leads", icon: Users, label: "Lead Generation" },
      { href: "/dashboard/personas", icon: Users, label: "Customer Personas" },
      { href: "/dashboard/boilerplate", icon: LayoutDashboard, label: "Code Boilerplate" },
    ],
  },
  {
    group: "Analytics & Account",
    items: [
      { href: "/dashboard/analytics", icon: LineChart, label: "Analytics" },
      { href: "/dashboard/settings", icon: Settings, label: "Settings & Branding" },
      { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
      { href: "/dashboard/security", icon: Shield, label: "Security Center" },
      { href: "/dashboard/support", icon: LifeBuoy, label: "Support & FAQ" },
    ],
  },
];

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    tier?: string;
    availableCredits?: number;
  };
  onClose?: () => void;
}

function SidebarContent({ user, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center px-4 py-5 border-b border-[#1B1716]/8 relative">
        <Link href="/" className="flex items-center justify-center" onClick={onClose}>
          <img src="/logo-primary-noir.png" alt="Validexio" className="h-10 w-auto object-contain" />
        </Link>
        {onClose && (
          <button onClick={onClose} className="absolute right-4 p-1 rounded-lg hover:bg-[#1B1716]/10 text-[#1B1716]/50 lg:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* New Validation CTA */}
      <div className="px-3 py-3">
        <Link
          href="/dashboard/validate"
          onClick={onClose}
          className="btn-primary w-full justify-center text-sm py-2.5 gap-2"
        >
          <Plus className="w-4 h-4" />
          New Validation
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 pb-6">
        {navItems.map((group) => (
          <div key={group.group}>
            <p className="text-xs font-semibold text-[#1B1716]/25 uppercase tracking-widest px-3 mb-2">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    prefetch={true}
                    className={cn(
                      "sidebar-item",
                      isActive && "active"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4 sidebar-icon flex-shrink-0", isActive ? "text-butter" : "text-[#1B1716]/40")} />
                    <span className={isActive ? "text-[#1B1716]" : ""}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-[#E5E7EB] p-3">
        {/* Tier Badge */}
        <div className="flex items-center justify-between px-3 py-2 mb-2">
          <span className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider">
            {user?.tier === "PRO" ? "Pro Plan" : user?.tier === "TEAM" ? "Team Plan" : "Free Plan"}
          </span>
          {(user?.tier === "FREE" || !user?.tier) && (
            <Link
              href="/dashboard/billing"
              className="text-xs text-[#630102] hover:text-[#75070C] font-bold transition-colors"
              onClick={onClose}
            >
              Upgrade
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#FDFDFD] border border-transparent hover:border-[#E5E7EB] transition-all cursor-pointer group">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-xs font-bold text-[#111827]">
              {user?.name ? getInitials(user.name) : "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#111827] text-sm font-bold truncate">
              {user?.name || "User"}
            </p>
            <p className="text-[#6B7280] text-xs truncate font-medium">{user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-[#6B7280] hover:text-red-600"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: SidebarProps["user"];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Bypass the standard sidebar layout if we are viewing a specific report
  // The route matches /dashboard/reports/[id] where [id] is present
  const isReportDetail = pathname.match(/^\/dashboard\/reports\/[^/]+$/);

  if (isReportDetail) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-[100dvh] bg-white overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col flex-shrink-0 glass-dark border-r border-[#1B1716]/8">
        <SidebarContent user={user} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-white/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 flex-shrink-0 glass-dark border-r border-[#1B1716]/8 flex flex-col">
            <SidebarContent user={user} onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#1B1716]/8 glass-dark flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#1B1716]/10 text-[#1B1716]/60"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <Breadcrumb />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Credits Badge */}
            <Link
              href="/dashboard/billing"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cherry/10 border border-cherry/20 hover:bg-cherry/20 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-cherry" />
              <span className="text-xs font-bold text-cherry">
                {user?.availableCredits || 0} Credits
              </span>
            </Link>

            {/* Notifications */}
            <NotificationsDropdown />

            {/* User Menu */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#1B1716]/10 cursor-pointer transition-colors">
              <div className="w-7 h-7 rounded-full bg-cherry border border-cherry/30 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {user?.name ? getInitials(user.name) : "U"}
                </span>
              </div>
              <span className="hidden sm:block text-[#1B1716] font-bold text-sm">
                {user?.name?.split(" ")[0] || "Account"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const labels: Record<string, string> = {
    dashboard: "Overview",
    validate: "Validate Idea",
    reports: "Validation Reports",
    mockups: "AI Mockups",
    competitors: "Competitors",
    leads: "Lead Generation",
    personas: "Customer Personas",
    analytics: "Analytics",
    strategy: "Go-to-Market Strategy",
    economics: "Unit Economics",
    boilerplate: "Code Boilerplate",
    "premium-execution": "Premium Blueprint",
    settings: "Settings",
    billing: "Billing",
    security: "Security Center",
    support: "Support & FAQ",
  };

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {segments.map((seg, i) => (
        <span key={seg} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-[#1B1716]/20">/</span>}
          <span
            className={i === segments.length - 1 ? "text-[#1B1716] font-medium" : "text-[#1B1716]/40"}
          >
            {labels[seg] || seg}
          </span>
        </span>
      ))}
    </nav>
  );
}
