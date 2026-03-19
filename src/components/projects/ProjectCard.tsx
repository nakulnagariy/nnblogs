'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  maxTechDisplay?: number;
}

export function ProjectCard({ project, featured = false, maxTechDisplay = 4 }: ProjectCardProps) {
  const handleExternalClick = (e: React.MouseEvent, url: string, type: 'github' | 'demo') => {
    e.preventDefault();
    e.stopPropagation();
    
    // Track the click
    if (type === 'github') {
      analytics.project.clickGithub(project.id, project.name);
    } else {
      analytics.project.clickLiveDemo(project.id, project.name);
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Link href={`/projects/${project.id}`} className="group">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        {/* Project Image */}
        <div className="aspect-video relative bg-muted overflow-hidden">
          {project.image_url ? (
            <Image
              src={project.image_url}
              alt={project.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className={featured ? 'text-6xl' : 'text-5xl'}>📦</span>
            </div>
          )}
          {featured && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-yellow-500/90 text-yellow-950">
                ⭐ Featured
              </Badge>
            </div>
          )}
        </div>

        {/* Project Content */}
        <div className={featured ? 'p-6 flex-1 flex flex-col' : 'p-5 flex-1 flex flex-col'}>
          <h3 className={`font-semibold mb-2 group-hover:text-foreground transition-colors ${featured ? 'text-xl' : 'text-lg'}`}>
            {project.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className={`flex flex-wrap ${featured ? 'gap-2 mb-4' : 'gap-1.5 mb-3'}`}>
            {project.technologies.slice(0, maxTechDisplay).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > maxTechDisplay && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - maxTechDisplay}
              </Badge>
            )}
          </div>

          {/* Links */}
          <div className="flex gap-2">
            {project.github_url && (
              <Button
                variant={featured ? 'outline' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={(e) => handleExternalClick(e, project.github_url!, 'github')}
              >
                <Github className={`${featured ? 'h-4 w-4' : 'h-3.5 w-3.5'} ${featured ? 'mr-2' : 'mr-1.5'}`} />
                Code
              </Button>
            )}
            {project.live_url && (
              <Button
                variant={featured ? 'outline' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={(e) => handleExternalClick(e, project.live_url!, 'demo')}
              >
                <ExternalLink className={`${featured ? 'h-4 w-4' : 'h-3.5 w-3.5'} ${featured ? 'mr-2' : 'mr-1.5'}`} />
                {featured ? 'Live' : 'Demo'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
