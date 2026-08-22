import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/videos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Dynamic blog post routes
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("published", true);

  const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Dynamic video routes
  const { data: videos } = await supabase
    .from("videos")
    .select("slug, updated_at")
    .eq("published", true);

  const videoRoutes: MetadataRoute.Sitemap = (videos ?? []).map((video) => ({
    url: `${siteUrl}/videos/${video.slug}`,
    lastModified: new Date(video.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Dynamic project routes
  const { data: projects } = await supabase
    .from("projects")
    .select("id, updated_at");

  const projectRoutes: MetadataRoute.Sitemap = (projects ?? []).map((project) => ({
    url: `${siteUrl}/projects/${project.id}`,
    lastModified: new Date(project.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...videoRoutes, ...projectRoutes];
}
