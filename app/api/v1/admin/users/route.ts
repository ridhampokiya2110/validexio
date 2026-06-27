import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/guards/admin.guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const isSuperAdmin = await requireSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      where: {
        email: {
          not: "ridhampokiya10@gmail.com"
        }
      },
      select: {
        id: true,
        email: true,
        tier: true,
        availableCredits: true,
        createdAt: true,
        isBanned: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.user.count({
      where: {
        email: {
          not: "ridhampokiya10@gmail.com"
        }
      }
    });

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin Users Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
