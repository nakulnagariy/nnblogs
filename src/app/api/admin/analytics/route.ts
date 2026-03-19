import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims as Record<string, unknown>)?.role as string;
    if (!userId || (role !== "ADMIN" && role !== "EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceIso = since.toISOString();

    const [topPostsResult, topVideosResult] = await Promise.all([
      supabaseAdmin
        .from("posts")
        .select("id, title, slug, views, category")
        .eq("published", true)
        .gte("created_at", sinceIso)
        .order("views", { ascending: false })
        .limit(10),
      supabaseAdmin
        .from("videos")
        .select("id, title, slug, views, category")
        .eq("published", true)
        .gte("created_at", sinceIso)
        .order("views", { ascending: false })
        .limit(10),
    ]);

    return NextResponse.json({
      topPosts: topPostsResult.data || [],
      topVideos: topVideosResult.data || [],
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
