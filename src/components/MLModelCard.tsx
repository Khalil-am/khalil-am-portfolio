import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
  headingLevel?: 2 | 3;
}

export function MLModelCard({ model, headingLevel = 3 }: ModelProps) {
  const { title, description, imageUrl, link, tags } = model;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <Card className="flex flex-col">
      <CardHeader>
        {imageUrl &&
          (link ? (
            <Link href={link} target="_blank" rel="noopener noreferrer">
              <Image
                src={imageUrl}
                alt={`Illustration for ${title}`}
                width={500}
                height={300}
                sizes="(max-width: 639px) calc(100vw - 2rem), 352px"
                className="h-40 w-full object-cover object-top"
              />
            </Link>
          ) : (
            <Image
              src={imageUrl}
              alt={`Illustration for ${title}`}
              width={500}
              height={300}
              sizes="(max-width: 639px) calc(100vw - 2rem), 352px"
              className="h-40 w-full object-cover object-top"
            />
          ))}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Heading className="font-semibold leading-none tracking-tight">
          {title}
        </Heading>
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
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Badge className="flex gap-2 px-2 py-1 text-[10px]">
              <Icon name="file-text" className="size-3" />
              Learn about {title}
            </Badge>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
