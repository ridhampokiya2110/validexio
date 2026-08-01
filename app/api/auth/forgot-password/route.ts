import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
  });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

    if (ratelimit) {
      const { success } = await ratelimit.limit(`forgot_password_${ip}`);
      if (!success) {
        return NextResponse.json({ error: "Too many password reset attempts. Please try again later." }, { status: 429 });
      }
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success anyway to prevent email enumeration
      return NextResponse.json({ success: true });
    }

    // Generate token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send email with Resend
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: "Validexio Security <support@validexio.com>",
      to: email,
      subject: "Reset your password - Validexio",
      html: `
        <div style="font-family: sans-serif; max-w-md: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #75070C; text-align: center; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">Validexio</h1>
          <h2 style="color: #1B1716;">Password Reset Request</h2>
          <p style="color: #1B1716; opacity: 0.8;">You requested a password reset. Click the button below to reset your password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #75070C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #1B1716; opacity: 0.6; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    
    console.log(`[EMAIL SENT] Password reset for ${email}: Token ${token}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
