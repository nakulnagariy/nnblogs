import Link from 'next/link';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { GitHubRepo } from '@/types';

interface RepoCardProps {
  repo: GitHubRepo;
}

function RepoCard({ repo }: RepoCardProps) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
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
      </CardHeader>
      <CardContent className="space-y-3">
        {repo.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{repo.description}</p>
        )}

        <div className="flex flex-wrap gap-1">
          {repo.language && <Badge variant="outline">{repo.language}</Badge>}
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
  repos: GitHubRepo[];
}

export function GitHubReposList({ repos }: GitHubReposListProps) {
  if (repos.length === 0) {
    return <p className="text-sm text-muted-foreground">No repositories to show.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
