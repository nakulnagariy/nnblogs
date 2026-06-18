import Link from "next/link";
import { Clock, Lock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DifficultyBadge } from "./DifficultyBadge";
import type { Topic } from "@/types";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const categorySlug = topic.category?.slug ?? topic.category_id;
  const href = `/learn/${categorySlug}/${topic.slug}`;
  const accentColor = topic.category?.color ?? "#6366f1";

  return (
    <article className="group flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-200 hover:shadow-sm hover:border-border">
      {/* Color accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Meta row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <DifficultyBadge difficulty={topic.difficulty} />
          {topic.access_level === "premium" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground font-medium border border-border/60">
              <Lock className="w-3 h-3" />
              Premium
            </span>
          )}
          <span className="text-xs font-mono text-muted-foreground ml-auto">
            {formatDate(topic.created_at)}
          </span>
        </div>

        {/* Title */}
        <Link href={href} className="group/link">
          <h2 className="font-bold tracking-tight leading-snug mb-2.5 text-foreground text-lg group-hover/link:opacity-70 transition-opacity">
            {topic.title}
          </h2>
        </Link>

        {/* Footer */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono pt-3 mt-auto border-t border-border/40">
          <Clock className="w-3 h-3" />
          <span>{topic.estimated_minutes} min</span>
        </div>
      </div>
    </article>
  );
}
