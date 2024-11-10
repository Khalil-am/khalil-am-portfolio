import MLModels from "@/components/MLModels";

export default async function MLModelsPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title">Machine Learning Models</h1>

      <MLModels />
    </article>
  );
}
