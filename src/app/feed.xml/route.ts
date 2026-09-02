import { getPosts } from "@/lib/posts";
import { siteConfig, SITE_URL } from "@/lib/site";
import path from "path";

export const dynamic = "force-static";

const blogDirectory = path.join(process.cwd(), "content");

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(): Promise<Response> {
  const posts = await getPosts(blogDirectory);

  const items = posts
    .filter((post) => post.title && post.publishedAt)
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title!)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt!).toUTCString()}</pubDate>
      ${post.summary ? `<description>${escapeXml(post.summary)}</description>` : ""}
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${siteConfig.name} — Blog`)}</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
