"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, CreditCard, Shield, User, AlertOctagon, Loader2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface UserProfile {
  name: string;
  email: string;
  availableCredits: number;
  tier: string;
  provider: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "billing" | "security" | "danger">("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Email Change State
  const [newEmail, setNewEmail] = useState("");
  const [emailChangeCode, setEmailChangeCode] = useState("");
  const [showEmailCodeInput, setShowEmailCodeInput] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/v1/settings/profile");
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      setProfile(data);
    } catch (error) {
      toast.error("Failed to load settings data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePortalRedirect = async () => {
    setActionLoading("portal");
    try {
      const res = await fetch("/api/v1/checkout/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate portal");
      
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message);
      setActionLoading(null);
    }
  };

  const handlePasswordReset = async () => {
    setActionLoading("reset");
    try {
      const res = await fetch("/api/v1/settings/reset-password", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to trigger reset");
      
      toast.success("Password reset instructions sent to your email.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEmailChangeSend = async () => {
    if (!newEmail || !/^\S+@\S+\.\S+$/.test(newEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (newEmail.toLowerCase() === profile?.email.toLowerCase()) {
      toast.error("New email must be different from the current one.");
      return;
    }
    setActionLoading("email-send");
    try {
      const res = await fetch("/api/v1/settings/change-email/send", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code");
      
      toast.success("Verification code sent to " + newEmail);
      setShowEmailCodeInput(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEmailChangeVerify = async () => {
    if (!emailChangeCode || emailChangeCode.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }
    setActionLoading("email-verify");
    try {
      const res = await fetch("/api/v1/settings/change-email/verify", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail, code: emailChangeCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to verify code");
      
      toast.success("Email updated successfully.");
      setProfile(prev => prev ? { ...prev, email: newEmail } : null);
      setNewEmail("");
      setEmailChangeCode("");
      setShowEmailCodeInput(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm.");
      return;
    }

    setActionLoading("delete");
    try {
      const res = await fetch("/api/v1/settings/account", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete account");
      }
      
      toast.success("Account permanently deleted.");
      await signOut({ callbackUrl: "/" });
    } catch (error: any) {
      toast.error(error.message);
      setActionLoading(null);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cherry animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile Details", icon: User },
    { id: "billing", label: "Billing & Credits", icon: CreditCard },
    { id: "security", label: "Security & Access", icon: Shield },
    { id: "danger", label: "Danger Zone", icon: AlertOctagon },
  ] as const;

  return (
    <div className="min-h-screen text-[#1B1716] font-sans">
      
      {/* HEADER */}
      <header className="glass-nav sticky top-0 z-40 h-16 flex items-center px-6">
        <div className="flex-1 flex items-center gap-4">
          <Link aria-label="Navigation link" href="/dashboard" className="w-8 h-8 rounded-lg hover:bg-[#1B1716]/5 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#1B1716]" />
          </Link>
          <span className="font-bold text-lg text-[#1B1716] tracking-tight">Settings</span>
        </div>
      </header>

      {/* SPLIT PANE LAYOUT */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        
        {/* SIDEBAR NAVIGATION */}
        <nav className="w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-[#1B1716]/10 p-4 md:p-6 overflow-x-auto md:overflow-x-visible">
          <div className="flex flex-row md:flex-col gap-2 min-w-max md:min-w-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button aria-label="Button action" type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all whitespace-nowrap rounded-lg ${
                    isActive 
                      ? "text-cherry bg-cherry/10" 
                      : "text-[#1B1716]/60 hover:text-[#1B1716] hover:bg-[#1B1716]/5"
                  } ${tab.id === 'danger' && !isActive ? "hover:text-red-600 hover:bg-red-50" : ""} ${tab.id === 'danger' && isActive ? "text-red-600 bg-red-50" : ""}`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
            {profile && ["PRO", "TEAM", "ENTERPRISE"].includes(profile.tier) && (
              <div className="md:mt-8 md:pt-4 md:border-t border-[#1B1716]/10 ml-auto md:ml-0 flex items-center">
                <Link aria-label="Navigation link" href="/dashboard/settings/affiliate" className="text-xs font-semibold text-[#1B1716]/70 hover:text-cherry transition-colors flex items-center px-4 py-3 md:py-0 whitespace-nowrap">
                  Partner Program
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* CONTENT PANE */}
        <main className="flex-1 p-6 md:p-12">
          <div className="max-w-2xl">
            
            {/* SECTION A: PROFILE */}
            {activeTab === "profile" && profile && (
              <div className="animate-fade-in-scale">
                <div className="glass-card p-8">
                  <h2 className="text-xl font-bold text-[#1B1716] mb-6">Profile Details</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1B1716]/80 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={profile.name || ""}
                        readOnly
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-[#1B1716]/80 mb-2">
                        Email Address
                      </label>
                      <div className="relative group">
                        <input
                          type="email"
                          defaultValue={profile.email}
                          disabled
                          className="input-field bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-[#1B1716] text-white text-xs py-1 px-2 -top-8 left-0 whitespace-nowrap z-10 rounded">
                          Tied to your authentication provider
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION B: BILLING */}
            {activeTab === "billing" && profile && (
              <div className="animate-fade-in-scale">
                <div className="glass-card p-8">
                  <h2 className="text-xl font-bold text-[#1B1716] mb-8">Financials & Usage</h2>
                  
                  <div className="bg-[#1B1716]/5 border border-[#1B1716]/10 p-6 rounded-xl mb-8 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#1B1716]/60 mb-1">Available Credits</p>
                      <p className="text-4xl font-black text-[#1B1716]">
                        {profile.availableCredits}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-cherry/10 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-cherry" />
                    </div>
                  </div>

                  <button aria-label="Button action" type="button"
                    onClick={handlePortalRedirect}
                    disabled={actionLoading === "portal"}
                    className="btn-primary w-full"
                  >
                    {actionLoading === "portal" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Manage Billing & Invoices"
                    )}
                  </button>
                  <p className="text-sm text-gray-500 mb-6 mt-4">
                    Need to change your card, download an invoice, or cancel? Access the Lemon Squeezy Customer Portal.
                  </p>
                </div>
              </div>
            )}

            {/* SECTION C: SECURITY */}
            {activeTab === "security" && profile && (
              <div className="animate-fade-in-scale">
                <div className="glass-card p-8 mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-cherry" />
                    <h2 className="text-xl font-bold text-[#1B1716]">Security & Access</h2>
                  </div>
                  
                  {profile.provider === "google" || profile.provider === "github" ? (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                      <p className="text-[#1B1716]/80 text-sm">
                        You are signed in using <strong>{profile.provider.charAt(0).toUpperCase() + profile.provider.slice(1)}</strong>. 
                        To change your email or password, please update your account settings directly with {profile.provider.charAt(0).toUpperCase() + profile.provider.slice(1)}.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {/* Change Email */}
                      <div>
                        <h3 className="text-sm font-bold text-[#1B1716] mb-4">Change Email Address</h3>
                        {!showEmailCodeInput ? (
                          <div className="space-y-4">
                            <input
                              type="email"
                              placeholder="New Email Address"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              className="input-field max-w-sm block"
                            />
                            <button aria-label="Button action" type="button"
                              onClick={handleEmailChangeSend}
                              disabled={actionLoading === "email-send"}
                              className="px-6 py-2.5 bg-cherry text-white rounded-lg font-semibold text-sm hover:bg-cherry/90 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                            >
                              {actionLoading === "email-send" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Verification Code"}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <p className="text-sm text-[#1B1716]/80 mb-2">
                              We sent a 6-digit code to <strong>{newEmail}</strong>.
                            </p>
                            <input
                              type="text"
                              placeholder="000000"
                              maxLength={6}
                              value={emailChangeCode}
                              onChange={(e) => setEmailChangeCode(e.target.value.replace(/[^0-9]/g, ''))}
                              className="input-field max-w-xs block font-mono text-lg tracking-widest text-center"
                            />
                            <div className="flex gap-3">
                              <button aria-label="Button action" type="button"
                                onClick={handleEmailChangeVerify}
                                disabled={actionLoading === "email-verify" || emailChangeCode.length !== 6}
                                className="px-6 py-2.5 bg-cherry text-white rounded-lg font-semibold text-sm hover:bg-cherry/90 transition-colors disabled:opacity-50 flex items-center justify-center"
                              >
                                {actionLoading === "email-verify" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Update"}
                              </button>
                              <button aria-label="Button action" type="button"
                                onClick={() => {
                                  setShowEmailCodeInput(false);
                                  setEmailChangeCode("");
                                }}
                                disabled={actionLoading === "email-verify"}
                                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="h-px bg-gray-100 w-full" />

                      {/* Change Password */}
                      <div>
                        <h3 className="text-sm font-bold text-[#1B1716] mb-4">Password</h3>
                        <p className="text-sm text-[#1B1716]/60 mb-4">
                          We will send a secure link to <strong>{profile.email}</strong> to reset your password.
                        </p>
                        <button aria-label="Button action" type="button"
                          onClick={handlePasswordReset}
                          disabled={actionLoading === "reset"}
                          className="px-6 py-2.5 bg-[#1B1716] text-white rounded-lg font-semibold text-sm hover:bg-[#1B1716]/90 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                        >
                          {actionLoading === "reset" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Change Password"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECTION D: DANGER ZONE */}
            {activeTab === "danger" && (
              <div className="animate-fade-in-scale">
                <div className="glass-card border-red-200 bg-red-50/50 p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertOctagon className="w-6 h-6 text-red-600" />
                    <h2 className="text-xl font-bold text-red-600">Delete Account</h2>
                  </div>
                  
                  <p className="text-[#1B1716]/70 text-sm mb-8 leading-relaxed">
                    This action is permanent and irreversible. Executing this process will completely destroy your identity, active sessions, and all associated validation reports, orders, and consent logs from our servers in compliance with GDPR/CCPA.
                  </p>

                  {!showDeleteConfirm ? (
                    <button aria-label="Button action" type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-6 py-2.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Permanently Delete Account
                    </button>
                  ) : (
                    <div className="p-6 bg-red-100/50 border border-red-200 rounded-xl">
                      <p className="text-sm font-bold text-red-800 mb-4">
                        Final Confirmation Required
                      </p>
                      <label className="block text-sm text-[#1B1716]/80 mb-2">
                        Type <strong>DELETE</strong> to confirm destruction of data:
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        className="input-field mb-4 uppercase bg-white border-red-200 focus:border-red-500"
                        placeholder="DELETE"
                      />
                      <div className="flex gap-3">
                        <button aria-label="Button action" type="button"
                          onClick={handleDeleteAccount}
                          disabled={actionLoading === "delete" || deleteConfirmText !== "DELETE"}
                          className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                          {actionLoading === "delete" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Execute Purge"
                          )}
                        </button>
                        <button aria-label="Button action" type="button"
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeleteConfirmText("");
                          }}
                          disabled={actionLoading === "delete"}
                          className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
                        >
                          Abort
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
