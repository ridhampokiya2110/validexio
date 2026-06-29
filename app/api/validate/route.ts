export const maxDuration = 60; // Allow enough time for LLM execution

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

import { z } from "zod";
import { sanitizeString } from "@/lib/utils";

const validateSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(50).max(4000),
  industry: z.string().min(1),
  targetMarket: z.string().optional(),
  targetScope: z.string().optional(),
  targetCountry: z.string().optional(),
  targetState: z.string().optional(),
  targetCity: z.string().optional(),
  pricingModel: z.string().optional(),
  priceTarget: z.string().optional(),
  billingFrequency: z.string().optional(),
  documentContext: z.object({
    documentTypeLabel: z.string(),
    extractedText: z.string().max(8000),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Rate limiting check (simplified - use Upstash Redis in production)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check usage limits and credits
    const isUnlimited = user.tier === "PRO" || user.tier === "TEAM";

    if (!isUnlimited) {
      if (user.availableCredits <= 0) {
        return NextResponse.json(
          {
            error: "INSUFFICIENT_CREDITS",
            message: "You have 0 credits remaining. Please upgrade or purchase more credits to validate this idea.",
          },
          { status: 402 }
        );
      }
    }

    // Parse and validate input
    const body = await req.json();
    const parsed = validateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { title, description, industry, targetMarket, targetScope, targetCountry, targetState, targetCity, pricingModel, priceTarget, billingFrequency, documentContext } = parsed.data;

    // Sanitize inputs
    const sanitizedData = {
      title: sanitizeString(title),
      description: sanitizeString(description),
      industry: sanitizeString(industry),
      targetMarket: targetMarket ? sanitizeString(targetMarket) : undefined,
      targetScope: targetScope ? sanitizeString(targetScope) : "GLOBAL",
      targetCountry: targetCountry ? sanitizeString(targetCountry) : undefined,
      targetState: targetState ? sanitizeString(targetState) : undefined,
      targetCity: targetCity ? sanitizeString(targetCity) : undefined,
      pricingModel: pricingModel ? sanitizeString(pricingModel) : undefined,
      priceTarget: priceTarget ? sanitizeString(priceTarget) : undefined,
      billingFrequency: billingFrequency ? sanitizeString(billingFrequency) : undefined,
    };

    // Construct a full location string for legacy fields or prompt parsing
    let locationString = "Global";
    if (sanitizedData.targetScope !== "GLOBAL") {
      const parts: string[] = [];
      if (sanitizedData.targetCity) parts.push(sanitizedData.targetCity);
      if (sanitizedData.targetState) parts.push(sanitizedData.targetState);
      if (sanitizedData.targetCountry) parts.push(sanitizedData.targetCountry);
      if (parts.length > 0) locationString = parts.join(", ");
    }

    // Construct pricing string
    let pricingDetails = sanitizedData.pricingModel || "";
    if (sanitizedData.priceTarget) {
      pricingDetails += ` - Target Price: $${sanitizedData.priceTarget}`;
    }
    if (sanitizedData.billingFrequency) {
      pricingDetails += ` (${sanitizedData.billingFrequency})`;
    }

    // Create the idea record
    const idea = await prisma.idea.create({
      data: {
        userId,
        title: sanitizedData.title,
        description: sanitizedData.description,
        industry: sanitizedData.industry,
        targetMarket: sanitizedData.targetMarket,
        location: locationString,
        pricingModel: pricingDetails,
        status: "PENDING",
        // Store document context if provided
        ...(documentContext ? { documentContext: documentContext as any } : {}),
      },
    });

    // Deduct credit
    if (!isUnlimited) {
      await prisma.user.update({
        where: { id: userId },
        data: { availableCredits: { decrement: 1 } },
      });
    }

    // Instead of synchronously analyzing the idea here (which takes 15s and breaks the flow),
    // we return the idea ID instantly. The frontend will redirect to the Generating page,
    // which then calls `/api/generate` to kick off the background worker!

    return NextResponse.json({
      success: true,
      ideaId: idea.id,
    });
  } catch (error) {
    console.error("Validation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
