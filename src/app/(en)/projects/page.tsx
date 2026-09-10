import Projects from "@/components/Projects";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/jsonld";
import { projectArticles } from "@/lib/projectArticles";
import { pageMetadata } from "@/lib/seo";
import { projectSchema } from "@/lib/schemas";
import { SITE_URL } from "@/lib/site";
import data from "@/data/projects.json";

const description =
  "Explore product and AI case studies by Khalil Abu Mushref across enterprise workflows, government services, healthcare, fintech, delivery, and analytics.";

export const metadata = pageMetadata({
  title: "Product & AI Case Studies",
  description,
  path: "/projects",
});

export default async function ProjectPage() {
  const projects = projectSchema
    .parse(data)
    .projects.filter((project) => !project.hidden);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/projects#collection`,
    name: "Projects by Khalil Abu Mushref",
    description,
    url: `${SITE_URL}/projects`,
    author: { "@id": `${SITE_URL}/#person` },
    about: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.name,
          description: project.description,
          ...(projectArticles[project.name]
            ? { url: `${SITE_URL}/blog/${projectArticles[project.name]}` }
            : {}),
          ...(project.href ? { sameAs: project.href } : {}),
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
      <header className="space-y-4">
        <h1 className="title">Product &amp; AI case studies</h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          A portfolio of digital products and prototypes shaped by Khalil Abu
          Mushref across procurement, delivery governance, business
          intelligence, healthcare, fintech, and AI-enabled operations. Each
          card identifies the product purpose, relevant capabilities, and an
          available live experience when one is public.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This catalogue includes work created independently and work delivered
          in collaborative settings. Individual case-study articles explain
          context and approach where public detail is available.
        </p>
      </header>

      <Projects />
    </article>
  );
}
