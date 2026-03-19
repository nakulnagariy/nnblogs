import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Validate user has required role (ADMIN or EDITOR)
 */
async function checkUserRole() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { authorized: false, userId: null };
  }

  const role = (sessionClaims as any)?.role || "VIEWER";
  const isAuthorized = ["ADMIN", "EDITOR"].includes(role);

  return { authorized: isAuthorized, userId, role };
}

/**
 * GET /api/admin/posts/[id] - Fetch single post for editing
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await checkUserRole();
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "Unauthorized - Admin or Editor role required" },
        { status: 403 },
      );
    }
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 },
      );
    }

    const { data: post, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .eq("id", id)
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
