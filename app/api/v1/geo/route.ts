import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Try to get country from Vercel edge headers
  const country = req.headers.get("x-vercel-ip-country");
  
  if (country) {
    return NextResponse.json({ country });
  }

  // Fallback for local development or if header is missing
  return NextResponse.json({ country: "UNKNOWN" });
}
