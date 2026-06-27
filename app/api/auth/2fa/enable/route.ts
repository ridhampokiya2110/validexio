import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: "Missing 2FA code" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true, email: true },
    });

    if (user?.twoFactorEnabled) {
      return NextResponse.json({ error: "2FA is already enabled" }, { status: 400 });
    }

    const userEmail = user?.email || "user@validexio.com";

    // Verify token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: `${userEmail}_2fa_enable`,
          token: code,
        },
      },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    // Clean up token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: `${userEmail}_2fa_enable`,
          token: code,
        },
      },
    });

    // Generate backup codes
    const backupCodes = Array.from({ length: 8 }, () => randomBytes(4).toString("hex"));

    // Enable 2FA and save backup codes
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        backupCodes: backupCodes, // Storing raw for simplicity as per plan, but ideally should be hashed
      },
    });

    return NextResponse.json({
      success: true,
      backupCodes,
    });
  } catch (error) {
    console.error("Error enabling 2FA:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
