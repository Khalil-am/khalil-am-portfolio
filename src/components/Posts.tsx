import { PostMetadata } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Card } from "./ui/Card";
import { Separator } from "./ui/Separator";

interface Props {
  posts: PostMetadata[];
  headingLevel?: 2 | 3;
}

export default function Posts({ posts, headingLevel = 3 }: Props) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    posts.length > 0 && (
      <Card>
        <ul className="flex flex-col">
          {posts.map((post, i) => (
            <li key={i}>
              {i !== 0 && i !== posts.length && <Separator />}
              <Link href={`/blog/${post.slug}`}>
                <div className="flex flex-col justify-between p-6 sm:flex-row sm:items-center">
                  <div className="max-w-md md:max-w-lg">
                    <Heading className="text-lg font-semibold">
                      {post.title}
                    </Heading>
                    <p className="mt-1 line-clamp-2 text-sm font-light text-muted-foreground">
                      {post.summary}
                    </p>
                  </div>

                  {post.publishedAt && (
                    <p className="mt-2 flex w-full justify-end text-sm font-light sm:mt-0 sm:w-auto">
                      {formatDate(post.publishedAt)}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    )
  );
}
