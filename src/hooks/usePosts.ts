"use client";

import { useEffect, useState } from "react";
import type { SearchResult } from "@/types";

interface UseSearchResult {
  data: SearchResult[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

interface SearchState {
  query: string;
  data: SearchResult[] | undefined;
  error: Error | null;
}

export function useSearch(query: string): UseSearchResult {
  const [state, setState] = useState<SearchState>({ query: "", data: undefined, error: null });
  const enabled = query.length >= 2;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Search failed");
        return res.json();
      })
      .then(({ data }: { data: SearchResult[] }) => {
        if (!cancelled) setState({ query, data, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            query,
            data: undefined,
            error: err instanceof Error ? err : new Error("Search failed"),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [query, enabled]);

  return {
    data: enabled ? state.data : undefined,
    isLoading: enabled && state.query !== query,
    error: enabled ? state.error : null,
  };
}
