import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const TIER_PRICES_INR = {
  STARTER: 499,
  PRO: 1499,
  TEAM: 2999,
  ENTERPRISE: 14999,
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tier } = await req.json();

    if (!tier || !TIER_PRICES_INR[tier as keyof typeof TIER_PRICES_INR]) {
      return NextResponse.json({ error: "Invalid tier selected" }, { status: 400 });
    }

    const amount = TIER_PRICES_INR[tier as keyof typeof TIER_PRICES_INR] * 100; // Razorpay expects amount in paise

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: session.user.id,
        tier: tier,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      keyId: process.env.RAZORPAY_KEY_ID, // Safe to send public key to frontend
    });
  } catch (error) {
    console.error("[Razorpay Order Error]", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
