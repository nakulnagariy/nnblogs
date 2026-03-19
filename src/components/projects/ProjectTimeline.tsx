'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Github, ExternalLink, Code2, Users, Star } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/types';

interface ProjectTimelineProps {
  projects: Project[];
  title?: string;
  description?: string;
  githubUrl?: string;
}

const techColors: Record<string, string> = {
  'React': 'from-blue-400 to-cyan-400',
  'Next.js': 'from-black to-gray-700',
  'TypeScript': 'from-blue-600 to-blue-400',
  'Node.js': 'from-green-600 to-green-400',
  'Python': 'from-blue-500 to-yellow-400',
  'Docker': 'from-blue-500 to-blue-600',
  'AWS': 'from-orange-500 to-orange-400',
  'PostgreSQL': 'from-blue-700 to-blue-500',
  'MongoDB': 'from-green-600 to-green-500',
  'GraphQL': 'from-pink-500 to-purple-500',
  'Tailwind': 'from-cyan-500 to-blue-500',
  'Vue.js': 'from-green-500 to-green-600',
  'Angular': 'from-red-600 to-red-500',
};

export function ProjectTimeline({
  projects,
  title = "Evolution of My Work",
  description = "A chronological journey through the projects that shaped my development journey",
  githubUrl = "https://github.com",
}: ProjectTimelineProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as any,
      },
    },
  };

  // Group projects by year
  const groupedProjects = projects.reduce((acc, project) => {
    const year = new Date(project.created_at).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  // Sort years descending
  const sortedYears = Object.keys(groupedProjects).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className="max-w-6xl mx-auto px-4 py-16"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-20">
        <Badge className="mb-4 backdrop-blur-sm">
          <Code2 className="w-4 h-4 mr-2" />
          Project Timeline
        </Badge>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-linear-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {description}
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-purple-500 to-blue-500 transform lg:-translate-x-1/2" />

        {sortedYears.map((year) => (
          <motion.div key={year} variants={itemVariants} className="mb-16">
            {/* Year Badge */}
            <div className="flex items-center mb-8">
              <div className="relative z-10 w-16 h-16 lg:w-20 lg:h-20 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 rounded-full bg-linear-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-lg text-lg lg:text-2xl">
                {year}
              </div>
              <div className="ml-6 lg:hidden">
                <p className="text-sm text-muted-foreground">{groupedProjects[year]?.length || 0} {(groupedProjects[year]?.length || 0) === 1 ? 'project' : 'projects'}</p>
              </div>
            </div>

            {/* Projects for this year */}
            <div className="space-y-8">
              {groupedProjects[year]?.map((project, projectIndex) => {
                const isEven = projectIndex % 2 === 0;
                const primaryTech = project.technologies?.[0] || 'React';
                const gradient = techColors[primaryTech] || 'from-gray-500 to-slate-500';

                return (
                  <motion.div
                    key={project.id}
                    variants={itemVariants}
                    className={`relative flex flex-col lg:flex-row lg:items-center gap-8 ${
                      isEven ? '' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Content */}
                    <div className={`w-full lg:w-5/12 ml-24 lg:ml-0 ${isEven ? 'lg:pr-12' : 'lg:pl-12'}`}>
                      <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="p-6">
                          {/* Featured Badge */}
                          {project.featured && (
                            <Badge className={`mb-3 bg-linear-to-r ${gradient} text-white border-0`}>
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </Badge>
                          )}

                          {/* Title */}
                          <h3 className="text-2xl font-bold mb-3 group-hover:text-foreground transition-colors">
                            {project.name}
                          </h3>

                          {/* Description */}
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {project.description}
                          </p>

                          {/* Technologies */}
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.technologies.map((tech) => (
                                <Badge key={tech} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Links */}
                          <div className="flex flex-wrap gap-2">
                            {project.github_url && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                                  <Github className="w-4 h-4 mr-1" />
                                  Code
                                </Link>
                              </Button>
                            )}
                            {project.live_url && (
                              <Button size="sm" asChild className={`bg-linear-to-r ${gradient}`}>
                                <Link href={project.live_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  Live Demo
                                </Link>
                              </Button>
                            )}
                          </div>

                          {/* Date */}
                          {project.created_at && (
                            <div className="mt-4 pt-4 border-t flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(project.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          )}
                        </div>

                        {/* Bottom gradient line */}
                        <motion.div
                          className={`h-1 bg-linear-to-r ${gradient}`}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          viewport={{ once: true }}
                          style={{ transformOrigin: '0%' }}
                        />
                      </Card>
                    </div>

                    {/* Timeline dot (mobile) */}
                    <div className="absolute left-8 top-0 w-4 h-4 rounded-full bg-gradient-to-br from-primary to-purple-500 ring-4 ring-background lg:hidden" />

                    {/* Empty space for alternating layout (desktop) */}
                    <div className="w-full lg:w-5/12 hidden lg:block" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        variants={itemVariants}
        className="text-center mt-20"
      >
          <Card className="p-8 md:p-12 bg-muted/40 border-border/60">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground flex items-center justify-center text-background">
            <Users className="w-8 h-8" />
          </div>
            <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-foreground">
            Let&apos;s Build Together
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Interested in collaborating on a project? I&apos;m always open to discussing new ideas and opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="#contact">
                Get In Touch
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 mr-2" />
                View GitHub
              </Link>
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
