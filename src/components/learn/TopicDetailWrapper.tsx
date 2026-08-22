"use client";

import type { ReactNode } from "react";
import { ReadingProgress } from "@/components/ui/ScrollProgress";

export function TopicDetailWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <ReadingProgress />
      {children}
    </>
  );
}
