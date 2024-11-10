import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";

interface ModelProps {
  model: {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    tags?: string[];
  };
}

export function MLModelCard({ model }: ModelProps) {
  const { title, description, imageUrl, link, tags } = model;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        {imageUrl && (
          <Link href={link || imageUrl}>
            <Image
              src={imageUrl}
              alt={title}
              width={500}
              height={300}
              className="h-40 w-full object-cover object-top"
            />
          </Link>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <CardTitle>{title}</CardTitle>
        <p className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
          {description}
        </p>
      </CardContent>
      <CardFooter className="flex h-full flex-col items-start justify-between gap-4">
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="px-1 py-0 text-[10px]"
                variant="secondary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex flex-row flex-wrap items-start gap-1">
          <Link href={link} target="_blank">
            <Badge className="flex gap-2 px-2 py-1 text-[10px]">
              <Icon name="file-text" className="size-3" />
              Learn More
            </Badge>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
