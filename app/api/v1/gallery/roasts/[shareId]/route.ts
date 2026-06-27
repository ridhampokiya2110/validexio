import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 m"),
});

export async function GET(req: Request, { params }: { params: { shareId: string } }) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    
    // Mock ratelimit check
    try {
      const { success } = await ratelimit.limit(`gallery_single_${ip}`);
      if (!success) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
      }
    } catch (e) {
      // Ignore ratelimit errors in dev
    }

    const { shareId } = params;

    const project = await prisma.project.findFirst({
      where: { 
        id: shareId,
        isPublic: true
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found or not public" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("[GALLERY_ROAST_DETAIL]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
