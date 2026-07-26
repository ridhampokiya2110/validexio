import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = process.env.UPSTASH_REDIS_REST_URL 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
  : ({
      sadd: async () => 1,
      eval: async () => [0, 0],
    } as any);

const rateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.UPSTASH_REDIS_REST_URL) {
      const identifier = `change-email-verify-${session.user.id}`;
      const { success } = await rateLimit.limit(identifier);

      if (!success) {
        return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
      }
    }

    const { newEmail, code } = await req.json();

    if (!newEmail || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: `${session.user.id}_change_email`,
          token: code,
        },
      },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
    }

    // Check if new email is already in use by another account
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail.toLowerCase() }
    });
    
    if (existingUser) {
      return NextResponse.json({ error: "Email is already in use by another account" }, { status: 400 });
    }

    // Update the email
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        email: newEmail.toLowerCase(),
        emailVerified: new Date() // implicitly verify the new email
      },
    });

    // Clean up the token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: `${session.user.id}_change_email`,
          token: code,
        },
      },
    });

    return NextResponse.json({ success: true, message: "Email updated successfully" });
  } catch (error: any) {
    console.error("Change Email Verify Error:", error);
    return NextResponse.json(
      { error: "Failed to verify and update email." }, 
      { status: 500 }
    );
  }
}
