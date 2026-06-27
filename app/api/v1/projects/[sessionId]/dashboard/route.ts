import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPaywallGuard } from "@/lib/guards/auth.guard";
import { getSignedUrl } from "@/lib/supabase";

import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const sessionAuth = await auth();
    if (!sessionAuth?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;
    const authGuard = await verifyPaywallGuard(sessionId, sessionAuth.user.id);
    
    if (authGuard.error) return authGuard.error;

    const session = await prisma.validationSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        businessIdea: true,
        industry: true,
        pricingModel: true,
        viabilityScore: true,
        antiRoadmap: true,
        wtpScore: true,
        unitEconomics: true,
        b2bLeads: true,
        uiMockups: true,
        unlockedTier: true,
        // We omit codeAssetKey here to prevent leakage of the exact path, even if it's protected
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Convert raw Supabase Storage paths into Ephemeral Signed URLs
    const signedMockupUrls: string[] = [];
    if (session.uiMockups && Array.isArray(session.uiMockups)) {
      for (const path of session.uiMockups) {
        const url = await getSignedUrl("validexio-assets", path, 900); // 15 mins
        if (url) signedMockupUrls.push(url);
      }
    }

    // Construct the unredacted payload
    const dashboardData = {
      ...session,
      uiMockups: signedMockupUrls, // Replaced with signed URLs
    };

    return NextResponse.json(
      { data: dashboardData },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    console.error("[Dashboard API] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
