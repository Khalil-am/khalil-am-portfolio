import LinkWithIcon from "@/components/LinkWithIcon";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Page not found | Khalil Abu Mushref" },
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function NotFound() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <div className="min-h-full px-4 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="mx-auto max-w-max text-center">
          <Image src="/cryingbee.png" alt="" width={150} height={150} />
          <section className="sm:flex">
            <p className="title leading-loose text-muted-foreground">404</p>
            <div className="sm:ml-6">
              <div className="leading-loose sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="title leading-loose sm:text-5xl">
                  Oops! We couldn&apos;t find the page
                </h1>
                <p className="mt-1 text-base leading-loose text-muted-foreground">
                  The page you&apos;re looking for seems to be missing or
                  renamed. Let&apos;s get you back on track!
                </p>
              </div>
              <div className="mt-10 flex justify-center space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <LinkWithIcon
                  href="/"
                  text="Back to home"
                  icon={<ArrowLeftIcon className="size-5" />}
                  position="left"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
