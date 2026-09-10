import "./globals.css";

import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";
import { siteConfig, SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import { Calistoga, Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

const notFoundTitle = "Page not found | Khalil Abu Mushref";
const notFoundDescription =
  "The requested page could not be found. Return to Khalil Abu Mushref's official portfolio.";
const notFoundCanonical = `${SITE_URL}/404`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: notFoundTitle },
  description: notFoundDescription,
  alternates: { canonical: notFoundCanonical },
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    type: "website",
    url: notFoundCanonical,
    siteName: siteConfig.name,
    title: notFoundTitle,
    description: notFoundDescription,
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
    title: notFoundTitle,
    description: notFoundDescription,
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        alt: `${siteConfig.name} — Principal Product Manager and AI product leader`,
      },
    ],
  },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr">
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          inter.variable,
          calistoga.variable,
        )}
      >
        <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-16 sm:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-muted/80 to-transparent"
          />
          <article className="w-full max-w-2xl rounded-3xl border bg-background/95 p-7 shadow-sm sm:p-12">
            <div className="grid items-center gap-8 sm:grid-cols-[9rem_1fr]">
              <Image
                src="/cryingbee.png"
                alt=""
                width={144}
                height={144}
                priority
                className="mx-auto size-28 object-contain sm:size-36"
              />

              <div className="text-center sm:text-left">
                <p className="font-serif text-sm tracking-[0.3em] text-muted-foreground">
                  ERROR 404
                </p>
                <h1 className="title mt-3 text-4xl sm:text-5xl">
                  Page not found
                </h1>
                <p className="mt-4 leading-7 text-muted-foreground">
                  The page may have moved, changed its address, or never
                  existed. You can continue from the portfolio homepage.
                </p>
                <p
                  lang="ar"
                  dir="rtl"
                  className="mt-3 leading-7 text-muted-foreground"
                >
                  الصفحة التي تبحث عنها غير موجودة. يمكنك العودة إلى الصفحة
                  الرئيسية ومتابعة التصفح.
                </p>
              </div>
            </div>

            <nav
              aria-label="Page recovery"
              className="mt-9 flex flex-col justify-center gap-3 border-t pt-7 sm:flex-row"
            >
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <ArrowLeftIcon aria-hidden="true" className="size-4" />
                Back to homepage
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 py-2.5 font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <EnvelopeClosedIcon aria-hidden="true" className="size-4" />
                Contact Khalil
              </Link>
              <Link
                href="/ar"
                hrefLang="ar"
                lang="ar"
                dir="rtl"
                className="inline-flex min-h-11 items-center justify-center rounded-full border px-5 py-2.5 font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                الصفحة العربية
              </Link>
            </nav>
          </article>
        </main>
      </body>
    </html>
  );
}
