import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 },
      );
    }

    // Public route: use the RLS-bound anon client and only ever return
    // published posts. Draft/unpublished content must go through the
    // authenticated /api/admin/posts routes instead.
    const supabase = createClient();
    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .eq("published", true)
      .single();

    if (error) {
      console.error("Supabase error fetching post:", error);
      return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
