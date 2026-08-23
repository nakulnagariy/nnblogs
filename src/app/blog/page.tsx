import { BlogClient } from '@/components/blog/BlogClient';
import { getPosts, getCategories } from '@/lib/content/posts';

export const revalidate = 3600;

interface BlogPageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const category = params.category;

  const [postsResult, categories] = await Promise.all([
    getPosts(page, 12, category),
    getCategories(),
  ]);

  return (
    <BlogClient
      posts={postsResult.data}
      page={postsResult.page}
      totalPages={postsResult.totalPages}
      categories={categories}
      activeCategory={category ?? null}
    />
  );
}
