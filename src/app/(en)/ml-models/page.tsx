import MLModels from "@/components/MLModels";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import data from "@/data/mlModels.json";

const description =
  "AI and machine-learning tools used or studied by Khalil Abu Mushref, including RAG, NLP, forecasting, medical AI, analytics, and open-source frameworks.";

export const metadata = pageMetadata({
  title: "AI & Machine-Learning Toolkit",
  description,
  path: "/ml-models",
});

export default async function MLModelsPage() {
  const models = data.models;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/ml-models#collection`,
    name: "AI and Machine-Learning Toolkit Used by Khalil Abu Mushref",
    description,
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
          "@type": "Thing",
          name: model.title,
          description: model.description,
          url: model.link,
          keywords: model.tags.join(", "),
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
      <header className="space-y-4">
        <h1 className="title">
          AI and machine-learning tools I use, evaluate, or study
        </h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          This is a working toolkit—not a claim that Khalil Abu Mushref created
          the third-party models or frameworks listed below. It covers
          technologies he has used, evaluated, or studied for retrieval,
          natural-language processing, forecasting, analytics, and
          healthcare-focused AI work.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Links go to each technology&apos;s primary project or documentation so
          readers can verify capabilities and current technical details at
          source.
        </p>
      </header>

      <MLModels />
    </article>
  );
}
