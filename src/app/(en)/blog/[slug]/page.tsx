import LinkWithIcon from "@/components/LinkWithIcon";
import MDXContent from "@/components/MDXContent";
import { extractFaq, faqPageJsonLd, jsonLdScript } from "@/lib/jsonld";
import { getPostBySlug, getPosts } from "@/lib/posts";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, SITE_URL } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import fs from "fs";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "path";

const blogDirectory = path.join(process.cwd(), "content");

function resolvePublicImage(image: string | undefined): string | undefined {
  if (!image) return undefined;
  const exists = fs.existsSync(path.join(process.cwd(), "public", image));
  return exists ? image : undefined;
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts(blogDirectory);
  const slugs = posts.map((post) => ({ slug: post.slug }));

  return slugs;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(blogDirectory, slug);

  if (!post) {
    return {};
  }

  const { title, summary, publishedAt, updatedAt } = post.metadata;
  const image = resolvePublicImage(post.metadata.image);
  const url = `/blog/${slug}`;
  const socialImage = `${SITE_URL}${url}/opengraph-image`;
  const baseMetadata = pageMetadata({
    title: title ?? "Article",
    description: summary ?? `An article by ${siteConfig.name}.`,
    path: url,
    type: "article",
    image: socialImage,
    absoluteTitle: true,
  });

  return {
    ...baseMetadata,
    authors: [{ name: siteConfig.name, url: `${SITE_URL}/about` }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "Technology",
    openGraph: {
      ...baseMetadata.openGraph,
      type: "article",
      publishedTime: publishedAt,
      ...(updatedAt ? { modifiedTime: updatedAt } : {}),
      authors: [`${SITE_URL}/about`],
    },
  };
}

export default async function Post({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(blogDirectory, slug);

  if (!post) {
    notFound();
  }

  const { metadata, content } = post;
  const { title, summary, publishedAt, updatedAt } = metadata;
  const image = resolvePublicImage(metadata.image);
  const postUrl = `${SITE_URL}/blog/${slug}`;
  const allPosts = await getPosts(blogDirectory);
  const currentIndex = allPosts.findIndex((item) => item.slug === slug);
  const relatedPosts = [
    allPosts[(currentIndex - 1 + allPosts.length) % allPosts.length],
    allPosts[(currentIndex + 1) % allPosts.length],
  ].filter(
    (item, index, items) =>
      item &&
      item.slug !== slug &&
      items.findIndex((other) => other?.slug === item.slug) === index,
  );
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: title,
    description: summary,
    url: postUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    ...(image ? { image: `${SITE_URL}${image}` } : {}),
    ...(publishedAt
      ? { datePublished: new Date(publishedAt).toISOString() }
      : {}),
    ...(updatedAt || publishedAt
      ? { dateModified: new Date(updatedAt ?? publishedAt!).toISOString() }
      : {}),
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/blog#blog` },
    copyrightHolder: { "@id": `${SITE_URL}/#person` },
    wordCount,
    inLanguage: "en",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      { "@type": "ListItem", position: 3, name: title, item: postUrl },
    ],
  };

  const faqItems = extractFaq(content);

  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }}
      />
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(faqPageJsonLd(postUrl, faqItems)),
          }}
        />
      )}
      <LinkWithIcon
        href="/blog"
        position="left"
        icon={<ArrowLeftIcon className="size-5" />}
        text="back to blog"
      />

      {image && (
        <div className="relative mb-6 h-96 w-full overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={`Cover image for ${title}`}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      <header>
        <h1 className="title">{title}</h1>
        {summary ? (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {summary}
          </p>
        ) : null}
        <p className="mt-4 text-sm text-muted-foreground">
          By{" "}
          <Link className="link font-semibold" href="/about" rel="author">
            {siteConfig.name}
          </Link>
          {" · "}
          {publishedAt ? (
            <time dateTime={new Date(publishedAt).toISOString()}>
              Published {formatDate(publishedAt)}
            </time>
          ) : null}
          {updatedAt && updatedAt !== publishedAt ? (
            <>
              {" · "}
              <time dateTime={new Date(updatedAt).toISOString()}>
                Updated {formatDate(updatedAt)}
              </time>
            </>
          ) : null}
        </p>
      </header>

      <div className="prose dark:prose-invert">
        <MDXContent source={content} />
      </div>

      {relatedPosts.length > 0 ? (
        <aside aria-labelledby="more-from-khalil" className="border-t pt-8">
          <h2 id="more-from-khalil" className="title text-2xl">
            More from Khalil Abu Mushref
          </h2>
          <ul className="mt-4 space-y-3">
            {relatedPosts.map((related) => (
              <li key={related.slug}>
                <Link
                  className="link font-semibold"
                  href={`/blog/${related.slug}`}
                >
                  {related.title ?? related.slug}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </article>
  );
}
