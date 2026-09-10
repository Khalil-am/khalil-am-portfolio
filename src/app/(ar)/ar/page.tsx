import { Button } from "@/components/ui/Button";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  jsonLdScript,
  profilePageJsonLd,
} from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, SITE_URL } from "@/lib/site";
import { ArrowLeft, FileDown } from "lucide-react";
import Link from "next/link";

const description =
  "الملف الرسمي لخليل أبو مشرف، مدير منتجات رئيسي ومالك منتج وقائد فريق في Digital Next، يعمل بين الرياض وأبوظبي في المنتجات الرقمية والذكاء الاصطناعي.";

export const metadata = pageMetadata({
  title: "خليل أبو مشرف | مدير منتجات رئيسي وقيادة منتجات الذكاء الاصطناعي",
  description,
  path: "/ar",
  locale: "ar_SA",
  absoluteTitle: true,
  languages: {
    en: `${SITE_URL}/about`,
    ar: `${SITE_URL}/ar`,
    "x-default": `${SITE_URL}/about`,
  },
});

const faqs = [
  {
    question: "من هو خليل أبو مشرف؟",
    answer:
      "خليل أبو مشرف هو مدير منتجات رئيسي ومالك منتج وقائد فريق في Digital Next. يعمل بين الرياض وأبوظبي على المنتجات الرقمية المؤسسية واستراتيجية المنتجات المدعومة بالذكاء الاصطناعي.",
  },
  {
    question: "ما مجال عمل خليل أبو مشرف؟",
    answer:
      "يحوّل خليل الاستراتيجية المؤسسية إلى منتجات قابلة للتنفيذ عبر الاستكشاف، وخرائط الطريق، وتحليل المتطلبات، وحوكمة التسليم، ومواءمة أصحاب المصلحة، وقياس النتائج.",
  },
  {
    question: "ما خبرات خليل أبو مشرف؟",
    answer:
      "تشمل خبراته إدارة المنتجات وملكية المنتج وتحليل الأعمال وذكاء الأعمال وعلوم البيانات وتسليم البرمجيات، مع خبرة في القطاعات الحكومية والصحية والمالية والتقنية منذ عام 2019.",
  },
  {
    question: "أين يعمل خليل أبو مشرف؟",
    answer:
      "يعمل خليل لدى Digital Next، ويمارس عمله عبر الرياض في المملكة العربية السعودية وأبوظبي في دولة الإمارات العربية المتحدة.",
  },
  {
    question: "كيف يمكن التواصل مع خليل أبو مشرف؟",
    answer: `يمكن التواصل عبر صفحة الاتصال أو البريد الإلكتروني ${siteConfig.email} للاستفسارات المهنية وفرص التعاون وقيادة المنتجات.`,
  },
];

export default function ArabicProfilePage() {
  const pageUrl = `${SITE_URL}/ar`;

  return (
    <article
      lang="ar"
      dir="rtl"
      className="mt-8 flex flex-col gap-12 pb-16 text-right"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            profilePageJsonLd({
              path: "/ar",
              language: "ar",
              displayName: "الملف الرسمي لخليل أبو مشرف",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: "الرئيسية", path: "" },
              { name: "خليل أبو مشرف", path: "/ar" },
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
        <p className="text-sm font-semibold tracking-wide text-muted-foreground">
          الملف الشخصي الرسمي
        </p>
        <h1 className="title text-4xl leading-tight sm:text-5xl">
          خليل أبو مشرف
        </h1>
        <p className="max-w-2xl text-lg leading-9">
          خليل أبو مشرف (Khalil Abu Mushref) هو مدير منتجات رئيسي ومالك منتج
          وقائد فريق في Digital Next. يعمل بين الرياض وأبوظبي، ويقود منتجات
          مؤسسية تجمع بين استراتيجية الذكاء الاصطناعي، ومتطلبات الأعمال، وحوكمة
          التسليم، والنتائج القابلة للقياس.
        </p>
        <p className="max-w-2xl leading-8 text-muted-foreground">
          بدأت خبرته المهنية في البرمجيات وعلوم البيانات، ثم امتدت إلى ذكاء
          الأعمال وتحليل الأعمال وملكية المنتج وقيادة المنتجات. ومنذ عام 2019
          عمل في قطاعات الحكومة والصحة والتقنية المالية والبيئات المؤسسية
          المعقدة.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/contact">
              تواصل مع خليل
              <ArrowLeft className="mr-2 size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <a
              href="/Khalil_Abu_Mushref_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              السيرة الذاتية
              <FileDown className="mr-2 size-4" />
            </a>
          </Button>
          <Link
            className="link self-center text-sm font-semibold"
            href="/about"
            hrefLang="en"
          >
            English profile
          </Link>
        </div>
      </header>

      <section aria-labelledby="arabic-profile" className="space-y-5">
        <h2 id="arabic-profile" className="title text-3xl">
          الملف المهني
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-5">
            <dt className="text-sm text-muted-foreground">المنصب الحالي</dt>
            <dd className="mt-1 font-semibold">
              مدير منتجات رئيسي ومالك منتج وقائد فريق
            </dd>
            <dd className="text-sm text-muted-foreground">Digital Next</dd>
          </div>
          <div className="rounded-lg border p-5">
            <dt className="text-sm text-muted-foreground">
              مواقع العمل الرئيسية
            </dt>
            <dd className="mt-1 font-semibold">الرياض وأبوظبي</dd>
            <dd className="text-sm text-muted-foreground">
              المملكة العربية السعودية ودولة الإمارات
            </dd>
          </div>
          <div className="rounded-lg border p-5">
            <dt className="text-sm text-muted-foreground">التعليم</dt>
            <dd className="mt-1 font-semibold">
              الحوسبة والذكاء الاصطناعي وهندسة الحاسوب
            </dd>
            <dd className="text-sm text-muted-foreground">
              UKM (الماجستير متوقع في 2026) والجامعة الأردنية
            </dd>
          </div>
          <div className="rounded-lg border p-5">
            <dt className="text-sm text-muted-foreground">مجالات الخبرة</dt>
            <dd className="mt-1 font-semibold">
              المنتجات والاستشارات وذكاء الأعمال وعلوم البيانات
            </dd>
            <dd className="text-sm text-muted-foreground">
              خبرة مهنية منذ عام 2019
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="arabic-expertise" className="space-y-5">
        <h2 id="arabic-expertise" className="title text-3xl">
          التخصصات الرئيسية
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            "استراتيجية المنتجات والاستكشاف",
            "ملكية المنتج وحوكمة التسليم",
            "منتجات الذكاء الاصطناعي وسير عمل الوكلاء الذكيين",
            "تحليل الأعمال وإدارة المتطلبات",
            "ذكاء الأعمال ومنتجات البيانات",
            "المنصات الحكومية والصحية والمالية",
          ].map((item) => (
            <li key={item} className="rounded-lg border px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
        <p className="leading-8">
          يمكن الاطلاع على الأدلة العملية في{" "}
          <Link className="link" href="/projects">
            مشاريع خليل
          </Link>
          ،{" "}
          <Link className="link" href="/bi">
            أعمال ذكاء الأعمال
          </Link>
          ، و{" "}
          <Link className="link" href="/blog">
            المقالات ودراسات الحالة
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="arabic-faq" className="space-y-6">
        <h2 id="arabic-faq" className="title text-3xl">
          أسئلة شائعة
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <p className="mt-2 leading-8 text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
