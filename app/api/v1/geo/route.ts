import { NextRequest, NextResponse } from "next/server";
import { Country, State, City } from "country-state-city";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const countryCode = searchParams.get("countryCode");
  const stateCode = searchParams.get("stateCode");

  if (type === "countries") {
    return NextResponse.json({ data: Country.getAllCountries() });
  }

  if (type === "states" && countryCode) {
    return NextResponse.json({ data: State.getStatesOfCountry(countryCode) });
  }

  if (type === "cities" && countryCode && stateCode) {
    return NextResponse.json({ data: City.getCitiesOfState(countryCode, stateCode) });
  }

  // Handle getting IP-based country
  const country = req.headers.get("x-vercel-ip-country");
  if (country) {
    return NextResponse.json({ country });
  }

  return NextResponse.json({ country: "UNKNOWN" });
}
