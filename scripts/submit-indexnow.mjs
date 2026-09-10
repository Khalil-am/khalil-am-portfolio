#!/usr/bin/env node

const SITE_URL = "https://www.khalil-am.com";
const INDEXNOW_KEY = "c153c010a761a4809d066cc13e84baf1";

const sitemapResponse = await fetch(`${SITE_URL}/sitemap.xml`);
if (!sitemapResponse.ok) {
  throw new Error(
    `Could not read the production sitemap (${sitemapResponse.status})`,
  );
}

const sitemapXml = await sitemapResponse.text();
const urlList = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  ([, url]) => url,
);

if (!urlList.length) {
  throw new Error("The production sitemap contained no URLs");
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  }),
});

if (![200, 202].includes(response.status)) {
  const body = await response.text();
  throw new Error(
    `IndexNow rejected the submission (${response.status}): ${body}`,
  );
}

console.log(
  `IndexNow accepted ${urlList.length} canonical URLs (${response.status}).`,
);
