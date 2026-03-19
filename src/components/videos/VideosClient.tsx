'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Calendar, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getVideos } from '@/lib/supabase/queries';
import { LoadingScreen, ScrollProgress } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { PaginatedResponse, Video } from '@/types';

interface VideosClientProps {
  initialData: PaginatedResponse<Video>;
}

export function VideosClient({ initialData }: VideosClientProps) {
  const [page, setPage] = useState(1);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['videos', page],
    queryFn: () => getVideos(page, 12),
    initialData: page === 1 ? initialData : undefined,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <>
        <ScrollProgress position="top" />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Error loading videos. Please try again.</p>
        </div>
      </>
    );
  }

  const videos = data?.data || [];
  const totalPages = data?.totalPages || 0;

  return (
    <>
      <ScrollProgress position="top" />

      <div className="container mx-auto px-6 max-w-6xl">

        {/* Page header */}
        <header className="pt-24 pb-10 border-b border-border/40">
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">
            Watch
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Videos</h1>
          <p className="mt-3 text-base text-muted-foreground max-w-xl">
            Video tutorials, walkthroughs, and educational content.
          </p>
        </header>

        {/* Grid */}
        <div className="py-10">
          {videos.length === 0 ? (
            <p className="text-center py-20 text-sm text-muted-foreground">No videos yet. Check back soon!</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <article key={video.id} className="group flex flex-col">
                  {/* Thumbnail */}
                  <Link href={`/videos/${video.slug}`} className="relative aspect-video overflow-hidden rounded-xl bg-muted mb-4 block">
                    {video.thumbnail_url ? (
                      <Image
                        src={video.thumbnail_url}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-5 h-5 text-foreground fill-foreground ml-0.5" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    {video.duration && (
                      <span className="absolute bottom-2 right-2 text-xs font-mono bg-black/80 text-white px-1.5 py-0.5 rounded">
                        {video.duration}
                      </span>
                    )}
                  </Link>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                      {video.category}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {formatDate(video.created_at)}
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/videos/${video.slug}`}>
                    <h2 className="font-semibold text-base leading-snug mb-2 text-foreground hover:text-foreground transition-colors line-clamp-2">
                      {video.title}
                    </h2>
                  </Link>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                    {video.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(video.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {video.views}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 py-12 border-t border-border/40">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>
            <span className="text-xs font-mono text-muted-foreground">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
