/* eslint-disable @next/next/no-head-element -- Shared App Router root layouts intentionally render the document head. */

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { jsonLdScript, personJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Calistoga, Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

export default function SiteDocument({
  children,
  language,
}: {
  children: ReactNode;
  language: "en" | "ar";
}) {
  const isArabic = language === "ar";

  return (
    <html lang={language} dir={isArabic ? "rtl" : "ltr"}>
      <head>
        <link rel="me" href={siteConfig.socials.linkedin} />
        <link rel="me" href={siteConfig.socials.github} />
        <link rel="me" href={siteConfig.socials.huggingFace} />
      </head>
      <body
        className={cn(
          "mx-auto flex min-h-screen max-w-3xl flex-col px-4 font-sans antialiased sm:px-8",
          inter.variable,
          calistoga.variable,
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd()) }}
        />
        <a
          href="#main-content"
          className="sr-only z-[100] rounded-md bg-background px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {isArabic ? "انتقل إلى المحتوى الرئيسي" : "Skip to main content"}
        </a>
        <Providers>
          <Header language={language} />
          <main id="main-content" className="grow">
            {children}
          </main>
          <Footer language={language} />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
