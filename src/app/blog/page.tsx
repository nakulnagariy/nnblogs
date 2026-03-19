import { BlogClient } from '@/components/blog/BlogClient';

export const revalidate = 3600;

export default function BlogPage() {
  return <BlogClient />;
}
