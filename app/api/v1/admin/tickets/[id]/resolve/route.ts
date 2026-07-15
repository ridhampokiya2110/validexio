import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/guards/admin.guard";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const isSuperAdmin = await requireSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const params = await context.params;
    const ticketId = params.id;
    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: "RESOLVED",
      },
    });

    await prisma.notification.create({
      data: {
        userId: updatedTicket.userId,
        type: "SUPPORT",
        title: "Support Ticket Resolved",
        description: `Your ticket regarding "${updatedTicket.subject}" has been marked as resolved by our team.`,
        link: "/dashboard",
      }
    });

    return NextResponse.json({ success: true, ticket: updatedTicket });
  } catch (error) {
    console.error("Admin Resolve Ticket Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
