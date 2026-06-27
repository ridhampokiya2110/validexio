import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ReportClient from "@/components/report/ReportClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PremiumReportPage(props: PageProps) {
  const params = await props.params;
  const { id } = params;

  const session = await prisma.validationSession.findUnique({
    where: { id },
  });

  if (!session) {
    notFound();
  }

  // Determine if it has the generated assets yet
  // In a real app, if it doesn't, we might trigger the /api/v1/generate-premium-report
  // For the UI template, we assume the data exists or we mock it if empty to show the UI

  return <ReportClient session={session} />;
}
