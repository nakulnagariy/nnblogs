import { NextRequest, NextResponse } from "next/server";
import { getTopicBySlug } from "@/lib/supabase/queries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ category: string; topic: string }> },
) {
  try {
    const { category, topic } = await params;

    if (!category || !topic) {
      return NextResponse.json(
        { error: "Category and topic slugs are required" },
        { status: 400 },
      );
    }

    const topicDetail = await getTopicBySlug(category, topic);

    if (!topicDetail) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json(topicDetail);
  } catch (error) {
    console.error("Error fetching topic:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 },
    );
  }
}
