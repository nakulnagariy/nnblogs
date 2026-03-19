"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPosts,
  getPostBySlug,
  getFeaturedPosts,
  getRecentPosts,
  searchContent,
} from "@/lib/supabase/queries";

export function usePosts(
  page: number = 1,
  pageSize: number = 10,
  category?: string,
) {
  return useQuery({
    queryKey: ["posts", page, pageSize, category],
    queryFn: () => getPosts(page, pageSize, category),
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
    enabled: !!slug,
  });
}

export function useFeaturedPosts(limit: number = 3) {
  return useQuery({
    queryKey: ["posts", "featured", limit],
    queryFn: () => getFeaturedPosts(limit),
  });
}

export function useRecentPosts(limit: number = 5) {
  return useQuery({
    queryKey: ["posts", "recent", limit],
    queryFn: () => getRecentPosts(limit),
  });
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchContent(query),
    enabled: query.length >= 2,
  });
}
