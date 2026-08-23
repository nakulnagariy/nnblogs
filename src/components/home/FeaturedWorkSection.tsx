'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { BlogPost } from '@/types';

interface FeaturedWorkSectionProps {
  posts: BlogPost[];
}

export function FeaturedWorkSection({ posts }: FeaturedWorkSectionProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const articles = posts.map((post) => ({
    category: post.category,
    title: post.title,
    excerpt: post.excerpt || '',
    href: `/blog/${post.slug}`,
  }));

  return (
    <section id="articles" className="py-24 md:py-32 border-b border-border/40">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-end justify-between mb-12">
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground">
              Recent Posts
            </p>
            <Link
              href="/blog"
              className="text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              All Posts
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {articles.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8">No posts yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border/40">
              {articles.map((article, i) => (
                <motion.div
                  key={article.href + i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
                >
                  <Link
                    href={article.href}
                    className="group grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 py-8 hover:opacity-80 transition-opacity"
                  >
                    <div className="space-y-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        {article.category}
                      </span>
                      <h3 className="text-base font-semibold text-foreground group-hover:text-foreground transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                        {article.excerpt}
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all self-start mt-6 shrink-0" />
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
