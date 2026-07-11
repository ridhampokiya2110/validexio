"use client";

import { useState, useEffect } from "react";
import { Loader2, Copy, CheckCircle2, Wallet, ArrowRight, TrendingUp, Users, MousePointerClick, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { safeDate } from "@/lib/utils";

export function AffiliateDashboard({ 
  initialProfile, 
  userId, 
  userEmail,
  referralsCount = 0,
  recentActivity = []
}: { 
  initialProfile: any, 
  userId: string, 
  userEmail: string,
  referralsCount?: number,
  recentActivity?: any[]
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [upiId, setUpiId] = useState(profile?.upiId || "");
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateCode = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/affiliate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payoutEmail: userEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfile(data.profile);
    } catch (e: any) {
      alert(e.message || "Failed to generate code");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!profile) return;
    const url = `${window.location.origin}/pricing?ref=${profile.couponCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const requestPayout = async () => {
    if (!upiId) return alert("Please enter your UPI ID");
    try {
      setPayoutLoading(true);
      const res = await fetch("/api/v1/affiliate/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upiId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert("Payout requested successfully!");
      setProfile({ ...profile, pendingBalance: 0, upiId: data.upiId });
    } catch (e: any) {
      alert(e.message || "Failed to request payout");
    } finally {
      setPayoutLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[450px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-orange-50/50 to-transparent pointer-events-none" />
        <div className="relative w-20 h-20 bg-gradient-to-br from-[#FF5C35] to-[#630102] rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-orange-900/10 ring-4 ring-orange-50">
          <Wallet className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-900 tracking-tight">Validexio Partner Program</h2>
        <p className="text-gray-500 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
          Generate your unique coupon code to start earning a 20% commission on every sale. We handle global payouts securely via UPI and PayPal.
        </p>
        <button 
          onClick={generateCode} 
          disabled={loading}
          className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-medium transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:-translate-y-0.5 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Activate Partner Account"}
          {!loading && <ArrowRight className="w-5 h-5 opacity-70" />}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 group-hover:to-orange-50/30 transition-colors" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-50 text-[#FF5C35] rounded-lg"><TrendingUp className="w-4 h-4" /></div>
              <p className="text-sm font-medium text-gray-500">Total Earned</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">₹{profile.totalEarned}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 transition-colors" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Wallet className="w-4 h-4" /></div>
              <p className="text-sm font-medium text-gray-500">Pending Payout</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">₹{profile.pendingBalance}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Users className="w-4 h-4" /></div>
              <p className="text-sm font-medium text-gray-500">Referrals</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">{referralsCount}</p>
            <p className="text-xs text-gray-400 mt-2">Successful subscriptions</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><MousePointerClick className="w-4 h-4" /></div>
              <p className="text-sm font-medium text-gray-500">Link Clicks</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">--</p>
            <p className="text-xs text-gray-400 mt-2">Analytics coming soon</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Left Column: Link & Coupon */}
        <div className="md:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 relative overflow-hidden h-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-gray-900">Your Partner Link</h3>
                <p className="text-sm text-gray-500 mt-1">Share this link to give 10% off and earn 20%.</p>
              </div>
              <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full ring-1 ring-green-600/10">Active</div>
            </div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 px-4 py-3.5 bg-gray-50/50 rounded-xl text-gray-600 font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap ring-1 ring-gray-900/5 shadow-inner">
                {mounted ? window.location.origin : ""}/pricing?ref=<span className="text-[#FF5C35] font-bold">{profile.couponCode}</span>
              </div>
              <button 
                onClick={copyCode} 
                className="px-5 py-3.5 bg-white text-gray-700 rounded-xl transition-all shadow-sm ring-1 ring-gray-900/5 hover:bg-gray-50 flex items-center justify-center shrink-0"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-400" />}
              </button>
            </div>

            <div className="relative p-6 bg-gradient-to-br from-white to-orange-50/30 rounded-2xl ring-1 ring-orange-900/5 overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FF5C35] opacity-5 rounded-full blur-2xl" />
              <div className="flex items-start gap-5 relative">
                <div className="p-3 bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#FF5C35]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-gray-900 font-medium mb-1 flex items-center gap-2">
                    Partner Code <span className="font-bold text-2xl tracking-tight ml-1 text-[#630102]">{profile.couponCode}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(profile.couponCode);
                      }}
                      className="ml-2 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                      title="Copy Partner Code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Your audience can manually enter this code during checkout if they don't use your link.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payouts */}
        <div className="md:col-span-4 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 flex flex-col h-full relative overflow-hidden">
            <h3 className="text-xl font-semibold tracking-tight text-gray-900 mb-6">Withdraw Funds</h3>
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-900 block mb-3">UPI ID <span className="text-gray-400 font-normal ml-1">(India Only)</span></label>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="e.g. name@okhdfcbank" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50/50 ring-1 ring-gray-900/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C35]/20 focus:border-[#FF5C35] transition-all shadow-inner"
                />
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Please ensure your UPI ID is correct. Payments are processed and sent within <span className="font-semibold text-gray-700">24 hours</span> of your request.
                </p>
                <button 
                  onClick={requestPayout}
                  disabled={payoutLoading || profile.pendingBalance < 1000}
                  className="w-full bg-[#630102] hover:bg-[#7f1d1d] disabled:opacity-50 disabled:hover:bg-[#630102] disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-medium transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {payoutLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Transfer"}
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-gray-100">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-50 ring-1 ring-gray-200 shrink-0">
                <div className={`w-2 h-2 rounded-full ${profile.pendingBalance >= 1000 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}></div>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                {profile.pendingBalance >= 1000 
                  ? "Eligible for payout" 
                  : "Minimum payout threshold is ₹1000"}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Table */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <Activity className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold tracking-tight text-gray-900">Recent Activity</h3>
        </div>
        
        {recentActivity.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity, idx) => (
              <div key={activity.id || idx} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'referral' ? 'bg-green-50 text-green-600 ring-1 ring-green-600/10' : 
                    'bg-blue-50 text-blue-600 ring-1 ring-blue-600/10'
                  }`}>
                    {activity.type === 'referral' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {activity.type === 'referral' ? 'New Referral' : 'Payout Requested'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {safeDate(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.type === 'payout' && (
                    <>
                      <p className="text-sm font-bold text-gray-900">₹{activity.amount}</p>
                      <p className={`text-xs font-medium mt-0.5 ${
                        activity.status === 'COMPLETED' ? 'text-green-600' : 'text-orange-500'
                      }`}>
                        {activity.status}
                      </p>
                    </>
                  )}
                  {activity.type === 'referral' && (
                    <p className="text-sm font-bold text-green-600">+ Commission Earned</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-gray-900/5">
              <Activity className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-900 font-medium mb-1">No recent activity</p>
            <p className="text-sm text-gray-500">Your recent referrals and payouts will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
