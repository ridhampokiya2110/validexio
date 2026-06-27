import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const CACHE_KEY = "gallery_global_stats";

export async function GET() {
  try {
    const totalRoasts = await prisma.project.count({
      where: { isPublic: true }
    });
    
    return NextResponse.json({
      totalRoasts: totalRoasts || 6, // fallback
      moneySaved: (totalRoasts || 6) * 15000 
    });
  } catch (error) {
    console.error("[GALLERY_STATS]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
