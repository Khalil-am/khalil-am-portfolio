import { Button } from "@/components/ui/Button";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  jsonLdScript,
  profilePageJsonLd,
} from "@/lib/jsonld";
import { getPosts } from "@/lib/posts";
import { pageMetadata } from "@/lib/seo";
import { PAGE_LAST_MODIFIED, siteConfig, SITE_URL } from "@/lib/site";
import { ArrowRightIcon, FileDown } from "lucide-react";
import Link from "next/link";
import path from "path";

const description =
  "Meet Khalil Abu Mushref, Principal Product Manager, Product Owner, and AI product leader at Digital Next working across Riyadh and Abu Dhabi.";

export const metadata = pageMetadata({
  title: "About & Professional Profile",
  description,
  path: "/about",
  languages: {
    en: `${SITE_URL}/about`,
    ar: `${SITE_URL}/ar`,
    "x-default": `${SITE_URL}/about`,
  },
});

const expertise = [
  "Product strategy and discovery",
  "Product ownership and delivery governance",
  "AI-enabled products and agentic workflows",
  "Business analysis and requirements",
  "Business intelligence and data products",
  "Government, healthcare, and fintech platforms",
];

const faqs = [
  {
    question: "Who is Khalil Abu Mushref?",
    answer:
      "Khalil Abu Mushref is a Principal Product Manager, Product Owner, and product team lead at Digital Next. He works across Riyadh and Abu Dhabi on enterprise digital products and AI-enabled product strategy.",
  },
  {
    question: "What does Khalil Abu Mushref do?",
    answer:
      "He turns enterprise strategy into shipped products through discovery, roadmaps, requirements, delivery governance, stakeholder alignment, and measurable product outcomes.",
  },
  {
    question: "What is Khalil Abu Mushref's professional background?",
    answer:
      "His experience spans product management, product ownership, business analysis, business intelligence, data science, and software delivery. He has worked across government, healthcare, finance, and enterprise technology since 2019.",
  },
  {
    question: "Where does Khalil Abu Mushref work?",
    answer:
      "Khalil works at Digital Next and operates across Riyadh, Saudi Arabia, and Abu Dhabi, United Arab Emirates.",
  },
  {
    question: "How can I contact Khalil Abu Mushref?",
    answer: `Use the contact page or email ${siteConfig.email} for professional inquiries, collaboration, and product leadership conversations.`,
  },
];

const blogDirectory = path.join(process.cwd(), "content");

export default async function AboutPage() {
  const recentPosts = await getPosts(blogDirectory, 5);
  const pageUrl = `${SITE_URL}/about`;

  return (
    <article className="mt-8 flex flex-col gap-12 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            profilePageJsonLd({
              path: "/about",
              language: "en",
              displayName: `About ${siteConfig.name}`,
              dateModified: PAGE_LAST_MODIFIED.about,
              recentPosts,
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
              { name: "About Khalil Abu Mushref", path: "/about" },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(faqPageJsonLd(pageUrl, faqs)),
        }}
      />

      <header className="space-y-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Official profile
        </p>
        <h1 className="title text-4xl sm:text-5xl">About Khalil Abu Mushref</h1>
        <p className="max-w-2xl text-lg leading-relaxed">
          Khalil Abu Mushref is a Principal Product Manager, Product Owner, and
          product team lead at Digital Next. Working across Riyadh and Abu
          Dhabi, he leads enterprise product work that connects AI strategy,
          business requirements, delivery governance, and measurable outcomes.
        </p>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          His career has moved from software and data science into business
          intelligence, business analysis, product ownership, and product
          leadership. Since 2019, he has worked across government, healthcare,
          fintech, and complex enterprise environments.
        </p>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Khalil Abu Mushref also publishes online as <strong>Khalil AM</strong>
          .
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/contact">
              Contact Khalil
              <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <a
              href="/Khalil_Abu_Mushref_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV
              <FileDown className="ml-2 size-4" />
            </a>
          </Button>
          <Link
            className="link self-center text-sm font-semibold"
            href="/ar"
            hrefLang="ar"
          >
            الملف الشخصي بالعربية
          </Link>
        </div>
      </header>

      <section aria-labelledby="profile-facts" className="space-y-5">
        <h2 id="profile-facts" className="title text-3xl">
          Professional profile
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-5">
            <dt className="text-sm text-muted-foreground">Current role</dt>
            <dd className="mt-1 font-semibold">{siteConfig.jobTitle}</dd>
            <dd>
              <Link
                className="link text-sm"
                href={siteConfig.employer.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {siteConfig.employer.name}
              </Link>
            </dd>
          </div>
          <div className="rounded-lg border p-5">
            <dt className="text-sm text-muted-foreground">Primary locations</dt>
            <dd className="mt-1 font-semibold">Riyadh and Abu Dhabi</dd>
            <dd className="text-sm text-muted-foreground">
              Saudi Arabia and the UAE
            </dd>
          </div>
          <div className="rounded-lg border p-5">
            <dt className="text-sm text-muted-foreground">Education</dt>
            <dd className="mt-1 font-semibold">
              Computing (AI) and Computer Engineering
            </dd>
            <dd className="text-sm text-muted-foreground">
              UKM (master&apos;s expected 2026) and University of Jordan
            </dd>
          </div>
          <div className="rounded-lg border p-5">
            <dt className="text-sm text-muted-foreground">Career foundation</dt>
            <dd className="mt-1 font-semibold">
              Product, consulting, BI, and data science
            </dd>
            <dd className="text-sm text-muted-foreground">
              Professional experience since 2019
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="expertise" className="space-y-5">
        <h2 id="expertise" className="title text-3xl">
          Areas of expertise
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {expertise.map((item) => (
            <li key={item} className="rounded-lg border px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
        <p>
          See the evidence in Khalil&apos;s{" "}
          <Link className="link" href="/projects">
            product portfolio
          </Link>
          ,{" "}
          <Link className="link" href="/bi">
            business intelligence work
          </Link>
          , and{" "}
          <Link className="link" href="/blog">
            first-hand articles and case studies
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="recent-articles" className="space-y-5">
        <h2 id="recent-articles" className="title text-3xl">
          Recent first-hand articles
        </h2>
        <ul className="space-y-3">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link className="link font-semibold" href={`/blog/${post.slug}`}>
                {post.title ?? post.slug}
              </Link>
              {post.publishedAt ? (
                <time
                  className="ml-2 text-sm text-muted-foreground"
                  dateTime={new Date(post.publishedAt).toISOString()}
                >
                  {new Intl.DateTimeFormat("en", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(post.publishedAt))}
                </time>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="about-faq" className="space-y-6">
        <h2 id="about-faq" className="title text-3xl">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
