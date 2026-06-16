import { NextResponse } from 'next/server';
import { createSessionClient, supabaseAdmin } from '@/lib/supabase/server';

interface PostStats {
  id: string;
  views: number;
  published: boolean;
}

interface VideoStats {
  id: string;
  views: number;
  published: boolean;
}

interface ProjectStats {
  id: string;
  featured: boolean;
}

export async function GET() {
  try {
    const supabase = await createSessionClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [postsResult, videosResult, projectsResult, recentPostsResult] = await Promise.all([
      supabaseAdmin.from('posts').select('id, views, published'),
      supabaseAdmin.from('videos').select('id, views, published'),
      supabaseAdmin.from('projects').select('id, featured'),
      supabaseAdmin
        .from('posts')
        .select('id, title, slug, published, created_at, views')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    const posts = (postsResult.data || []) as PostStats[];
    const totalPosts = posts.length;
    const publishedPosts = posts.filter((p) => p.published).length;
    const draftPosts = totalPosts - publishedPosts;
    const totalPostViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

    const videos = (videosResult.data || []) as VideoStats[];
    const totalVideos = videos.length;
    const publishedVideos = videos.filter((v) => v.published).length;
    const totalVideoViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);

    const projects = (projectsResult.data || []) as ProjectStats[];
    const totalProjects = projects.length;
    const featuredProjects = projects.filter((p) => p.featured).length;

    const totalViews = totalPostViews + totalVideoViews;

    return NextResponse.json({
      stats: {
        posts: { total: totalPosts, published: publishedPosts, drafts: draftPosts, views: totalPostViews },
        videos: { total: totalVideos, published: publishedVideos, views: totalVideoViews },
        projects: { total: totalProjects, featured: featuredProjects },
        totalViews,
      },
      recentPosts: recentPostsResult.data || [],
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
