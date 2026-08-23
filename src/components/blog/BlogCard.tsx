import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { formatDate, getReadingTime, truncate } from '@/lib/utils';
import { getCategoryGradient } from '@/lib/category-themes';
import type { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const gradient = getCategoryGradient(post.category);

  return (
    <article className={`group flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-200 hover:shadow-sm hover:border-border${featured ? ' md:col-span-2' : ''}`}>
      {/* Cover — flush to card edges */}
      <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
          )}
        </div>
      </Link>

      {/* Content */}
      <div className={`flex flex-col flex-1 p-5${featured ? ' sm:p-6' : ''}`}>
        {/* Meta row */}
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2.5 py-0.5 rounded-md text-xs bg-muted text-muted-foreground font-medium">
            {post.category}
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            {formatDate(post.created_at)}
          </span>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`} className="group/link">
          <h2 className={`font-bold tracking-tight leading-snug mb-2.5 text-foreground group-hover/link:opacity-70 transition-opacity${featured ? ' text-2xl' : ' text-lg'}`}>
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
          {truncate(post.excerpt, featured ? 200 : 120)}
        </p>

        {/* Footer meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono pt-3 border-t border-border/40">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {getReadingTime(post.content)}
          </span>
        </div>
      </div>
    </article>
  );
}

