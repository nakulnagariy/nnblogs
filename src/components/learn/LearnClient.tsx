"use client";

import { useTopicCategories } from "@/hooks/useLearn";
import { CategoryCard } from "./CategoryCard";
import { Skeleton } from "@/components/ui/Skeleton";

export function LearnClient() {
  const { data: categories, isLoading, error } = useTopicCategories();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-52 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error || !categories?.length) {
    return (
      <p className="text-muted-foreground text-sm">
        No categories available yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
