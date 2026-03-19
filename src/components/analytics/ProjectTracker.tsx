'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';

interface ProjectTrackerProps {
  projectId: string;
  projectName: string;
  technologies: string[];
}

export function ProjectTracker({ projectId, projectName, technologies }: ProjectTrackerProps) {
  useEffect(() => {
    // Track project page view
    analytics.project.view(projectId, projectName, technologies);

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
  }, [projectId, projectName, technologies]);

  return null;
}
