import { siteConfig, SITE_URL } from "@/lib/site";
import type { Metadata } from "next";

export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/opengraph-image`;

export function absoluteUrl(pathname = ""): string {
  if (!pathname || pathname === "/") return SITE_URL;
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  locale?: string;
  image?: string;
  type?: "website" | "article";
  languages?: Record<string, string>;
  absoluteTitle?: boolean;
};

/** Build complete, self-canonical page metadata without inheriting stale social fields. */
export function pageMetadata({
  title,
  description,
  path,
  locale = "en_US",
  image = DEFAULT_SOCIAL_IMAGE,
  type = "website",
  languages,
  absoluteTitle = false,
}: PageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const socialTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      type,
      url: canonical,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      locale,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} — ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [{ url: image, alt: `${title} — ${siteConfig.name}` }],
    },
  };
}
