'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { Eye, Users, FileText, TrendingUp } from 'lucide-react';

interface Stat {
  icon: typeof Eye;
  label: string;
  value: number;
  suffix: string;
  color: string;
}

export function StatsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const stats: Stat[] = [
    {
      icon: FileText,
      label: 'Articles Published',
      value: 150,
      suffix: '+',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Eye,
      label: 'Total Views',
      value: 500,
      suffix: 'K+',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      label: 'Community Members',
      value: 10,
      suffix: 'K+',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: TrendingUp,
      label: 'Years Experience',
      value: 11,
      suffix: '+',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <section className="py-20 md:py-24 relative overflow-hidden bg-muted/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} inView={inView} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function StatCard({ stat, index, inView }: { stat: Stat; index: number; inView: boolean }) {
  const [count, setCount] = useState(0);
  const Icon = stat.icon;

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const duration = 2000;
    const endValue = stat.value;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * endValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, stat.value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center group"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
        style={{
          backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
        }}
      >
        <div className={`bg-gradient-to-br ${stat.color} w-full h-full rounded-2xl flex items-center justify-center`}>
          <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ scale: 0.5 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-br bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
        }}
      >
        <span className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
          {count}{stat.suffix}
        </span>
      </motion.div>
      
      <p className="text-sm md:text-base text-muted-foreground font-medium">
        {stat.label}
      </p>
    </motion.div>
  );
}
