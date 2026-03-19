'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  Eye,
  TrendingUp,
  FileText,
  Video,
  FolderGit2,
  ExternalLink,
} from 'lucide-react';

interface StatsData {
  stats: {
    posts: { total: number; published: number; drafts: number; views: number };
    videos: { total: number; published: number; views: number };
    projects: { total: number; featured: number };
    totalViews: number;
  };
}

interface TopPost {
  id: string;
  title: string;
  slug: string;
  views: number;
  category: string;
}

interface TopVideo {
  id: string;
  title: string;
  slug: string;
  views: number;
  category: string;
}

interface AnalyticsData {
  topPosts: TopPost[];
  topVideos: TopVideo[];
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData['stats'] | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch(`/api/admin/analytics?days=${days}`).then((r) => r.json()),
    ])
      .then(([statsData, analyticsData]: [StatsData, AnalyticsData]) => {
        setStats(statsData.stats);
        setAnalytics(analyticsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [timeRange]);

  if (loading) {
    return (
      <div className="p-8 max-w-5xl">
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 max-w-5xl">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Track your content performance and audience engagement
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-foreground hover:bg-muted/70'
                }`}
              >
                {range === '7d' && 'Last 7 Days'}
                {range === '30d' && 'Last 30 Days'}
                {range === '90d' && 'Last 90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-3xl font-bold mt-1">{stats.totalViews.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Posts + Videos</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                <Eye className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published Posts</p>
                <p className="text-3xl font-bold mt-1">{stats.posts.published.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{stats.posts.drafts} drafts</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published Videos</p>
                <p className="text-3xl font-bold mt-1">{stats.videos.published.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.videos.views.toLocaleString()} views
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                <Video className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projects</p>
                <p className="text-3xl font-bold mt-1">{stats.projects.total.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.projects.featured} featured
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                <FolderGit2 className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </Card>
        </div>

        {/* Top Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Top Posts
            </h2>
            {analytics?.topPosts && analytics.topPosts.length > 0 ? (
              <div className="space-y-4">
                {analytics.topPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{post.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {post.views.toLocaleString()} views • {post.category}
                      </p>
                    </div>
                    <Badge variant="secondary">{index + 1}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                No posts published in this period.
              </p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Video className="h-5 w-5" />
              Top Videos
            </h2>
            {analytics?.topVideos && analytics.topVideos.length > 0 ? (
              <div className="space-y-4">
                {analytics.topVideos.map((video, index) => (
                  <div key={video.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                      <Video className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{video.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {video.views.toLocaleString()} views • {video.category}
                      </p>
                    </div>
                    <Badge variant="secondary">{index + 1}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                No videos published in this period.
              </p>
            )}
          </Card>
        </div>

        {/* Total views breakdown */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Views Breakdown
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Blog Posts</span>
                <span className="text-sm text-muted-foreground">
                  {stats.posts.views.toLocaleString()} views
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground rounded-full transition-all"
                  style={{
                    width: stats.totalViews > 0
                      ? `${Math.round((stats.posts.views / stats.totalViews) * 100)}%`
                      : '0%',
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Videos</span>
                <span className="text-sm text-muted-foreground">
                  {stats.videos.views.toLocaleString()} views
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground rounded-full transition-all"
                  style={{
                    width: stats.totalViews > 0
                      ? `${Math.round((stats.videos.views / stats.totalViews) * 100)}%`
                      : '0%',
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Google Analytics CTA */}
        <Card className="p-6 bg-muted/40 border-border/40">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
              <ExternalLink className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Connect Google Analytics for visitor metrics</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Unique visitors, bounce rate, session duration, traffic sources, and real-time data
                are available through Google Analytics. Your{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  NEXT_PUBLIC_GA_MEASUREMENT_ID
                </code>{' '}
                is already configured — view your data directly in the GA dashboard.
              </p>
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4"
              >
                Open Google Analytics
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
