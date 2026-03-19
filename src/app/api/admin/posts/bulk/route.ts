import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { sessionClaims } = await auth();
    const role = (sessionClaims as any)?.role;

    if (!role || !["ADMIN", "EDITOR"].includes(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, postIds } = body;

    if (
      !action ||
      !postIds ||
      !Array.isArray(postIds) ||
      postIds.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields: action and postIds" },
        { status: 400 },
      );
    }

    const supabase = supabaseAdmin;

    switch (action) {
      case "publish": {
        const { error } = await supabase
          .from("posts")
          .update({ published: true, updated_at: new Date().toISOString() })
          .in("id", postIds);

        if (error) {
          console.error("Error publishing posts:", error);
          return NextResponse.json(
            { error: "Failed to publish posts" },
            { status: 500 },
          );
        }

        return NextResponse.json({
          success: true,
          message: `Successfully published ${postIds.length} post(s)`,
        });
      }

      case "unpublish": {
        const { error } = await supabase
          .from("posts")
          .update({ published: false, updated_at: new Date().toISOString() })
          .in("id", postIds);

        if (error) {
          console.error("Error unpublishing posts:", error);
          return NextResponse.json(
            { error: "Failed to unpublish posts" },
            { status: 500 },
          );
        }

        return NextResponse.json({
          success: true,
          message: `Successfully unpublished ${postIds.length} post(s)`,
        });
      }

      case "delete": {
        const { error } = await supabase
          .from("posts")
          .delete()
          .in("id", postIds);

        if (error) {
          console.error("Error deleting posts:", error);
          return NextResponse.json(
            { error: "Failed to delete posts" },
            { status: 500 },
          );
        }

        return NextResponse.json({
          success: true,
          message: `Successfully deleted ${postIds.length} post(s)`,
        });
      }

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Supported actions: publish, unpublish, delete",
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Error in bulk actions:", error);
    return NextResponse.json(
      { error: "Failed to perform bulk action" },
      { status: 500 },
    );
  }
}
