import MLModels from "@/components/MLModels";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/site";
import data from "@/data/mlModels.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI & Machine Learning Models",
  description:
    "Applied machine learning work by Khalil Abu Mushref — healthcare AI, NLP models, and predictive analytics projects with real-world deployments.",
  alternates: { canonical: "/ml-models" },
  openGraph: {
    title: "AI & Machine Learning Models | Khalil Abu Mushref",
    description: "Healthcare AI, NLP models, and predictive analytics projects.",
    url: "/ml-models",
  },
};

export default async function MLModelsPage() {
  const models = data.models;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/ml-models#collection`,
    name: "AI & Machine Learning Work by Khalil Abu Mushref",
    url: `${SITE_URL}/ml-models`,
    author: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: models.length,
      itemListElement: models.map((model, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: model.title,
          description: model.description,
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
              { name: "AI & ML Models", path: "/ml-models" },
            ]),
          ),
        }}
      />
      <h1 className="title">my AI/ML models.</h1>

      <MLModels />
    </article>
  );
}
