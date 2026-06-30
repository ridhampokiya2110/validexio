import { NextResponse, NextRequest } from "next/server";
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

    if (!redis) {
      return NextResponse.json({ enabled: false, error: "Redis not configured" }, { status: 200 });
    }

    const maintenanceKey = `maintenance_mode_enabled_${process.env.NODE_ENV || "development"}`;
    const enabled = await redis.get(maintenanceKey);
    return NextResponse.json({ enabled: !!enabled });
  } catch (error) {
    console.error("Admin Maintenance Mode GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isSuperAdmin = await requireSuperAdmin();
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    if (!redis) {
      return NextResponse.json({ error: "Redis not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { enabled } = body;

    const maintenanceKey = `maintenance_mode_enabled_${process.env.NODE_ENV || "development"}`;

    if (enabled) {
      await redis.set(maintenanceKey, "true");
    } else {
      await redis.del(maintenanceKey);
    }

    return NextResponse.json({ success: true, enabled: !!enabled });
  } catch (error) {
    console.error("Admin Maintenance Mode POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
