import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Eye, ArrowLeft } from 'lucide-react';
import { getPostBySlug, incrementPostViews, getRelatedPosts } from '@/lib/supabase/queries';
import { MarkdownRenderer, BlogPostClientWrapper, TableOfContents } from '@/components/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import { formatDate, getReadingTime } from '@/lib/utils';
import { extractHeadings } from '@/lib/markdown';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      images: post.featured_image ? [post.featured_image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  incrementPostViews(slug).catch(console.error);
  const relatedPosts = await getRelatedPosts(slug, post.category, 3).catch(() => []);
  const headings = extractHeadings(post.content);

  return (
    <BlogPostClientWrapper slug={slug} title={post.title} category={post.category}>
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Back link */}
        <div className="pt-20 pb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Blog
          </Link>
        </div>

        {/* Two-column layout: article + TOC sidebar */}
        <div className="flex gap-12 xl:gap-16 items-start">

          {/* Main article content */}
          <div className="flex-1 min-w-0">
            {/* Article header */}
            <header className="pb-10 border-b border-border/40">
              {/* Category + tags */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="px-2.5 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                  {post.category}
                </span>
                {post.tags?.map((tag) => (
                  <span key={tag} className="text-xs font-mono text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-5 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {getReadingTime(post.content)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {post.views} views
                </span>
              </div>
            </header>

            {/* Featured image */}
            {post.featured_image && (
              <div className="relative aspect-video my-10 rounded-xl overflow-hidden">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="py-10">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* Post footer */}
            <footer className="py-8 border-t border-border/40 mb-16">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                More Posts
              </Link>
            </footer>
          </div>

          {/* "On this page" sticky TOC sidebar — only on large screens */}
          {headings.length > 1 && (
            <aside className="hidden xl:block w-56 shrink-0">
              <div className="sticky top-24 pt-2 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border/40">
          <div className="container mx-auto px-6 max-w-6xl py-16">
            <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-8">
              Related Reading
            </p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rp) => (
                <BlogCard key={rp.id} post={rp} />
              ))}
            </div>
          </div>
        </section>
      )}
    </BlogPostClientWrapper>
  );
}


