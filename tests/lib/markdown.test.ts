import { describe, it, expect } from "vitest";
import {
  headingToId,
  generateSlug,
  calculateReadTime,
  extractExcerpt,
  extractHeadings,
} from "@/lib/markdown";

describe("markdown", () => {
  describe("headingToId", () => {
    it("lowercases and replaces spaces with hyphens", () => {
      expect(headingToId("Hello World")).toBe("hello-world");
    });

    it("strips HTML tags before processing", () => {
      expect(headingToId("<strong>Bold Title</strong>")).toBe("bold-title");
    });

    it("removes special characters", () => {
      expect(headingToId("React & Next.js!")).toBe("react-nextjs");
    });

    it("handles empty string", () => {
      expect(headingToId("")).toBe("");
    });

    it("trims surrounding whitespace", () => {
      expect(headingToId("  spaced  ")).toBe("spaced");
    });
  });

  describe("generateSlug", () => {
    it("lowercases and replaces spaces with hyphens", () => {
      expect(generateSlug("Hello World")).toBe("hello-world");
    });

    it("removes special characters", () => {
      expect(generateSlug("React & Next.js Guide!")).toBe("react-nextjs-guide");
    });

    it("collapses multiple hyphens", () => {
      expect(generateSlug("foo--bar")).toBe("foo-bar");
    });

    it("trims leading and trailing hyphens", () => {
      expect(generateSlug("  -hello- ")).toBe("hello");
    });

    it("handles empty string", () => {
      expect(generateSlug("")).toBe("");
    });
  });

  describe("calculateReadTime", () => {
    it("returns 1 for a single word", () => {
      expect(calculateReadTime("word")).toBe(1);
    });

    it("returns 1 for content shorter than 200 words", () => {
      const content = "word ".repeat(100).trim();
      expect(calculateReadTime(content)).toBe(1);
    });

    it("scales with word count", () => {
      const content = "word ".repeat(400).trim(); // 400 words = 2 min
      expect(calculateReadTime(content)).toBe(2);
    });

    it("rounds up fractional minutes", () => {
      const content = "word ".repeat(210).trim(); // 210 / 200 = 1.05 → 2
      expect(calculateReadTime(content)).toBe(2);
    });

    it("returns minimum of 1 for empty string", () => {
      expect(calculateReadTime("")).toBe(1);
    });
  });

  describe("extractExcerpt", () => {
    it("strips heading markers", () => {
      const result = extractExcerpt("## Section\nParagraph text.");
      expect(result).not.toContain("##");
      expect(result).toContain("Section");
    });

    it("strips bold and italic markers", () => {
      const result = extractExcerpt("This is **bold** and *italic*.");
      expect(result).toBe("This is bold and italic.");
    });

    it("strips inline code backticks", () => {
      const result = extractExcerpt("Use `console.log` for debugging.");
      expect(result).toBe("Use console.log for debugging.");
    });

    it("strips links, keeping display text", () => {
      const result = extractExcerpt("Visit [the site](https://example.com).");
      expect(result).toBe("Visit the site.");
    });

    it("strips images entirely", () => {
      const result = extractExcerpt("Before ![alt text](img.png) after.");
      expect(result).not.toContain("![");
      expect(result).not.toContain("img.png");
    });

    it("truncates to 160 chars by default with ellipsis", () => {
      const content = "word ".repeat(100);
      const result = extractExcerpt(content);
      expect(result.endsWith("...")).toBe(true);
      expect(result.length).toBeLessThanOrEqual(163);
    });

    it("respects custom maxLength parameter", () => {
      const result = extractExcerpt("A longer piece of text here.", 10);
      expect(result.endsWith("...")).toBe(true);
      expect(result.length).toBeLessThanOrEqual(13);
    });

    it("returns original text when under limit", () => {
      const result = extractExcerpt("Short.", 160);
      expect(result).toBe("Short.");
    });
  });

  describe("extractHeadings", () => {
    it("extracts h1 headings", () => {
      const headings = extractHeadings("# Title\n\nSome content.");
      expect(headings).toHaveLength(1);
      expect(headings[0]).toMatchObject({ text: "Title", level: 1 });
    });

    it("extracts h2 and h3 headings", () => {
      const content = "## Section\n\n### Subsection\n\nText.";
      const headings = extractHeadings(content);
      expect(headings).toHaveLength(2);
      expect(headings[0]).toMatchObject({ level: 2, text: "Section" });
      expect(headings[1]).toMatchObject({ level: 3, text: "Subsection" });
    });

    it("does not extract h4 or deeper", () => {
      const headings = extractHeadings("#### Deep\n\n##### Deeper");
      expect(headings).toHaveLength(0);
    });

    it("generates correct ids from heading text", () => {
      const headings = extractHeadings("## Hello World");
      expect(headings[0]?.id).toBe("hello-world");
    });

    it("strips inline markdown formatting from heading text", () => {
      const headings = extractHeadings("## **Bold** heading with `code`");
      expect(headings[0]?.text).toBe("Bold heading with code");
    });

    it("returns empty array for content with no headings", () => {
      const headings = extractHeadings("Just some paragraph text.\n\nAnother paragraph.");
      expect(headings).toHaveLength(0);
    });

    it("handles multiple headings in order", () => {
      const content = "# H1\n## H2a\n## H2b\n### H3";
      const headings = extractHeadings(content);
      expect(headings).toHaveLength(4);
      expect(headings.map((h) => h.level)).toEqual([1, 2, 2, 3]);
    });
  });
});
