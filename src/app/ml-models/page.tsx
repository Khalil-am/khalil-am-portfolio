import MLModels from "@/components/MLModels";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI & Machine Learning Models",
  description:
    "Applied machine learning work by Khalil Abu Mushref — healthcare AI, NLP models, and predictive analytics projects with real-world deployments.",
  alternates: { canonical: "/ml-models" },
  openGraph: {
    title: "AI & Machine Learning Models | Khalil Abu Mushref",
    description: "Healthcare AI, NLP models, and predictive analytics projects.",
    url: "/ml-models",
  },
};

export default async function MLModelsPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title">my AI/ML models.</h1>

      <MLModels />
    </article>
  );
}
