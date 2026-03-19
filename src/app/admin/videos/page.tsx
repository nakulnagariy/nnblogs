'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Dialog } from '@/components/ui/Dialog';
import { formatDate } from '@/lib/utils';
import type { Video } from '@/types';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    videoId?: string;
  }>({ isOpen: false });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/videos');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`);
      }
      
      const { data } = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch videos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteDialog({ isOpen: true, videoId: id });
  };

  const executeDelete = async () => {
    if (!deleteDialog.videoId) return;
    const id = deleteDialog.videoId;

    try {
      const response = await fetch(`/api/admin/videos?id=${id}`, { method: 'DELETE' });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete video');
      }
      
      setVideos(videos.filter((v) => v.id !== id));
      setDeleteDialog({ isOpen: false });
    } catch (error) {
      console.error('Failed to delete video:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete video');
      setDeleteDialog({ isOpen: false });
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-1">Content</p>
          <h1 className="text-2xl font-black tracking-tight">Videos</h1>
        </div>
        <Link href="/admin/videos/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Video
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl border border-destructive/30 bg-destructive/5 text-destructive">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : videos.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No videos yet. Create your first video!</p>
            <Link href="/admin/videos/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Video
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <Card key={video.id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{video.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">{video.category}</Badge>
                      {video.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>{formatDate(video.created_at)}</span>
                      {video.duration && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{video.duration}</span>
                        </>
                      )}
                      <span className="mx-2">•</span>
                      <span>{video.views} views</span>
                      <span className="mx-2">•</span>
                      <span className={video.published ? 'text-green-500' : 'text-yellow-500'}>
                        {video.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/admin/videos/${video.id}`}>
                      <Button variant="outline" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(video.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false })}
        onConfirm={executeDelete}
        title="Delete Video"
        description="Are you sure you want to delete this video? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
