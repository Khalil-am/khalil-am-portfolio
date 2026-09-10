import BI from "@/components/BI";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { projectSchema } from "@/lib/schemas";
import { SITE_URL } from "@/lib/site";
import data from "@/data/bi.json";

const description =
  "Business intelligence portfolio by Khalil Abu Mushref covering executive KPIs, Power BI, analytics, reporting frameworks, and data-informed decision support.";

export const metadata = pageMetadata({
  title: "Business Intelligence Portfolio",
  description,
  path: "/bi",
});

export default async function BIPage() {
  const dashboards = projectSchema.parse(data).projects;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/bi#collection`,
    name: "Business Intelligence Dashboards by Khalil Abu Mushref",
    description,
    url: `${SITE_URL}/bi`,
    author: { "@id": `${SITE_URL}/#person` },
    about: { "@id": `${SITE_URL}/#person` },
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
          ...(dashboard.href ? { sameAs: dashboard.href } : {}),
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
      <header className="space-y-4">
        <h1 className="title">Business intelligence portfolio</h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Khalil Abu Mushref&apos;s BI work connects operational data to
          decisions through KPI definition, reporting frameworks, dashboard
          design, and analytics workflows. The examples below cover executive,
          sales, marketing, operations, and web-performance use cases.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          These portfolio entries describe the intended analytical experience;
          availability and data freshness depend on the linked demonstration.
        </p>
      </header>
      <BI />
    </article>
  );
}
