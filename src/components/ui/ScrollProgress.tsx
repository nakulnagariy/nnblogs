'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

interface ScrollProgressProps {
  position?: 'top' | 'bottom';
  height?: number;
}

export function ScrollProgress({ position = 'top', height = 4 }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  // Add spring physics for smooth animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50 origin-left`}
      style={{
        scaleX,
        height: `${height}px`,
        background:
          'linear-gradient(90deg, var(--nn-color-primary), var(--nn-indigo-400), var(--nn-sky-500))',
        transformOrigin: '0%',
      }}
    />
  );
}

interface ReadingProgressProps {
  className?: string;
}

export function ReadingProgress({ className = '' }: ReadingProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      {/* Track */}
      <div className="h-0.75 w-full bg-transparent" />

      {/* Filled bar */}
      <motion.div
        className="absolute top-0 left-0 h-0.75 w-full origin-left"
        style={{
          scaleX,
          background:
            'linear-gradient(90deg, var(--nn-color-primary), var(--nn-indigo-400), var(--nn-sky-500))',
        }}
      />

      {/* Glowing dot at the leading edge */}
      <motion.div
        className="absolute top-0 h-0.75 w-24 origin-left"
        style={{
          scaleX,
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.6))',
          filter: 'blur(4px)',
        }}
      />
    </div>
  );
}
