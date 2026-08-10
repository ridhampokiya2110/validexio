import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, message } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const htmlContent = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
        <h2 style="color: #111827; margin-top: 0;">New Contact Inquiry</h2>
        <p style="color: #4b5563; font-size: 16px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p style="color: #4b5563; font-size: 16px;"><strong>Email:</strong> ${email}</p>
        <div style="margin-top: 24px;">
          <p style="color: #111827; font-weight: bold; margin-bottom: 8px;">Message:</p>
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; color: #374151; white-space: pre-wrap;">${message}</div>
        </div>
      </div>
    `;

    if (resend) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Validexio Contact <support@validexio.com>",
        to: "support@validexio.com",
        replyTo: email,
        subject: `Validexio Inquiry: ${firstName} ${lastName}`,
        html: htmlContent,
      });
    } else {
      console.log("Development Mode - Mock Email Sent to validexio1@gmail.com:", htmlContent);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
