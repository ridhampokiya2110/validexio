import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/guards/admin.guard";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isSuperAdmin = await requireSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const resolvedParams = await params;

    const request = await prisma.payoutRequest.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const updatedRequest = await prisma.payoutRequest.update({
      where: { id: resolvedParams.id },
      data: { status }
    });

    if (status === "PAID") {
      await prisma.notification.create({
        data: {
          userId: request.userId,
          type: "PAYOUT",
          title: "Payout Successful!",
          description: `Your payout request for ₹${request.amount} has been processed and paid out.`,
          link: "/dashboard/affiliate",
        }
      });
    }

    return NextResponse.json(updatedRequest);
  } catch (error: any) {
    console.error("Admin payout update error:", error);
    return NextResponse.json({ error: "Failed to update payout" }, { status: 500 });
  }
}
