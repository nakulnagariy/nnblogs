'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function AboutSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="about" className="py-24 md:py-32 border-b border-border/40">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground mb-12">
            About
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left — large statement */}
            <h2 className="text-2xl md:text-3xl font-medium leading-relaxed text-foreground">
              Crafting digital experiences with precision and soul. Specializing
              in React, design systems, and advanced aesthetics.
            </h2>

            {/* Right — prose + availability */}
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                I&apos;m a full-stack engineer focused on building products at the
                intersection of great engineering and great design. I work with
                modern web technologies to ship fast, accessible, and beautiful
                experiences.
              </p>
              <p>
                Beyond writing code, I create content that helps developers
                navigate complex topics — from architecture patterns to AI
                tooling and everything in between.
              </p>

              {/* Availability indicator */}
              <div className="flex items-center gap-2 pt-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-foreground">
                  Available for new projects
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


