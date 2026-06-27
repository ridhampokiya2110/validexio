import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");

  if (!token || !email) {
    return NextResponse.json({ error: "Missing token or email" }, { status: 400 });
  }

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    if (verificationToken.expires < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
      },
    });

    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    });

  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  // Next.js redirect() throws an error under the hood (NEXT_REDIRECT). 
  // It MUST be called outside the try/catch block, otherwise the catch block catches the redirect and returns 500.
  redirect("/dashboard/security?verified=true");
}
