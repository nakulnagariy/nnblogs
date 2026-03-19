import { getProjects, getFeaturedProjects } from '@/lib/supabase/queries';
import { ProjectsClient } from '@/components/projects/ProjectsClient';

export const revalidate = 3600;

export default async function ProjectsPage() {
  const [featuredProjects, allProjects] = await Promise.all([
    getFeaturedProjects(),
    getProjects(),
  ]);

  return (
    <ProjectsClient
      featuredProjects={featuredProjects}
      allProjects={allProjects}
      githubUrl={`https://github.com/${process.env.GITHUB_USERNAME || ''}`}
    />
  );
}
