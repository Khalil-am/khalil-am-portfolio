import PostsWithSearch from "@/components/PostsWithSearch";
import { getPosts } from "@/lib/posts";
import type { Metadata } from "next";
import path from "path";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on business analysis, AI-enabled product delivery, and data-driven consulting from Khalil Abu Mushref.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Khalil Abu Mushref",
    description:
      "Insights on business analysis, AI-enabled product delivery, and data-driven consulting.",
    url: "/blog",
  },
};

const blogDirectory = path.join(process.cwd(), "content");

export default async function BlogPage() {
  const posts = await getPosts(blogDirectory);

  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title">my blog.</h1>

      <PostsWithSearch posts={posts} />
    </article>
  );
}
