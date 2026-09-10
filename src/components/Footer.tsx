import Link from "next/link";
import Socials from "./Socials";

export default function Footer({
  language = "en",
}: {
  language?: "en" | "ar";
}) {
  const isArabic = language === "ar";

  return (
    <footer className="flex flex-col items-center justify-center gap-6 pb-32 sm:flex-row-reverse sm:justify-between">
      <Socials />
      <section>
        <nav
          aria-label={isArabic ? "روابط التذييل" : "Footer navigation"}
          className="mb-3"
        >
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
            <li>
              <Link className="link" href={isArabic ? "/ar" : "/about"}>
                {isArabic ? "نبذة عن خليل" : "About Khalil"}
              </Link>
            </li>
            <li>
              <Link
                className="link"
                href={isArabic ? "/about" : "/ar"}
                hrefLang={isArabic ? "en" : "ar"}
              >
                {isArabic ? "English" : "العربية"}
              </Link>
            </li>
            <li>
              <Link className="link" href="/blog">
                {isArabic ? "المقالات" : "Insights"}
              </Link>
            </li>
            <li>
              <Link className="link" href="/contact">
                {isArabic ? "تواصل" : "Contact"}
              </Link>
            </li>
            <li>
              <Link className="link" href="/privacy">
                {isArabic ? "الخصوصية" : "Privacy"}
              </Link>
            </li>
          </ul>
        </nav>
        <p className="text-center text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()}</span>{" "}
          <Link className="link" href={isArabic ? "/ar" : "/"}>
            khalil-am.com
          </Link>
        </p>
      </section>
    </footer>
  );
}
