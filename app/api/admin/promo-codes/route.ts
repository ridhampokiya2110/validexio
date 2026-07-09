import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const promoCodes = await prisma.promoCode.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ promoCodes });
  } catch (error) {
    console.error("Fetch Promo Codes Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { code, discountPercentage } = body;

    if (!code || discountPercentage === undefined || isNaN(discountPercentage)) {
      return NextResponse.json({ error: "Code and discount percentage are required." }, { status: 400 });
    }

    const newCode = await prisma.promoCode.create({
      data: {
        code: code.trim().toUpperCase(),
        discountPercentage: parseInt(discountPercentage, 10),
        isActive: true,
      }
    });

    return NextResponse.json({ promoCode: newCode }, { status: 201 });
  } catch (error: any) {
    console.error("Create Promo Code Error:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Promo code already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
