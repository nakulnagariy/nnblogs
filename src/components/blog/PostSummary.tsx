'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostSummaryProps {
  /** Raw markdown content of the blog post */
  content: string;
  /** Post slug — used as the localStorage cache key */
  slug: string;
}

const CACHE_PREFIX = 'post_summary_v1_';

/**
 * Collapsible "Quick Summary" card for blog post readers.
 * Lazily calls OpenAI to summarize the post into 4-5 bullet points.
 * Caches the result in localStorage so repeat visitors see it instantly.
 */
export function PostSummary({ content, slug }: PostSummaryProps) {
  const cacheKey = `${CACHE_PREFIX}${slug}`;

  const [isOpen, setIsOpen] = useState(false);
  const [bullets, setBullets] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cached summary on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setBullets(JSON.parse(cached) as string[]);
      }
    } catch {
      // ignore storage errors
    }
  }, [cacheKey]);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'summarize', content }),
      });
      const json = await res.json();

      if (!res.ok || !json.data) {
        throw new Error(json.error || 'Failed to generate summary');
      }

      const data = json.data as string[];
      setBullets(data);

      // Cache for future visits
      try {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch {
        // ignore storage quota errors
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  }, [content, cacheKey]);

  // Auto-fetch when the section is opened and no cached result exists
  const handleToggle = async () => {
    const opening = !isOpen;
    setIsOpen(opening);
    if (opening && !bullets && !isLoading) {
      await fetchSummary();
    }
  };

  return (
    <div className="my-8 rounded-xl border border-violet-500/25 bg-violet-500/5 overflow-hidden">
      {/* Toggle header */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-violet-500/10 transition-colors"
      >
        <Sparkles className="w-4 h-4 text-violet-500 shrink-0" aria-hidden="true" />
        <span className="text-sm font-semibold flex-1 text-foreground">Quick Summary</span>
        <span className="text-xs text-muted-foreground mr-2 hidden sm:inline">
          AI-generated · 30 sec read
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div className="px-5 pb-5">
          {/* Loading */}
          {isLoading && (
            <div
              className="flex items-center gap-2 text-sm text-muted-foreground py-2"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Generating summary…
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="flex items-center gap-2 py-2">
              <p className="text-sm text-muted-foreground">
                {error}
              </p>
              <button
                type="button"
                onClick={() => fetchSummary()}
                className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-500 underline-offset-2 hover:underline shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            </div>
          )}

          {/* Bullet points */}
          {bullets && !isLoading && (
            <>
              <ul
                className="space-y-2.5 mt-1"
                aria-label="Post key takeaways"
              >
                {bullets.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span
                      className={cn(
                        'mt-1.5 w-1.5 h-1.5 rounded-full shrink-0',
                        'bg-violet-500',
                      )}
                      aria-hidden="true"
                    />
                    <span className="text-foreground/90 leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Generated by AI · may not be 100% accurate
                </p>
                <button
                  type="button"
                  onClick={() => {
                    try { localStorage.removeItem(cacheKey); } catch { /* */ }
                    setBullets(null);
                    fetchSummary();
                  }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Regenerate summary"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
