import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Calistoga, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Khalil Abu Mushref | Data Scientist",
  description: "Personal site to showcase my work, projects, and insights on data science and technology.",
  icons: {
    icon: "/favicon.ico", // Path to your icon file
  },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
      className={cn(
        "mx-auto flex min-h-screen max-w-3xl flex-col px-8 font-sans antialiased",
        inter.variable,
        calistoga.variable,
      )}
    >
    <Providers>
      <Header />
      <main className="grow">{children}</main>
      <Footer />
    </Providers>
    </body>
    </html>
  );
}
