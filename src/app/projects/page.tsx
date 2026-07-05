import Projects from "@/components/Projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "AI-powered platforms and product builds by Khalil Abu Mushref — SprintsGate, BoardIQ, NuRad, StoryIQ, and more across healthcare, delivery, and analytics.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Khalil Abu Mushref",
    description:
      "AI-powered platforms and product builds across healthcare, delivery, and analytics.",
    url: "/projects",
  },
};

export default async function ProjectPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title">my projects.</h1>

      <Projects />
    </article>
  );
}
