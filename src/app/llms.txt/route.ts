import { getPosts } from "@/lib/posts";
import { siteConfig, SITE_URL } from "@/lib/site";
import path from "path";

export const dynamic = "force-static";

const blogDirectory = path.join(process.cwd(), "content");

export async function GET(): Promise<Response> {
  const posts = await getPosts(blogDirectory);

  const postLines = posts
    .map((post) => {
      const date = post.publishedAt ? ` (${post.publishedAt})` : "";
      const summary = post.summary ? `: ${post.summary}` : "";
      return `- [${post.title ?? post.slug}](${SITE_URL}/blog/${post.slug})${date}${summary}`;
    })
    .join("\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is a ${siteConfig.jobTitle} at ${siteConfig.employer.name}, working across Riyadh and Abu Dhabi on enterprise digital and AI-enabled product delivery in government, healthcare, and fintech.

## Key pages

- [Home](${SITE_URL}): profile, current role, and career timeline
- [Projects](${SITE_URL}/projects): product and engineering portfolio
- [Business Intelligence](${SITE_URL}/bi): BI and dashboard case studies
- [ML Models](${SITE_URL}/ml-models): applied machine learning work
- [Contact](${SITE_URL}/contact): how to get in touch

## Blog posts

${postLines}

## Contact

- Email: ${siteConfig.email}
- LinkedIn: ${siteConfig.socials.linkedin}
- GitHub: ${siteConfig.socials.github}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
