import { NextRequest, NextResponse } from "next/server";
import { Country, State, City } from "country-state-city";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const countryCode = searchParams.get("countryCode");
  const stateCode = searchParams.get("stateCode");

  try {
    if (type === "countries") {
      const countries = Country.getAllCountries().map(c => ({ name: c.name, isoCode: c.isoCode }));
      return NextResponse.json({ data: countries });
    } else if (type === "states" && countryCode) {
      const states = State.getStatesOfCountry(countryCode).map(s => ({ name: s.name, isoCode: s.isoCode }));
      return NextResponse.json({ data: states });
    } else if (type === "cities" && countryCode && stateCode) {
      const cities = City.getCitiesOfState(countryCode, stateCode).map(c => ({ name: c.name }));
      return NextResponse.json({ data: cities });
    }
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  } catch (error) {
    console.error("[Geo API Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
