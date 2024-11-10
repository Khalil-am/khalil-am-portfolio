import data from "@/data/mlModels.json"; // Import the ML models data
import { MLModelCard } from "@/components/MLModelCard"; // Import the MLModelCard component

interface Props {
  limit?: number;
}

export default function MLModels({ limit }: Props) {
  // Parse the models data from JSON file
  const models = data.models.slice(0, limit ?? data.models.length);

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {models.map((model, index) => (
        <MLModelCard key={index} model={model} />
      ))}
    </section>
  );
}
