import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCustomer, lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user?.lemonSqueezyCustomerId) {
      return NextResponse.json({ error: "No active Lemon Squeezy customer found for this account." }, { status: 400 });
    }

    // Ensure Lemon Squeezy is initialized
    lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY || "" });

    const customer = await getCustomer(user.lemonSqueezyCustomerId);

    if (customer.error) {
      console.error("Lemon Squeezy Portal Error:", customer.error);
      return NextResponse.json({ error: "Failed to fetch customer portal." }, { status: 500 });
    }

    const url = customer.data?.data?.attributes?.urls?.customer_portal;

    if (!url) {
      return NextResponse.json({ error: "No customer portal URL available." }, { status: 400 });
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("[LEMON_SQUEEZY_PORTAL]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
