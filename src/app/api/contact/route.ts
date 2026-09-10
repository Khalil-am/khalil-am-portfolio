// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rateLimit";

// Define a schema for validating email data
const ContactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long")
    .refine((name) => !/[\r\n]/.test(name), "Name contains invalid characters"),
  email: z.string().trim().email("Invalid email address").max(254),
  message: z.string().trim().min(1, "Message is required").max(5000),
  website: z.string().max(0).optional(),
});

export const runtime = "nodejs";

export type ContactFormInputs = z.infer<typeof ContactFormSchema>;

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  auth: {
    user: "postmaster@khalil-am.com", // Your Mailgun SMTP login
    pass: process.env.MAILGUN_SMTP_PASSWORD, // Your Mailgun SMTP password
  },
});

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, {
    namespace: "contact",
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      {
        status: 429,
        headers: {
          ...rateLimit.headers,
          "Retry-After": String(rateLimit.retryAfter),
        },
      },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 8_000) {
    return NextResponse.json(
      { error: "Request is too large." },
      { status: 413, headers: rateLimit.headers },
    );
  }

  try {
    const data = await request.json();

    if (typeof data?.website === "string" && data.website.length > 0) {
      return NextResponse.json(
        { success: true },
        { status: 200, headers: rateLimit.headers },
      );
    }

    const result = ContactFormSchema.safeParse(data);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400, headers: rateLimit.headers },
      );
    }

    const { name, email, message } = result.data;

    // Create the email data
    const mailOptions = {
      from: `"Khalil Support" <postmaster@khalil-am.com>`,
      to: "khalil@khalil-am.com",
      replyTo: email,
      subject: `New message from ${name}!`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send the email using Nodemailer
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true },
      { status: 200, headers: rateLimit.headers },
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500, headers: rateLimit.headers },
    );
  }
}
