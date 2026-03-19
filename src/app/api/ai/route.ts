import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  generateBlogContent,
  generateExcerpt,
  suggestTags,
  improveWriting,
  summarizePost,
  continueWriting,
  suggestTitles,
  findContentGaps,
} from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const body = await request.json();
    const { action, content, topic, style, title } = body;

    // Public action — no auth required (summarizing already-public content)
    // Rate limited: 10 summarize requests per minute per IP
    if (action === "summarize") {
      const { success } = rateLimit(`ai:summarize:${ip}`, 10, 60 * 1000);
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please slow down." },
          { status: 429 },
        );
      }
      if (!content) {
        return NextResponse.json(
          { error: "Content is required" },
          { status: 400 },
        );
      }
      const bullets = await summarizePost(content);
      if (!bullets?.length) {
        return NextResponse.json(
          { error: "AI service unavailable. Check your OpenAI API key." },
          { status: 503 },
        );
      }
      return NextResponse.json({ data: bullets });
    }

    // All other actions require authentication (admin writing tools)
    // Rate limited: 30 AI requests per hour per IP
    const { success: withinLimit } = rateLimit(`ai:admin:${ip}`, 30, 60 * 60 * 1000);
    if (!withinLimit) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    switch (action) {
      case "generate":
        if (!topic) {
          return NextResponse.json(
            { error: "Topic is required" },
            { status: 400 },
          );
        }
        const generatedContent = await generateBlogContent(
          topic,
          style || "casual",
        );
        return NextResponse.json({ data: generatedContent });

      case "excerpt":
        if (!content) {
          return NextResponse.json(
            { error: "Content is required" },
            { status: 400 },
          );
        }
        const excerpt = await generateExcerpt(content);
        if (!excerpt) {
          return NextResponse.json(
            { error: "AI service unavailable. Check your OpenAI API key." },
            { status: 503 },
          );
        }
        return NextResponse.json({ data: excerpt });

      case "tags":
        if (!content) {
          return NextResponse.json(
            { error: "Content is required" },
            { status: 400 },
          );
        }
        const tags = await suggestTags(content);
        return NextResponse.json({ data: tags });

      case "improve":
        if (!content) {
          return NextResponse.json(
            { error: "Content is required" },
            { status: 400 },
          );
        }
        const improved = await improveWriting(content);
        if (!improved) {
          return NextResponse.json(
            { error: "AI service unavailable. Check your OpenAI API key." },
            { status: 503 },
          );
        }
        return NextResponse.json({ data: improved });

      case "continue":
        if (!content) {
          return NextResponse.json(
            { error: "Content is required" },
            { status: 400 },
          );
        }
        const continuation = await continueWriting(content);
        if (!continuation) {
          return NextResponse.json(
            { error: "AI service unavailable. Check your OpenAI API key." },
            { status: 503 },
          );
        }
        return NextResponse.json({ data: continuation });

      case "suggest-title":
        if (!content) {
          return NextResponse.json(
            { error: "Content is required" },
            { status: 400 },
          );
        }
        const titles = await suggestTitles(content, title || "");
        if (!titles?.length) {
          return NextResponse.json(
            { error: "AI service unavailable. Check your OpenAI API key." },
            { status: 503 },
          );
        }
        return NextResponse.json({ data: titles });

      case "find-gaps":
        if (!content) {
          return NextResponse.json(
            { error: "Content is required" },
            { status: 400 },
          );
        }
        const gaps = await findContentGaps(content);
        if (!gaps?.length) {
          return NextResponse.json(
            { error: "AI service unavailable. Check your OpenAI API key." },
            { status: 503 },
          );
        }
        return NextResponse.json({ data: gaps });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error with AI generation:", error);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 },
    );
  }
}
