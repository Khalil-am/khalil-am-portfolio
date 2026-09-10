import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";
import { siteConfig, SITE_URL } from "@/lib/site";
import type { Metadata } from "next";

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: `${SITE_URL}/about` }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Khalil Abu Mushref — Blog" },
      ],
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    locale: "en_US",
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Principal Product Manager and AI product leader`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        alt: `${siteConfig.name} — Principal Product Manager and AI product leader`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "k2m3xNOYGngOTpHpYqMWOgynytDrKugHM1g9TsWjyhA",
  },
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
};
