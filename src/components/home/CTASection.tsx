'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { ArrowUpRight, Mail } from 'lucide-react';

export function CTASection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end"
        >
          <div className="space-y-4">
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground">
              Let&apos;s Build
            </p>
            <h2
              className="font-bold leading-none tracking-tight text-foreground"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              Got something
              <br />
              in mind?
            </h2>
          </div>

          <div className="space-y-6 md:pb-2">
            <p className="text-base text-muted-foreground leading-relaxed">
              I&apos;m always open to interesting projects, collaborative ideas, or just a good
              conversation about technology and craft.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="mailto:nakul@example.com"
                whileHover={{ x: 4 }}
                className="inline-flex items-center gap-2 text-sm font-mono tracking-widest uppercase text-foreground border-b border-foreground pb-0.5 hover:text-foreground hover:border-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                Say Hello
              </motion.a>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-mono tracking-widest uppercase text-muted-foreground border-b border-border pb-0.5 hover:text-foreground hover:border-foreground transition-colors"
              >
                Read the Blog
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
