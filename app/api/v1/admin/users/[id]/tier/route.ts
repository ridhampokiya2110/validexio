import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/guards/admin.guard";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const isSuperAdmin = await requireSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const body = await req.json();
    const { tier, credits } = body;

    if (!["FREE", "STARTER", "PRO", "TEAM", "ENTERPRISE"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const updateData: any = { tier };
    if (credits !== undefined) {
      updateData.availableCredits = Number(credits);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Notify the user in real-time that their plan has been updated
    await supabaseAdmin.channel(`user-updates:${id}`).send({
      type: "broadcast",
      event: "plan-updated",
      payload: { tier: updatedUser.tier, credits: updatedUser.availableCredits },
    });

    return NextResponse.json({ success: true, tier: updatedUser.tier, availableCredits: updatedUser.availableCredits });
  } catch (error) {
    console.error("Tier update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
