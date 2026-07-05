import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Khalil Abu Mushref for consulting, product ownership, and AI-enabled delivery engagements in Riyadh and beyond.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Khalil Abu Mushref",
    description:
      "Consulting, product ownership, and AI-enabled delivery engagements.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title">contact me.</h1>
      
      <ContactForm />
    </article>
  );
}
