'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Link as LinkIcon, Twitter } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useGitHubStats } from '@/hooks/useGitHub';

export function GitHubProfile() {
  const { data: stats, isLoading, error } = useGitHubStats();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Unable to load GitHub profile
        </CardContent>
      </Card>
    );
  }

  const { user, totalStars, totalForks, topLanguages } = stats;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Image
            src={user.avatar_url}
            alt={user.name || user.login}
            width={80}
            height={80}
            className="rounded-full"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold">{user.name || user.login}</h3>
            <p className="text-muted-foreground">@{user.login}</p>
            {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {user.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{user.location}</span>
            </div>
          )}
          {user.blog && (
            <Link
              href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground"
            >
              <LinkIcon className="h-4 w-4" />
              <span>Website</span>
            </Link>
          )}
          {user.twitter_username && (
            <Link
              href={`https://twitter.com/${user.twitter_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground"
            >
              <Twitter className="h-4 w-4" />
              <span>@{user.twitter_username}</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{user.public_repos}</div>
            <div className="text-xs text-muted-foreground">Repositories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalStars}</div>
            <div className="text-xs text-muted-foreground">Stars</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.followers}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalForks}</div>
            <div className="text-xs text-muted-foreground">Forks</div>
          </div>
        </div>

        {topLanguages.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Top Languages</h4>
            <div className="flex flex-wrap gap-2">
              {topLanguages.map(({ language, count }) => (
                <span
                  key={language}
                  className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                >
                  {language} ({count})
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-foreground hover:underline"
        >
          View full profile on GitHub
        </Link>
      </CardContent>
    </Card>
  );
}
