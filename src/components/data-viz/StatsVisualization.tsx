'use client';

import React, { type ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface DataPoint {
  label: string;
  value: number;
  color: string;
  icon?: ReactNode;
}

interface StatsVisualizationProps {
  title: string;
  description?: string;
  data: DataPoint[];
  type?: 'bar' | 'progress' | 'radial';
  animated?: boolean;
}

export function StatsVisualization({
  title,
  description,
  data,
  type = 'progress',
  animated = true,
}: StatsVisualizationProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-2">{title}</h3>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <div className="space-y-6">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-2"
            >
              {/* Label and Value */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.icon && (
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                      }}
                    >
                      {item.icon}
                    </div>
                  )}
                  <span className="font-semibold text-lg">{item.label}</span>
                </div>
                <Badge variant="secondary" className="text-base">
                  {item.value.toLocaleString()}
                </Badge>
              </div>

              {/* Progress Bar */}
              {type === 'progress' && (
                <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}aa)`,
                    }}
                    initial={{ width: 0 }}
                    animate={inView && animated ? { width: `${percentage}%` } : { width: 0 }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
                  />
                </div>
              )}

              {/* Bar Chart */}
              {type === 'bar' && (
                <div className="relative">
                  <motion.div
                    className="h-12 rounded-lg shadow-lg relative overflow-hidden"
                    style={{
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                      transformOrigin: '0%',
                    }}
                    initial={{ scaleX: 0 }}
                    animate={inView && animated ? { scaleX: percentage / 100 } : { scaleX: 0 }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: [0.22, 1, 0.36, 1] as any }}
                  >
                    <div className="absolute inset-0 flex items-center justify-end pr-4">
                      <span className="text-white font-bold">{Math.round(percentage)}%</span>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

interface InfographicCardProps {
  stat: string;
  label: string;
  description?: string;
  color: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export function InfographicCard({
  stat,
  label,
  description,
  color,
  icon,
  trend,
}: InfographicCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const [count, setCount] = useState(0);
  const targetValue = parseInt(stat.replace(/[^0-9]/g, '')) || 0;

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const duration = 2000; // 2 seconds

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Ease out cubic
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOutCubic * targetValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, targetValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
          style={{
            background: `linear-gradient(135deg, ${color}, transparent)`,
          }}
        />

        <div className="relative p-6 md:p-8">
          {/* Icon */}
          {icon && (
            <div
              className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}dd)`,
              }}
            >
              {icon}
            </div>
          )}

          {/* Stat */}
          <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
            {count > 0 ? count.toLocaleString() : stat}
            {stat.includes('+') && '+'}
            {stat.includes('K') && 'K'}
            {stat.includes('M') && 'M'}
          </div>

          {/* Label */}
          <div className="text-lg md:text-xl font-semibold text-muted-foreground mb-2">
            {label}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}

          {/* Trend indicator */}
          {trend && (
            <div className="mt-4 flex items-center gap-2">
              <Badge
                variant={trend.direction === 'up' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
              </Badge>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="h-1"
          style={{
            background: `linear-gradient(90deg, ${color}, transparent)`,
            transformOrigin: '0%',
          }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </Card>
    </motion.div>
  );
}
