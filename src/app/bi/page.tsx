import BI from "@/components/BI";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Intelligence Dashboards",
  description:
    "Power BI and analytics dashboard portfolio by Khalil Abu Mushref — executive KPIs, sales performance, and real-time reporting for data-driven decisions.",
  alternates: { canonical: "/bi" },
  openGraph: {
    title: "Business Intelligence Dashboards | Khalil Abu Mushref",
    description:
      "Executive KPIs, sales performance, and real-time reporting dashboards.",
    url: "/bi",
  },
};

export default async function BIPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title">my dashboards.</h1>
      <BI />
    </article>
  );
}
