import fs from "fs";
import matter from "gray-matter";
import path from "path";

export type Post = {
  metadata: PostMetadata;
  content: string;
};

export type PostMetadata = {
  title?: string;
  summary?: string;
  image?: string;
  publishedAt?: string;
  slug: string;
};

export async function getPostBySlug(
  rootDirectory: string,
  slug: string,
): Promise<Post | null> {
  try {
    const filePath = path.join(rootDirectory, `${slug}.mdx`);
    const fileContents = await fs.promises.readFile(filePath, { encoding: "utf-8" });
    const { data, content } = matter(fileContents);

    return { metadata: { ...data, slug }, content };
  } catch (error) {
    return null;
  }
}

export async function getPosts(
  rootDirectory: string,
  limit?: number,
): Promise<PostMetadata[]> {
  const files = await fs.promises.readdir(rootDirectory);

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx")) // might have .DS_Store?
      .map((file) => getPostMetaData(rootDirectory, file))
  );

  posts.sort(
    (a, b) =>
      (new Date(b.publishedAt ?? "").getTime() || 0) -
      (new Date(a.publishedAt ?? "").getTime() || 0),
  );

  if (limit) {
    return posts.slice(0, limit);
  }

  return posts;
}

export async function getPostMetaData(
  rootDirectory: string,
  filePath: string,
): Promise<PostMetadata> {
  const slug = filePath.replace(/\.mdx$/, "");
  const fullFilePath = path.join(rootDirectory, filePath);
  const fileContent = await fs.promises.readFile(fullFilePath, { encoding: "utf8" });
  const { data } = matter(fileContent);

  return { ...data, slug };
}