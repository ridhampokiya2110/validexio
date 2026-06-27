"use server";

import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function trackInterception(competitorTargeted: string) {
  try {
    const headersList = await headers();
    const referrer = headersList.get("referer") || "Direct";
    
    // We are extracting the basic origin or full referrer.
    // For privacy, some referrers might be stripped by the browser, but we log what we get.
    await prisma.interceptTracking.create({
      data: {
        incomingReferrer: referrer || "direct",
        capturedUtmSource: null, // Could parse from URL if needed
        competitorSlug: competitorTargeted,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to track interception:", error);
    // Don't throw here to avoid breaking the frontend flow if analytics fail
    return { success: false };
  }
}
