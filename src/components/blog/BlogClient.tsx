'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogTimeline } from '@/components/blog/BlogTimeline';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, LayoutGrid, AlignJustify, X } from 'lucide-react';
import type { BlogPost } from '@/types';

interface BlogClientProps {
  posts: BlogPost[];
  page: number;
  totalPages: number;
  categories: string[];
  activeCategory: string | null;
}

function categoryHref(category: string | null) {
  return category ? `/blog?category=${encodeURIComponent(category)}` : '/blog';
}

function pageHref(page: number, category: string | null) {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (category) params.set('category', category);
  const qs = params.toString();
  return qs ? `/blog?${qs}` : '/blog';
}

export function BlogClient({ posts, page, totalPages, categories, activeCategory }: BlogClientProps) {
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

  const timelinePosts = posts.map((p) => ({ ...p, published_at: p.created_at }));

  return (
    <>
      <ScrollProgress position="top" />

      <div className="container mx-auto px-6 max-w-6xl">

        {/* Page header */}
        <header className="pt-24 pb-10 border-b border-border/40">
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">
            Writing
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Blog</h1>
              <p className="mt-3 text-base text-muted-foreground max-w-xl">
                Thoughts, tutorials and insights on web development, AI, and building things.
              </p>
            </div>
            {/* View toggle */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setViewMode('timeline')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'timeline'
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
                aria-label="Timeline view"
              >
                <AlignJustify className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'grid'
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Category filter strip */}
        <div className="flex items-center gap-2 py-5 overflow-x-auto">
          {activeCategory ? (
            <Link
              href={categoryHref(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-foreground text-background whitespace-nowrap transition-colors"
            >
              {activeCategory}
              <X className="w-3 h-3" />
            </Link>
          ) : (
            categories.map((cat) => (
              <Link
                key={cat}
                href={categoryHref(cat)}
                className="px-3 py-1 rounded-full text-xs border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/40 whitespace-nowrap transition-colors"
              >
                {cat}
              </Link>
            ))
          )}
        </div>

        {/* Content */}
        <div className="py-4">
          {posts.length === 0 && (
            <p className="py-20 text-center text-sm text-muted-foreground">
              No posts found.{activeCategory && ' Try a different category.'}
            </p>
          )}

          {posts.length > 0 && viewMode === 'timeline' && <BlogTimeline posts={timelinePosts} />}

          {posts.length > 0 && viewMode === 'grid' && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-4">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 py-12 border-t border-border/40">
            <Link
              href={pageHref(Math.max(1, page - 1), activeCategory)}
              aria-disabled={page === 1}
              className={cn(
                'inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors',
                page === 1 && 'pointer-events-none opacity-40'
              )}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </Link>
            <span className="text-xs font-mono text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Link
              href={pageHref(Math.min(totalPages, page + 1), activeCategory)}
              aria-disabled={page === totalPages}
              className={cn(
                'inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors',
                page === totalPages && 'pointer-events-none opacity-40'
              )}
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
