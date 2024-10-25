// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// Define a schema for validating email data
const ContactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

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
  try {
    const data = await request.json();
    const result = ContactFormSchema.safeParse(data);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const { name, email, message } = result.data;

    // Create the email data
    const mailOptions = {
      from: `"Khalil Support" <postmaster@khalil-am.com>`,
      to: "khalil@khalil-am.com",
      subject: `New message from ${name}!`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send the email using Nodemailer
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
