import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { prisma } from "@/lib/db";
import { RealtimePlanListener } from "@/components/dashboard/RealtimePlanListener";
async function getCachedUser(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { availableCredits: true, tier: true, profession: true }
    });
  } catch (error) {
    console.error("Database connection failed in layout:", error);
    return null;
  }
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();



  const dbUser = session?.user?.id ? await getCachedUser(session.user.id) : null;

  const isAdmin = (session?.user as any)?.role === "ADMIN" || session?.user?.email === "ridhampokiya10@gmail.com";

  const isMissingProfession = !(session.user as any).profession && !dbUser?.profession;

  if (session?.user && isMissingProfession && !isAdmin) {
    redirect("/onboarding");
  }

  // Mock user for UI testing if not logged in
  const user = session?.user ? {
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
    tier: dbUser?.tier || "FREE",
    availableCredits: dbUser?.availableCredits || 0,
  } : {
    name: "Demo Founder",
    email: "founder@startup.com",
    image: null,
    tier: "pro",
    availableCredits: 10,
  };

  return (
    <>
      {session?.user?.id && <RealtimePlanListener userId={session.user.id} />}
      <DashboardLayout user={user}>{children}</DashboardLayout>
    </>
  );
}
