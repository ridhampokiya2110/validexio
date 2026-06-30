import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ authenticated: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true, availableCredits: true, updatedAt: true },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ 
      authenticated: true,
      tier: user.tier,
      availableCredits: user.availableCredits,
      updatedAt: user.updatedAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
