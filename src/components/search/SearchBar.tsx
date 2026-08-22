'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, Video, FolderGit2, BookOpen } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useSearch } from '@/hooks/usePosts';
import { cn } from '@/lib/utils';
import type { SearchResult } from '@/types';

interface SearchBarProps {
  className?: string;
  autoFocus?: boolean;
  onResultClick?: () => void;
}

const typeIcons = {
  post: FileText,
  video: Video,
  project: FolderGit2,
  topic: BookOpen,
};

const typeColors = {
  post: 'text-foreground',
  video: 'text-red-500',
  project: 'text-muted-foreground',
  topic: 'text-primary',
};

export function SearchBar({ className, autoFocus, onResultClick }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data: results, isLoading } = useSearch(debouncedQuery);

  // Debounce search query and open dropdown
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.length >= 2) setIsOpen(true);
      else setIsOpen(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Track analytics when results come in (no setState here)
  useEffect(() => {
    if (results && results.length > 0 && query.length >= 2) {
      analytics.search.query(query, results.length);
    }
  }, [results, query]);

  const handleResultClick = useCallback(
    (result: SearchResult, index: number) => {
      // Track search result click
      analytics.search.resultClick(query, result.type, result.slug, index);
      
      const paths = {
        post: `/blog/${result.slug}`,
        video: `/videos/${result.slug}`,
        project: `/projects#${result.slug}`,
        topic: `/learn/${result.category ?? ""}/${result.slug}`,
      };
      router.push(paths[result.type]);
      setIsOpen(false);
      setQuery('');
      onResultClick?.();
    },
    [router, onResultClick, query]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setIsOpen(false);
  }, []);

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search posts, videos, projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="pl-10 pr-10"
          autoFocus={autoFocus}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : results && results.length > 0 ? (
            <ul className="py-2">
              {results.map((result, index) => {
                const Icon = typeIcons[result.type];
                return (
                  <li key={`${result.type}-${result.id}`}>
                    <button
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-start gap-3"
                      onClick={() => handleResultClick(result, index)}
                    >
                      <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', typeColors[result.type])} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium line-clamp-1">{result.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {result.excerpt}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 capitalize">
                          {result.type} {result.category && `• ${result.category}`}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
