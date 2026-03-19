'use client';

import { TrendingUp, GitFork, Star, Code } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useGitHubStats } from '@/hooks/useGitHub';

export function GitHubStats() {
  const { data: stats, isLoading, error } = useGitHubStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Unable to load GitHub stats
      </div>
    );
  }

  const { totalStars, totalForks, totalRepos, topLanguages } = stats;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Stars */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Stars</p>
              <p className="text-3xl font-bold mt-2">{totalStars.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        {/* Total Forks */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Forks</p>
              <p className="text-3xl font-bold mt-2">{totalForks.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
              <GitFork className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </Card>

        {/* Total Repos */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Repositories</p>
              <p className="text-3xl font-bold mt-2">{totalRepos}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Top Languages */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-foreground" />
          <h3 className="text-lg font-semibold">Most Used Languages</h3>
        </div>
        <div className="space-y-4">
          {topLanguages.map((lang, index) => {
            const percentage = (lang.count / totalRepos) * 100;
            const isTop = index === 0;
            
            return (
              <div key={lang.language} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={isTop ? "default" : "secondary"}
                      className="min-w-[100px] justify-center"
                    >
                      {lang.language}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {lang.count} {lang.count === 1 ? 'repo' : 'repos'}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isTop
                        ? 'bg-gradient-to-r from-primary to-primary/80'
                        : 'bg-muted-foreground/30'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Activity Insight */}
      <Card className="p-6 bg-muted/40 border-border/60">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-foreground/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h4 className="font-semibold mb-1">Active Developer</h4>
            <p className="text-sm text-muted-foreground">
              {stats.followers} developers following with {totalStars} stars across {totalRepos} repositories. 
              {topLanguages[0] && ` Primarily working with ${topLanguages[0].language}.`}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
