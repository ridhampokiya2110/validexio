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

    // Models CompetitorMatrix and InterceptTracking are removed.
    // Returning a mock to prevent 404s breaking the frontend tracker
    return NextResponse.json({ 
      competitor: {
        slug: competitorSlug,
        name: competitorSlug,
      } 
    });
  } catch (error) {
    console.error("Error in Compare API:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
