import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";
import { TicketCategory } from "@prisma/client";
import { Resend } from "resend";

const ticketSchema = z.object({
  category: z.enum(["BILLING", "GENERATION", "ACCESS", "OTHER"]),
  subject: z.string().min(5).max(150),
  message: z.string().min(20).max(2000),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = ticketSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid payload format." }, { status: 400 });
    }

    const { category, subject, message } = parseResult.data;

    // Sanitize inputs to prevent XSS
    const sanitizedSubject = DOMPurify.sanitize(subject, { ALLOWED_TAGS: [] });
    const sanitizedMessage = DOMPurify.sanitize(message, { ALLOWED_TAGS: [] });

    if (sanitizedSubject.length < 5 || sanitizedMessage.length < 20) {
      return NextResponse.json({ error: "Content too short after sanitization." }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.user.id,
        category: category as TicketCategory,
        subject: sanitizedSubject,
        message: sanitizedMessage,
      },
    });

    // Send email notification directly via Resend (No Queue)
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      // We process this asynchronously but log the actual error object
      resend.emails.send({
        from: "onboarding@resend.dev", // Must use this for Resend free tier!
        to: "validexio1@gmail.com",
        subject: `New Support Ticket: ${category} - ${sanitizedSubject}`,
        html: `
          <h2>New Support Ticket Submitted</h2>
          <p><strong>User Name:</strong> ${session.user.name || "Unknown User"}</p>
          <p><strong>User Email:</strong> ${session.user.email || "Unknown Email"}</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Subject:</strong> ${sanitizedSubject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${sanitizedMessage.replace(/\n/g, '<br/>')}</p>
        `,
      }).then((response) => {
        if (response.error) {
          console.error("\n❌ RESEND API REJECTED THE EMAIL:");
          console.error(response.error);
          console.error("If the error is 'validation_error', it means your Resend FREE tier account is NOT registered to validexio1@gmail.com!");
        } else {
          console.log("✅ Support email successfully accepted by Resend:", response.data);
        }
      }).catch((err) => {
        console.error("❌ Failed to contact Resend API:", err);
      });
    } else {
      console.warn("⚠️ RESEND_API_KEY IS MISSING IN .env FILE!");
    }

    // Return immediately to keep the API extremely fast (under 1 second)
    return NextResponse.json({ success: true, ticketId: ticket.id });

  } catch (error: any) {
    console.error("Support Ticket API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
