import { siteConfig, SITE_LAST_MODIFIED, SITE_URL } from "@/lib/site";

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function personJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    identifier: "khalil-abu-mushref",
    name: siteConfig.name,
    givenName: siteConfig.givenName,
    familyName: siteConfig.familyName,
    alternateName: [...siteConfig.alternateNames],
    description: siteConfig.description,
    url: `${SITE_URL}/about`,
    mainEntityOfPage: { "@id": `${SITE_URL}/about#profile` },
    image: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#portrait`,
      url: siteConfig.image,
      contentUrl: siteConfig.image,
      width: 800,
      height: 800,
      caption: `Portrait of ${siteConfig.name}`,
    },
    jobTitle: siteConfig.jobTitle,
    worksFor: {
      "@type": "Organization",
      "@id": `${siteConfig.employer.url}#organization`,
      name: siteConfig.employer.name,
      url: siteConfig.employer.url,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressCountry: siteConfig.location.country,
    },
    workLocation: siteConfig.workLocations.map((place) => ({
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: place.city,
        addressCountry: place.country,
      },
    })),
    email: `mailto:${siteConfig.email}`,
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "University of Jordan",
        url: "https://www.ju.edu.jo",
      },
    ],
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "National University of Malaysia (UKM)",
      url: "https://www.ukm.my",
    },
    sameAs: [
      siteConfig.socials.linkedin,
      siteConfig.socials.github,
      siteConfig.socials.huggingFace,
      siteConfig.socials.indiePage,
    ],
    knowsLanguage: [
      { "@type": "Language", name: "English", alternateName: "en" },
      { "@type": "Language", name: "Arabic", alternateName: "ar" },
    ],
    knowsAbout: [...siteConfig.expertise],
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Principal Product Manager",
        occupationLocation: siteConfig.workLocations.map((place) => ({
          "@type": "City",
          name: place.city,
          containedInPlace: {
            "@type": "Country",
            identifier: place.country,
          },
        })),
        skills: [
          "Product Strategy",
          "Product Ownership",
          "AI Product Management",
          "Business Analysis",
          "Digital Transformation",
        ],
      },
    ],
  };
}

export function websiteJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: SITE_URL,
    description: siteConfig.description,
    publisher: { "@id": PERSON_ID },
    inLanguage: ["en", "ar"],
  };
}

export function webPageJsonLd({
  name,
  description,
  path,
  language = "en",
  type = "WebPage",
}: {
  name: string;
  description: string;
  path: string;
  language?: string;
  type?: string;
}): object {
  const url = path ? `${SITE_URL}${path}` : SITE_URL;

  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    name,
    description,
    url,
    inLanguage: language,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    primaryImageOfPage: { "@id": `${SITE_URL}/#portrait` },
  };
}

export function profilePageJsonLd({
  path,
  language,
  displayName,
  recentPosts = [],
}: {
  path: string;
  language: "en" | "ar";
  displayName: string;
  recentPosts?: Array<{ title?: string; slug: string; publishedAt?: string }>;
}): object {
  const url = `${SITE_URL}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profile`,
    name: displayName,
    url,
    inLanguage: language,
    dateModified: `${SITE_LAST_MODIFIED}T00:00:00.000Z`,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
    ...(recentPosts.length
      ? {
          hasPart: recentPosts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title ?? post.slug,
            url: `${SITE_URL}/blog/${post.slug}`,
            ...(post.publishedAt
              ? { datePublished: new Date(post.publishedAt).toISOString() }
              : {}),
            author: { "@id": PERSON_ID },
          })),
        }
      : {}),
  };
}

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
 * Extract Q&A pairs from a post body's trailing FAQ section, where each
 * question is an "### ..." heading followed by its answer paragraphs.
 */
export function extractFaq(content: string): FaqItem[] {
  const faqSection = content.split(
    /^## (?:FAQ|Frequently Asked Questions)\s*$/m,
  )[1];
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
