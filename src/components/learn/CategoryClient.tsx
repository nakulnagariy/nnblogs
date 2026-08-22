"use client";

import { useState } from "react";
import { useTopicsByCategory } from "@/hooks/useLearn";
import { TopicCard } from "./TopicCard";
import { TopicListSkeleton } from "./TopicCardSkeleton";
import { Button } from "@/components/ui/Button";
import type { Difficulty } from "@/types";

interface CategoryClientProps {
  categorySlug: string;
}

const DIFFICULTIES: { label: string; value: Difficulty | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

export function CategoryClient({ categorySlug }: CategoryClientProps) {
  const [page, setPage] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(
    undefined,
  );

  const { data, isLoading, error } = useTopicsByCategory(
    categorySlug,
    page,
    20,
    difficulty,
  );

  return (
    <div className="space-y-6">
      {/* Difficulty filter */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by difficulty">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.label}
            onClick={() => {
              setDifficulty(d.value);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              difficulty === d.value
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Topics grid */}
      {isLoading ? (
        <TopicListSkeleton />
      ) : error ? (
        <p className="text-muted-foreground text-sm">Failed to load topics.</p>
      ) : !data?.data.length ? (
        <p className="text-muted-foreground text-sm">No topics found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground font-mono">
            {page} / {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
