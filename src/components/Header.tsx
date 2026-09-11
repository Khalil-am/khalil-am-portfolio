import Image from "next/image";
import Link from "next/link";
import ChatToggle from "./ChatToggle";
import ThemeToggle from "./ThemeToggle";

const englishNavLinks = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "BI", href: "/bi" },
  { name: "AI", href: "/ml-models" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const arabicNavLinks = [
  { name: "الملف", href: "/ar" },
  { name: "المشاريع", href: "/projects" },
  { name: "البيانات", href: "/bi" },
  { name: "AI", href: "/ml-models" },
  { name: "المقالات", href: "/blog" },
  { name: "تواصل", href: "/contact" },
];

export default function Header({
  language = "en",
}: {
  language?: "en" | "ar";
}) {
  const isArabic = language === "ar";
  const navLinks = isArabic ? arabicNavLinks : englishNavLinks;

  return (
    <header className="sticky top-0 z-50 bg-background/75 py-6 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={isArabic ? "/ar" : "/"}
          aria-label={
            isArabic ? "خليل أبو مشرف — الرئيسية" : "Khalil Abu Mushref — home"
          }
        >
          <Image
            src="/assets/Kam-logo-black.svg"
            alt={isArabic ? "شعار خليل أبو مشرف" : "Khalil Abu Mushref logo"}
            width={56}
            height={56}
            className="h-14 w-auto dark:hidden"
          />
          <Image
            src="/assets/Kam-logo-white.svg"
            alt={isArabic ? "شعار خليل أبو مشرف" : "Khalil Abu Mushref logo"}
            width={56}
            height={56}
            className="hidden h-14 w-auto dark:block"
          />
        </Link>

        <nav
          aria-label={isArabic ? "التنقل الرئيسي" : "Main navigation"}
          className="hidden sm:block"
        >
          <ul className="flex gap-4 md:gap-6">
            {navLinks.map((nav) => (
              <li key={nav.href} className="link text-sm">
                <Link href={nav.href}>{nav.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 gap-0 sm:gap-2">
          <ChatToggle />
          <ThemeToggle />
        </div>
      </div>

      <nav
        aria-label={isArabic ? "التنقل على الهاتف" : "Mobile navigation"}
        className="-mx-2 mt-3 overflow-x-auto px-2 pb-1 sm:hidden"
      >
        <ul className="flex min-w-max gap-5 text-sm">
          {navLinks.map((nav) => (
            <li key={nav.href} className="link">
              <Link href={nav.href}>{nav.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
