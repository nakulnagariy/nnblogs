import { NextRequest, NextResponse } from "next/server";
import { getTopicsByCategory } from "@/lib/supabase/queries";
import type { Difficulty } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> },
) {
  try {
    const { category } = await params;
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20")));
    const difficulty = searchParams.get("difficulty") as Difficulty | null;

    const result = await getTopicsByCategory(
      category,
      page,
      pageSize,
      difficulty ?? undefined,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 },
    );
  }
}
