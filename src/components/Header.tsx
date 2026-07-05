import Link from "next/link";
import ChatToggle from "./ChatToggle";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  // { name: "home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "BI", href: "/bi" },
  { name: "AI", href: "/ml-models" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/75 py-6 backdrop-blur-sm">
      <nav aria-label="Main navigation" className="flex items-center justify-between">
        {/* Logo Section — both theme variants rendered, CSS picks one */}
        <Link href="/">
          <img
            src="/assets/Kam-logo-black.svg"
            alt="Khalil Abu Mushref — home"
            width={56}
            height={56}
            className="h-14 w-auto dark:hidden"
          />
          <img
            src="/assets/Kam-logo-white.svg"
            alt="Khalil Abu Mushref — home"
            width={56}
            height={56}
            className="hidden h-14 w-auto dark:block"
          />
        </Link>

        {/* Navigation Links */}
        <ul className="flex gap-4 sm:gap-8">
          {navLinks.map((nav, id) => (
            <li key={id} className="link">
              <Link href={nav.href}>{nav.name}</Link>
            </li>
          ))}
        </ul>

        {/* Chat and Theme Toggles */}
        <div className="flex gap-0 sm:gap-4">
          <ChatToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
