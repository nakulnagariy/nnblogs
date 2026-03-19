'use client';

import { useEffect, useState } from 'react';
import { FileText, Video, FolderGit2, Plus, Eye, Edit, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface Stats {
  posts: {
    total: number;
    published: number;
    drafts: number;
    views: number;
  };
  videos: {
    total: number;
    published: number;
    views: number;
  };
  projects: {
    total: number;
    featured: number;
  };
  totalViews: number;
}

interface RecentPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  views: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/admin/stats');

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStats(data.stats);
      setRecentPosts(data.recentPosts || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 flex items-center gap-3 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">Error loading dashboard</p>
            <p className="text-xs text-destructive/80 mt-0.5">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-1">Overview</p>
          <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/posts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Total Views */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                    <p className="text-3xl font-bold mt-2">{stats?.totalViews.toLocaleString()}</p>
                  </div>
                  <Eye className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  Across all content
                </div>
              </div>
            </Card>

            {/* Posts Stats */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Blog Posts</p>
                    <p className="text-3xl font-bold mt-2">{stats?.posts.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-500" />
                </div>
                <div className="mt-4 flex items-center gap-3 text-sm">
                  <span className="text-green-600">{stats?.posts.published} published</span>
                  <span className="text-yellow-600">{stats?.posts.drafts} drafts</span>
                </div>
              </div>
            </Card>

            {/* Videos Stats */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Videos</p>
                    <p className="text-3xl font-bold mt-2">{stats?.videos.total}</p>
                  </div>
                  <Video className="h-8 w-8 text-red-500" />
                </div>
                <div className="mt-4 flex items-center gap-3 text-sm">
                  <span className="text-green-600">{stats?.videos.published} published</span>
                  <span className="text-muted-foreground">{stats?.videos.views} views</span>
                </div>
              </div>
            </Card>

            {/* Projects Stats */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Projects</p>
                    <p className="text-3xl font-bold mt-2">{stats?.projects.total}</p>
                  </div>
                  <FolderGit2 className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-muted-foreground">{stats?.projects.featured} featured</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Posts */}
            <Card className="lg:col-span-2 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold">Recent Posts</h2>
                  <Link href="/admin/posts">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
                {recentPosts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No posts yet</p>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {recentPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 rounded-xl hover:bg-muted/40 transition-colors border border-transparent hover:border-border/40"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-medium truncate max-w-[200px] sm:max-w-none">{post.title}</h3>
                            <Badge variant={post.published ? 'default' : 'secondary'} className="text-xs shrink-0">
                              {post.published ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                            <span className="truncate">{formatDate(post.created_at)}</span>
                            <span className="flex items-center gap-1 shrink-0">
                              <Eye className="h-3 w-3" />
                              {post.views}
                            </span>
                          </div>
                        </div>
                        <Link href={`/admin/posts/${post.id}`} className="shrink-0">
                          <Button variant="ghost" size="icon" className="w-9 h-9">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="overflow-hidden">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Quick Actions</h2>
                <div className="space-y-2 sm:space-y-3">
                  <Link href="/admin/analytics" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </Link>
                  <Link href="/admin/posts" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Manage Posts
                    </Button>
                  </Link>
                  <Link href="/admin/posts/new" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      New Post
                    </Button>
                  </Link>
                  <Link href="/admin/videos" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Manage Videos
                    </Button>
                  </Link>
                  <Link href="/admin/projects" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <FolderGit2 className="h-4 w-4 mr-2" />
                      Manage Projects
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
