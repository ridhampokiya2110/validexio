import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
  });
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    let email = session?.user?.email;

    if (!email) {
      // Allow unauthenticated requests if they provide an email in the body
      const body = await req.json().catch(() => ({}));
      if (body.email) {
        email = body.email;
      } else {
        return NextResponse.json({ error: "Unauthorized or missing email" }, { status: 401 });
      }
    }

    if (ratelimit) {
      const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success } = await ratelimit.limit(`verify_email_send_${ip}`);
      if (!success) {
        return NextResponse.json({ error: "Too many verification requests. Please try again later." }, { status: 429 });
      }
    }

    // Check if user exists and if already verified
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, emailVerified: true },
    });

    if (!user) {
      // Silently return success to prevent email enumeration
      return NextResponse.json({ success: true });
    }

    if (user?.emailVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 });
    }

    // Generate token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Delete existing token if any
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Save token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send email via Resend
    const host = req.headers.get("host") || "validexio.com";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    const confirmLink = `${appUrl}/verify-email?token=${token}`;

    if (resend) {
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Validexio Security <support@validexio.com>",
        to: email,
        subject: "Verify your email address - Validexio",
        html: `
          <div style="font-family: sans-serif; max-w-md: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #75070C; text-align: center; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">Validexio</h1>
            <h2 style="color: #1B1716;">Verify your email address</h2>
            <p style="color: #1B1716; opacity: 0.8;">Please click the button below to verify your email address and secure your founder account.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmLink}" style="background-color: #75070C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Now</a>
            </div>
            <p style="color: #1B1716; opacity: 0.6; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      }).catch(err => console.error("Non-blocking email send error:", err));
    } else {
      console.log("Mock Email Sent (No RESEND_API_KEY configured). Verification Link:", confirmLink);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
