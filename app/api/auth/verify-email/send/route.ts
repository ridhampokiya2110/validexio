import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import dns from "dns";

// Fix for Node 17+ IPv6 preference causing 'queryA ETIMEOUT'
dns.setDefaultResultOrder("ipv4first");

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const email = session.user.email;

    // Check if already verified
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    });

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

    // Send email via Nodemailer using Gmail SMTP
    const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/verify-email/confirm?token=${token}&email=${encodeURIComponent(email)}`;

    if (process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: "74.125.143.108", // Hardcoded IP to bypass ProtonVPN DNS timeout
        port: 465,
        secure: true,
        tls: {
          servername: "smtp.gmail.com",
        },
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });

      transporter.sendMail({
        from: `"Validexio Security" <${process.env.EMAIL_SERVER_USER}>`,
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
      console.log("Mock Email Sent (No EMAIL_SERVER_USER configured). Verification Link:", confirmLink);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
