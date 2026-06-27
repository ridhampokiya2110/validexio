"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { User, Mail, Globe, Building, MapPin, Save, LogOut, Trash2 } from "lucide-react";

interface SettingsFormProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    bio?: string | null;
    company?: string | null;
    website?: string | null;
    location?: string | null;
  };
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    company: user.company || "",
    website: user.website || "",
    location: user.location || "",
  });
  const [saving, setSaving] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Profile updated successfully");
      router.refresh();
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.")) return;
    if (!confirm("Final confirmation: Delete my account and all associated data?")) return;

    setDeletingAccount(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await signOut({ callbackUrl: "/" });
    } catch {
      toast.error("Failed to delete account");
      setDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="glass-card p-6">
        <h2 className="text-lg font-bold text-[#1B1716] mb-5">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B1716]/30" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field !pl-10"
                placeholder="Your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B1716]/30" />
              <input
                type="email"
                value={user.email || ""}
                className="input-field !pl-10 bg-[#1B1716]/5 text-[#1B1716]/70 cursor-not-allowed"
                disabled
              />
            </div>
            <p className="text-[#1B1716]/30 text-xs mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="input-field min-h-20"
              placeholder="Tell us about yourself..."
              maxLength={300}
              rows={3}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">Company</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B1716]/30" />
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="input-field !pl-10"
                  placeholder="Your company"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B1716]/30" />
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="input-field !pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B1716]/60 uppercase tracking-wider mb-2">Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B1716]/30" />
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="input-field !pl-10"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-[#1B1716]/8">
          <button type="submit" disabled={saving} className="btn-primary text-sm px-6 py-2.5 disabled:opacity-60">
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Saving...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />Save Changes</>
            )}
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="glass-card p-6 border-red-600/20">
        <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-[#1B1716]/60 text-sm mb-5">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={deletingAccount}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/10 border border-red-600/20 text-red-600 text-sm font-medium hover:bg-red-600/20 transition-all disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          {deletingAccount ? "Deleting..." : "Delete My Account"}
        </button>
      </div>
    </div>
  );
}
