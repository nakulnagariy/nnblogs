import { HeroSection, FeaturedWorkSection } from '@/components/home';
import { getFeaturedPosts } from '@/lib/content/posts';

export default async function HomePage() {
  const featuredPosts = await getFeaturedPosts(3);
  const articles = featuredPosts.map((post) => ({
    category: post.category,
    title: post.title,
    excerpt: post.excerpt || '',
    href: `/blog/${post.slug}`,
  }));

  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedWorkSection articles={articles} />
    </div>
  );
}
