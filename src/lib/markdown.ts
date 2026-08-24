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
