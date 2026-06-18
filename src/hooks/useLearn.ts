"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  TopicCategory,
  Topic,
  TopicDetail,
  PaginatedResponse,
  Difficulty,
} from "@/types";

export function useTopicCategories() {
  return useQuery<TopicCategory[]>({
    queryKey: ["topic-categories"],
    queryFn: async () => {
      const res = await fetch("/api/learn/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopicsByCategory(
  categorySlug: string,
  page: number = 1,
  pageSize: number = 20,
  difficulty?: Difficulty,
) {
  return useQuery<PaginatedResponse<Topic>>({
    queryKey: ["topics", categorySlug, page, pageSize, difficulty],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (difficulty) params.set("difficulty", difficulty);

      const res = await fetch(`/api/learn/${categorySlug}?${params}`);
      if (!res.ok) throw new Error("Failed to fetch topics");
      return res.json();
    },
    enabled: !!categorySlug,
    staleTime: 2 * 60 * 1000,
  });
}

export function useTopic(categorySlug: string, topicSlug: string) {
  return useQuery<TopicDetail>({
    queryKey: ["topic", categorySlug, topicSlug],
    queryFn: async () => {
      const res = await fetch(`/api/learn/${categorySlug}/${topicSlug}`);
      if (!res.ok) throw new Error("Failed to fetch topic");
      return res.json();
    },
    enabled: !!categorySlug && !!topicSlug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRelatedTopics(
  categorySlug: string,
  topicSlug: string,
  limit: number = 3,
) {
  return useQuery<Topic[]>({
    queryKey: ["related-topics", categorySlug, topicSlug, limit],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: String(limit) });
      const res = await fetch(`/api/learn/${categorySlug}?${params}`);
      if (!res.ok) throw new Error("Failed to fetch related topics");
      const result: PaginatedResponse<Topic> = await res.json();
      return result.data.filter((t) => t.slug !== topicSlug).slice(0, limit);
    },
    enabled: !!categorySlug && !!topicSlug,
    staleTime: 5 * 60 * 1000,
  });
}
