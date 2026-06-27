import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Mock implementation to satisfy the original route structure
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});

export async function GET(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    
    // Mock ratelimit check
    try {
      const { success } = await ratelimit.limit(`gallery_feed_${ip}`);
      if (!success) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
      }
    } catch (e) {
      // Ignore ratelimit errors in dev
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const cursor = searchParams.get("cursor");

    const projects = await prisma.project.findMany({
      where: { isPublic: true },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
    });

    let nextCursor = null;
    if (projects.length > limit) {
      const nextItem = projects.pop();
      nextCursor = nextItem?.id;
    }

    return NextResponse.json({
      items: projects,
      nextCursor
    });
  } catch (error) {
    console.error("[GALLERY_ROASTS]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
