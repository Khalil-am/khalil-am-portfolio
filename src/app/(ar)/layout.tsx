import SiteDocument from "@/components/SiteDocument";
import { rootMetadata } from "@/lib/rootMetadata";
import type { ReactNode } from "react";
import "../globals.css";

export const metadata = rootMetadata;

export default function ArabicRootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <SiteDocument language="ar">{children}</SiteDocument>;
}
