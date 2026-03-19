'use client';

import { useState } from 'react';
import { GitHubProfile } from '@/components/github/GitHubProfile';
import { GitHubReposList } from '@/components/github/GitHubReposList';
import { GitHubStats } from '@/components/github/GitHubStats';
import { ProjectCard, ProjectTimeline } from '@/components/projects';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { Grid3x3, List } from 'lucide-react';
import type { Project } from '@/types';

interface ProjectsClientProps {
  featuredProjects: Project[];
  allProjects: Project[];
  githubUrl?: string;
}

export function ProjectsClient({ featuredProjects, allProjects, githubUrl }: ProjectsClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('timeline');

  return (
    <>
      <ScrollProgress position="top" />

      <div className="container mx-auto px-6 max-w-6xl">

        {/* Page header */}
        <header className="pt-24 pb-10 border-b border-border/40">
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">
            Selected Work
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Projects</h1>
              <p className="mt-3 text-base text-muted-foreground max-w-xl">
                Open-source work, full-stack apps, and experiments built with modern tooling.
              </p>
            </div>
            {/* View toggle */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'timeline'
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
                aria-label="Timeline view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="py-8">
          {viewMode === 'timeline' && <ProjectTimeline projects={allProjects} githubUrl={githubUrl} />}

          {viewMode === 'grid' && (
            <>
              {featuredProjects.length > 0 && (
                <section className="mb-12">
                  <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-6">Featured</p>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredProjects.map(p => <ProjectCard key={p.id} project={p} featured />)}
                  </div>
                </section>
              )}
              <section>
                <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-6">All Projects</p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {allProjects.map(p => <ProjectCard key={p.id} project={p} maxTechDisplay={3} />)}
                </div>
              </section>
            </>
          )}
        </div>

        {/* GitHub section */}
        <section className="py-12 border-t border-border/40">
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-8">Open Source</p>
          <GitHubProfile />
        </section>

        <section className="py-8 border-t border-border/40">
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-8">Activity</p>
          <GitHubStats />
        </section>

        <section className="py-8 border-t border-border/40 pb-16">
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-8">Repositories</p>
          <GitHubReposList limit={6} />
        </section>
      </div>
    </>
  );
}
