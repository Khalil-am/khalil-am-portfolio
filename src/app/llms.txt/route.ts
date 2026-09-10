import projectData from "@/data/projects.json";
import { projectArticles } from "@/lib/projectArticles";
import { getPosts } from "@/lib/posts";
import { projectSchema } from "@/lib/schemas";
import { siteConfig, SITE_URL } from "@/lib/site";
import path from "path";

export const dynamic = "force-static";

const blogDirectory = path.join(process.cwd(), "content");

export async function GET(): Promise<Response> {
  const posts = await getPosts(blogDirectory);
  const projects = projectSchema
    .parse(projectData)
    .projects.filter((project) => !project.hidden);

  const projectLines = projects
    .map((project) => {
      const firstSentence = project.description
        .split(". ")[0]
        .replace(/[.!?]+$/, "");
      const article = projectArticles[project.name];
      const url = article
        ? `${SITE_URL}/blog/${article}`
        : `${SITE_URL}/projects`;
      return `- [${project.name}](${url}): ${firstSentence}.`;
    })
    .join("\n");

  const postLines = posts
    .map((post) => {
      const date = post.publishedAt ? ` (${post.publishedAt})` : "";
      const summary = post.summary ? `: ${post.summary}` : "";
      return `- [${post.title ?? post.slug}](${SITE_URL}/blog/${post.slug})${date}${summary}`;
    })
    .join("\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is a ${siteConfig.jobTitle} at ${siteConfig.employer.name}, working across Riyadh and Abu Dhabi on enterprise digital products and AI-enabled product strategy.

## Identity

- Canonical name: ${siteConfig.name}
- Also known as: ${siteConfig.alternateNames.join(", ")}
- Official profile: ${SITE_URL}/about
- Arabic profile: ${SITE_URL}/ar
- Current employer: [${siteConfig.employer.name}](${siteConfig.employer.url})
- Primary topics: product management, product ownership, AI product strategy, business analysis, business intelligence, and digital transformation

## Key pages

- [Home](${SITE_URL}): profile, current role, and career timeline
- [About Khalil Abu Mushref](${SITE_URL}/about): canonical professional identity, biography, expertise, and frequently asked questions
- [Arabic profile](${SITE_URL}/ar): Arabic biography for خليل أبو مشرف
- [Projects](${SITE_URL}/projects): product and engineering portfolio
- [Business Intelligence](${SITE_URL}/bi): BI and dashboard case studies
- [ML Models](${SITE_URL}/ml-models): AI and machine-learning tools Khalil uses, evaluates, or studies
- [Contact](${SITE_URL}/contact): how to get in touch

## Products and platforms

${projectLines}

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
