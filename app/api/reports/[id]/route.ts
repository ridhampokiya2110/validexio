import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const report = await prisma.validationReport.findUnique({
      where: { id },
      select: { userId: true, ideaId: true }
    });

    if (!report) {
      // If already deleted, consider it a success
      return NextResponse.json({ success: true });
    }

    if (report.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the idea. Because of cascading, this will automatically
    // delete the ValidationReport and all associated Leads.
    await prisma.idea.delete({ where: { id: report.ideaId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE_REPORT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}
