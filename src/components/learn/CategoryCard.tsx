import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { TopicCategory } from "@/types";

interface CategoryCardProps {
  category: TopicCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/learn/${category.slug}`}
      className="group block rounded-2xl border border-border/60 bg-card p-6 transition-all duration-200 hover:shadow-sm hover:border-border"
      style={{ borderTopColor: category.color, borderTopWidth: 3 }}
    >
      {/* Icon */}
      <div className="text-4xl mb-4" role="img" aria-label={category.name}>
        {category.icon}
      </div>

      {/* Name */}
      <h2 className="font-bold text-lg tracking-tight text-foreground group-hover:opacity-70 transition-opacity mb-2">
        {category.name}
      </h2>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {category.description}
      </p>

      {/* Topic count */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
        <BookOpen className="w-3.5 h-3.5" />
        <span>{category.topic_count ?? 0} topics</span>
      </div>
    </Link>
  );
}
