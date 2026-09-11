#!/usr/bin/env node

const BASE_URL = new URL(
  process.argv[2] ?? process.env.SEO_BASE_URL ?? "http://localhost:3000",
);
const CANONICAL_ORIGIN = "https://www.khalil-am.com";

const legacyRedirects = new Map([
  ["Adaptive-Traffic-Light-System", "adaptive-traffic-light-ai-system"],
  ["BC-Automations", "business-consultant-ai-automations"],
  ["Email_Service", "transactional-email-service"],
  ["Features-Extraction", "medical-image-feature-extraction"],
  ["Hewari-AI-Powered-Document-Builder", "hewari-ai-document-builder"],
  ["KAM-AI", "kam-ai-agent-orchestration"],
  ["KAM-CLI", "kam-cli-developer-tooling"],
  ["Keef-Libsaty", "keef-libsaty-fashion-ai"],
  [
    "New_Role_New_Responsibilties",
    "enterprise-digital-transformation-product-leadership",
  ],
  ["PPlus-AI-Sync-Tool", "pplus-ai-configuration-sync"],
  ["PRF-Production", "prf-production-ai-creative-services"],
  ["SCIC", "supply-chain-intelligence-consultant"],
  ["Virtue_Server", "virtue-ai-mental-health-platform"],
  ["Wajibaty-AI", "wajibaty-ai-visual-study-graphs"],
  ["Wathiq-Fintech-Platform", "wathiq-e-invoicing-platform"],
  ["Yadree", "yadree-ai-business-intelligence"],
]);

function atBase(pathname) {
  return new URL(pathname, BASE_URL).href;
}

function parseAttributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([^\s=<>]+)\s*=\s*["']([^"']*)["']/g)].map(
      ([, key, value]) => [key.toLowerCase(), value],
    ),
  );
}

function findMeta(html, key, value) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    if (attributes[key] === value) return attributes.content;
  }
}

function findLink(html, rel, extraKey, extraValue) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    const rels = (attributes.rel ?? "").toLowerCase().split(/\s+/);
    if (
      rels.includes(rel) &&
      (!extraKey || attributes[extraKey] === extraValue)
    ) {
      return attributes.href;
    }
  }
}

function textBetween(html, tag) {
  return html.match(
    new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"),
  )?.[1];
}

function rootHtmlAttributes(html) {
  const tag = html.match(/<html\b[^>]*>/i)?.[0];
  return tag ? parseAttributes(tag) : {};
}

const failures = [];
const observations = [];
const pageRecords = [];

function fail(message) {
  failures.push(message);
}

const sitemapResponse = await fetch(atBase("/sitemap.xml"));
if (!sitemapResponse.ok) {
  throw new Error(`Sitemap returned ${sitemapResponse.status}`);
}

const sitemapXml = await sitemapResponse.text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  ([, value]) => value,
);

if (!sitemapUrls.length) fail("Sitemap contains no URLs");
if (new Set(sitemapUrls).size !== sitemapUrls.length) {
  fail("Sitemap contains duplicate URLs");
}

for (const url of sitemapUrls) {
  const parsed = new URL(url);
  if (parsed.origin !== CANONICAL_ORIGIN) {
    fail(`Non-canonical sitemap origin: ${url}`);
  }
}

const results = await Promise.all(
  sitemapUrls.map(async (canonicalUrl) => {
    const pathname = new URL(canonicalUrl).pathname;
    const response = await fetch(atBase(pathname), { redirect: "manual" });
    return { canonicalUrl, pathname, response, body: await response.text() };
  }),
);

for (const { canonicalUrl, pathname, response, body } of results) {
  if (response.status !== 200) {
    fail(`${pathname} returned ${response.status}`);
    continue;
  }

  if (pathname.toLowerCase().endsWith(".pdf")) {
    if (!response.headers.get("content-type")?.includes("application/pdf")) {
      fail(`${pathname} is not served as application/pdf`);
    }
    if (response.headers.get("x-robots-tag")?.includes("noindex")) {
      fail(`${pathname} is blocked by X-Robots-Tag`);
    }
    continue;
  }

  const title = textBetween(body, "title")?.trim();
  const description = findMeta(body, "name", "description")?.trim();
  const canonical = findLink(body, "canonical");
  const robots = findMeta(body, "name", "robots") ?? "";
  const h1Count = [...body.matchAll(/<h1\b/gi)].length;

  if (!title) fail(`${pathname} has no title`);
  if (!description) fail(`${pathname} has no meta description`);
  if (canonical !== canonicalUrl) {
    fail(`${pathname} canonical is ${canonical ?? "missing"}`);
  }
  if (/noindex/i.test(robots)) fail(`${pathname} has noindex`);
  if (h1Count !== 1) fail(`${pathname} has ${h1Count} H1 elements`);

  for (const match of body.matchAll(/<img\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    if (!attributes.alt?.trim()) {
      fail(`${pathname} has an image with missing or empty alt text`);
    }
  }

  for (const property of ["og:title", "og:description", "og:url", "og:image"]) {
    if (!findMeta(body, "property", property)) {
      fail(`${pathname} is missing ${property}`);
    }
  }
  for (const name of [
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
  ]) {
    if (!findMeta(body, "name", name)) fail(`${pathname} is missing ${name}`);
  }

  const jsonLdBlocks = [
    ...body.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  if (!jsonLdBlocks.length) fail(`${pathname} has no JSON-LD`);
  for (const [, json] of jsonLdBlocks) {
    try {
      JSON.parse(json);
    } catch {
      fail(`${pathname} contains invalid JSON-LD`);
    }
  }

  pageRecords.push({ pathname, canonical, title, description });
}

for (const field of ["title", "description", "canonical"]) {
  const values = new Map();
  for (const record of pageRecords) {
    const value = record[field];
    if (!value) continue;
    values.set(value, [...(values.get(value) ?? []), record.pathname]);
  }
  for (const [value, paths] of values) {
    if (paths.length > 1) {
      fail(`Duplicate ${field} on ${paths.join(", ")}: ${value}`);
    }
  }
}

for (const [legacy, destination] of legacyRedirects) {
  const response = await fetch(atBase(`/blog/${legacy}`), {
    redirect: "manual",
  });
  const expected = `/blog/${destination}`;
  const location = response.headers.get("location");
  if (![301, 308].includes(response.status)) {
    fail(
      `/blog/${legacy} returned ${response.status}, not a permanent redirect`,
    );
  } else if (!location || new URL(location, BASE_URL).pathname !== expected) {
    fail(
      `/blog/${legacy} redirects to ${location ?? "nowhere"}, not ${expected}`,
    );
  }
}

const notFoundResponse = await fetch(
  atBase("/__seo_audit_missing_page_8f39a2"),
  { redirect: "manual" },
);
const notFoundBody = await notFoundResponse.text();
if (notFoundResponse.status !== 404) {
  fail(`Missing-page check returned ${notFoundResponse.status}, not 404`);
}
if (!/noindex/i.test(findMeta(notFoundBody, "name", "robots") ?? "")) {
  fail("404 page is missing noindex");
}
if (notFoundBody.includes("http://localhost")) {
  fail("404 metadata contains a localhost URL");
}

for (const [pathname, expectedText] of [
  ["/robots.txt", `${CANONICAL_ORIGIN}/sitemap.xml`],
  ["/llms.txt", "Khalil Abu Mushref"],
  ["/feed.xml", "application/rss+xml"],
  ["/c153c010a761a4809d066cc13e84baf1.txt", "c153c010a761a4809d066cc13e84baf1"],
]) {
  const response = await fetch(atBase(pathname));
  const body = await response.text();
  if (!response.ok) fail(`${pathname} returned ${response.status}`);
  if (!body.includes(expectedText))
    fail(`${pathname} is missing expected content`);
}

const robotsResponse = await fetch(atBase("/robots.txt"));
const robotsBody = await robotsResponse.text();
if (/^Host:/im.test(robotsBody)) {
  fail("robots.txt contains a non-standard Host directive");
}
if (!/^User-Agent: \*$/im.test(robotsBody) || !/^Allow: \/$/im.test(robotsBody)) {
  fail("robots.txt does not explicitly allow public crawling");
}

const about = results.find(({ pathname }) => pathname === "/about")?.body ?? "";
const arabic = results.find(({ pathname }) => pathname === "/ar")?.body ?? "";
const aboutHtml = rootHtmlAttributes(about);
const arabicHtml = rootHtmlAttributes(arabic);
if (aboutHtml.lang !== "en" || aboutHtml.dir !== "ltr") {
  fail("English profile root must use lang=en and dir=ltr");
}
if (arabicHtml.lang !== "ar" || arabicHtml.dir !== "rtl") {
  fail("Arabic profile root must use lang=ar and dir=rtl");
}
if (
  findLink(about, "alternate", "hreflang", "ar") !== `${CANONICAL_ORIGIN}/ar`
) {
  fail("English profile is missing its Arabic hreflang alternate");
}
if (
  findLink(arabic, "alternate", "hreflang", "en") !==
  `${CANONICAL_ORIGIN}/about`
) {
  fail("Arabic profile is missing its English hreflang alternate");
}
if (!/<article\b[^>]*lang=["']ar["'][^>]*dir=["']rtl["']/i.test(arabic)) {
  fail("Arabic profile is missing Arabic language/direction semantics");
}

observations.push(`${sitemapUrls.length} sitemap URLs fetched`);
observations.push(`${pageRecords.length} HTML pages checked`);
observations.push(`${legacyRedirects.size} legacy redirects checked`);

if (failures.length) {
  console.error(`SEO audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`SEO audit passed: ${observations.join("; ")}.`);
}
