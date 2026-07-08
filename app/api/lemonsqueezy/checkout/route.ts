import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createCheckout, lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

export async function POST(req: Request) {
  try {
    lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY || "" });
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tier, discountCode } = await req.json();
    
    let variantId;
    switch (tier) {
      case "STARTER":
        variantId = process.env.LEMON_SQUEEZY_STARTER_VARIANT_ID;
        break;
      case "PRO":
        variantId = process.env.LEMON_SQUEEZY_PRO_VARIANT_ID;
        break;
      case "TEAM":
        variantId = process.env.LEMON_SQUEEZY_TEAM_VARIANT_ID;
        break;
      case "ENTERPRISE":
        variantId = process.env.LEMON_SQUEEZY_ENTERPRISE_VARIANT_ID;
        break;
      default:
        return NextResponse.json({ error: "Invalid pricing tier selected." }, { status: 400 });
    }

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

    const checkoutData: any = {
      email: user?.email,
      custom: {
        user_id: user?.id,
        tier: tier
      }
    };

    if (discountCode) {
      checkoutData.discount_code = discountCode;
    }


    // Create a Lemon Squeezy checkout
    const checkout = await createCheckout(storeId, variantId, {
      checkoutData: checkoutData,
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
