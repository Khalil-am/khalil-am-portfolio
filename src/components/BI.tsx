"use client";

import data from "@/data/bi.json";          // read from your BI data
import { projectSchema } from "@/lib/schemas";
import { BICard } from "./BICard";

interface Props {
  limit?: number;
}

export default function BI({ limit }: Props) {
  // 1. Parse the BI data with the same Zod schema
  let projects = projectSchema.parse(data).projects;

  // 2. Optionally limit the results
  if (limit) {
    projects = projects.slice(0, limit);
  }

  // 3. Render the cards
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {projects.map((project, id) => (
        <BICard key={id} project={project} />
      ))}
    </section>
  );
}
