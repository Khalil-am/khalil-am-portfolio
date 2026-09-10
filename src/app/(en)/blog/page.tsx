import PostsWithSearch from "@/components/PostsWithSearch";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/jsonld";
import { getPosts } from "@/lib/posts";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import path from "path";

const description =
  "First-hand product, AI, delivery, business analysis, and data insights from Khalil Abu Mushref, with practical case studies from enterprise work.";

const baseMetadata = pageMetadata({
  title: "Product, AI & Delivery Insights",
  description,
  path: "/blog",
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    ...baseMetadata.alternates,
    canonical: "/blog",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Khalil Abu Mushref — Blog" },
      ],
    },
  },
};

const blogDirectory = path.join(process.cwd(), "content");

export default async function BlogPage() {
  const posts = await getPosts(blogDirectory);

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    name: "Khalil Abu Mushref — Blog",
    description,
    url: `${SITE_URL}/blog`,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en",
    blogPost: posts
      .filter((post) => post.title)
      .map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        url: `${SITE_URL}/blog/${post.slug}`,
        ...(post.publishedAt
          ? { datePublished: new Date(post.publishedAt).toISOString() }
          : {}),
      })),
  };

  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: "Home", path: "" },
              { name: "Insights", path: "/blog" },
            ]),
          ),
        }}
      />
      <header className="space-y-4">
        <h1 className="title">Product, AI &amp; delivery insights</h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          First-hand articles and case studies by Khalil Abu Mushref on product
          leadership, AI-enabled delivery, business analysis, enterprise
          workflows, business intelligence, and the lessons behind selected
          products.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Use the search below to find a product or topic. Every article has a
          canonical URL, publication date, named author, and structured article
          data.
        </p>
      </header>

      <PostsWithSearch posts={posts} />
    </article>
  );
}
