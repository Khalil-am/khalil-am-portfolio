import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { siteConfig, SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Calistoga, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: SITE_URL }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
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
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: siteConfig.name,
  url: SITE_URL,
  image: siteConfig.image,
  jobTitle: siteConfig.jobTitle,
  worksFor: {
    "@type": "Organization",
    name: siteConfig.employer.name,
    url: siteConfig.employer.url,
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.location.city,
    addressCountry: siteConfig.location.country,
  },
  email: `mailto:${siteConfig.email}`,
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "University of Jordan",
      url: "https://www.ju.edu.jo",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "National University of Malaysia (UKM)",
      url: "https://www.ukm.my",
    },
  ],
  sameAs: [siteConfig.socials.linkedin, siteConfig.socials.github],
  knowsAbout: [
    "Business Analysis",
    "Product Ownership",
    "Artificial Intelligence",
    "Business Intelligence",
    "Data Science",
    "Digital Transformation",
    "Enterprise Consulting",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: siteConfig.name,
  url: SITE_URL,
  description: siteConfig.description,
  publisher: { "@id": `${SITE_URL}/#person` },
  inLanguage: "en",
};

function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
      className={cn(
        "mx-auto flex min-h-screen max-w-3xl flex-col px-8 font-sans antialiased",
        inter.variable,
        calistoga.variable,
      )}
    >
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd) }}
    />
    <Providers>
      <Header />
      <main className="grow">{children}</main>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </Providers>
    </body>
    </html>
  );
}
