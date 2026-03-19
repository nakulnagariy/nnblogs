'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const journey = [
  {
    period: '2024 – PRESENT',
    title: 'Full-Stack AI Native Engineer',
    company: 'Independent',
    description:
      'Building AI-powered applications, content platforms, and developer tools. Exploring the frontier of LLMs, Vercel AI SDK, and modern full-stack frameworks.',
  },
  {
    period: '2022 – 2024',
    title: 'Senior Software Engineer',
    company: 'Your Company',
    description:
      'Led frontend architecture for large-scale React + Node.js products. Introduced design systems, improved Core Web Vitals, and mentored junior devs.',
  },
  {
    period: '2020 – 2022',
    title: 'Software Engineer',
    company: 'Your Company',
    description:
      'Developed full-stack features across React, Express, and PostgreSQL. Drove migration from REST to GraphQL and integrated third-party APIs.',
  },
  {
    period: '2018 – 2020',
    title: 'Frontend Developer',
    company: 'Your Company',
    description:
      'Built responsive UIs, component libraries, and internal tooling. Owned design-to-code hand-off workflows and accessibility improvements.',
  },
];

export function JourneySection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="journey" className="py-24 md:py-32 border-b border-border/40">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground mb-12">
            Journey
          </p>

          <div className="flex flex-col divide-y divide-border/40">
            {journey.map((item, i) => (
              <motion.div
                key={item.period}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 md:gap-8 py-8"
              >
                {/* Year range */}
                <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase pt-0.5">
                  {item.period}
                </span>

                {/* Role details */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      — {item.company}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
