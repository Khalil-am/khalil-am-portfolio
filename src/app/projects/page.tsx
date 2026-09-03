import Projects from "@/components/Projects";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/jsonld";
import { projectSchema } from "@/lib/schemas";
import { SITE_URL } from "@/lib/site";
import data from "@/data/projects.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "AI-powered platforms and product builds by Khalil Abu Mushref — IMDAD, SprintsGate, BoardIQ, NuRad, StoryIQ, and more across healthcare, delivery, and analytics.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Khalil Abu Mushref",
    description:
      "AI-powered platforms and product builds across healthcare, delivery, and analytics.",
    url: "/projects",
  },
};

export default async function ProjectPage() {
  const projects = projectSchema
    .parse(data)
    .projects.filter((project) => !project.hidden);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/projects#collection`,
    name: "Projects by Khalil Abu Mushref",
    url: `${SITE_URL}/projects`,
    author: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareApplication",
          name: project.name,
          description: project.description,
          applicationCategory: "BusinessApplication",
          ...(project.href ? { url: project.href } : {}),
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
              { name: "Projects", path: "/projects" },
            ]),
          ),
        }}
      />
      <h1 className="title">my projects.</h1>

      <Projects />
    </article>
  );
}
