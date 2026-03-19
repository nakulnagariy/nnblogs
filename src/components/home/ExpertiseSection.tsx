'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const skills = [
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Shadcn/ui'],
  },
  {
    category: 'Backend / API',
    items: ['Node.js', 'Express', 'PostgreSQL', 'Supabase', 'REST APIs', 'GraphQL'],
  },
  {
    category: 'AI & Automation',
    items: ['OpenAI API', 'LangChain', 'Python', 'Vector DBs', 'Vercel AI SDK', 'Prompt Engineering'],
  },
  {
    category: 'DevOps',
    items: ['Docker', 'GitHub Actions', 'AWS', 'Vercel', 'CI/CD', 'Terraform'],
  },
];

export function ExpertiseSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="expertise" className="py-24 md:py-32 border-b border-border/40">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground mb-12">
            Expertise
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-14">
            {skills.map((group, gi) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + gi * 0.1 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill, si) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.2 + gi * 0.1 + si * 0.05 }}
                      className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full border border-border/60 hover:border-foreground/30 hover:text-foreground transition-colors cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
