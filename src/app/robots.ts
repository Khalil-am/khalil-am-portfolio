import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

/**
 * AI/answer-engine crawlers are allowed explicitly (GEO): being present in
 * their indexes is how the site gets cited by ChatGPT, Claude, Perplexity,
 * Gemini and friends. The wildcard rule already allows them, but naming them
 * makes the policy explicit and survives a future tightening of the wildcard.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
  "Meta-ExternalFetcher",
  "Amazonbot",
  "DuckAssistBot",
  "cohere-ai",
  "MistralAI-User",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
