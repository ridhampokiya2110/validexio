import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true, email: true },
    });

    if (user?.twoFactorEnabled) {
      return NextResponse.json({ error: "2FA is already enabled" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    const userEmail = user?.email || "user@validexio.com";

    // Save token for validation
    await prisma.verificationToken.deleteMany({
      where: { identifier: `${userEmail}_2fa_enable` },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: `${userEmail}_2fa_enable`,
        token: otp,
        expires,
      },
    });

    // Send email via Resend
    if (resend) {
      resend.emails.send({
        from: "Validexio Security <support@validexio.com>",
        to: userEmail,
        subject: "Your 2FA Security Code",
        html: `
          <div style="font-family: sans-serif; max-w-md: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #75070C; text-align: center; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">Validexio</h1>
            <h2 style="color: #1B1716;">Enable Two-Factor Authentication</h2>
            <p style="color: #1B1716; opacity: 0.8;">Here is your 6-digit security code to enable 2FA on your account:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-family: monospace; font-size: 32px; letter-spacing: 0.2em; background-color: #f3f4f6; padding: 12px 24px; border-radius: 8px; font-weight: bold; color: #1B1716;">${otp}</span>
            </div>
            <p style="color: #1B1716; opacity: 0.6; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, ignore this email.</p>
          </div>
        `,
      }).catch(err => console.error("Non-blocking email send error:", err));
    } else {
       console.warn("RESEND_API_KEY is missing. 2FA email not sent.");
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error generating 2FA:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
