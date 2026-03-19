import { marked } from "marked";
import type { RefObject } from "react";
import hljs from "highlight.js";

// Configure marked with syntax highlighting
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Custom renderer for code blocks with syntax highlighting
const renderer = new marked.Renderer();

renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
  const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";
  const highlighted = hljs.highlight(text, { language }).value;
  return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
};

renderer.link = ({
  href,
  title,
  text,
}: {
  href: string;
  title?: string | null;
  text: string;
}) => {
  const isExternal = href?.startsWith("http");
  const titleAttr = title ? ` title="${title}"` : "";
  const targetAttr = isExternal
    ? ' target="_blank" rel="noopener noreferrer"'
    : "";
  return `<a href="${href}"${titleAttr}${targetAttr}>${text}</a>`;
};

renderer.image = ({
  href,
  title,
  text,
}: {
  href: string;
  title?: string | null;
  text: string;
}) => {
  const titleAttr = title ? ` title="${title}"` : "";
  return `<figure class="my-8">
    <img src="${href}" alt="${text}" loading="lazy" class="rounded-lg"${titleAttr} />
    ${text ? `<figcaption class="text-center text-sm text-gray-500 mt-2">${text}</figcaption>` : ""}
  </figure>`;
};

/**
 * Converts heading text to a URL-safe HTML id.
 * Strips HTML tags, lowercases, and replaces spaces with hyphens.
 */
export function headingToId(text: string): string {
  return text
    .replace(/<[^>]+>/g, "") // strip HTML tags
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
  const id = headingToId(text);
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

marked.use({ renderer });

export function parseMarkdown(content: string): string {
  return marked.parse(content) as string;
}

export function parseMarkdownSync(content: string): string {
  return marked.parse(content, { async: false }) as string;
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * Extracts headings from raw markdown content for use in a Table of Contents.
 * Only returns h1–h3 headings. Strips markdown formatting from text.
 */
export function extractHeadings(content: string): TocHeading[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: TocHeading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1]?.length ?? 0;
    const rawText = (match[2] ?? "").trim();
    if (!level || !rawText) continue;
    // Strip common markdown inline formatting
    const plainText = rawText
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/~~([^~]+)~~/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    const id = headingToId(plainText);
    headings.push({ id, text: plainText, level });
  }

  return headings;
}

/**
 * Insert markdown syntax at cursor position in textarea
 */
export function insertMarkdownSyntax(
  textareaRef: RefObject<HTMLTextAreaElement>,
  before: string,
  after: string = before,
  placeholder: string = "text",
): void {
  const textarea = textareaRef.current;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selectedText = text.substring(start, end) || placeholder;

  const newText =
    text.substring(0, start) +
    before +
    selectedText +
    after +
    text.substring(end);

  // Use React's internal setter so the onChange fires on controlled inputs
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    "value",
  )?.set;
  nativeSetter?.call(textarea, newText);

  const newStart = start + before.length;
  const newEnd = newStart + selectedText.length;
  textarea.setSelectionRange(newStart, newEnd);
  textarea.focus();
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Insert link syntax
 */
export function insertLink(
  textareaRef: RefObject<HTMLTextAreaElement>,
  url: string = "https://example.com",
): void {
  const textarea = textareaRef.current;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selectedText = text.substring(start, end) || "link text";

  const linkSyntax = `[${selectedText}](${url})`;
  const newText = text.substring(0, start) + linkSyntax + text.substring(end);

  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    "value",
  )?.set;
  nativeSetter?.call(textarea, newText);

  textarea.setSelectionRange(start + 1, start + selectedText.length + 1);
  textarea.focus();
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Insert image syntax
 */
export function insertImage(
  textareaRef: RefObject<HTMLTextAreaElement>,
  url: string,
  alt: string = "image",
): void {
  const textarea = textareaRef.current;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const text = textarea.value;

  const imageSyntax = `![${alt}](${url})`;
  const newText =
    text.substring(0, start) + imageSyntax + text.substring(start);

  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    "value",
  )?.set;
  nativeSetter?.call(textarea, newText);

  textarea.setSelectionRange(
    start + imageSyntax.length,
    start + imageSyntax.length,
  );
  textarea.focus();
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Calculate approximate read time in minutes
 */
export function calculateReadTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Extract excerpt from markdown content
 */
export function extractExcerpt(
  content: string,
  maxLength: number = 160,
): string {
  let text = content
    .replace(/^#+\s/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/!\[(.+?)\]\(.+?\)/g, "")
    .replace(/\n+/g, " ")
    .trim();

  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim() + "...";
  }

  return text;
}
