'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail, FileText } from 'lucide-react';
import Link from 'next/link';

const socials = [
  { icon: Github, href: 'https://github.com/nakulnagariya', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/nakulnagariya', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:nakul@example.com', label: 'Email' },
  { icon: FileText, href: '/resume.pdf', label: 'Resume' },
];

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.12 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

/* ---------- Orbit Animation ---------- */

// Round to 4 decimal places so server and browser produce the same CSS string.
// Math.cos/sin can produce slightly different trailing digits in Node.js vs
// the browser, and the CSS parser rounds them differently — causing hydration
// mismatches when React compares the serialised style values.
function r(n: number) {
  return Math.round(n * 1e4) / 1e4;
}

// Split keywords across 3 rings
const rings = [
  { keywords: ['React', 'TypeScript', 'AI'], radius: 47, duration: 50, direction: 1 },
  { keywords: ['Next.js', 'Node.js', 'Tailwind'], radius: 33, duration: 38, direction: -1 },
  { keywords: ['PostgreSQL', 'Supabase'], radius: 20, duration: 28, direction: 1 },
];

function HeroOrbit() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative w-full aspect-square max-w-105 mx-auto" aria-hidden="true">
      {/* Static rings (visual only) */}
      <div className="absolute inset-0 rounded-full border border-border/30" />
      <div className="absolute inset-[18%] rounded-full border border-border/20" />
      <div className="absolute inset-[36%] rounded-full border border-border/15" />

      {/* Center glow */}
      <div className="absolute inset-[42%] rounded-full bg-foreground/10 blur-xl" />
      <div className="absolute inset-[44%] rounded-full bg-foreground/20 blur-md" />
      <motion.div
        className="absolute inset-[46%] rounded-full bg-foreground/30"
        animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
      />

      {/* Rotating ring groups with keywords */}
      {rings.map((ring, ringIdx) => (
        <motion.div
          key={ringIdx}
          className="absolute inset-0"
          animate={prefersReducedMotion ? {} : { rotate: ring.direction * 360 }}
          transition={{ duration: ring.duration, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'linear' }}
        >
          {ring.keywords.map((word, i) => {
            const angleDeg = (360 / ring.keywords.length) * i;
            const angleRad = (angleDeg * Math.PI) / 180;
            // Position on the ring: 50% ± radius% (rounded to avoid hydration mismatch)
            const top = r(50 - ring.radius * Math.cos(angleRad));
            const left = r(50 + ring.radius * Math.sin(angleRad));

            return (
              <motion.div
                key={word}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${top}%`, left: `${left}%` }}
                // Counter-rotate so text stays readable
                animate={prefersReducedMotion ? {} : { rotate: -ring.direction * 360 }}
                transition={{ duration: ring.duration, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'linear' }}
              >
                <motion.span
                  className="block px-2.5 py-1 text-[10px] font-mono font-medium text-muted-foreground bg-background/80 border border-border/40 rounded-full backdrop-blur-sm whitespace-nowrap shadow-sm"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + ringIdx * 0.2 + i * 0.1, duration: 0.5 }}
                >
                  {word}
                </motion.span>
              </motion.div>
            );
          })}
        </motion.div>
      ))}

      {/* Small floating dots */}
      {[...Array(6)].map((_, i) => {
        const size = 3 + (i % 3) * 2;
        const top = r(15 + Math.sin(i * 1.8) * 35 + 35);
        const left = r(15 + Math.cos(i * 1.8) * 35 + 35);
        return (
          <motion.div
            key={`dot-${i}`}
            className="absolute rounded-full bg-foreground/40"
            style={{ width: size, height: size, top: `${top}%`, left: `${left}%` }}
            animate={prefersReducedMotion ? {} : {
              y: [0, -10, 0, 10, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: prefersReducedMotion ? 0 : Infinity,
              ease: 'easeInOut',
              delay: i * 0.6,
            }}
          />
        );
      })}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center border-b border-border/40">
      <div className="container mx-auto px-6 py-28 max-w-6xl w-full">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8"
          >
            {/* Descriptor */}
            <motion.p
              variants={fadeUp}
              className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground"
            >
              NN. &mdash;&nbsp; Full-Stack Engineer
            </motion.p>

            {/* Name */}
            <motion.h1
              variants={fadeUp}
              className="text-[clamp(3rem,10vw,8rem)] font-bold tracking-tight leading-[0.9] uppercase"
            >
              Nakul
              <br />
              Nagariya
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              Full-Stack AI Native Engineer &amp; Content Creator. Crafting digital
              experiences with precision and soul.
            </motion.p>

            {/* Actions + Socials */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-4 md:gap-6 pt-2"
            >
              <Link
                href="#about"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-full hover:opacity-80 transition-opacity"
              >
                View Work
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <Link
                href="/blog"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-foreground/50 pb-px"
              >
                Read Blog
              </Link>

              {/* Social icons */}
              <div className="flex items-center gap-4 md:ml-auto">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={label}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Orbit animation */}
          <motion.div
            className="hidden lg:block w-105"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          >
            <HeroOrbit />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
