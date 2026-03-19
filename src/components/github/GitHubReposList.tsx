'use client';

import Link from 'next/link';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useGitHubRepos } from '@/hooks/useGitHub';
import type { GitHubRepo } from '@/types';

interface RepoCardProps {
  repo: GitHubRepo;
}

function RepoCard({ repo }: RepoCardProps) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            <Link
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground flex items-center gap-1"
            >
              {repo.name}
              <ExternalLink className="h-3 w-3" />
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {repo.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{repo.description}</p>
        )}
        
        <div className="flex flex-wrap gap-1">
          {repo.language && (
            <Badge variant="outline">{repo.language}</Badge>
          )}
          {repo.topics?.slice(0, 3).map((topic) => (
            <Badge key={topic} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>{repo.stargazers_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            <span>{repo.forks_count}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface GitHubReposListProps {
  limit?: number;
}

export function GitHubReposList({ limit = 6 }: GitHubReposListProps) {
  const { data: repos, isLoading, error } = useGitHubRepos('stars', limit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !repos) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Unable to load repositories
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
