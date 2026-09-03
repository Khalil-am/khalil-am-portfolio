import ContactForm from "@/components/ContactForm";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/jsonld";
import { siteConfig, SITE_URL } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Khalil Abu Mushref for product leadership, consulting, and AI-enabled delivery engagements across Riyadh, Abu Dhabi, and the wider Gulf.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Khalil Abu Mushref",
    description:
      "Consulting, product ownership, and AI-enabled delivery engagements.",
    url: "/contact",
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contact#contact`,
  name: "Contact Khalil Abu Mushref",
  url: `${SITE_URL}/contact`,
  inLanguage: "en",
  about: { "@id": `${SITE_URL}/#person` },
  mainEntity: {
    "@id": `${SITE_URL}/#person`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "professional inquiries",
      email: siteConfig.email,
      availableLanguage: ["en", "ar"],
    },
  },
};

export default function ContactPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(contactJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: "Home", path: "" },
              { name: "Contact", path: "/contact" },
            ]),
          ),
        }}
      />
      <h1 className="title">contact me.</h1>

      <ContactForm />
    </article>
  );
}
