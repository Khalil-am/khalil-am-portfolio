import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import { Project } from "@/lib/schemas";
import { projectArticles } from "@/lib/projectArticles";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import Icon from "./Icon";

interface Props {
  project: Project;
  headingLevel?: 2 | 3;
}

export function ProjectCard({ project, headingLevel = 3 }: Props) {
  const { name, href, description, image, tags, links } = project;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const articleSlug = projectArticles[name];
  const articleHref = articleSlug ? `/blog/${articleSlug}` : undefined;

  return (
    <Card className="flex flex-col">
      {image && (
        <CardHeader>
          {articleHref || href ? (
            <Link
              href={articleHref ?? href!}
              target={articleHref ? undefined : "_blank"}
              rel={articleHref ? undefined : "noopener noreferrer"}
            >
              <Image
                src={image}
                alt={`Screenshot of ${name}`}
                width={500}
                height={300}
                sizes="(max-width: 639px) calc(100vw - 2rem), 352px"
                className="h-40 w-full object-cover object-top"
              />
            </Link>
          ) : (
            <Image
              src={image}
              alt={`Screenshot of ${name}`}
              width={500}
              height={300}
              sizes="(max-width: 639px) calc(100vw - 2rem), 352px"
              className="h-40 w-full object-cover object-top"
            />
          )}
        </CardHeader>
      )}
      <CardContent className="flex flex-col gap-2">
        <Heading className="font-semibold leading-none tracking-tight">
          {articleHref ? (
            <Link className="hover:underline" href={articleHref}>
              {name}
            </Link>
          ) : (
            name
          )}
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
        {(articleHref || (links && links.length > 0)) && (
          <div className="flex flex-row flex-wrap items-start gap-1">
            {articleHref ? (
              <Link href={articleHref}>
                <Badge className="px-2 py-1 text-[10px]" variant="secondary">
                  Read case study
                </Badge>
              </Link>
            ) : null}
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
