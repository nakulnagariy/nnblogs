'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { TocHeading } from '@/lib/markdown';

interface TableOfContentsProps {
  headings: TocHeading[];
  hideLabel?: boolean;
}

/**
 * "On this page" navigation. Highlights the currently visible section as the
 * user scrolls, and supports smooth-scroll navigation to any heading.
 */
export function TableOfContents({ headings, hideLabel = false }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!headings.length) return;

    // Collect heading elements that are present in the DOM
    const elements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!elements.length) return;

    // Use IntersectionObserver to track which heading is near the top of the viewport
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting heading to set as active
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          // Pick the one with the smallest top value (closest to top of viewport)
          const topmost = intersecting.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
          );
          setActiveId(topmost.target.id);
        }
      },
      {
        // Trigger when a heading enters the top third of the viewport
        rootMargin: '-80px 0% -60% 0%',
        threshold: 0,
      },
    );

    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [headings]);

  if (!headings.length) return null;

  const handleClick = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 88; // account for sticky header height
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <nav aria-label="Table of contents">
      {!hideLabel && (
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          On this page
        </p>
      )}
      <ul className="space-y-1">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => handleClick(id, e)}
              className={cn(
                'block text-sm leading-snug py-1 transition-colors duration-150 hover:text-foreground',
                level === 2 && 'pl-0',
                level === 3 && 'pl-4 text-xs',
                activeId === id
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground',
              )}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
