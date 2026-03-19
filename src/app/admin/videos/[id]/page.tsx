'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { Save, Video as VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { YouTubeEmbed } from '@/components/videos/YouTubeEmbed';
import { isYouTubeUrl, getYouTubeThumbnail } from '@/lib/youtube';
import type { Video } from '@/types';

type VideoSource = 'youtube' | 'self-hosted';

interface EditVideoPageProps {
  params: Promise<{ id: string }>;
}

export default function EditVideoPage({ params }: EditVideoPageProps) {
  const router = useRouter();
  const [videoId, setVideoId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoSource, setVideoSource] = useState<VideoSource>('youtube');
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    duration: '',
    category: '',
    tags: '',
    published: false,
  });

  useEffect(() => {
    params.then((p) => {
      setVideoId(p.id);
      fetchVideo(p.id);
    });
  }, [params]);

  const fetchVideo = async (id: string) => {
    try {
      setIsFetching(true);
      const response = await fetch(`/api/admin/videos/${id}`);

      if (!response.ok) {
        throw new Error('Failed to load video');
      }

      const { data } = await response.json();
      const video: Video = data;

      setFormData({
        title: video.title,
        slug: video.slug,
        description: video.description,
        video_url: video.video_url,
        thumbnail_url: video.thumbnail_url || '',
        duration: video.duration || '',
        category: video.category,
        tags: video.tags.join(', '),
        published: video.published,
      });
      
      // Detect video source
      if (isYouTubeUrl(video.video_url)) {
        setVideoSource('youtube');
      } else {
        setVideoSource('self-hosted');
      }
    } catch (error) {
      console.error('Failed to load video:', error);
      setError(error instanceof Error ? error.message : 'Failed to load video');
    } finally {
      setIsFetching(false);
    }
  };

  // Auto-detect YouTube URLs and update thumbnail
  useEffect(() => {
    if (formData.video_url && isYouTubeUrl(formData.video_url)) {
      setVideoSource('youtube');
      // Auto-populate thumbnail if empty
      if (!formData.thumbnail_url) {
        const thumbnail = getYouTubeThumbnail(formData.video_url, 'max');
        if (thumbnail) {
          setFormData((prev) => ({ ...prev, thumbnail_url: thumbnail }));
        }
      }
    }
  }, [formData.video_url]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSourceChange = (source: VideoSource) => {
    setVideoSource(source);
    setShowPreview(false);
    // Clear video URL when switching sources
    setFormData((prev) => ({ ...prev, video_url: '', thumbnail_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const response = await fetch('/api/admin/videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: videoId,
          ...formData,
          tags,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update video');
      }

      router.push('/admin/videos');
    } catch (error) {
      console.error('Failed to update video:', error);
      setError(error instanceof Error ? error.message : 'Failed to update video');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="p-8 max-w-5xl">
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-1">Edit Content</p>
        <h1 className="text-2xl font-black tracking-tight">Edit Video</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl border border-destructive/30 bg-destructive/5 text-destructive">
          <p className="font-semibold text-sm">Error</p>
          <p className="text-xs mt-0.5 opacity-80">{error}</p>
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter video title"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-2">
              Slug *
            </label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="video-slug"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-border/60 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter video description"
            />
          </div>

          {/* Video Source Selector */}
          <div>
            <label className="block text-sm font-medium mb-3">Video Source *</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleSourceChange('youtube')}
                className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                  videoSource === 'youtube'
                    ? 'border-foreground bg-foreground/5'
                    : 'border-border/60 hover:border-border'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <VideoIcon className="h-5 w-5" />
                  <span className="font-semibold">YouTube</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Embed videos from YouTube
                </p>
              </button>
              <button
                type="button"
                onClick={() => handleSourceChange('self-hosted')}
                className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                  videoSource === 'self-hosted'
                    ? 'border-foreground bg-foreground/5'
                    : 'border-border/60 hover:border-border'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <VideoIcon className="h-5 w-5" />
                  <span className="font-semibold">Self-Hosted</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload your own video files
                </p>
              </button>
            </div>
          </div>

          {/* Video URL - Dynamic based on source */}
          <div>
            <label htmlFor="video_url" className="block text-sm font-medium mb-2">
              {videoSource === 'youtube' ? 'YouTube URL *' : 'Video File URL *'}
            </label>
            <Input
              id="video_url"
              name="video_url"
              type="url"
              value={formData.video_url}
              onChange={handleChange}
              required
              placeholder={
                videoSource === 'youtube'
                  ? 'https://www.youtube.com/watch?v=...'
                  : 'https://example.com/video.mp4'
              }
            />
            {videoSource === 'youtube' && formData.video_url && isYouTubeUrl(formData.video_url) && (
              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </div>
            )}
          </div>

          {/* YouTube Preview */}
          {videoSource === 'youtube' && showPreview && formData.video_url && isYouTubeUrl(formData.video_url) && (
            <div>
              <label className="block text-sm font-medium mb-2">Preview</label>
              <div className="max-w-2xl">
                <YouTubeEmbed videoUrl={formData.video_url} title="Preview" />
              </div>
            </div>
          )}

          {/* Thumbnail URL */}
          <div>
            <label htmlFor="thumbnail_url" className="block text-sm font-medium mb-2">
              Thumbnail URL{' '}
              <span className="text-muted-foreground">
                {videoSource === 'youtube' ? '(auto-filled)' : '(optional)'}
              </span>
            </label>
            <Input
              id="thumbnail_url"
              name="thumbnail_url"
              type="url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              placeholder="https://example.com/thumbnail.jpg"
              disabled={videoSource === 'youtube' && !!formData.video_url}
            />
            {formData.thumbnail_url && (
              <div className="mt-2">
                <Image
                  src={formData.thumbnail_url}
                  alt="Thumbnail preview"
                  width={192}
                  height={108}
                  unoptimized
                  className="rounded border"
                />
              </div>
            )}
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium mb-2">
              Duration <span className="text-muted-foreground">(e.g., 10:30)</span>
            </label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="10:30"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category *
            </label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="Tutorial, Review, etc."
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-2">
              Tags <span className="text-muted-foreground">(comma-separated)</span>
            </label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="javascript, tutorial, react"
            />
          </div>

          {/* Published */}
          <div className="flex items-center gap-2">
            <input
              id="published"
              name="published"
              type="checkbox"
              checked={formData.published}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border/60"
            />
            <label htmlFor="published" className="text-sm font-medium">
              Published
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Link href="/admin/videos">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
