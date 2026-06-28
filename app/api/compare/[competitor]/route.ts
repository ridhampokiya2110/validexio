import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ competitor: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const referrer = request.headers.get('referer') || searchParams.get('ref') || null;
    const utmSource = searchParams.get('utm_source') || null;
    const resolvedParams = await params;
    const competitorSlug = resolvedParams.competitor.toLowerCase();

    // Safely query the database for the competitor
    const competitorData = await prisma.competitorMatrix.findUnique({
      where: { slug: competitorSlug },
    });

    if (!competitorData) {
      return NextResponse.json(
        { error: 'Competitor not found' },
        { status: 404 }
      );
    }

    // Trigger background entry in market_interceptions without awaiting it fully to keep response fast
    // We do await it here for serverless environments where execution might halt immediately,
    // but in a real high-scale scenario we might fire and forget.
    try {
      await prisma.interceptTracking.create({
        data: {
          competitorSlug: competitorSlug,
          incomingReferrer: referrer,
          capturedUtmSource: utmSource,
        },
      });
    } catch (trackingError) {
      console.error("Failed to track interception:", trackingError);
      // We don't fail the request if tracking fails
    }

    return NextResponse.json({ competitor: competitorData });
  } catch (error) {
    console.error("Error in Compare API:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
