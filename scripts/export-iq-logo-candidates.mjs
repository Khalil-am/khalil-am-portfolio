import { chromium } from "playwright";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const products = [
  { name: "SquadIQ", url: "https://squadiq.stkksa.com/auth" },
  { name: "SafetyIQ", url: "https://safetyiq-six.vercel.app/auth/sign-in" },
  { name: "BoardIQ", url: "https://boardiq.stkksa.com" },
  { name: "IdeaIQ", url: "https://ideaiq.stkksa.com" },
  { name: "TaskIQ", url: "https://taskiq.stkksa.com/login" },
  { name: "ApplyIQ", url: "https://applyiq.stkksa.com/login" },
  { name: "StoryIQ", url: "https://storyiq.stkksa.com/auth" },
];

const knownPaths = [
  "/mark.png",
  "/logo.svg",
  "/logo.png",
  "/favicon.svg",
  "/favicon.png",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/boardiq-logo.png",
  "/boardiq-icon.png",
  "/storyiq-icon.png",
  "/storyiq-icon-256.png",
  "/storyiq-icon-512.png",
  "/taskiq-logo.svg",
  "/taskiq-logo.png",
  "/applyiq-logo.svg",
  "/applyiq-logo.png",
  "/safetyiq-logo.svg",
  "/safetyiq-logo.png",
  "/squadiq-logo.svg",
  "/squadiq-logo.png",
  "/ideaiq-logo.svg",
  "/ideaiq-logo.png",
];

const outputRoot = path.resolve("iq-logo-candidates");
await mkdir(outputRoot, { recursive: true });

function safeName(value) {
  return value
    .replace(/^https?:\/\//i, "")
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140) || "asset";
}

function extFrom(contentType, sourceUrl) {
  const type = String(contentType || "").toLowerCase();
  if (type.includes("svg")) return ".svg";
  if (type.includes("png")) return ".png";
  if (type.includes("jpeg") || type.includes("jpg")) return ".jpg";
  if (type.includes("webp")) return ".webp";
  if (type.includes("x-icon") || type.includes("vnd.microsoft.icon")) return ".ico";
  const pathname = new URL(sourceUrl).pathname.toLowerCase();
  for (const ext of [".svg", ".png", ".jpg", ".jpeg", ".webp", ".ico"]) {
    if (pathname.endsWith(ext)) return ext === ".jpeg" ? ".jpg" : ext;
  }
  return ".bin";
}

async function downloadAsset(context, sourceUrl, dir, label, registry, manifest) {
  try {
    const response = await context.request.get(sourceUrl, {
      timeout: 45000,
      failOnStatusCode: false,
      headers: { "user-agent": "Mozilla/5.0 IQ-logo-export" },
    });
    const status = response.status();
    if (status < 200 || status >= 300) return;
    const headers = response.headers();
    const contentType = headers["content-type"] || "";
    if (!/image|svg|icon|octet-stream/i.test(contentType) && !/\.(svg|png|jpe?g|webp|ico)(\?|$)/i.test(sourceUrl)) return;
    const body = await response.body();
    if (!body || body.length < 64 || body.length > 10_000_000) return;
    const hash = createHash("sha256").update(body).digest("hex");
    if (registry.has(hash)) return;
    registry.add(hash);
    const ext = extFrom(contentType, sourceUrl);
    const file = `${String(manifest.assets.length + 1).padStart(2, "0")}-${safeName(label)}${ext}`;
    await writeFile(path.join(dir, file), body);
    manifest.assets.push({ file, sourceUrl, status, contentType, bytes: body.length, sha256: hash });
  } catch (error) {
    manifest.errors.push({ stage: "download", sourceUrl, message: String(error?.message || error) });
  }
}

const browser = await chromium.launch({ headless: true });

for (const product of products) {
  const dir = path.join(outputRoot, product.name);
  await mkdir(dir, { recursive: true });
  const manifest = { product: product.name, url: product.url, finalUrl: null, title: null, assets: [], captures: [], errors: [] };
  const registry = new Set();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  try {
    await page.goto(product.url, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(5000);
    manifest.finalUrl = page.url();
    manifest.title = await page.title();
    await page.screenshot({ path: path.join(dir, "page.png"), fullPage: true });
    await writeFile(path.join(dir, "page.html"), await page.content(), "utf8");

    const origin = new URL(page.url()).origin;
    for (const knownPath of knownPaths) {
      await downloadAsset(context, new URL(knownPath, origin).href, dir, `known-${knownPath}`, registry, manifest);
    }

    const referencedUrls = await page.evaluate(() => {
      const urls = new Set();
      const add = (value) => {
        if (!value) return;
        try { urls.add(new URL(value, document.baseURI).href); } catch {}
      };
      for (const el of document.querySelectorAll("img")) {
        add(el.currentSrc || el.src);
        add(el.getAttribute("src"));
        const srcset = el.getAttribute("srcset") || "";
        for (const part of srcset.split(",")) add(part.trim().split(/\s+/)[0]);
      }
      for (const el of document.querySelectorAll('link[rel*="icon" i], link[rel*="apple-touch" i], link[rel*="mask-icon" i]')) add(el.getAttribute("href"));
      for (const el of document.querySelectorAll('meta[property="og:image" i], meta[name="twitter:image" i]')) add(el.getAttribute("content"));
      for (const el of document.querySelectorAll("source")) {
        add(el.getAttribute("src"));
        const srcset = el.getAttribute("srcset") || "";
        for (const part of srcset.split(",")) add(part.trim().split(/\s+/)[0]);
      }
      return [...urls];
    });

    for (const assetUrl of referencedUrls.slice(0, 100)) {
      const lower = assetUrl.toLowerCase();
      const score = ["logo", "mark", "brand", "icon", "favicon", product.name.toLowerCase()].reduce((n, token) => n + (lower.includes(token) ? 1 : 0), 0);
      if (score > 0 || /\.(svg|png|jpe?g|webp|ico)(\?|$)/i.test(assetUrl)) {
        await downloadAsset(context, assetUrl, dir, `referenced-${new URL(assetUrl).pathname}`, registry, manifest);
      }
    }

    const candidates = await page.evaluate((productName) => {
      const product = productName.toLowerCase();
      const selectors = "img,svg,a,button,div,span,h1,h2,h3";
      const nodes = [...document.querySelectorAll(selectors)];
      const records = [];
      let id = 0;
      for (const el of nodes) {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        if (rect.width < 12 || rect.height < 12 || rect.width > 900 || rect.height > 500) continue;
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;
        const own = [
          el.tagName,
          el.id,
          el.className?.baseVal ?? el.className,
          el.getAttribute("alt"),
          el.getAttribute("aria-label"),
          el.getAttribute("title"),
          el.getAttribute("src"),
          el.textContent,
        ].filter(Boolean).join(" ").toLowerCase();
        const parent = [
          el.parentElement?.id,
          el.parentElement?.className?.baseVal ?? el.parentElement?.className,
          el.parentElement?.getAttribute?.("aria-label"),
          el.parentElement?.textContent,
        ].filter(Boolean).join(" ").toLowerCase();
        let score = 0;
        if (own.includes(product)) score += 100;
        if (/\b(logo|wordmark|brand|mark)\b/i.test(own)) score += 80;
        if (/\b(logo|wordmark|brand|mark)\b/i.test(parent)) score += 35;
        if (el.tagName === "IMG") score += 35;
        if (el.tagName === "SVG") score += 30;
        if (el.textContent?.trim().toLowerCase() === product) score += 100;
        if (el.closest("header,nav,aside,form")) score += 20;
        if (rect.top < 300) score += 10;
        if (rect.width * rect.height > 180000) score -= 80;
        if (score < 40) continue;
        const exportId = `iq-export-${id++}`;
        el.setAttribute("data-iq-export-id", exportId);
        records.push({ exportId, score, tag: el.tagName, width: Math.round(rect.width), height: Math.round(rect.height), text: (el.textContent || "").trim().slice(0, 160), meta: own.slice(0, 300) });
      }
      return records.sort((a, b) => b.score - a.score).slice(0, 24);
    }, product.name);

    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index];
      try {
        const locator = page.locator(`[data-iq-export-id="${candidate.exportId}"]`);
        if (await locator.count()) {
          const file = `capture-${String(index + 1).padStart(2, "0")}-${candidate.tag.toLowerCase()}-${candidate.score}.png`;
          await locator.screenshot({ path: path.join(dir, file), omitBackground: true, animations: "disabled" });
          manifest.captures.push({ file, ...candidate });
          if (candidate.tag === "SVG") {
            const svg = await locator.evaluate((node) => node.outerHTML);
            await writeFile(path.join(dir, file.replace(/\.png$/, ".svg")), svg, "utf8");
          }
        }
      } catch (error) {
        manifest.errors.push({ stage: "capture", candidate, message: String(error?.message || error) });
      }
    }
  } catch (error) {
    manifest.errors.push({ stage: "page", message: String(error?.message || error) });
  } finally {
    await writeFile(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
    await context.close();
  }
}

await browser.close();
await writeFile(path.join(outputRoot, "README.txt"), "Automated logo candidates collected from the IQ product websites listed in the STK Sales Demo Sheet.\n", "utf8");
