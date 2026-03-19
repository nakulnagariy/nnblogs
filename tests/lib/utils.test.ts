import { describe, it, expect } from "vitest";
import {
  cn,
  formatDate,
  formatRelativeDate,
  slugify,
  truncate,
  getReadingTime,
  generateExcerpt,
} from "@/lib/utils";

describe("utils", () => {
  describe("cn (className merger)", () => {
    it("merges class names correctly", () => {
      // Arrange & Act
      const result = cn("text-red-500", "bg-blue-500");

      // Assert
      expect(result).toBe("text-red-500 bg-blue-500");
    });

    it("handles conflicting Tailwind classes", () => {
      // Arrange & Act
      const result = cn("p-4", "p-8");

      // Assert
      expect(result).toBe("p-8"); // Last one wins
    });

    it("handles conditional classes", () => {
      // Arrange
      const isActive = true;

      // Act
      const result = cn("base-class", isActive && "active-class");

      // Assert
      expect(result).toBe("base-class active-class");
    });

    it("filters out falsy values", () => {
      // Arrange & Act
      const result = cn("base", null, undefined, false, "valid");

      // Assert
      expect(result).toBe("base valid");
    });
  });

  describe("formatDate", () => {
    it("formats Date object correctly", () => {
      // Arrange
      const date = new Date("2026-02-18");

      // Act
      const result = formatDate(date);

      // Assert
      expect(result).toBe("February 18, 2026");
    });

    it("formats date string correctly", () => {
      // Arrange
      const dateString = "2026-02-18T10:00:00Z";

      // Act
      const result = formatDate(dateString);

      // Assert
      expect(result).toContain("February");
      expect(result).toContain("2026");
    });
  });

  describe("formatRelativeDate", () => {
    it('returns "just now" for recent dates', () => {
      // Arrange
      const now = new Date();

      // Act
      const result = formatRelativeDate(now);

      // Assert
      expect(result).toBe("just now");
    });

    it("returns minutes ago for dates within last hour", () => {
      // Arrange
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      // Act
      const result = formatRelativeDate(fiveMinutesAgo);

      // Assert
      expect(result).toMatch(/\d+ minutes ago/);
    });

    it("returns hours ago for dates within last day", () => {
      // Arrange
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

      // Act
      const result = formatRelativeDate(twoHoursAgo);

      // Assert
      expect(result).toMatch(/\d+ hours ago/);
    });

    it("returns days ago for dates within last week", () => {
      // Arrange
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

      // Act
      const result = formatRelativeDate(threeDaysAgo);

      // Assert
      expect(result).toMatch(/\d+ days ago/);
    });

    it("returns formatted date for older dates", () => {
      // Arrange
      const longAgo = new Date("2025-01-01");

      // Act
      const result = formatRelativeDate(longAgo);

      // Assert
      expect(result).toContain("January");
      expect(result).toContain("2025");
    });
  });

  describe("slugify", () => {
    it("converts text to lowercase slug", () => {
      // Arrange
      const text = "Hello World";

      // Act
      const result = slugify(text);

      // Assert
      expect(result).toBe("hello-world");
    });

    it("removes special characters", () => {
      // Arrange
      const text = "React & Next.js Guide!";

      // Act
      const result = slugify(text);

      // Assert
      expect(result).toBe("react-nextjs-guide");
    });

    it("replaces multiple spaces with single hyphen", () => {
      // Arrange
      const text = "Multiple   Spaces   Here";

      // Act
      const result = slugify(text);

      // Assert
      expect(result).toBe("multiple-spaces-here");
    });

    it("trims leading and trailing hyphens", () => {
      // Arrange
      const text = "  -Leading and Trailing-  ";

      // Act
      const result = slugify(text);

      // Assert
      expect(result).toBe("leading-and-trailing");
    });

    it("handles empty string", () => {
      // Arrange
      const text = "";

      // Act
      const result = slugify(text);

      // Assert
      expect(result).toBe("");
    });

    it("handles strings with only special characters", () => {
      // Arrange
      const text = "!@#$%^&*()";

      // Act
      const result = slugify(text);

      // Assert
      expect(result).toBe("");
    });
  });

  describe("truncate", () => {
    it("truncates text longer than specified length", () => {
      // Arrange
      const text = "This is a very long text that needs to be truncated";

      // Act
      const result = truncate(text, 20);

      // Assert
      expect(result).toBe("This is a very long...");
      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
    });

    it("does not truncate text shorter than length", () => {
      // Arrange
      const text = "Short text";

      // Act
      const result = truncate(text, 20);

      // Assert
      expect(result).toBe("Short text");
    });

    it("does not truncate text equal to length", () => {
      // Arrange
      const text = "Exactly twenty chars";

      // Act
      const result = truncate(text, 20);

      // Assert
      expect(result).toBe("Exactly twenty chars");
    });

    it("handles empty string", () => {
      // Arrange
      const text = "";

      // Act
      const result = truncate(text, 10);

      // Assert
      expect(result).toBe("");
    });
  });

  describe("getReadingTime", () => {
    it("calculates reading time for short content", () => {
      // Arrange
      const content =
        "This is a short blog post with about fifty words. ".repeat(4); // ~200 words

      // Act
      const result = getReadingTime(content);

      // Assert
      expect(result).toBe("1 min read");
    });

    it("calculates reading time for medium content", () => {
      // Arrange
      const content = "Word ".repeat(600); // 600 words

      // Act
      const result = getReadingTime(content);

      // Assert
      expect(result).toBe("3 min read");
    });

    it("rounds up reading time", () => {
      // Arrange
      const content = "Word ".repeat(250); // 250 words = 1.25 minutes

      // Act
      const result = getReadingTime(content);

      // Assert
      expect(result).toBe("2 min read"); // Rounds up
    });

    it("handles empty content", () => {
      // Arrange
      const content = "";

      // Act
      const result = getReadingTime(content);

      // Assert
      expect(result).toBe("1 min read"); // Minimum 1 minute
    });

    it("handles single word", () => {
      // Arrange
      const content = "Word";

      // Act
      const result = getReadingTime(content);

      // Assert
      expect(result).toBe("1 min read");
    });
  });

  describe("generateExcerpt", () => {
    it("strips markdown headings", () => {
      // Arrange
      const content = "## My Heading\nSome paragraph text here.";

      // Act
      const result = generateExcerpt(content);

      // Assert
      expect(result).not.toContain("##");
      expect(result).toContain("My Heading");
    });

    it("strips bold and italic markers", () => {
      // Arrange
      const content = "This is **bold** and *italic* text.";

      // Act
      const result = generateExcerpt(content);

      // Assert
      expect(result).toBe("This is bold and italic text.");
    });

    it("strips inline links keeping display text", () => {
      // Arrange
      const content = "Read [the docs](https://example.com) for more.";

      // Act
      const result = generateExcerpt(content);

      // Assert
      expect(result).toBe("Read the docs for more.");
    });

    it("strips code fence backtick markers", () => {
      // Arrange
      const content = "Intro\n```js\nsome code\n```\nOutro";

      // Act
      const result = generateExcerpt(content);

      // Assert
      // The triple-backtick markers are removed (single-backtick regex consumes them first)
      expect(result).not.toContain("```");
    });

    it("truncates to 160 chars by default and appends ellipsis", () => {
      // Arrange
      const content = "Word ".repeat(100); // ~500 chars

      // Act
      const result = generateExcerpt(content);

      // Assert
      expect(result.endsWith("...")).toBe(true);
      expect(result.length).toBeLessThanOrEqual(163); // 160 + '...'
    });

    it("respects custom length parameter", () => {
      // Arrange
      const content = "This is some content that is longer than fifty chars total.";

      // Act
      const result = generateExcerpt(content, 20);

      // Assert
      expect(result.endsWith("...")).toBe(true);
      expect(result.length).toBeLessThanOrEqual(23);
    });

    it("returns original text when shorter than limit", () => {
      // Arrange
      const content = "Short content.";

      // Act
      const result = generateExcerpt(content);

      // Assert
      expect(result).toBe("Short content.");
    });
  });
});
