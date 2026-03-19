'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export function SkipToContent() {
  return (
    <Link
      href="#main-content"
      className={cn(
        'sr-only focus:not-sr-only',
        'fixed top-4 left-4 z-[100]',
        'bg-foreground text-background',
        'px-4 py-2 rounded-md',
        'font-medium text-sm',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'transition-all'
      )}
    >
      Skip to main content
    </Link>
  );
}
