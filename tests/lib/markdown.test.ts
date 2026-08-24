import { describe, it, expect } from "vitest";
import { headingToId, extractHeadings } from "@/lib/markdown";

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
