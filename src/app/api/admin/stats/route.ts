import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabase/server";

interface SessionClaims {
  role?: string;
}

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
    const { sessionClaims } = await auth();
    const role = (sessionClaims as SessionClaims)?.role;

    if (!role || !["ADMIN", "EDITOR"].includes(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = supabaseAdmin;

    // Fetch all stats in parallel
    const [postsResult, videosResult, projectsResult, recentPostsResult] =
      await Promise.all([
        // Total posts and stats
        supabase.from("posts").select("id, views, published"),
        // Total videos
        supabase.from("videos").select("id, views, published"),
        // Total projects
        supabase.from("projects").select("id, featured"),
        // Recent posts
        supabase
          .from("posts")
          .select("id, title, slug, published, created_at, views")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

    // Calculate post statistics
    const posts = (postsResult.data || []) as PostStats[];
    const totalPosts = posts.length;
    const publishedPosts = posts.filter((p) => p.published).length;
    const draftPosts = totalPosts - publishedPosts;
    const totalPostViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

    // Calculate video statistics
    const videos = (videosResult.data || []) as VideoStats[];
    const totalVideos = videos.length;
    const publishedVideos = videos.filter((v) => v.published).length;
    const totalVideoViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);

    // Calculate project statistics
    const projects = (projectsResult.data || []) as ProjectStats[];
    const totalProjects = projects.length;
    const featuredProjects = projects.filter((p) => p.featured).length;

    // Total views across all content
    const totalViews = totalPostViews + totalVideoViews;

    return NextResponse.json({
      stats: {
        posts: {
          total: totalPosts,
          published: publishedPosts,
          drafts: draftPosts,
          views: totalPostViews,
        },
        videos: {
          total: totalVideos,
          published: publishedVideos,
          views: totalVideoViews,
        },
        projects: {
          total: totalProjects,
          featured: featuredProjects,
        },
        totalViews,
      },
      recentPosts: recentPostsResult.data || [],
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 },
    );
  }
}
