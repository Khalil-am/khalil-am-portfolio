import { SITE_URL } from "@/lib/site";

/** Serialize JSON-LD safely for a <script> tag. */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function breadcrumbJsonLd(
  crumbs: Array<{ name: string; path: string }>,
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

export type FaqItem = { question: string; answer: string };

/** Strip markdown syntax down to plain text for schema.org fields. */
function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract Q&A pairs from a post body's trailing "## FAQ" section, where each
 * question is an "### ..." heading followed by its answer paragraphs.
 */
export function extractFaq(content: string): FaqItem[] {
  const faqSection = content.split(/^## FAQ\s*$/m)[1];
  if (!faqSection) return [];

  // The FAQ section ends at the next h2 (or end of post).
  const section = faqSection.split(/^## /m)[0];

  const items: FaqItem[] = [];
  const blocks = section.split(/^### /m).slice(1);
  for (const block of blocks) {
    const [rawQuestion, ...rest] = block.split("\n");
    const question = markdownToPlainText(rawQuestion ?? "");
    const answer = markdownToPlainText(
      rest.join("\n").split(/^---\s*$/m)[0] ?? "",
    );
    if (question && answer) {
      items.push({ question, answer });
    }
  }
  return items;
}

export function faqPageJsonLd(pageUrl: string, items: FaqItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
