'use client';

import DOMPurify from 'isomorphic-dompurify';
import { parseMarkdownSync } from '@/lib/markdown';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export default function MarkdownPreview({
  content,
  className,
}: MarkdownPreviewProps) {
  if (!content.trim()) {
    return (
      <div className="p-6 text-center text-gray-400 dark:text-gray-600">
        Preview will appear here as you type...
      </div>
    );
  }

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
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'loading'],
  });

  return (
    <div
      className={cn(
        'prose prose-lg prose-slate dark:prose-invert max-w-none p-6 overflow-auto',
        'prose-headings:scroll-mt-20',
        'prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline',
        'prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:text-gray-800 dark:prose-code:text-gray-200',
        'prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:overflow-x-auto',
        'prose-img:rounded-lg prose-img:shadow-md',
        'prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700',
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
