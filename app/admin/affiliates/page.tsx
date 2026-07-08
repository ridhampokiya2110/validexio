import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/guards/admin.guard";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Admin - Affiliates Overview",
};

export default async function AdminAffiliatesPage() {
  const isSuperAdmin = await requireSuperAdmin();
  if (!isSuperAdmin) notFound();

  const affiliates = await prisma.affiliateProfile.findMany({
    include: {
      user: {
        select: { email: true, name: true, tier: true }
      }
    },
    orderBy: { totalEarned: 'desc' }
  });

  const payoutRequests = await prisma.payoutRequest.findMany({
    include: {
      user: {
        select: { email: true, name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Affiliates & Payouts</h1>
        <p className="text-gray-500 mt-2">Manage creator earnings and pending payouts.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Payout Requests</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">UPI ID</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Requested At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payoutRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No payout requests yet.
                  </td>
                </tr>
              ) : payoutRequests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {req.user.name || "N/A"} <br />
                    <span className="text-xs text-gray-500 font-normal">{req.user.email}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">₹{req.amount}</td>
                  <td className="px-6 py-4 font-mono text-xs">{req.upiId}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      req.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {req.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">All Creators</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-medium">Creator</th>
                <th className="px-6 py-4 font-medium">Tier</th>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium text-right">Pending</th>
                <th className="px-6 py-4 font-medium text-right">Total Earned</th>
                <th className="px-6 py-4 font-medium text-right">UPI ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {affiliates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No affiliates joined yet.
                  </td>
                </tr>
              ) : affiliates.map(aff => (
                <tr key={aff.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {aff.user.name || "N/A"} <br />
                    <span className="text-xs text-gray-500 font-normal">{aff.user.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">{aff.user.tier}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-indigo-600">
                    {aff.couponCode}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-orange-600">
                    ₹{aff.pendingBalance}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-green-600">
                    ₹{aff.totalEarned}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-xs text-gray-500">
                    {aff.upiId || "Not provided"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
