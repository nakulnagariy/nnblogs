'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';

interface VideoTrackerProps {
  slug: string;
  title: string;
  source: 'youtube' | 'self-hosted';
}

export function VideoTracker({ slug, title, source }: VideoTrackerProps) {
  useEffect(() => {
    // Track video page view
    analytics.video.view(slug, title, source);

    // Track time on page
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      analytics.engagement.timeOnPage(timeSpent, window.location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [slug, title, source]);

  return null;
}
