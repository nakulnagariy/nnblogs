'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';

// Dynamically import heavy components with loading states
export const Dialog = dynamic(() => import('../ui/Dialog').then(mod => mod.Dialog), {
  loading: () => <div className="fixed inset-0 bg-black/50 z-50" />,
  ssr: false,
});

export const MarkdownEditor = dynamic(
  () => import('../blog/MarkdownEditor'),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    ),
    ssr: false,
  }
);

export const GitHubProfile = dynamic(
  () => import('../github/GitHubProfile').then(mod => mod.GitHubProfile),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    ),
  }
);

export const FlashcardDeck = dynamic(
  () => import('../learn/FlashcardDeck'),
  {
    loading: () => <Skeleton className="h-64 w-full rounded-xl" />,
    ssr: false,
  }
);

export const DataVizCharts = dynamic(
  () => import('../data-viz/StatsVisualization').then(mod => mod.StatsVisualization),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    ),
  }
);
