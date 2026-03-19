import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  createPost,
  updatePost,
  deletePost,
} from "@/lib/supabase/admin-queries";
import { generateSlug } from "@/lib/markdown";
/**
 * Validate user has required role (ADMIN or EDITOR)
 */
async function checkUserRole() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { authorized: false, userId: null };
  }

  // Check user role from Clerk sessionClaims (stored at top level)
  const role = (sessionClaims as any)?.role || "VIEWER";
  const isAuthorized = ["ADMIN", "EDITOR"].includes(role);

  return { authorized: isAuthorized, userId, role };
}

/**
 * Check if slug already exists (for uniqueness validation)
 */
async function checkSlugExists(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  let query = supabaseAdmin.from("posts").select("id").eq("slug", slug);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.limit(1);

  if (error) {
    console.error("Error checking slug:", error);
    return false;
  }

  return (data?.length ?? 0) > 0;
}

interface PostData {
  title?: unknown;
  slug?: unknown;
  category?: unknown;
  content?: unknown;
  status?: unknown;
  [key: string]: unknown;
}

/**
 * Validate required post fields
 */
function validatePostData(data: PostData): { valid: boolean; error?: string } {
  if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
    return { valid: false, error: "Title is required and must be a string" };
  }

  if (!data.slug || typeof data.slug !== "string" || !data.slug.trim()) {
    return { valid: false, error: "Slug is required and must be a string" };
  }

  if (!data.category || typeof data.category !== "string") {
    return { valid: false, error: "Category is required" };
  }

  if (
    !data.content ||
    typeof data.content !== "string" ||
    !data.content.trim()
  ) {
    return { valid: false, error: "Content is required" };
  }

  if (data.status && !["draft", "published"].includes(data.status as string)) {
    return { valid: false, error: 'Status must be "draft" or "published"' };
  }

  return { valid: true };
}

/**
 * GET /api/admin/posts - List all posts with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkUserRole();
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "Unauthorized - Admin or Editor role required" },
        { status: 401 },
      );
    }

    // Get pagination params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "20", 10),
      100,
    );
    const offset = (page - 1) * limit;

    // Get total count
    const { count } = await supabaseAdmin
      .from("posts")
      .select("*", { count: "exact", head: true });

    // Get paginated posts
    const { data: posts, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      data: posts || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

/**
 * POST /api/admin/posts - Create new post
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkUserRole();
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "Unauthorized - Admin or Editor role required" },
        { status: 403 },
      );
    }

    if (!authResult.userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const body = await request.json();

    // Generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = generateSlug(body.title);
    }

    // Validate post data
    const validation = validatePostData(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Check slug uniqueness
    const slugExists = await checkSlugExists(body.slug);
    if (slugExists) {
      return NextResponse.json(
        { error: `A post with slug "${body.slug}" already exists` },
        { status: 400 },
      );
    }

    // Create post with metadata
    const post = await createPost({
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      featured_image: body.featuredImage,
      category: body.category,
      tags: body.tags || [],
      author_id: authResult.userId,
      published: body.status === "published",
      // Note: metaTitle and metaDescription are sent by form but not stored in DB
      // These could be added to posts table in a future migration
    });

    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/posts - Update existing post
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkUserRole();
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "Unauthorized - Admin or Editor role required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 },
      );
    }

    // Validate individual provided fields
    if (
      updates.title !== undefined &&
      typeof updates.title === "string" &&
      !updates.title.trim()
    ) {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 },
      );
    }

    if (
      updates.slug !== undefined &&
      typeof updates.slug === "string" &&
      !updates.slug.trim()
    ) {
      return NextResponse.json(
        { error: "Slug cannot be empty" },
        { status: 400 },
      );
    }

    if (
      updates.content !== undefined &&
      typeof updates.content === "string" &&
      !updates.content.trim()
    ) {
      return NextResponse.json(
        { error: "Content cannot be empty" },
        { status: 400 },
      );
    }

    if (updates.status && !["draft", "published"].includes(updates.status)) {
      return NextResponse.json(
        { error: 'Status must be "draft" or "published"' },
        { status: 400 },
      );
    }

    // Check slug uniqueness if slug is being updated
    if (updates.slug) {
      const slugExists = await checkSlugExists(updates.slug, id);
      if (slugExists) {
        return NextResponse.json(
          { error: `A post with slug "${updates.slug}" already exists` },
          { status: 400 },
        );
      }
    }

    // Map camelCase to snake_case for database fields
    const dbUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title) dbUpdates.title = updates.title;
    if (updates.slug) dbUpdates.slug = updates.slug;
    if (updates.content) dbUpdates.content = updates.content;
    if (updates.excerpt) dbUpdates.excerpt = updates.excerpt;
    if (updates.category) dbUpdates.category = updates.category;
    if (updates.tags) dbUpdates.tags = updates.tags;
    // Note: readTime is calculated on the frontend but not stored in the database
    if (updates.featuredImage !== undefined)
      dbUpdates.featured_image = updates.featuredImage;
    if (updates.status) dbUpdates.published = updates.status === "published";

    // Update post
    const post = await updatePost(id, dbUpdates);

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/posts?id=postId - Delete post
 */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await checkUserRole();
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "Unauthorized - Admin or Editor role required" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required (use ?id=postId)" },
        { status: 400 },
      );
    }

    // Delete post (featured image deletion should be handled by Supabase storage policies)
    await deletePost(id);

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
