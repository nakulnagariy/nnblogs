'use client';

import DOMPurify from 'isomorphic-dompurify';
import { parseMarkdownSync } from '@/lib/markdown';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const html = parseMarkdownSync(content);
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'strong', 'em', 'u', 's', 'blockquote',
      'a', 'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'code', 'pre', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'hr', 'div', 'span'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'loading', 'id'],
  });

  return (
    <article
      className={cn(
        'prose prose-lg prose-slate dark:prose-invert max-w-none',
        'prose-headings:scroll-mt-20',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-slate-900 prose-pre:text-slate-50',
        'prose-img:rounded-lg prose-img:shadow-md',
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
