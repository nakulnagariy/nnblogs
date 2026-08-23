import { HeroSection, FeaturedWorkSection } from '@/components/home';
import { getFeaturedPosts } from '@/lib/supabase/queries';

export default async function HomePage() {
  const featuredPosts = await getFeaturedPosts(3);

  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedWorkSection posts={featuredPosts} />
    </div>
  );
}
