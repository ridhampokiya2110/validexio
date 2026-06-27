import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { revalidatePath } from "next/cache";

// Fallback to local memory if UPSTASH is not configured properly in dev
const redis = process.env.UPSTASH_REDIS_REST_URL 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
  : ({
      sadd: async () => 1,
      eval: async () => [0, 0], // Mocks the sliding window script evaluation
    } as any);

const rateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
});

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.UPSTASH_REDIS_REST_URL) {
      const identifier = `delete-account-${session.user.id}`;
      const { success } = await rateLimit.limit(identifier);

      if (!success) {
        return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
      }
    }

    // Fetch user to check for active Lemon Squeezy subscriptions
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      // @ts-ignore
      select: { lemonSqueezyCustomerId: true, email: true },
    });

    // @ts-ignore
    if (user?.lemonSqueezyCustomerId) {
      try {
        const { lemonSqueezySetup, listSubscriptions, cancelSubscription } = await import("@lemonsqueezy/lemonsqueezy.js");
        lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY || "" });
        
        const subscriptions = await listSubscriptions({
          filter: {
            userEmail: user.email as string,
            status: "active",
          }
        });

        if (subscriptions.data?.data) {
          for (const sub of subscriptions.data.data) {
            await cancelSubscription(sub.id);
          }
        }
      } catch (e) {
        console.error("Failed to cancel Lemon Squeezy subscription:", e);
        // Continue with account deletion even if LS fails, 
        // to ensure GDPR compliance on our end
      }
    }

    // Use Prisma to securely delete the user and trigger cascade deletes
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Account Deletion Error:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please contact support if the issue persists." }, 
      { status: 500 }
    );
  }
}
