'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, Tag, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { BlogPost } from '@/types';

interface TimelinePost extends BlogPost {
  published_at: string;
  read_time?: number;
}

interface BlogTimelineProps {
  posts: TimelinePost[];
  title?: string;
  description?: string;
}

export function BlogTimeline({ posts, title = "Journey Through Knowledge", description = "Explore articles chronologically - each post is a chapter in the story of continuous learning" }: BlogTimelineProps) {
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

  // Group posts by month/year
  const groupedPosts = posts.reduce((acc, post) => {
    const date = new Date(post.published_at);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(post);
    return acc;
  }, {} as Record<string, TimelinePost[]>);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className="max-w-5xl mx-auto px-4 py-12"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-16">
        <Badge className="mb-4 backdrop-blur-sm">
          <Calendar className="w-4 h-4 mr-2" />
          Content Timeline
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {description}
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-border/60" />

        {Object.entries(groupedPosts).map(([monthYear, monthPosts]) => (
          <motion.div key={monthYear} variants={itemVariants} className="mb-12">
            {/* Month/Year Label */}
            <div className="flex items-center mb-6">
              <div className="relative z-10 w-14 h-14 rounded-full bg-foreground flex items-center justify-center text-background font-bold shadow-sm text-sm font-mono">
                {monthPosts?.[0]?.published_at ? new Date(monthPosts[0].published_at).getMonth() + 1 : 1}
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">{monthYear}</h2>
                <p className="text-sm text-muted-foreground">{monthPosts.length} {monthPosts.length === 1 ? 'article' : 'articles'}</p>
              </div>
            </div>

            {/* Posts for this month */}
            <div className="ml-24 space-y-6">
              {monthPosts.map((post) => {
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-foreground/30">
                      <div className="p-6">
                        {/* Category Badge */}
                        <div className="flex items-start justify-between mb-4">
                          <Badge variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {post.category}
                          </Badge>
                          {post.views && post.views > 0 && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              {post.views.toLocaleString()} views
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-foreground transition-colors">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(post.published_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                          {post.read_time && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {post.read_time} min read
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.slice(0, 4).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Hover accent line */}
                      <motion.div
                        className="h-0.5 bg-foreground"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{ transformOrigin: '0%' }}
                      />
                    </Card>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        variants={itemVariants}
        className="text-center mt-16 p-8 rounded-2xl bg-muted/40 border border-border/60"
      >
        <h3 className="text-2xl font-bold mb-3">More Stories Coming Soon</h3>
        <p className="text-muted-foreground">
          Subscribe to stay updated on the latest chapters in this learning journey
        </p>
      </motion.div>
    </motion.div>
  );
}
