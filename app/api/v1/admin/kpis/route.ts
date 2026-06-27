import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/guards/admin.guard";
import { Redis } from "@upstash/redis";

const redis = process.env.UPSTASH_REDIS_REST_URL 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
  : null;

export async function GET() {
  try {
    const isSuperAdmin = await requireSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const cacheKey = "admin_kpis_cache";
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json(cached);
      }
    }

    const [
      totalFounders,
      ideasValidated,
      activeTickets,
      proSubscriptions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.validationSession.count(),
      prisma.supportTicket.count({ where: { status: "OPEN" } }),
      prisma.subscription.count({ where: { status: "ACTIVE" } })
    ]);

    // Mock MRR calculation based on active Pro subscriptions
    // Assuming PRO is $29/mo
    const totalMRR = proSubscriptions * 29;

    const kpis = {
      totalMRR,
      totalFounders,
      ideasValidated,
      activeTickets
    };

    if (redis) {
      // Cache for 5 minutes (300 seconds)
      await redis.setex(cacheKey, 300, kpis);
    }

    return NextResponse.json(kpis);
  } catch (error) {
    console.error("Admin KPIs Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
