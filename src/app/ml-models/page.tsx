import MLModels from "@/components/MLModels";

export default async function MLModelsPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title">my AI/ML models.</h1>

      <MLModels />
    </article>
  );
}
