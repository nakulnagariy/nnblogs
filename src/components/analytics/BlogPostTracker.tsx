'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';

interface BlogPostTrackerProps {
  slug: string;
  title: string;
  category?: string;
}

export function BlogPostTracker({ slug, title, category }: BlogPostTrackerProps) {
  useEffect(() => {
    // Track page view
    analytics.blog.view(slug, title, category);

    // Track time on page
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      analytics.blog.readTime(slug, timeSpent);
    };

    // Track scroll depth
    const trackedDepths = new Set<number>();
    const thresholds = [25, 50, 75, 100];
    
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const percentage = Math.round((scrolled / scrollHeight) * 100);
      
      thresholds.forEach(threshold => {
        if (percentage >= threshold && !trackedDepths.has(threshold)) {
          trackedDepths.add(threshold);
          analytics.engagement.scrollDepth(threshold, window.location.pathname);
        }
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [slug, title, category]);

  return null;
}
