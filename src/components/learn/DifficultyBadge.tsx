import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <Badge
      className={cn(
        {
          "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 dark:text-emerald-400":
            difficulty === "easy",
          "bg-amber-500/10 text-amber-600 border border-amber-500/30 dark:text-amber-400":
            difficulty === "medium",
          "bg-destructive/10 text-destructive border border-destructive/30":
            difficulty === "hard",
        },
        className,
      )}
    >
      {difficulty}
    </Badge>
  );
}
