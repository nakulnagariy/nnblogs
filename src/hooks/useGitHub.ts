'use client';

import { useQuery } from '@tanstack/react-query';
import { getGitHubUser, getGitHubRepos, getGitHubStats, getPinnedRepos } from '@/lib/github';

export function useGitHubUser() {
  return useQuery({
    queryKey: ['github', 'user'],
    queryFn: getGitHubUser,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useGitHubRepos(sort: 'updated' | 'pushed' | 'created' | 'stars' = 'updated', limit: number = 10) {
  return useQuery({
    queryKey: ['github', 'repos', sort, limit],
    queryFn: () => getGitHubRepos(sort, limit),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useGitHubStats() {
  return useQuery({
    queryKey: ['github', 'stats'],
    queryFn: getGitHubStats,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function usePinnedRepos() {
  return useQuery({
    queryKey: ['github', 'pinned'],
    queryFn: getPinnedRepos,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
