'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Award,
  BookOpen,
  Briefcase,
  Code,
  GraduationCap,
  Lightbulb,
  Rocket,
  Trophy,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: ReactNode;
  achievements?: string[];
}

const defaultEvents: TimelineEvent[] = [
  {
    year: '2015',
    title: 'The Beginning',
    description: 'Started my journey in software development, discovering a passion for creating digital experiences.',
    icon: <Code className="w-6 h-6" />,
    achievements: ['First line of code', 'Built first website', 'Learned HTML, CSS, JavaScript'],
  },
  {
    year: '2017',
    title: 'Education & Growth',
    description: 'Pursued formal education in Computer Science while building real-world projects.',
    icon: <GraduationCap className="w-6 h-6" />,
    achievements: ['Computer Science Degree', 'Multiple certifications', 'Contributed to open source'],
  },
  {
    year: '2019',
    title: 'Professional Experience',
    description: 'Joined industry-leading companies, working on large-scale applications and learning from the best.',
    icon: <Briefcase className="w-6 h-6" />,
    achievements: ['Full-stack developer role', 'Led team projects', 'Architected scalable solutions'],
  },
  {
    year: '2021',
    title: 'Innovation & Leadership',
    description: 'Took on leadership roles, mentored developers, and drove technical innovation.',
    icon: <Rocket className="w-6 h-6" />,
    achievements: ['Tech lead position', 'Mentored 10+ developers', 'Launched major products'],
  },
  {
    year: '2023',
    title: 'Recognition & Impact',
    description: 'Recognized for contributions to the developer community and technical excellence.',
    icon: <Award className="w-6 h-6" />,
    achievements: ['Industry awards', 'Conference speaker', 'Published technical articles'],
  },
  {
    year: '2024',
    title: 'Thought Leadership',
    description: 'Sharing knowledge through content creation, helping others grow in their tech careers.',
    icon: <Lightbulb className="w-6 h-6" />,
    achievements: ['Started blog platform', '100+ articles published', '500K+ readers reached'],
  },
  {
    year: 'Today',
    title: 'Continuous Evolution',
    description: 'Committed to lifelong learning, innovation, and making a positive impact in tech.',
    icon: <Zap className="w-6 h-6" />,
    achievements: ['Building in public', 'Growing community', 'Exploring new technologies'],
  },
];

interface JourneyTimelineProps {
  events?: TimelineEvent[];
  title?: string;
  description?: string;
}

export function JourneyTimeline({
  events = defaultEvents,
  title = 'My Journey',
  description = 'A visual story of growth, learning, and impact in the world of technology',
}: JourneyTimelineProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as any,
      },
    },
  };

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
          <BookOpen className="w-4 h-4 mr-2" />
          Timeline
        </Badge>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {description}
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/60 transform -translate-x-1/2 hidden lg:block" />

        {events.map((event, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={event.year}
              variants={itemVariants}
              className={`relative mb-12 lg:mb-20 flex flex-col ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-8`}
            >
              {/* Content Card */}
              <Card className="w-full lg:w-5/12 group hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="p-6 md:p-8">
                  {/* Year Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="text-sm px-3 py-1 font-mono">
                      {event.year}
                    </Badge>
                    <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background shadow-sm lg:hidden">
                      {event.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-foreground transition-colors">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Achievements */}
                  {event.achievements && event.achievements.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Key Achievements
                      </p>
                      <ul className="space-y-2">
                        {event.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-foreground/40 mt-2 mr-3 flex-shrink-0" />
                            <span className="text-sm">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bottom accent line */}
                <motion.div
                  className="h-0.5 bg-foreground"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                  style={{ transformOrigin: '0%' }}
                />
              </Card>

              {/* Center Icon (Desktop) */}
              <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 z-10">
                <motion.div
                  className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center text-background shadow-xl ring-4 ring-background"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {event.icon}
                </motion.div>
              </div>

              {/* Empty space for alternating layout */}
              <div className="w-full lg:w-5/12 hidden lg:block" />
            </motion.div>
          );
        })}
      </div>

      {/* Future Section */}
      <motion.div variants={itemVariants} className="text-center mt-20">
        <Card className="p-8 md:p-12 bg-muted/40 border-border/60">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground flex items-center justify-center text-background">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-foreground">
            The Story Continues...
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            This is not the end, but rather the beginning of the next chapter. Let&apos;s build something
            amazing together.
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}
