import ContactForm from "@/components/ContactForm";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, SITE_URL } from "@/lib/site";
import Link from "next/link";

const description =
  "Contact Khalil Abu Mushref about product leadership, product ownership, AI-enabled delivery, and professional collaboration in Riyadh or Abu Dhabi.";

export const metadata = pageMetadata({
  title: "Contact",
  description,
  path: "/contact",
});

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
      <header className="space-y-4">
        <h1 className="title">Contact Khalil Abu Mushref</h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Get in touch about product leadership, product ownership, enterprise
          delivery, AI-enabled products, or professional collaboration across
          Riyadh, Abu Dhabi, and the wider Gulf.
        </p>
        <p className="text-sm text-muted-foreground">
          You can also email{" "}
          <Link
            className="link font-semibold"
            href={`mailto:${siteConfig.email}`}
          >
            {siteConfig.email}
          </Link>
          .
        </p>
      </header>

      <ContactForm />
    </article>
  );
}
