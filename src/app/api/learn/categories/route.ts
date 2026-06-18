import { NextResponse } from "next/server";
import { getTopicCategories } from "@/lib/supabase/queries";

export async function GET() {
  try {
    const categories = await getTopicCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching topic categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
