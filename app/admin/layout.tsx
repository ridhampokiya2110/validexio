import { requireSuperAdmin } from "@/lib/guards/admin.guard";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isSuperAdmin = await requireSuperAdmin();
  
  // If not admin, instantly return 404 so they don't even know it exists
  if (!isSuperAdmin) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      {children}
    </div>
  );
}
