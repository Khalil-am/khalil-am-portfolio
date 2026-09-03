import BI from "@/components/BI";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/jsonld";
import { projectSchema } from "@/lib/schemas";
import { SITE_URL } from "@/lib/site";
import data from "@/data/bi.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Intelligence Dashboards",
  description:
    "Power BI and analytics dashboard portfolio by Khalil Abu Mushref — executive KPIs, sales performance, and real-time reporting for data-driven decisions.",
  alternates: { canonical: "/bi" },
  openGraph: {
    title: "Business Intelligence Dashboards | Khalil Abu Mushref",
    description:
      "Executive KPIs, sales performance, and real-time reporting dashboards.",
    url: "/bi",
  },
};

export default async function BIPage() {
  const dashboards = projectSchema.parse(data).projects;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/bi#collection`,
    name: "Business Intelligence Dashboards by Khalil Abu Mushref",
    url: `${SITE_URL}/bi`,
    author: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: dashboards.length,
      itemListElement: dashboards.map((dashboard, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: dashboard.name,
          description: dashboard.description,
          ...(dashboard.href ? { url: dashboard.href } : {}),
          author: { "@id": `${SITE_URL}/#person` },
        },
      })),
    },
  };

  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: "Home", path: "" },
              { name: "Business Intelligence", path: "/bi" },
            ]),
          ),
        }}
      />
      <h1 className="title">my dashboards.</h1>
      <BI />
    </article>
  );
}
