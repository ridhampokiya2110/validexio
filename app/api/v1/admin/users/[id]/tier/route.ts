import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/guards/admin.guard";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const isSuperAdmin = await requireSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const body = await req.json();
    const { tier } = body;

    if (!["FREE", "PRO", "TEAM", "ENTERPRISE"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    let addedCredits = 0;
    if (tier === "PRO") addedCredits = 1;
    if (tier === "TEAM") addedCredits = 3;
    if (tier === "ENTERPRISE") addedCredits = 15;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { 
        tier,
        availableCredits: { increment: addedCredits }
      },
    });

    return NextResponse.json({ success: true, tier: updatedUser.tier, availableCredits: updatedUser.availableCredits });
  } catch (error) {
    console.error("Tier update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
