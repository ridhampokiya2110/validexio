import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { twoFactorEnabled: true },
    });

    if (!user || !user.twoFactorEnabled) {
      return NextResponse.json({ error: "2FA not required" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save token for validation
    await prisma.verificationToken.deleteMany({
      where: { identifier: `${email}_2fa_login` },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: `${email}_2fa_login`,
        token: otp,
        expires,
      },
    });

    // Send email
    if (process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: "74.125.143.108",
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
        subject: "Your Login Security Code",
        html: `
          <div style="font-family: sans-serif; max-w-md: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #75070C; text-align: center; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">Validexio</h1>
            <h2 style="color: #1B1716;">Login Security Code</h2>
            <p style="color: #1B1716; opacity: 0.8;">Here is your 6-digit security code to complete your sign-in:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-family: monospace; font-size: 32px; letter-spacing: 0.2em; background-color: #f3f4f6; padding: 12px 24px; border-radius: 8px; font-weight: bold; color: #1B1716;">${otp}</span>
            </div>
            <p style="color: #1B1716; opacity: 0.6; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please secure your account.</p>
          </div>
        `,
      }).catch(err => console.error("Non-blocking email send error:", err));
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error sending login 2FA:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
