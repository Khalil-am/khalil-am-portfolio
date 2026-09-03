import PostsWithSearch from "@/components/PostsWithSearch";
import { jsonLdScript } from "@/lib/jsonld";
import { getPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import path from "path";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on product management, AI-enabled delivery, business analysis, and data-driven consulting from Khalil Abu Mushref.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Khalil Abu Mushref — Blog" },
      ],
    },
  },
  openGraph: {
    title: "Blog | Khalil Abu Mushref",
    description:
      "Insights on product management, AI-enabled delivery, business analysis, and data-driven consulting.",
    url: "/blog",
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
      <h1 className="title">my blog.</h1>

      <PostsWithSearch posts={posts} />
    </article>
  );
}
