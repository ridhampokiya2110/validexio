import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

export async function POST(req: NextRequest) {
  try {
    const authSession = await auth();
    if (!authSession?.user?.id || !authSession?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { idea, industry } = body;

    if (!idea || !industry) {
      return NextResponse.json({ error: "Missing idea or industry in payload" }, { status: 400 });
    }

    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const variantId = process.env.LEMON_SQUEEZY_DEFAULT_VARIANT_ID;

    if (!storeId || !variantId) {
      return NextResponse.json({ error: "Lemon Squeezy is not fully configured." }, { status: 500 });
    }

    const checkout = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: authSession.user.email,
        custom: {
          userId: authSession.user.id,
          userEmail: authSession.user.email,
          idea,
          industry,
        }
      },
      productOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/reports?success=true`,
      }
    });

    if (checkout.error) {
      console.error("Lemon Squeezy Checkout Error:", checkout.error);
      return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
    }

    return NextResponse.json({ url: checkout.data?.data.attributes.url });
  } catch (error: any) {
    console.error("[Checkout API] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
