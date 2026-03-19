'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePosts } from '@/hooks/usePosts';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogListSkeleton } from '@/components/blog/BlogCardSkeleton';
import { BlogTimeline } from '@/components/blog/BlogTimeline';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, LayoutGrid, AlignJustify, X } from 'lucide-react';

function BlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/posts/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  const category = searchParams.get('category');
  const { data, isLoading, error } = usePosts(page, 12, category || undefined);
  const { data: posts = [], totalPages = 0 } = data || {};

  const handleCategory = (cat: string | null) => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    router.push(`/blog${cat ? '?' + params.toString() : ''}`);
    setPage(1);
  };

  const timelinePosts = posts.map(p => ({ ...p, published_at: p.created_at }));

  if (error) {
    return (
      <div className="container mx-auto px-6 max-w-6xl pt-24 text-center">
        <p className="text-muted-foreground">Error loading posts. Please try again.</p>
      </div>
    );
  }

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
          {category ? (
            <button
              onClick={() => handleCategory(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-foreground text-background whitespace-nowrap transition-colors"
            >
              {category}
              <X className="w-3 h-3" />
            </button>
          ) : (
            categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className="px-3 py-1 rounded-full text-xs border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/40 whitespace-nowrap transition-colors"
              >
                {cat}
              </button>
            ))
          )}
        </div>

        {/* Content */}
        <div className="py-4">
          {isLoading && <BlogListSkeleton />}

          {!isLoading && posts.length === 0 && (
            <p className="py-20 text-center text-sm text-muted-foreground">
              No posts found.{category && ' Try a different category.'}
            </p>
          )}

          {!isLoading && posts.length > 0 && viewMode === 'timeline' && (
            <BlogTimeline posts={timelinePosts} />
          )}

          {!isLoading && posts.length > 0 && viewMode === 'grid' && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-4">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 py-12 border-t border-border/40">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>
            <span className="text-xs font-mono text-muted-foreground">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function BlogLoadingFallback() {
  return (
    <div className="container mx-auto px-6 max-w-6xl pt-24">
      <div className="pb-10 border-b border-border/40">
        <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">Writing</p>
        <h1 className="text-5xl font-bold tracking-tight">Blog</h1>
      </div>
      <div className="py-8">
        <BlogListSkeleton />
      </div>
    </div>
  );
}

export function BlogClient() {
  return (
    <Suspense fallback={<BlogLoadingFallback />}>
      <BlogContent />
    </Suspense>
  );
}

