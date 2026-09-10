import type { Metadata } from "next";
import { breadcrumbJsonLd, jsonLdScript, webPageJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

const description =
  "Privacy information for khalil-am.com, including contact-form data, AI chat processing, site analytics, service providers, retention, and privacy choices.";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description,
  path: "/privacy",
});

const lastUpdated = "10 September 2026";

export default function PrivacyPolicy() {
  return (
    <article className="prose mt-8 pb-16 dark:prose-invert">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            webPageJsonLd({
              name: "Privacy Policy",
              description,
              path: "/privacy",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: "Home", path: "" },
              { name: "Privacy Policy", path: "/privacy" },
            ]),
          ),
        }}
      />
      <div className="space-y-4">
        <h1 className="title text-5xl">Privacy Policy</h1>
        <p>Last Updated: {lastUpdated}</p>
      </div>
      <div className="space-y-4">
        <h2 className="title text-3xl">Overview</h2>
        <p>
          This policy explains how khalil-am.com handles information when you
          browse the portfolio, send a message, or use the optional AI
          assistant. Khalil Abu Mushref is the site owner and the contact for
          privacy questions.
        </p>
        <h2 className="title">What Information I Collect</h2>
        <p>
          Most pages are public and can be read without creating an account. The
          site processes limited information in the following situations:
        </p>
        <h3>Contact form</h3>
        <p>
          If you submit the contact form, the site processes your name, email
          address, and message so Khalil can receive and respond to your
          inquiry. The message is transmitted using Mailgun&apos;s email
          infrastructure.
        </p>
        <h3>AI assistant</h3>
        <p>
          If you use the AI assistant, the text you submit is sent to
          OpenAI&apos;s API to generate a response. Do not include confidential,
          sensitive, or personal information in a chat message. The site does
          not intentionally use those messages to build a visitor profile.
        </p>
        <h3>Analytics and performance</h3>
        <p>
          Vercel Analytics and Speed Insights provide aggregated usage and
          technical performance measurements, such as page visits, device or
          browser category, approximate location, loading performance, and error
          diagnostics. These measurements help maintain and improve the site.
        </p>
        <h2 className="title">How I Use the Info</h2>
        <p>Here’s what I might do with the data I collect:</p>
        <ul>
          <li>Ensure the site runs smoothly</li>
          <li>Respond to your questions or feedback</li>
          <li>Operate the AI assistant when you choose to use it</li>
          <li>Protect the site and services from misuse</li>
        </ul>
        <h2 className="title">Service Providers and Transfers</h2>
        <p>
          Information is shared only as needed with service providers that
          operate this site: Vercel for hosting and performance analytics,
          OpenAI for the optional AI assistant, and Mailgun for contact-form
          email delivery. These providers may process information in countries
          other than your own under their respective terms and privacy
          safeguards. Personal information is not sold.
        </p>
        <h2 className="title">Retention</h2>
        <p>
          Contact messages may be retained in email records for as long as
          reasonably needed to respond, maintain professional records, or meet
          legal obligations. Analytics and AI-provider records are retained
          according to the applicable provider settings and policies. Data that
          is no longer needed is deleted or allowed to expire where reasonably
          possible.
        </p>
        <h2 className="title">Security</h2>
        <p>
          I take reasonable steps to protect your data, but no system is 100%
          secure.
        </p>
        <h2 className="title">Your Choices</h2>
        <p>
          You may ask to access, correct, or delete personal information you
          have submitted, subject to applicable law and necessary
          record-keeping. You can browse the public portfolio without using the
          contact form or AI assistant. Browser controls may also limit storage
          or tracking technologies.
        </p>
        <h2 className="title">Policy Updates</h2>
        <p>
          This policy was last updated on <b>{lastUpdated}</b>. Material changes
          will be published on this page.
        </p>
        <h2 className="title">Got Questions?</h2>
        <p>
          If you have questions or concerns, feel free to contact me at{" "}
          <Link href="mailto:Khalil-am@outlook.com">Khalil-am@outlook.com</Link>{" "}
          or use the <Link href="/contact">contact form</Link>.
        </p>
      </div>
    </article>
  );
}
