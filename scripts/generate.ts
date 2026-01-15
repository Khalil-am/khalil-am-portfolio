import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { DocumentInterface } from "@langchain/core/documents";
import { Redis } from "@upstash/redis";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

async function generateEmbeddings() {
  const redis = Redis.fromEnv();

  // Clear existing data
  await redis.flushdb();

  const routeLoader = new DirectoryLoader(
    "src/app",
    {
      ".tsx": (path) => new TextLoader(path),
    },
    true,
  );

  // Load routes
  const routes = (await routeLoader.load())
    .filter((route) => route.metadata.source.endsWith("page.tsx"))
    .map((route): DocumentInterface => {
      const url =
        route.metadata.source
          .replace(/\\/g, "/")
          .split("/src/app")[1]
          .split("/page.tsx")[0] || "/";

      const pageContentTrimmed = route.pageContent
        .replace(/^import.*$/gm, "")
        .replace(/ className=(["']).*?\1| className={.*?}/g, "")
        .replace(/^\s*[\r]/gm, "")
        .trim();

      return { pageContent: pageContentTrimmed, metadata: { url } };
    });

  const routesSplitter = RecursiveCharacterTextSplitter.fromLanguage("html");
  const splitRoutes = await routesSplitter.splitDocuments(routes);

  // Resume data
  const dataLoader = new DirectoryLoader("src/data", {
    ".json": (path) => new TextLoader(path),
  });

  const data = await dataLoader.load();
  const dataSplitter = RecursiveCharacterTextSplitter.fromLanguage("js");
  const splitData = await dataSplitter.splitDocuments(data);

  // Blog posts
  const postLoader = new DirectoryLoader(
    "content",
    {
      ".mdx": (path) => new TextLoader(path),
    },
    true,
  );

  const posts = (await postLoader.load())
    .filter((post) => post.metadata.source.endsWith(".mdx"))
    .map((post): DocumentInterface => {
      const pageContentTrimmed = post.pageContent.split("---")[1];
      return { pageContent: pageContentTrimmed, metadata: post.metadata };
    });

  const postSplitter = RecursiveCharacterTextSplitter.fromLanguage("markdown");
  const splitPosts = await postSplitter.splitDocuments(posts);

  // Store all documents in Redis
  const allDocuments = [...splitRoutes, ...splitData, ...splitPosts];

  for (let i = 0; i < allDocuments.length; i++) {
    const doc = allDocuments[i];
    await redis.set(`doc:${i}`, JSON.stringify(doc));
  }

  await redis.set("doc:count", allDocuments.length);

  console.log(`✅ Generated and stored ${allDocuments.length} document chunks`);
}

generateEmbeddings();
