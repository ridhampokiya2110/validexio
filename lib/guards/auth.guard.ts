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
    select: { id: true, isUnlocked: true, unlockedTier: true, userId: true },
  });

  if (!session) {
    return { error: NextResponse.json({ error: "Session not found" }, { status: 404 }) };
  }

  // IDOR Check: Ensure the user requesting this session is the owner
  if (session.userId !== userId) {
    return { error: NextResponse.json({ error: "Unauthorized access to session" }, { status: 403 }) };
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
