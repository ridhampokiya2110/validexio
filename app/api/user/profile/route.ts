import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { sanitizeString } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(300).optional(),
  company: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal("")),
  location: z.string().max(100).optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const data = parsed.data;
    const sanitized: Record<string, string | undefined> = {};

    if (data.name) sanitized.name = sanitizeString(data.name);
    if (data.bio !== undefined) sanitized.bio = sanitizeString(data.bio);
    if (data.company !== undefined) sanitized.company = sanitizeString(data.company);
    if (data.website !== undefined) sanitized.website = data.website;
    if (data.location !== undefined) sanitized.location = sanitizeString(data.location);

    await prisma.user.update({
      where: { id: session.user.id },
      data: sanitized,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all user data (cascade handled by Prisma)
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
