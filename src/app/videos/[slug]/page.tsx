import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, ArrowLeft, Share2 } from 'lucide-react';
import { getVideoBySlug, incrementVideoViews, getRelatedVideos } from '@/lib/supabase/queries';
import { YouTubeEmbed } from '@/components/videos/YouTubeEmbed';
import { VideoTracker } from '@/components/analytics';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { isYouTubeUrl } from '@/lib/youtube';
import type { Metadata } from 'next';

interface VideoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  if (!video) {
    return {
      title: 'Video Not Found',
    };
  }

  return {
    title: video.title,
    description: video.description,
    openGraph: {
      title: video.title,
      description: video.description,
      type: 'video.other',
      images: video.thumbnail_url ? [video.thumbnail_url] : [],
    },
    twitter: {
      card: 'player',
      title: video.title,
      description: video.description,
      images: video.thumbnail_url ? [video.thumbnail_url] : [],
    },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  if (!video) {
    notFound();
  }

  // Increment views (fire and forget)
  incrementVideoViews(slug).catch(console.error);

  // Get related videos from same category
  const relatedVideos = await getRelatedVideos(slug, video.category, 3).catch(() => []);

  // Check if it's a YouTube video
  const isYouTube = isYouTubeUrl(video.video_url);

  return (
    <>
      <VideoTracker slug={slug} title={video.title} source={isYouTube ? 'youtube' : 'self-hosted'} />
      <article className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Back Button */}
        <Link href="/videos">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Videos
          </Button>
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{video.category}</Badge>
            {video.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl font-bold mb-4">{video.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={video.created_at}>{formatDate(video.created_at)}</time>
            </div>
            {video.duration && (
              <div className="flex items-center gap-1">
                <span>⏱️ {video.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{video.views} views</span>
            </div>
          </div>
        </header>

        {/* Video Player */}
        <div className="mb-8">
          {isYouTube ? (
            <YouTubeEmbed videoUrl={video.video_url} title={video.title} />
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <video
                src={video.video_url}
                controls
                className="w-full h-full rounded-lg"
                poster={video.thumbnail_url}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        {/* Description */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">About this video</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{video.description}</p>
          </div>
        </Card>

        {/* Footer */}
        <footer className="pt-8 border-t">
          <div className="flex items-center justify-between">
            <Link href="/videos">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                More Videos
              </Button>
            </Link>
            <Button variant="ghost">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </footer>
      </article>

      {/* Related Videos Section */}
      {relatedVideos.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold mb-8">Related Videos</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedVideos.map((relatedVideo) => (
                <Link
                  key={relatedVideo.id}
                  href={`/videos/${relatedVideo.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative bg-muted">
                      {relatedVideo.thumbnail_url ? (
                        <Image
                          src={relatedVideo.thumbnail_url}
                          alt={relatedVideo.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">🎥</span>
                        </div>
                      )}
                      {relatedVideo.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {relatedVideo.duration}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-foreground transition-colors line-clamp-2 mb-2">
                        {relatedVideo.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{relatedVideo.views}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {relatedVideo.category}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
