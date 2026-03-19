import OpenAI from "openai";

// Note: Install openai package: npm install openai
// This is a placeholder - uncomment and use when needed

let openai: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY not set");
    return null;
  }

  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openai;
}

export interface GenerateContentOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export async function generateBlogContent(
  topic: string,
  style: "technical" | "casual" | "tutorial" = "casual",
): Promise<string | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  const stylePrompts = {
    technical:
      "Write in a technical, professional tone with code examples where appropriate.",
    casual:
      "Write in a friendly, conversational tone that is easy to understand.",
    tutorial:
      "Write as a step-by-step tutorial with clear instructions and examples.",
  };

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful blog writer. ${stylePrompts[style]} Use markdown formatting.`,
        },
        {
          role: "user",
          content: `Write a blog post about: ${topic}`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
}

export async function generateExcerpt(content: string): Promise<string | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Generate a concise, engaging excerpt (2-3 sentences) for the following blog post. Do not use quotes.",
        },
        {
          role: "user",
          content: content.slice(0, 3000),
        },
      ],
      max_tokens: 150,
      temperature: 0.5,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("Error generating excerpt:", error);
    return null;
  }
}

export async function suggestTags(content: string): Promise<string[]> {
  const client = getOpenAIClient();
  if (!client) return [];

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Suggest 3-5 relevant tags for this blog post. Return only the tags as a comma-separated list, lowercase.",
        },
        {
          role: "user",
          content: content.slice(0, 2000),
        },
      ],
      max_tokens: 50,
      temperature: 0.3,
    });

    const tagsString = response.choices[0]?.message?.content || "";
    return tagsString
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  } catch (error) {
    console.error("Error suggesting tags:", error);
    return [];
  }
}

export async function improveWriting(content: string): Promise<string | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Improve the following text for clarity, grammar, and engagement while maintaining the original meaning and style. Keep markdown formatting.",
        },
        {
          role: "user",
          content,
        },
      ],
      max_tokens: 3000,
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("Error improving writing:", error);
    return null;
  }
}

/**
 * Summarizes a blog post into 4-5 concise bullet points for readers.
 * Returns an array of plain-text bullet strings (no leading dash).
 */
export async function summarizePost(content: string): Promise<string[] | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'Summarize the following blog post into exactly 4-5 concise, informative bullet points that capture the key takeaways. Return each bullet on its own line starting with "- ". No preamble, just bullets.',
        },
        {
          role: "user",
          content: content.slice(0, 6000),
        },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    const raw = response.choices[0]?.message?.content || "";
    return raw
      .split("\n")
      .map((line) => line.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean);
  } catch (error) {
    console.error("Error summarizing post:", error);
    return null;
  }
}

/**
 * Continues writing the blog post from where it left off.
 * Returns a markdown string that can be appended to the existing content.
 */
export async function continueWriting(content: string): Promise<string | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a technical blog writer. Continue the following blog post naturally from where it ends. Match the tone, style and markdown formatting already used. Write 2-4 paragraphs. Do not repeat what was already written.",
        },
        {
          role: "user",
          content: content.slice(-3000), // send last 3000 chars for context
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("Error continuing writing:", error);
    return null;
  }
}

/**
 * Suggests 3 alternative, SEO-friendly title variations for the blog post.
 */
export async function suggestTitles(
  content: string,
  currentTitle: string,
): Promise<string[] | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Suggest 3 compelling, SEO-friendly blog post title alternatives. Return one title per line, no numbering, no quotes.",
        },
        {
          role: "user",
          content: `Current title: "${currentTitle}"\n\nPost content (excerpt):\n${content.slice(0, 2000)}`,
        },
      ],
      max_tokens: 120,
      temperature: 0.8,
    });

    const raw = response.choices[0]?.message?.content || "";
    return raw
      .split("\n")
      .map((line) => line.replace(/^\d+[.)]\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 3);
  } catch (error) {
    console.error("Error suggesting titles:", error);
    return null;
  }
}

/**
 * Identifies content gaps — sections that are thin, missing, or could be expanded.
 * Returns an array of actionable suggestions.
 */
export async function findContentGaps(
  content: string,
): Promise<string[] | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            'You are a senior technical editor. Review the blog post and identify specific content gaps, missing explanations, weak sections, or topics that should be added/expanded. Return 3-6 actionable suggestions, one per line starting with "- ".',
        },
        {
          role: "user",
          content: content.slice(0, 5000),
        },
      ],
      max_tokens: 400,
      temperature: 0.4,
    });

    const raw = response.choices[0]?.message?.content || "";
    return raw
      .split("\n")
      .map((line) => line.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean);
  } catch (error) {
    console.error("Error finding content gaps:", error);
    return null;
  }
}
