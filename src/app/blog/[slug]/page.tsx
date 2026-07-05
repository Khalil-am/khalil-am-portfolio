import LinkWithIcon from "@/components/LinkWithIcon";
import MDXContent from "@/components/MDXContent";
import { getPostBySlug, getPosts } from "@/lib/posts";
import { siteConfig, SITE_URL } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import fs from "fs";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import path from "path";

const blogDirectory = path.join(process.cwd(), "content");

function resolvePublicImage(image: string | undefined): string | undefined {
  if (!image) return undefined;
  const exists = fs.existsSync(path.join(process.cwd(), "public", image));
  return exists ? image : undefined;
}

interface PostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await getPosts(blogDirectory);
  const slugs = posts.map((post) => ({ slug: post.slug }));

  return slugs;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(blogDirectory, params.slug);

  if (!post) {
    return {};
  }

  const { title, summary, publishedAt } = post.metadata;
  const image = resolvePublicImage(post.metadata.image);
  const url = `/blog/${params.slug}`;

  return {
    title,
    description: summary,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title,
      description: summary,
      publishedTime: publishedAt,
      authors: [siteConfig.name],
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
    },
  };
}

function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function Post({ params }: PostPageProps) {
  const { slug } = params;
  const post = await getPostBySlug(blogDirectory, slug);

  if (!post) {
    notFound();
  }

  const { metadata, content } = post;
  const { title, summary, publishedAt } = metadata;
  const image = resolvePublicImage(metadata.image);
  const postUrl = `${SITE_URL}/blog/${slug}`;

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: summary,
    url: postUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    ...(image ? { image: `${SITE_URL}${image}` } : {}),
    ...(publishedAt
      ? { datePublished: new Date(publishedAt).toISOString() }
      : {}),
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
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
        <p className="mt-2 text-xs text-muted-foreground">
          {publishedAt ? (
            <time dateTime={new Date(publishedAt).toISOString()}>
              {formatDate(publishedAt)}
            </time>
          ) : null}
        </p>
      </header>

      <div className="prose dark:prose-invert">
        <MDXContent source={content} />
      </div>
    </article>
  );
}
