import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import { Project } from "@/lib/schemas";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import Icon from "./Icon"; // same import as ProjectCard

interface Props {
  project: Project;
  headingLevel?: 2 | 3;
}

export function BICard({ project, headingLevel = 3 }: Props) {
  const { name, href, description, image, tags, links } = project;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <Card className="flex flex-col">
      <CardHeader>
        {image &&
          (href ? (
            <Link href={href} target="_blank" rel="noopener noreferrer">
              <Image
                src={image}
                alt={`Screenshot of the ${name} dashboard`}
                width={500}
                height={300}
                sizes="(max-width: 639px) calc(100vw - 2rem), 352px"
                className="h-40 w-full object-cover object-top"
              />
            </Link>
          ) : (
            <Image
              src={image}
              alt={`Screenshot of the ${name} dashboard`}
              width={500}
              height={300}
              sizes="(max-width: 639px) calc(100vw - 2rem), 352px"
              className="h-40 w-full object-cover object-top"
            />
          ))}
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <Heading className="font-semibold leading-none tracking-tight">
          {name}
        </Heading>
        <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
          {description}
        </Markdown>
      </CardContent>

      <CardFooter className="flex h-full flex-col items-start justify-between gap-4">
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.toSorted().map((tag) => (
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

        {links && links.length > 0 && (
          <div className="flex flex-row flex-wrap items-start gap-1">
            {links.toSorted().map((link, idx) => (
              <Link
                href={link?.href}
                key={idx}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge key={idx} className="flex gap-2 px-2 py-1 text-[10px]">
                  <Icon name={link.icon} className="size-3" />
                  {link.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
