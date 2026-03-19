import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Github, ExternalLink, Calendar } from 'lucide-react';
import { getProjectById, getRelatedProjects } from '@/lib/supabase/queries';
import { ProjectTracker } from '@/components/analytics';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
      type: 'website',
      images: project.image_url ? [project.image_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.name,
      description: project.description,
      images: project.image_url ? [project.image_url] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  // Get related projects based on shared technologies
  const relatedProjects = await getRelatedProjects(project.id, project.technologies, 3);

  return (
    <>
      <ProjectTracker projectId={project.id} projectName={project.name} technologies={project.technologies} />
      <article className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Back Button */}
        <Link href="/projects">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {project.featured && (
              <Badge variant="secondary" className="bg-yellow-500/90 text-yellow-950">
                ⭐ Featured
              </Badge>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <time dateTime={project.created_at}>{formatDate(project.created_at)}</time>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
          <p className="text-xl text-muted-foreground mb-6">{project.description}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>
                  <Github className="h-4 w-4 mr-2" />
                  View Source Code
                </Button>
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Demo
                </Button>
              </a>
            )}
          </div>
        </header>

        {/* Project Image */}
        {project.image_url && (
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={project.image_url}
              alt={project.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Tech Stack */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Technologies Used</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Long Description */}
        {project.long_description && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">About this Project</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {project.long_description}
              </p>
            </div>
          </Card>
        )}

        {/* Project Links */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Links</h2>
          <div className="space-y-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Github className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">Source Code</div>
                  <div className="text-sm text-muted-foreground">{project.github_url}</div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">Live Demo</div>
                  <div className="text-sm text-muted-foreground">{project.live_url}</div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            )}
          </div>
        </Card>
      </article>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold mb-8">Related Projects</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  href={`/projects/${relatedProject.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="aspect-video relative bg-muted">
                      {relatedProject.image_url ? (
                        <Image
                          src={relatedProject.image_url}
                          alt={relatedProject.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">📦</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-foreground transition-colors line-clamp-2 mb-2">
                        {relatedProject.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {relatedProject.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {relatedProject.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {relatedProject.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{relatedProject.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
