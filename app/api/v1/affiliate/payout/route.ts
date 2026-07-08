import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { upiId } = await req.json();

    if (!upiId || typeof upiId !== "string") {
      return NextResponse.json({ error: "Valid UPI ID is required" }, { status: 400 });
    }

    // Fetch the affiliate profile
    const profile = await prisma.affiliateProfile.findUnique({
      where: { userId: session.user.id },
      include: { user: true }
    });

    if (!profile) {
      return NextResponse.json({ error: "Affiliate profile not found" }, { status: 404 });
    }

    if (profile.pendingBalance < 1000) {
      return NextResponse.json({ error: "Minimum payout threshold is ₹1000" }, { status: 400 });
    }

    // Update UPI ID if it has changed
    let isNewUpi = false;
    if (profile.upiId !== upiId) {
      await prisma.affiliateProfile.update({
        where: { userId: session.user.id },
        data: { upiId }
      });
      isNewUpi = true;
    }

    const amount = profile.pendingBalance;

    // Create a payout request
    const payoutRequest = await prisma.payoutRequest.create({
      data: {
        userId: session.user.id,
        amount: amount,
        upiId: upiId,
        status: "PENDING" // This should match your PayoutStatus enum
      }
    });

    // Deduct pending balance
    await prisma.affiliateProfile.update({
      where: { userId: session.user.id },
      data: { pendingBalance: { decrement: amount } }
    });

    // Send email to admin
    if (resend) {
      const adminEmail = process.env.ADMIN_EMAIL || "ridhampokiya10@gmail.com"; 
      
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "support@validexio.com",
          to: adminEmail,
          subject: `💰 New Payout Request - ₹${amount}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px;">
              <h2>New Affiliate Payout Request</h2>
              <p><strong>Creator:</strong> ${profile.user.name} (${profile.user.email})</p>
              <p><strong>Amount:</strong> ₹${amount}</p>
              <p><strong>UPI ID:</strong> ${upiId} ${isNewUpi ? "(NEWLY UPDATED)" : ""}</p>
              <p><strong>Coupon Code:</strong> ${profile.couponCode}</p>
              <br/>
              <p>Please process this within 24 hours.</p>
            </div>
          `
        });
      } catch (err) {
        console.error("Failed to send payout email to admin", err);
      }
    }

    return NextResponse.json({ success: true, request: payoutRequest });

  } catch (error) {
    console.error("Payout request error:", error);
    return NextResponse.json({ error: "Failed to process payout" }, { status: 500 });
  }
}
