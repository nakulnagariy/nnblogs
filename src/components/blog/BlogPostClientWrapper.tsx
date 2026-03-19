'use client';

import type { ReactNode } from 'react';
import { ReadingProgress } from '@/components/ui/ScrollProgress';
import { BlogPostTracker } from '@/components/analytics/BlogPostTracker';

interface BlogPostClientWrapperProps {
  slug: string;
  title: string;
  category: string;
  children: ReactNode;
}

export function BlogPostClientWrapper({
  slug,
  title,
  category,
  children,
}: BlogPostClientWrapperProps) {
  return (
    <>
      <ReadingProgress />
      <BlogPostTracker slug={slug} title={title} category={category} />
      {children}
    </>
  );
}
