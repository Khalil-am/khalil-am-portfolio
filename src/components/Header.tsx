"use client";

import Link from "next/link";
import ChatToggle from "./ChatToggle";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const navLinks = [
  // { name: "home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "BI", href: "/bi" },
  { name: "AI", href: "/ml-models" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevents hydration mismatch
  }

  return (
    <header className="sticky top-0 z-50 bg-background/75 py-6 backdrop-blur-sm">
      <nav className="flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/">
          <img
            src={
              resolvedTheme === "dark"
                ? "/assets/Kam-logo-white.svg"
                : "/assets/Kam-logo-black.svg"
            }
            alt="Logo"
            className="h-14 w-auto"
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
