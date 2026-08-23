"use client";

import { useQuery } from "@tanstack/react-query";
import type { SearchResult } from "@/types";

async function fetchSearchResults(query: string): Promise<SearchResult[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  const { data } = await res.json();
  return data;
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearchResults(query),
    enabled: query.length >= 2,
  });
}
