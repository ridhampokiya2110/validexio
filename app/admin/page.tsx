"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Zap, Users, BarChart3, ShieldAlert, CheckCircle, Loader2, MessageSquare, LayoutDashboard, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface KPI {
  totalMRR: number;
  totalFounders: number;
  ideasValidated: number;
  activeTickets: number;
}

interface User {
  id: string;
  email: string;
  tier: string;
  availableCredits: number;
  createdAt: string;
  isBanned: boolean;
}

interface Ticket {
  id: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  createdAt: string;
  user: {
    email: string;
  };
}

export default function AdminConsole() {
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModalTicket, setActiveModalTicket] = useState<Ticket | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingCredits, setEditingCredits] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "support" | "settings">("overview");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loadingMaintenance, setLoadingMaintenance] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [kpiRes, userRes, ticketRes, maintenanceRes] = await Promise.all([
        fetch("/api/v1/admin/kpis", { cache: "no-store" }),
        fetch("/api/v1/admin/users?limit=100", { cache: "no-store" }),
        fetch("/api/v1/admin/tickets?status=OPEN", { cache: "no-store" }),
        fetch("/api/admin/maintenance", { cache: "no-store" }),
      ]);

      if (kpiRes.status === 404) {
        // Not authorized mask
        window.location.href = "/";
        return;
      }

      const kpiData = await kpiRes.json();
      const userData = await userRes.json();
      const ticketData = await ticketRes.json();
      const maintenanceData = await maintenanceRes.json();

      setKpis(kpiData);
      setUsers(userData.users || []);
      const initialCredits: Record<string, number> = {};
      (userData.users || []).forEach((u: User) => {
        initialCredits[u.id] = u.availableCredits;
      });
      setEditingCredits(initialCredits);
      setTickets(ticketData.tickets || []);
      setMaintenanceMode(maintenanceData.enabled || false);
    } catch (error) {
      console.error("Fetch error", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to completely delete this user and all their data? This action cannot be undone.")) return;
    try {
      setProcessingId(`delete-${userId}`);
      const res = await fetch(`/api/v1/admin/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      
      setUsers(users.filter(u => u.id !== userId));
      toast.success("User completely deleted");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleResolveTicket = async (ticketId: string) => {
    try {
      setProcessingId(`resolve-${ticketId}`);
      const res = await fetch(`/api/v1/admin/tickets/${ticketId}/resolve`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to resolve ticket");
      
      setTickets(tickets.filter(t => t.id !== ticketId));
      setActiveModalTicket(null);
      toast.success("Ticket resolved");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateTier = async (userId: string, newTier: string, newCredits?: number) => {
    try {
      setProcessingId(`tier-${userId}`);
      const payload = { tier: newTier, credits: newCredits !== undefined ? newCredits : editingCredits[userId] };
      const res = await fetch(`/api/v1/admin/users/${userId}/tier`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update tier");
      
      const data = await res.json();
      setUsers(users.map(u => u.id === userId ? { ...u, tier: data.tier, availableCredits: data.availableCredits } : u));
      toast.success("Tier & Credits updated successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      setLoadingMaintenance(true);
      const res = await fetch("/api/admin/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !maintenanceMode }),
      });
      if (!res.ok) throw new Error("Failed to toggle maintenance mode");
      
      const data = await res.json();
      setMaintenanceMode(data.enabled);
      toast.success(data.enabled ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingMaintenance(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cherry" />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans flex flex-col md:flex-row text-[#1B1716]">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#1B1716]/10 bg-white flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-[#1B1716]/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cherry/10 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-cherry" />
          </div>
          <span className="font-bold text-lg text-[#1B1716] tracking-tight">
            God Mode
          </span>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <button aria-label="Button action" type="button" 
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 font-semibold text-sm rounded-lg transition-colors ${
              activeTab === "overview" ? "bg-cherry/10 text-cherry" : "text-[#1B1716]/60 hover:text-[#1B1716] hover:bg-[#1B1716]/5"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview KPIs
          </button>
          <button aria-label="Button action" type="button" 
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 font-semibold text-sm rounded-lg transition-colors ${
              activeTab === "users" ? "bg-cherry/10 text-cherry" : "text-[#1B1716]/60 hover:text-[#1B1716] hover:bg-[#1B1716]/5"
            }`}
          >
            <Users className="w-4 h-4" />
            User Management
          </button>
          <button aria-label="Button action" type="button" 
            onClick={() => setActiveTab("support")}
            className={`w-full flex items-center gap-3 px-4 py-3 font-semibold text-sm rounded-lg transition-colors ${
              activeTab === "support" ? "bg-cherry/10 text-cherry" : "text-[#1B1716]/60 hover:text-[#1B1716] hover:bg-[#1B1716]/5"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Support Queue
          </button>
          <button aria-label="Button action" type="button" 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 font-semibold text-sm rounded-lg transition-colors ${
              activeTab === "settings" ? "bg-cherry/10 text-cherry" : "text-[#1B1716]/60 hover:text-[#1B1716] hover:bg-[#1B1716]/5"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            System Settings
          </button>
        </nav>
        <div className="p-4 border-t border-[#1B1716]/10 flex flex-col gap-2">
          <button aria-label="Button action" type="button" 
            onClick={async () => {
              await signOut({ redirect: false });
              window.location.href = '/';
            }}
            className="text-left text-xs font-semibold text-[#1B1716]/60 hover:text-red-600 transition-colors block px-2 py-1"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT PANE */}
      <main className="flex-1 overflow-x-hidden p-6 md:p-10 space-y-12 bg-transparent">
        
        {/* SECTION A: OVERVIEW KPIs */}
        {activeTab === "overview" && (
          <section className="animate-fade-in-scale">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#1B1716]">
              <BarChart3 className="w-5 h-5 text-cherry" />
              Platform Telemetry
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stat-card">
                <p className="text-sm font-semibold text-[#1B1716]/60 mb-1">Total MRR</p>
                <p className="text-3xl font-black text-[#1B1716]">${kpis?.totalMRR.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <p className="text-sm font-semibold text-[#1B1716]/60 mb-1">Total Founders</p>
                <p className="text-3xl font-black text-[#1B1716]">{kpis?.totalFounders.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <p className="text-sm font-semibold text-[#1B1716]/60 mb-1">Ideas Validated</p>
                <p className="text-3xl font-black text-[#1B1716]">{kpis?.ideasValidated.toLocaleString()}</p>
              </div>
              <div className={`stat-card ${
                (kpis?.activeTickets || 0) > 0 ? "border-red-200 bg-red-50/50" : ""
              }`}>
                <p className="text-sm font-semibold text-[#1B1716]/60 mb-1">Active Tickets</p>
                <p className={`text-3xl font-black ${
                  (kpis?.activeTickets || 0) > 0 ? "text-red-600" : "text-[#1B1716]"
                }`}>
                  {kpis?.activeTickets.toLocaleString()}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SECTION B: USER MANAGEMENT */}
        {activeTab === "users" && (
          <section className="animate-fade-in-scale">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#1B1716]">
              <Users className="w-5 h-5 text-cherry" />
              Founder Roster & Controls
            </h2>
            <div className="glass-card overflow-x-auto p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1B1716]/10 bg-[#1B1716]/5">
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[#1B1716]/60">ID</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[#1B1716]/60">Email</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[#1B1716]/60">Tier / Credits</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[#1B1716]/60">Joined</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[#1B1716]/60 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1B1716]/10 text-sm">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#1B1716]/5 transition-colors">
                      <td className="p-4 font-mono text-xs text-[#1B1716]/50 truncate max-w-[100px]">{user.id}</td>
                      <td className="p-4 font-medium text-[#1B1716]">
                        {user.email}
                      </td>
                      <td className="p-4 font-sans flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-[#1B1716]/[0.03] p-1.5 rounded-lg border border-[#1B1716]/10 hover:border-[#1B1716]/20 transition-all focus-within:ring-2 focus-within:ring-cherry/20 focus-within:border-cherry/30">
                          <div className="relative">
                            <select 
                              value={user.tier}
                              onChange={(e) => handleUpdateTier(user.id, e.target.value)}
                              disabled={processingId === `tier-${user.id}`}
                              className="appearance-none bg-white border border-[#1B1716]/10 text-[#1B1716] text-[11px] rounded-md pl-2 pr-6 py-1.5 font-bold tracking-wide shadow-sm focus:outline-none focus:ring-1 focus:ring-cherry/50 disabled:opacity-50 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                              <option value="FREE">FREE</option>
                              <option value="STARTER">STARTER</option>
                              <option value="PRO">PRO</option>
                              <option value="TEAM">TEAM</option>
                              <option value="ENTERPRISE">ENTERPRISE</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-[#1B1716]/50">
                              <svg className="h-3 w-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                          </div>

                          <div className="h-4 w-[1px] bg-[#1B1716]/10 mx-0.5"></div>

                          <div className="relative flex items-center bg-white rounded-md border border-[#1B1716]/10 shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-cherry/50 group transition-all">
                            <div className="pl-2 pr-1 flex items-center justify-center bg-[#1B1716]/[0.02] border-r border-[#1B1716]/10 h-full">
                              <Zap className="w-3 h-3 text-[#1B1716]/50 group-focus-within:text-cherry transition-colors" />
                            </div>
                            <input
                              type="number"
                              min="0"
                              value={editingCredits[user.id] ?? user.availableCredits}
                              onChange={(e) => setEditingCredits({ ...editingCredits, [user.id]: parseInt(e.target.value) || 0 })}
                              className="w-14 bg-transparent py-1.5 pr-2 text-center text-xs font-bold text-[#1B1716] focus:outline-none [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="0"
                            />
                          </div>

                          {editingCredits[user.id] !== undefined && editingCredits[user.id] !== user.availableCredits && (
                            <button aria-label="Button action" type="button"
                              onClick={() => handleUpdateTier(user.id, user.tier, editingCredits[user.id])}
                              className="ml-1 bg-gradient-to-tr from-cherry to-orange-500 hover:opacity-90 text-white p-1.5 rounded-md shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center animate-in fade-in zoom-in duration-200"
                              title="Save Changes"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-[#1B1716]/60 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right flex items-center justify-end gap-2">
                        <button aria-label="Button action" type="button" 
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={processingId === `delete-${user.id}`}
                          className="p-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete User Completely"
                        >
                          {processingId === `delete-${user.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SECTION C: SUPPORT QUEUE */}
        {activeTab === "support" && (
          <section className="animate-fade-in-scale">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#1B1716]">
              <MessageSquare className="w-5 h-5 text-cherry" />
              Active Support Tickets
            </h2>
            {tickets.length === 0 ? (
              <div className="p-8 border border-[#1B1716]/10 border-dashed rounded-2xl text-center">
                <CheckCircle className="w-8 h-8 text-[#1B1716]/20 mx-auto mb-3" />
                <p className="text-[#1B1716]/60 font-medium">No active tickets in the queue.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {tickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className="bg-white border border-[#1B1716]/10 rounded-xl p-5 cursor-pointer hover:border-cherry hover:shadow-lg hover:shadow-cherry/5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    onClick={() => setActiveModalTicket(ticket)}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 bg-[#1B1716]/5 text-[#1B1716]/80 text-[10px] font-bold uppercase tracking-wider rounded-md border border-[#1B1716]/10">
                          {ticket.category}
                        </span>
                        <span className="text-xs text-[#1B1716]/50">
                          {new Date(ticket.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#1B1716] text-lg">{ticket.subject}</h3>
                      <p className="text-sm text-[#1B1716]/60 mt-1">{ticket.user.email}</p>
                    </div>
                    <div className="text-right">
                      <button aria-label="Button action" type="button" className="px-4 py-2 bg-white border border-[#1B1716]/10 text-[#1B1716] rounded-lg text-sm font-semibold hover:bg-[#1B1716]/5 transition-colors">
                        View & Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION D: SYSTEM SETTINGS */}
        {activeTab === "settings" && (
          <section className="animate-fade-in-scale">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#1B1716]">
              <ShieldAlert className="w-5 h-5 text-cherry" />
              System Settings
            </h2>
            <div className="bg-white border border-[#1B1716]/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#1B1716]">Maintenance Mode</h3>
                  <p className="text-sm text-[#1B1716]/60 mt-1 max-w-lg">
                    When enabled, all public routes will redirect to the maintenance page. 
                    Only users accessing <code className="bg-[#1B1716]/5 px-1 py-0.5 rounded text-xs">/admin</code> will be able to bypass it.
                  </p>
                </div>
                <button aria-label="Button action" type="button"
                  onClick={handleToggleMaintenance}
                  disabled={loadingMaintenance}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                    maintenanceMode ? "bg-red-600" : "bg-gray-300"
                  } disabled:opacity-50`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      maintenanceMode ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* TICKET MODAL */}
      {activeModalTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1716]/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#1B1716]/10 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-scale">
            <div className="p-6 border-b border-[#1B1716]/10 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#1B1716] mb-1">{activeModalTicket.subject}</h2>
                <p className="text-sm font-medium text-[#1B1716]/60">User: {activeModalTicket.user.email}</p>
              </div>
              <button aria-label="Button action" type="button" 
                onClick={() => setActiveModalTicket(null)}
                className="text-[#1B1716]/40 hover:text-[#1B1716] transition-colors font-mono"
              >
                [ESC]
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-sm leading-relaxed text-[#1B1716]/80 whitespace-pre-wrap bg-[#1B1716]/5 font-mono">
              {activeModalTicket.message}
            </div>
            <div className="p-6 border-t border-[#1B1716]/10 flex justify-end gap-3 bg-white rounded-b-2xl">
              <button aria-label="Button action" type="button" 
                onClick={() => setActiveModalTicket(null)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button aria-label="Button action" type="button" 
                onClick={() => handleResolveTicket(activeModalTicket.id)}
                disabled={processingId === `resolve-${activeModalTicket.id}`}
                className="btn-primary"
              >
                {processingId === `resolve-${activeModalTicket.id}` ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
