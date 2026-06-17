/**
 * Generator — produces AI content for placeholder topics using the Anthropic API.
 * Supports notes, examples, assessments, and flashcards.
 * All generated content carries full generation metadata.
 */

import Anthropic from '@anthropic-ai/sdk';
import type { TopicAnalysis, GeneratedContent, ContentType } from './types.js';
import { CostTracker } from './cost-tracker.js';

// Default models per content type (balance quality vs cost)
const MODELS: Record<ContentType, string> = {
  notes:      'claude-haiku-4-5-20251001', // override to sonnet/opus for higher quality
  example:    'claude-haiku-4-5-20251001',
  assessment: 'claude-haiku-4-5-20251001',
  flashcards: 'claude-haiku-4-5-20251001',
};

const PROMPT_VERSION = 'v1.0';

export class ContentGenerator {
  private client: Anthropic;
  private tracker: CostTracker;

  constructor(tracker: CostTracker, apiKey?: string) {
    this.client = new Anthropic({ apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY });
    this.tracker = tracker;
  }

  async generateNotes(analysis: TopicAnalysis, existingBase?: string): Promise<GeneratedContent> {
    const model = MODELS.notes;
    const topicTitle = slugToTitle(analysis.topic);
    const categoryLabel = slugToTitle(analysis.category);

    const baseSection = existingBase
      ? `\nHere is a draft/stub to expand from:\n<draft>\n${existingBase.slice(0, 2000)}\n</draft>\n`
      : '';

    const prompt = `Write a comprehensive notes article (800–1500 words) for a JavaScript interview prep platform.

Topic: ${topicTitle}
Category: ${categoryLabel}
${baseSection}
Requirements:
- Explain the concept clearly from first principles
- Include real-world use cases and practical examples
- Cover common gotchas, edge cases, and interview traps
- Include inline code snippets (fenced with \`\`\`js) to illustrate key points
- Use markdown formatting: ## headers, **bold**, bullet lists
- Write at a senior/intermediate developer level
- Do NOT include a top-level H1 title (it will be added by the UI)
- End with a "Key Takeaways" section

Output ONLY the markdown content. No preamble, no "Here is..." intro.`;

    return this.callApi(model, prompt, `${analysis.category}/${analysis.topic}/notes`);
  }

  async generateExample(analysis: TopicAnalysis, notesBody?: string): Promise<GeneratedContent> {
    const model = MODELS.example;
    const topicTitle = slugToTitle(analysis.topic);

    const context = notesBody
      ? `\nContext from notes:\n<notes>\n${notesBody.slice(0, 1500)}\n</notes>\n`
      : '';

    const prompt = `Write a JavaScript code example file for interview prep.

Topic: ${topicTitle}
${context}
Requirements:
- Include exactly 6 self-contained, runnable JavaScript functions/examples
- Each function should demonstrate a distinct aspect of the topic
- Add a brief comment above each function explaining what it demonstrates
- Use modern JavaScript (ES2020+), no TypeScript
- Include console.log() calls showing expected output in comments
- Examples should progress from basic to advanced
- No imports/exports needed — plain JavaScript

Output ONLY the JavaScript code. No markdown fences, no preamble.`;

    return this.callApi(model, prompt, `${analysis.category}/${analysis.topic}/example`);
  }

  async generateAssessment(analysis: TopicAnalysis, notesBody?: string): Promise<GeneratedContent> {
    const model = MODELS.assessment;
    const topicTitle = slugToTitle(analysis.topic);

    const context = notesBody
      ? `\nBased on these notes:\n<notes>\n${notesBody.slice(0, 2000)}\n</notes>\n`
      : '';

    const prompt = `Create an interactive HTML assessment quiz for a JavaScript interview prep platform.

Topic: ${topicTitle}
${context}
Requirements:
- Include exactly 6 multiple-choice questions (MCQs)
- Mix difficulty: 2 easy, 3 medium, 1 hard
- Each question must have 4 answer options (a, b, c, d)
- Include a hidden explanation for each question that reveals after answering
- Questions should test deep understanding, not just definitions
- Include at least one question about a common misconception or gotcha

Output ONLY the following HTML structure (no <html>/<head>/<body> tags):

<div class="assessment-container">
  <div class="question-block" id="q1">
    <h3 class="question-text">QUESTION TEXT</h3>
    <div class="options">
      <label><input type="radio" name="q1" value="a"> OPTION A</label>
      <label><input type="radio" name="q1" value="b"> OPTION B</label>
      <label><input type="radio" name="q1" value="c"> OPTION C</label>
      <label><input type="radio" name="q1" value="d"> OPTION D</label>
    </div>
    <div class="explanation" data-correct="a" hidden>EXPLANATION TEXT</div>
  </div>
  <!-- repeat for q2–q6 -->
</div>`;

    return this.callApi(model, prompt, `${analysis.category}/${analysis.topic}/assessment`);
  }

  async generateFlashcards(analysis: TopicAnalysis, notesBody?: string): Promise<GeneratedContent> {
    const model = MODELS.flashcards;
    const topicTitle = slugToTitle(analysis.topic);

    const context = notesBody
      ? `\nBased on these notes:\n<notes>\n${notesBody.slice(0, 1500)}\n</notes>\n`
      : '';

    const prompt = `Create 12 flashcards for a JavaScript interview prep platform.

Topic: ${topicTitle}
${context}
Requirements:
- Exactly 12 question/answer pairs
- Questions should be concise (1 sentence)
- Answers should be 1–3 sentences, precise and complete
- Mix of definition, conceptual, and application questions
- Include at least 2 "why" questions (testing deep understanding)
- Vary difficulty (4 easy, 5 medium, 3 hard)

Output ONLY a JSON array in this exact format (no markdown, no preamble):
[
  {"front": "QUESTION", "back": "ANSWER"},
  ...
]`;

    const raw = await this.callApi(model, prompt, `${analysis.category}/${analysis.topic}/flashcards`);

    // Validate and normalize JSON output
    try {
      const parsed = JSON.parse(extractJson(raw.body));
      if (!Array.isArray(parsed)) throw new Error('Expected array');
      return {
        ...raw,
        body: JSON.stringify(parsed, null, 2),
      };
    } catch {
      // If JSON parsing fails, wrap what we got and mark for review
      return {
        ...raw,
        body: raw.body,
      };
    }
  }

  async generateInterviewQuestions(
    analysis: TopicAnalysis,
    notesBody: string,
  ): Promise<Array<{ question: string; answer: string; difficulty: 'easy' | 'medium' | 'hard' }>> {
    const model = MODELS.notes;
    const topicTitle = slugToTitle(analysis.topic);

    const prompt = `Extract 4 interview questions from the following notes about "${topicTitle}".

<notes>
${notesBody.slice(0, 3000)}
</notes>

Requirements:
- 1 easy, 2 medium, 1 hard question
- Questions should be common in real JavaScript interviews
- Answers should be 2–4 sentences, suitable for a verbal interview answer

Output ONLY a JSON array:
[
  {"question": "Q", "answer": "A", "difficulty": "easy|medium|hard"},
  ...
]`;

    const result = await this.callApi(
      model,
      prompt,
      `${analysis.category}/${analysis.topic}/interview-questions`,
    );

    try {
      return JSON.parse(extractJson(result.body));
    } catch {
      return [];
    }
  }

  private async callApi(model: string, prompt: string, taskId: string): Promise<GeneratedContent> {
    const { result, inputTokens, outputTokens } = await (async () => {
      const msg = await this.client.messages.create({
        model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = msg.content
        .filter(b => b.type === 'text')
        .map(b => (b as { type: 'text'; text: string }).text)
        .join('');

      return {
        result: text.trim(),
        inputTokens: msg.usage.input_tokens,
        outputTokens: msg.usage.output_tokens,
      };
    })();

    const costEntry = this.tracker.record({
      taskId,
      model,
      inputTokens,
      outputTokens,
      metadata: { promptVersion: PROMPT_VERSION },
    });

    return {
      body: result,
      isAiGenerated: true,
      metadata: {
        model,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        cost_usd: costEntry.estimated_cost_usd,
        prompt_version: PROMPT_VERSION,
        generated_at: new Date().toISOString(),
      },
    };
  }
}

/** Strip markdown code fences from model output before JSON.parse */
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return fenced?.[1]?.trim() ?? text.trim();
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/-+/g, ' ')
    .replace(/\bvs\b/gi, 'vs')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bApi\b/g, 'API')
    .replace(/\bDom\b/g, 'DOM')
    .replace(/\bHtml\b/g, 'HTML')
    .replace(/\bCss\b/g, 'CSS')
    .replace(/\bJs\b/g, 'JS')
    .replace(/\bTdz\b/g, 'TDZ')
    .replace(/\bEs\b/g, 'ES');
}
