import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.UPSTASH_REDIS_REST_URL) {
      const identifier = `reset-password-${session.user.id}`;
      const { success } = await rateLimit.limit(identifier);

      if (!success) {
        return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, provider: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.provider !== "credentials" && user.provider !== "email" && user.provider !== null) {
      return NextResponse.json({ 
        error: `Your account uses ${user.provider} for authentication. Password reset is disabled.` 
      }, { status: 400 });
    }

    // Generate token
    const { randomBytes } = await import("crypto");
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        expires,
      },
    });

    // Determine the base URL for the reset link
    const host = req.headers.get("host") || "validexio.com";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Only send the email if the Resend API key is configured
    if (resend) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "security@validexio.com",
        to: user.email,
        subject: "Validexio - Password Reset",
        html: `<p>We received a request to reset your password. Click the link below to securely choose a new password.</p>
               <br/>
               <a href="${resetUrl}">Reset Password</a>
               <br/><br/>
               <p>If you did not request this, please ignore this email or contact support.</p>`,
      });
    }

    return NextResponse.json({ success: true, message: "Password reset instructions sent." });
  } catch (error: any) {
    console.error("Password Reset Error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request." }, 
      { status: 500 }
    );
  }
}
