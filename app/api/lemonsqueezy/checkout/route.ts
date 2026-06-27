import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tier } = await req.json();
    
    // Determine Lemon Squeezy Variant ID based on selected tier
    // Make sure these are set in .env.local
    const variantId = tier === "PRO" 
      ? process.env.LEMON_SQUEEZY_PRO_VARIANT_ID 
      : process.env.LEMON_SQUEEZY_TEAM_VARIANT_ID;

    if (!variantId) {
      return NextResponse.json({ error: "Pricing not configured correctly." }, { status: 500 });
    }

    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;

    if (!storeId) {
       return NextResponse.json({ error: "Store not configured correctly." }, { status: 500 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    // Create a Lemon Squeezy checkout
    const checkout = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: user?.email,
        custom: {
          user_id: user?.id,
          tier: tier
        }
      },
      productOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`
      }
    });

    if (checkout.error) {
      console.error("Lemon Squeezy Checkout Error:", checkout.error);
      return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
    }

    return NextResponse.json({ url: checkout.data?.data.attributes.url });
  } catch (error) {
    console.error("[LEMON_SQUEEZY_CHECKOUT]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
