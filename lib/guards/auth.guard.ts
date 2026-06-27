import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

const uuidSchema = z.string().uuid();

export async function verifyAuthGuard(req: Request) {
  let token = "";

  // 1. Try to get token from Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. Fallback to HttpOnly cookie
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("sb-access-token")?.value || "";
  }

  if (!token) {
    return { error: NextResponse.json({ error: "Missing authentication token" }, { status: 401 }) };
  }

  
  // Verify JWT securely using Supabase Admin
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  
  if (error || !user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return { userId: user.id };
}

export async function verifyPaywallGuard(sessionId: string, userId: string, requirePro: boolean = false) {
  // Validate UUID
  const parsedId = uuidSchema.safeParse(sessionId);
  if (!parsedId.success) {
    return { error: NextResponse.json({ error: "Invalid Session ID" }, { status: 400 }) };
  }

  // Find Session
  const session = await prisma.validationSession.findUnique({
    where: { id: sessionId },
    select: { id: true, isUnlocked: true, unlockedTier: true, userId: true, createdAt: true },
  });

  if (!session) {
    return { error: NextResponse.json({ error: "Session not found" }, { status: 404 }) };
  }

  // IDOR Check: Ensure the user requesting this session is the owner
  if (session.userId !== userId) {
    return { error: NextResponse.json({ error: "Unauthorized access to session" }, { status: 403 }) };
  }

  // Enforce STARTER 7-Day and 30-Day rules
  if (session.unlockedTier === "STARTER") {
    const daysSinceCreation = (Date.now() - session.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    
    // After 30 days, delete the session data
    if (daysSinceCreation > 30) {
      try {
        await prisma.validationSession.delete({ where: { id: sessionId } });
      } catch (e) {
        console.error("Failed to delete expired STARTER session:", e);
      }
      return { error: NextResponse.json({ error: "Session Expired. This report has been permanently deleted as per the Starter tier 30-day retention policy." }, { status: 410 }) };
    }

    // After 7 days, lock it
    if (daysSinceCreation > 7) {
      return { error: NextResponse.json({ error: "Access Expired. The Starter tier only includes 7-day access to reports. Upgrade to Pro for lifetime access." }, { status: 403 }) };
    }
  }

  // Paywall checks
  if (!session.isUnlocked) {
    return { error: NextResponse.json({ error: "Access Denied. Paywall locked." }, { status: 403 }) };
  }

  if (requirePro && session.unlockedTier !== "PRO") {
    return { error: NextResponse.json({ error: "Forbidden. PRO tier required for this asset." }, { status: 403 }) };
  }

  return { session };
}
