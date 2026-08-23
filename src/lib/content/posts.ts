import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import type { BlogPost, SearchResult, PaginatedResponse } from '@/types';

const reader = createReader(process.cwd(), keystaticConfig);

type PostEntry = Awaited<ReturnType<typeof reader.collections.posts.read>>;

function toBlogPost(slug: string, entry: NonNullable<PostEntry>): BlogPost {
  return {
    id: slug,
    title: entry.title,
    slug,
    content: entry.content,
    excerpt: entry.excerpt,
    featured_image: entry.featuredImage ? `/images/posts/${entry.featuredImage}` : undefined,
    category: entry.category,
    tags: [...entry.tags],
    featured: entry.featured,
    created_at: entry.createdAt,
    updated_at: entry.createdAt,
  };
}

async function allPosts(): Promise<{ slug: string; post: BlogPost; draft: boolean }[]> {
  const entries = await reader.collections.posts.all();
  return entries.map(({ slug, entry }) => ({
    slug,
    post: toBlogPost(slug, entry),
    draft: entry.draft,
  }));
}

function byNewest(a: { post: BlogPost }, b: { post: BlogPost }) {
  return new Date(b.post.created_at).getTime() - new Date(a.post.created_at).getTime();
}

export async function getPosts(
  page: number = 1,
  pageSize: number = 10,
  category?: string,
): Promise<PaginatedResponse<BlogPost>> {
  let published = (await allPosts()).filter((p) => !p.draft);
  if (category) {
    published = published.filter((p) => p.post.category === category);
  }
  published.sort(byNewest);

  const total = published.length;
  const from = (page - 1) * pageSize;
  const data = published.slice(from, from + pageSize).map((p) => p.post);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const entry = await reader.collections.posts.read(slug);
  if (!entry) return null;
  return toBlogPost(slug, entry);
}

export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
  const published = (await allPosts()).filter((p) => !p.draft);
  published.sort(byNewest);

  const featured = published.filter((p) => p.post.featured).slice(0, limit);
  if (featured.length >= limit) return featured.map((p) => p.post);

  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const fill = published
    .filter((p) => !featuredSlugs.has(p.slug))
    .slice(0, limit - featured.length);

  return [...featured, ...fill].map((p) => p.post);
}

export async function getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
  const published = (await allPosts()).filter((p) => !p.draft);
  published.sort(byNewest);
  return published.slice(0, limit).map((p) => p.post);
}

export async function getRelatedPosts(
  slug: string,
  category: string,
  limit: number = 3,
): Promise<BlogPost[]> {
  const related = (await allPosts()).filter(
    (p) => !p.draft && p.post.category === category && p.slug !== slug,
  );
  related.sort(byNewest);
  return related.slice(0, limit).map((p) => p.post);
}

export async function getCategories(): Promise<string[]> {
  const published = (await allPosts()).filter((p) => !p.draft);
  const categories = new Set(published.map((p) => p.post.category).filter(Boolean));
  return [...categories].sort();
}

export async function searchContent(query: string): Promise<SearchResult[]> {
  const term = query.toLowerCase();
  const published = (await allPosts()).filter((p) => !p.draft);

  const results = published
    .filter(
      (p) =>
        p.post.title.toLowerCase().includes(term) ||
        p.post.excerpt.toLowerCase().includes(term) ||
        p.post.content.toLowerCase().includes(term),
    )
    .map((p) => ({
      id: p.post.id,
      type: 'post' as const,
      title: p.post.title,
      slug: p.post.slug,
      excerpt: p.post.excerpt,
      category: p.post.category,
      created_at: p.post.created_at,
    }))
    .slice(0, 10);

  return results.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}
