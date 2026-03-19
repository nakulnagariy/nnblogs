'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';

interface SelectedWorksSectionProps {
  projects: Project[];
}

export function SelectedWorksSection({ projects }: SelectedWorksSectionProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const works = projects.map((project) => ({
    name: project.name,
    type: project.featured ? 'Featured' : 'Project',
    description: project.description,
    tags: project.technologies || [],
    href: `/projects/${project.id}`,
    external: false,
  }));

  return (
    <section id="projects" className="py-24 md:py-32 border-b border-border/40">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-end justify-between mb-12">
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground">
              Selected Works
            </p>
            <Link
              href="/projects"
              className="text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              All Projects
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {works.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8">No featured projects yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border/40">
              {works.map((work, i) => (
                <motion.div
                  key={work.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
                >
                  <Link
                    href={work.href}
                    target={work.external ? '_blank' : undefined}
                    rel={work.external ? 'noopener noreferrer' : undefined}
                    className="group grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 py-8 hover:opacity-80 transition-opacity"
                  >
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-3">
                        <h3 className="text-base font-semibold text-foreground group-hover:text-foreground transition-colors">
                          {work.name}
                        </h3>
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                          {work.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                        {work.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {work.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded border border-border/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all self-start mt-1 shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
