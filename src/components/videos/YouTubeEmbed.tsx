'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/youtube';

interface YouTubeEmbedProps {
  videoUrl: string;
  title?: string;
  className?: string;
  autoplay?: boolean;
  lazyLoad?: boolean;
}

export function YouTubeEmbed({
  videoUrl,
  title = 'YouTube video',
  className = '',
  autoplay = false,
  lazyLoad = true,
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(!lazyLoad);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoId = extractYouTubeId(videoUrl);

  useEffect(() => {
    if (!lazyLoad || isLoaded || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [lazyLoad, isLoaded]);

  if (!videoId) {
    return (
      <div className={`relative aspect-video bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-sm text-muted-foreground">Invalid YouTube URL</p>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  const thumbnailUrl = getYouTubeThumbnail(videoUrl, 'hq');

  if (!embedUrl) {
    return (
      <div className={`relative aspect-video bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-sm text-muted-foreground">Unable to load video</p>
      </div>
    );
  }

  const iframeSrc = `${embedUrl}${autoplay ? '?autoplay=1' : ''}`;

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video bg-black rounded-lg overflow-hidden ${className}`}
    >
      {isLoaded ? (
        <iframe
          src={iframeSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          onClick={() => setIsLoaded(true)}
          className="absolute inset-0 w-full h-full group cursor-pointer"
          aria-label="Load video"
        >
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
            <div className="rounded-full bg-red-600 p-4 group-hover:scale-110 transition-transform">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
