import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { ReportContent } from "@/components/report/ReportContent";
import DashboardLoading from "@/app/dashboard/loading";

interface PageProps {
  params: Promise<{ id: string }>;
}

const getCachedShowcaseReport = unstable_cache(
  async (id: string) => {
    return await prisma.validationReport.findFirst({
      where: { id },
      include: {
        idea: true,
      },
    });
  },
  ['showcase-report'],
  { revalidate: 3600 }
);

async function ShowcaseDataFetcher({ id }: { id: string }) {
  const report = await getCachedShowcaseReport(id);
  if (!report) notFound();
  
  return (
    <ReportContent report={report} isReadOnly={true} />
  );
}

export default async function ShowcasePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      <Suspense fallback={<DashboardLoading />}>
        <ShowcaseDataFetcher id={id} />
      </Suspense>
    </div>
  );
}
