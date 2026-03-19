import {
  HeroSection,
  AboutSection,
  JourneySection,
  ExpertiseSection,
  FeaturedWorkSection,
  SelectedWorksSection,
  CTASection,
} from '@/components/home';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { getFeaturedPosts, getFeaturedProjects } from '@/lib/supabase/queries';

export default async function HomePage() {
  const [featuredPosts, featuredProjects] = await Promise.all([
    getFeaturedPosts(3),
    getFeaturedProjects(),
  ]);

  return (
    <>
      <ScrollProgress position="top" />
      <div className="flex flex-col">
        <HeroSection />
        <AboutSection />
        <JourneySection />
        <ExpertiseSection />
        <FeaturedWorkSection posts={featuredPosts} />
        <SelectedWorksSection projects={featuredProjects.slice(0, 3)} />
        <CTASection />
      </div>
    </>
  );
}
