import { unstable_cache } from "next/cache";
import { createClient } from "./client";

const supabase = createClient();
import type {
  BlogPost,
  Video,
  Project,
  Category,
  SearchResult,
  PaginatedResponse,
  TopicCategory,
  Topic,
  TopicDetail,
  Flashcard,
  InterviewQuestion,
  Difficulty,
} from "@/types";

// Blog Posts
export async function getPosts(
  page: number = 1,
  pageSize: number = 10,
  category?: string,
): Promise<PaginatedResponse<BlogPost>> {
  let query = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

async function _getFeaturedPosts(limit: number): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("views", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export const getFeaturedPosts = unstable_cache(
  _getFeaturedPosts,
  ["featured-posts"],
  { revalidate: 300, tags: ["posts"] }, // 5-minute cache
);

export async function getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * Increment a post's view count using Supabase RPC function
 * Safe to call multiple times - the RPC handles the database update
 * Non-blocking: Errors are logged but don't interrupt user experience
 */
export async function incrementPostViews(slug: string): Promise<void> {
  try {
    const { error } = await supabase.rpc("increment_post_views", {
      post_slug: slug,
    });
    if (error) {
      console.error("Failed to increment post views:", error);
      // Don't throw - view tracking shouldn't break user experience
    }
  } catch (err) {
    console.error("Error calling increment_post_views RPC:", err);
    // Silent fail - view tracking is non-critical
  }
}

// Videos
export async function getVideos(
  page: number = 1,
  pageSize: number = 10,
  category?: string,
): Promise<PaginatedResponse<Video>> {
  let query = supabase
    .from("videos")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

// Projects
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

async function _getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export const getFeaturedProjects = unstable_cache(
  _getFeaturedProjects,
  ["featured-projects"],
  { revalidate: 300, tags: ["projects"] }, // 5-minute cache
);
// Get single project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }
  return data;
}

// Get related projects by technology
export async function getRelatedProjects(
  projectId: string,
  technologies: string[],
  limit: number = 3,
): Promise<Project[]> {
  // Get projects that share at least one technology
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .neq("id", projectId)
    .overlaps("technologies", technologies)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching related projects:", error);
    return [];
  }
  return data || [];
}
// Categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return data || [];
}

// Search
export async function searchContent(query: string): Promise<SearchResult[]> {
  const searchTerm = `%${query}%`;

  // Search posts
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, category, created_at")
    .eq("published", true)
    .or(
      `title.ilike.${searchTerm},content.ilike.${searchTerm},excerpt.ilike.${searchTerm}`,
    )
    .limit(10);

  // Search videos
  const { data: videos } = await supabase
    .from("videos")
    .select("id, title, slug, description, category, created_at")
    .eq("published", true)
    .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
    .limit(10);

  // Search projects
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, description, created_at")
    .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
    .limit(10);

  // Search topics
  const { data: topics } = await supabase
    .from("topics")
    .select("id, title, slug, category_id, category:topic_categories(slug), created_at")
    .eq("status", "published")
    .ilike("title", searchTerm)
    .limit(10);

  const results: SearchResult[] = [
    ...(posts || []).map((post) => ({
      id: post.id,
      type: "post" as const,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      category: post.category,
      created_at: post.created_at,
    })),
    ...(videos || []).map((video) => ({
      id: video.id,
      type: "video" as const,
      title: video.title,
      slug: video.slug,
      excerpt: video.description,
      category: video.category,
      created_at: video.created_at,
    })),
    ...(projects || []).map((project) => ({
      id: project.id,
      type: "project" as const,
      title: project.name,
      slug: project.name.toLowerCase().replace(/\s+/g, "-"),
      excerpt: project.description,
      created_at: project.created_at,
    })),
    ...(topics || []).map((topic) => ({
      id: topic.id,
      type: "topic" as const,
      title: topic.title,
      slug: topic.slug,
      excerpt: "",
      category: Array.isArray(topic.category) ? (topic.category[0]?.slug ?? "") : (topic.category as { slug: string } | null)?.slug ?? "",
      created_at: topic.created_at,
    })),
  ];

  return results.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

/**
 * Get related posts by category (excluding the current post)
 */
export async function getRelatedPosts(
  slug: string,
  category: string,
  limit: number = 3,
): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("category", category)
    .eq("published", true)
    .neq("slug", slug)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * Increment video views count
 */
export async function incrementVideoViews(slug: string): Promise<void> {
  const { error } = await supabase.rpc("increment_video_views", {
    video_slug: slug,
  });

  if (error) {
    console.error("Error incrementing video views:", error);
  }
}

/**
 * Get related videos by category (excluding the current video)
 */
export async function getRelatedVideos(
  slug: string,
  category: string,
  limit: number = 3,
): Promise<Video[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("category", category)
    .eq("published", true)
    .neq("slug", slug)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// ─── Interview Prep Queries ───────────────────────────────────────────────────

export async function getTopicCategories(): Promise<TopicCategory[]> {
  const { data, error } = await supabase
    .from("topic_categories")
    .select("*, topics(count)")
    .order("sort_order");

  if (error) throw error;

  return (data || []).map((row) => ({
    ...row,
    topic_count: (row.topics as { count: number }[])?.[0]?.count ?? 0,
  }));
}

export async function getTopicsByCategory(
  categorySlug: string,
  page: number = 1,
  pageSize: number = 20,
  difficulty?: Difficulty,
): Promise<PaginatedResponse<Topic>> {
  const { data: category } = await supabase
    .from("topic_categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) return { data: [], total: 0, page, pageSize, totalPages: 0 };

  let query = supabase
    .from("topics")
    .select("*, category:topic_categories(*)", { count: "exact" })
    .eq("category_id", category.id)
    .eq("status", "published")
    .order("sort_order");

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  const from = (page - 1) * pageSize;
  const { data, error, count } = await query.range(from, from + pageSize - 1);

  if (error) throw error;

  return {
    data: (data || []) as Topic[],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getTopicBySlug(
  categorySlug: string,
  topicSlug: string,
): Promise<TopicDetail | null> {
  const { data: topic, error: topicError } = await supabase
    .from("topics")
    .select("*, category:topic_categories(*)")
    .eq("slug", topicSlug)
    .eq("status", "published")
    .single();

  if (topicError || !topic) return null;

  if ((topic.category as TopicCategory)?.slug !== categorySlug) return null;

  const { data: contents } = await supabase
    .from("topic_content")
    .select("content_type, body")
    .eq("topic_id", topic.id);

  const { data: questions } = await supabase
    .from("interview_questions")
    .select("*")
    .eq("topic_id", topic.id)
    .order("difficulty");

  const notes = contents?.find((c) => c.content_type === "notes")?.body ?? null;
  const example = contents?.find((c) => c.content_type === "example")?.body ?? null;
  const assessment = contents?.find((c) => c.content_type === "assessment")?.body ?? null;

  let flashcards: Flashcard[] = [];
  const flashcardsRaw = contents?.find((c) => c.content_type === "flashcards")?.body;
  if (flashcardsRaw) {
    try {
      flashcards = JSON.parse(flashcardsRaw) as Flashcard[];
    } catch {
      flashcards = [];
    }
  }

  return {
    ...(topic as Topic),
    notes,
    example,
    assessment,
    flashcards,
    questions: (questions || []) as InterviewQuestion[],
  };
}

export async function incrementTopicViews(topicId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc("increment_topic_views", {
      topic_id: topicId,
    });
    // Silently ignore — RPC may not exist yet
  } catch {
    // Silent fail — view tracking is non-critical
  }
}

export async function getRelatedTopics(
  categorySlug: string,
  topicSlug: string,
  limit: number = 3,
): Promise<Topic[]> {
  const { data: category } = await supabase
    .from("topic_categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) return [];

  const { data, error } = await supabase
    .from("topics")
    .select("*, category:topic_categories(*)")
    .eq("category_id", category.id)
    .eq("status", "published")
    .neq("slug", topicSlug)
    .order("sort_order")
    .limit(limit);

  if (error) return [];
  return (data || []) as Topic[];
}
