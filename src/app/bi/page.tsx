// /src/app/bi/page.tsx
import BI from "@/components/BI";

export default async function BIPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title">my BI dashboards.</h1>
      <BI />
    </article>
  );
}
