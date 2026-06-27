import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCustomer, lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      // @ts-ignore
      select: { lemonSqueezyCustomerId: true },
    });

    // @ts-ignore
    if (!user || !user.lemonSqueezyCustomerId) {
      return NextResponse.json(
        { error: "No active Lemon Squeezy customer found for this account." },
        { status: 400 }
      );
    }

    // Ensure Lemon Squeezy is initialized
    lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY || "" });

    // @ts-ignore
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
  } catch (error: any) {
    console.error("Lemon Squeezy Portal Error:", error);
    return NextResponse.json({ error: "Failed to initiate Lemon Squeezy portal." }, { status: 500 });
  }
}
