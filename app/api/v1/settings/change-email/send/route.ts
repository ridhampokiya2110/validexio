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
      const identifier = `change-email-${session.user.id}`;
      const { success } = await rateLimit.limit(identifier);

      if (!success) {
        return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
      }
    }

    const { newEmail } = await req.json();

    if (!newEmail || !/^\S+@\S+\.\S+$/.test(newEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
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
        error: `Your account uses ${user.provider} for authentication. Email change is disabled.` 
      }, { status: 400 });
    }
    
    if (user.email.toLowerCase() === newEmail.toLowerCase()) {
      return NextResponse.json({ error: "New email must be different from current email" }, { status: 400 });
    }

    // Check if new email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail.toLowerCase() }
    });
    
    if (existingUser) {
      return NextResponse.json({ error: "Email is already in use by another account" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    // Store token. We use identifier as `${userId}_change_email` and token as the OTP
    await prisma.verificationToken.deleteMany({
      where: { identifier: `${session.user.id}_change_email` }
    });

    await prisma.verificationToken.create({
      data: {
        identifier: `${session.user.id}_change_email`,
        token: code,
        expires,
      },
    });

    // Only send the email if the Resend API key is configured
    if (resend) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "security@validexio.com",
        to: newEmail,
        subject: "Validexio - Verify Email Change",
        html: `<p>You requested to change your Validexio account email to this address.</p>
               <br/>
               <p>Your verification code is: <strong>${code}</strong></p>
               <br/>
               <p>This code will expire in 15 minutes. If you did not request this, please ignore this email or contact support.</p>`,
      });
    } else {
      console.log(`[EMAIL MOCK] Change email OTP for ${newEmail}: ${code}`);
    }

    return NextResponse.json({ success: true, message: "Verification code sent to new email." });
  } catch (error: any) {
    console.error("Change Email Send Error:", error);
    return NextResponse.json(
      { error: "Failed to process email change request." }, 
      { status: 500 }
    );
  }
}
