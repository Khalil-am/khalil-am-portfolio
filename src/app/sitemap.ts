import { getPosts } from "@/lib/posts";
import { PAGE_LAST_MODIFIED, SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";
import path from "path";

const blogDirectory = path.join(process.cwd(), "content");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts(blogDirectory);
  const toDate = (date: string) => new Date(`${date}T00:00:00.000Z`);

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt
      ? new Date(post.updatedAt)
      : post.publishedAt
        ? new Date(post.publishedAt)
        : toDate(PAGE_LAST_MODIFIED.blog),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: toDate(PAGE_LAST_MODIFIED.home),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: toDate(PAGE_LAST_MODIFIED.projects),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/bi`,
      lastModified: toDate(PAGE_LAST_MODIFIED.bi),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ml-models`,
      lastModified: toDate(PAGE_LAST_MODIFIED.models),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: toDate(PAGE_LAST_MODIFIED.blog),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: toDate(PAGE_LAST_MODIFIED.about),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ar`,
      lastModified: toDate(PAGE_LAST_MODIFIED.arabicProfile),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: toDate(PAGE_LAST_MODIFIED.contact),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: toDate(PAGE_LAST_MODIFIED.privacy),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/Khalil_Abu_Mushref_CV.pdf`,
      lastModified: toDate(PAGE_LAST_MODIFIED.cv),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  return [...staticEntries, ...blogEntries];
}
