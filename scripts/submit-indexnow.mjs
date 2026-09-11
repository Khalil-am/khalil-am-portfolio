#!/usr/bin/env node

const SITE_URL = "https://www.khalil-am.com";
const INDEXNOW_KEY = "c153c010a761a4809d066cc13e84baf1";
const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const inputs = process.argv.slice(2);

if (!inputs.length) {
  throw new Error(
    "Provide changed/deleted URLs (for example: npm run submit:indexnow -- / /about) or pass --all for an intentional full-sitemap submission.",
  );
}

if (inputs.includes("--all") && inputs.length !== 1) {
  throw new Error("Use --all by itself, or provide an explicit URL list.");
}

let urlList;
if (inputs[0] === "--all") {
  const sitemapResponse = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!sitemapResponse.ok) {
    throw new Error(
      `Could not read the production sitemap (${sitemapResponse.status})`,
    );
  }

  const sitemapXml = await sitemapResponse.text();
  urlList = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    ([, url]) => url,
  );
} else {
  urlList = inputs.map((input) => new URL(input, SITE_URL).href);
}

urlList = [...new Set(urlList)];

if (!urlList.length) {
  throw new Error("No URLs were supplied for IndexNow");
}

for (const url of urlList) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.host !== new URL(SITE_URL).host) {
    throw new Error(`IndexNow URL must use the canonical site host: ${url}`);
  }
}

const keyResponse = await fetch(INDEXNOW_KEY_LOCATION);
if (!keyResponse.ok || (await keyResponse.text()).trim() !== INDEXNOW_KEY) {
  throw new Error("The production IndexNow key file is missing or invalid");
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList,
  }),
});

if (![200, 202].includes(response.status)) {
  const body = await response.text();
  throw new Error(
    `IndexNow rejected the submission (${response.status}): ${body}`,
  );
}

if (response.status === 200) {
  console.log(`IndexNow received ${urlList.length} canonical URLs (200).`);
} else {
  console.log(
    `IndexNow received ${urlList.length} canonical URLs; key validation is pending (202).`,
  );
}
