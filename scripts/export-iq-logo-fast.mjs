import { chromium } from "playwright";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const products = [
  ["SquadIQ", "https://squadiq.stkksa.com/auth"],
  ["SafetyIQ", "https://safetyiq-six.vercel.app/auth/sign-in"],
  ["BoardIQ", "https://boardiq.stkksa.com"],
  ["IdeaIQ", "https://ideaiq.stkksa.com"],
  ["TaskIQ", "https://taskiq.stkksa.com/login"],
  ["ApplyIQ", "https://applyiq.stkksa.com/login"],
  ["StoryIQ", "https://storyiq.stkksa.com/auth"],
];

const knownPaths = [
  "/mark.png", "/logo.svg", "/logo.png", "/favicon.svg", "/favicon.png", "/favicon.ico",
  "/apple-touch-icon.png", "/icon.png", "/icon-192.png", "/icon-512.png",
  "/boardiq-logo.png", "/boardiq-icon.png", "/storyiq-icon-256.png", "/storyiq-icon-512.png",
  "/taskiq-logo.svg", "/taskiq-logo.png", "/applyiq-logo.svg", "/applyiq-logo.png",
  "/safetyiq-logo.svg", "/safetyiq-logo.png", "/squadiq-logo.svg", "/squadiq-logo.png",
  "/ideaiq-logo.svg", "/ideaiq-logo.png",
];

const root = path.resolve("iq-logo-candidates");
await mkdir(root, { recursive: true });

const safe = (s) => s.replace(/^https?:\/\//i, "").replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 120) || "asset";
const extFor = (type, url) => {
  const t = String(type || "").toLowerCase();
  if (t.includes("svg")) return ".svg";
  if (t.includes("png")) return ".png";
  if (t.includes("jpeg") || t.includes("jpg")) return ".jpg";
  if (t.includes("webp")) return ".webp";
  if (t.includes("icon")) return ".ico";
  const match = new URL(url).pathname.toLowerCase().match(/\.(svg|png|jpe?g|webp|ico)$/);
  return match ? `.${match[1] === "jpeg" ? "jpg" : match[1]}` : ".bin";
};

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

for (const [name, url] of products) {
  const dir = path.join(root, name);
  await mkdir(dir, { recursive: true });
  const manifest = { product: name, url, finalUrl: null, title: null, assets: [], captures: [], errors: [] };
  const seen = new Set();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(2500);
    manifest.finalUrl = page.url();
    manifest.title = await page.title();
    await page.screenshot({ path: path.join(dir, "page.png"), fullPage: false });

    const origin = new URL(page.url()).origin;
    const references = await page.evaluate(() => {
      const set = new Set();
      const add = (value) => {
        if (!value) return;
        try { set.add(new URL(value, document.baseURI).href); } catch {}
      };
      document.querySelectorAll("img").forEach((el) => {
        add(el.currentSrc || el.src);
        add(el.getAttribute("src"));
        (el.getAttribute("srcset") || "").split(",").forEach((part) => add(part.trim().split(/\s+/)[0]));
      });
      document.querySelectorAll('link[rel*="icon" i],link[rel*="apple-touch" i],link[rel*="mask-icon" i]').forEach((el) => add(el.getAttribute("href")));
      document.querySelectorAll('meta[property="og:image" i],meta[name="twitter:image" i]').forEach((el) => add(el.getAttribute("content")));
      return [...set];
    });

    const urls = [...new Set([
      ...knownPaths.map((item) => new URL(item, origin).href),
      ...references.filter((item) => /logo|mark|brand|icon|favicon|\.(svg|png|jpe?g|webp|ico)(\?|$)/i.test(item)),
    ])].slice(0, 100);

    const download = async (assetUrl) => {
      try {
        const response = await context.request.get(assetUrl, { timeout: 10000, failOnStatusCode: false, headers: { "user-agent": "Mozilla/5.0 IQ-logo-export" } });
        if (response.status() < 200 || response.status() >= 300) return;
        const contentType = response.headers()["content-type"] || "";
        if (!/image|svg|icon|octet-stream/i.test(contentType) && !/\.(svg|png|jpe?g|webp|ico)(\?|$)/i.test(assetUrl)) return;
        const body = await response.body();
        if (!body || body.length < 64 || body.length > 10_000_000) return;
        const hash = createHash("sha256").update(body).digest("hex");
        if (seen.has(hash)) return;
        seen.add(hash);
        const file = `${String(manifest.assets.length + 1).padStart(2, "0")}-${safe(new URL(assetUrl).pathname)}${extFor(contentType, assetUrl)}`;
        await writeFile(path.join(dir, file), body);
        manifest.assets.push({ file, sourceUrl: assetUrl, contentType, bytes: body.length, sha256: hash });
      } catch (error) {
        manifest.errors.push({ stage: "download", sourceUrl: assetUrl, message: String(error?.message || error) });
      }
    };

    for (let index = 0; index < urls.length; index += 12) {
      await Promise.all(urls.slice(index, index + 12).map(download));
    }

    const candidates = await page.evaluate((productName) => {
      const product = productName.toLowerCase();
      const output = [];
      let id = 0;
      for (const el of document.querySelectorAll("img,svg,a,button,div,span,h1,h2,h3")) {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        if (rect.width < 12 || rect.height < 12 || rect.width > 800 || rect.height > 350) continue;
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;
        const info = [el.tagName, el.id, el.className?.baseVal ?? el.className, el.getAttribute("alt"), el.getAttribute("aria-label"), el.getAttribute("title"), el.getAttribute("src"), el.textContent].filter(Boolean).join(" ").toLowerCase();
        const parent = [el.parentElement?.id, el.parentElement?.className?.baseVal ?? el.parentElement?.className, el.parentElement?.textContent].filter(Boolean).join(" ").toLowerCase();
        let score = 0;
        if (info.includes(product)) score += 100;
        if (/logo|wordmark|brand|mark/i.test(info)) score += 75;
        if (/logo|wordmark|brand|mark/i.test(parent)) score += 30;
        if (el.tagName === "IMG") score += 30;
        if (el.tagName === "SVG") score += 25;
        if ((el.textContent || "").trim().toLowerCase() === product) score += 100;
        if (el.closest("header,nav,aside,form")) score += 20;
        if (rect.top < 300) score += 10;
        if (rect.width * rect.height > 120000) score -= 70;
        if (score < 45) continue;
        const exportId = `iq-fast-${id++}`;
        el.setAttribute("data-iq-fast-id", exportId);
        output.push({ exportId, score, tag: el.tagName, width: Math.round(rect.width), height: Math.round(rect.height), text: (el.textContent || "").trim().slice(0, 140), info: info.slice(0, 260) });
      }
      return output.sort((a, b) => b.score - a.score).slice(0, 12);
    }, name);

    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index];
      try {
        const locator = page.locator(`[data-iq-fast-id="${candidate.exportId}"]`);
        const file = `capture-${String(index + 1).padStart(2, "0")}-${candidate.tag.toLowerCase()}-${candidate.score}.png`;
        await locator.screenshot({ path: path.join(dir, file), omitBackground: true, animations: "disabled", timeout: 10000 });
        manifest.captures.push({ file, ...candidate });
        if (candidate.tag === "SVG") {
          await writeFile(path.join(dir, file.replace(/\.png$/, ".svg")), await locator.evaluate((node) => node.outerHTML), "utf8");
        }
      } catch (error) {
        manifest.errors.push({ stage: "capture", message: String(error?.message || error), candidate });
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
await writeFile(path.join(root, "README.txt"), "Logo candidates collected from the seven IQ product websites in the STK Sales Demo Sheet.\n", "utf8");
