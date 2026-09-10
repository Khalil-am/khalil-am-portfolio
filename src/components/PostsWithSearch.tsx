"use client";

import { PostMetadata } from "@/lib/posts";
import { Delete } from "lucide-react";
import { useState } from "react";
import Posts from "./Posts";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface Props {
  posts: PostMetadata[];
}

export default function PostsWithSearch({ posts }: Props) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = posts.filter((post) =>
    `${post.title ?? ""} ${post.summary ?? ""}`
      .toLowerCase()
      .includes(normalizedQuery),
  );

  const resetFilter = () => setQuery("");

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
        <div className="grow">
          <label
            htmlFor="article-search"
            className="mb-2 block text-sm font-semibold"
          >
            Search articles by title
          </label>
          <Input
            id="article-search"
            type="text"
            placeholder="Try product strategy, AI, or business analysis"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={resetFilter}
          disabled={query.length === 0}
          aria-label="Clear article search"
        >
          Clear
          <Delete className="ml-2 size-4" />
        </Button>
      </div>

      <p className="-mt-8 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"}
      </p>

      <Posts posts={filtered} headingLevel={2} />
    </div>
  );
}
