import { Children, createElement, Fragment, isValidElement, type ReactNode } from 'react';
import Markdoc, { Tag, type Node as MarkdocAstNode, type Schema } from '@markdoc/markdoc';
import hljs from 'highlight.js';
import { headingToId } from '@/lib/markdown';

interface MarkdownRendererProps {
  content: MarkdocAstNode;
}

/**
 * Markdoc's default node schemas for `heading` and `fence` hardcode their own
 * output tag name inside a custom `transform()` (e.g. `new Tag(`h${level}`, ...)`),
 * bypassing the schema's `render` property entirely — overriding just `render`
 * has no effect for these two. `link`/`image`/`document` have no custom
 * `transform`, so overriding `render` there works via Markdoc's generic path.
 * Markdoc's react renderer also only consults the `components` map for tag
 * names starting with an uppercase letter (that's how it tells a custom
 * component apart from a plain HTML tag) — hence the PascalCase names below.
 */
const markdocConfig = {
  nodes: {
    document: { ...Markdoc.nodes.document, render: 'Article' },
    heading: {
      ...Markdoc.nodes.heading,
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        return new Tag('Heading', { ...attributes, level: node.attributes.level }, node.transformChildren(config));
      },
    } satisfies Schema,
    fence: {
      ...Markdoc.nodes.fence,
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        const children = node.children.length ? node.transformChildren(config) : [node.attributes.content];
        return new Tag('CodeBlock', attributes, children);
      },
    } satisfies Schema,
    link: { ...Markdoc.nodes.link, render: 'ExternalAwareLink' },
    image: { ...Markdoc.nodes.image, render: 'ContentImage' },
  },
};

function flattenText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join('');
  if (isValidElement(node)) {
    return flattenText((node.props as { children?: ReactNode }).children);
  }
  return Children.toArray(node).map(flattenText).join('');
}

function Article({ children }: { children: ReactNode }) {
  return (
    <article
      className={[
        'prose prose-lg prose-slate dark:prose-invert max-w-none',
        'prose-headings:scroll-mt-20',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-slate-900 prose-pre:text-slate-50',
        'prose-img:rounded-lg prose-img:shadow-md',
      ].join(' ')}
    >
      {children}
    </article>
  );
}

function Heading({ level, children }: { level: 1 | 2 | 3 | 4 | 5 | 6; children: ReactNode }) {
  const Tag = `h${level}` as const;
  const id = headingToId(flattenText(children));
  return <Tag id={id}>{children}</Tag>;
}

function CodeBlock({
  ['data-language']: requested,
  children,
}: {
  ['data-language']?: string;
  children: ReactNode;
}) {
  const code = Array.isArray(children) ? children.join('') : String(children ?? '');
  const language = requested && hljs.getLanguage(requested) ? requested : 'plaintext';
  const highlighted = hljs.highlight(code, { language }).value;
  return (
    <pre>
      <code className={`hljs language-${language}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  );
}

function ExternalAwareLink({ href, title, children }: { href: string; title?: string; children: ReactNode }) {
  const isExternal = href?.startsWith('http');
  return (
    <a
      href={href}
      title={title}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
}

function ContentImage({ src, alt, title }: { src: string; alt?: string; title?: string }) {
  return (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt ?? ''} title={title} loading="lazy" className="rounded-lg" />
      {alt && <figcaption className="text-center text-sm text-muted-foreground mt-2">{alt}</figcaption>}
    </figure>
  );
}

const components = {
  Article,
  Heading,
  CodeBlock,
  ExternalAwareLink,
  ContentImage,
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const renderable = Markdoc.transform(content, markdocConfig);
  return Markdoc.renderers.react(renderable, { createElement, Fragment }, { components });
}
