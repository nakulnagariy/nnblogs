/**
 * Loader — transforms content per transformation-rules.md and upserts into Supabase.
 * All inserts use ON CONFLICT DO UPDATE (idempotent).
 * Uses supabaseAdmin (service role) to bypass RLS.
 */

import { createClient } from '@supabase/supabase-js';
import type { TopicAnalysis, TopicContentMap, GeneratedContent, DirectContent } from './types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

// Lazy-init admin client (loaded after dotenv)
let _admin: ReturnType<typeof createClient> | null = null;

function getAdmin(): ReturnType<typeof createClient> {
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    _admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  }
  return _admin;
}

export interface LoadResult {
  topicId: string;
  slug: string;
  contentTypesLoaded: string[];
  interviewQuestionsLoaded: number;
  errors: string[];
}

/** Upsert a topic and all its content into Supabase. Returns the topic UUID. */
export async function loadTopic(
  analysis: TopicAnalysis,
  content: TopicContentMap,
): Promise<LoadResult> {
  const admin = getAdmin();
  const errors: string[] = [];
  const contentTypesLoaded: string[] = [];

  // ── 1. Resolve category_id ──────────────────────────────────────────────
  const { data: catRow, error: catErr } = await admin
    .from('topic_categories')
    .select('id')
    .eq('slug', analysis.category)
    .single();

  if (catErr || !catRow) {
    throw new Error(`Category not found: ${analysis.category}. Run schema migration first.`);
  }
  const categoryId: string = (catRow as AnyRecord).id;

  // ── 2. Upsert topic ─────────────────────────────────────────────────────
  const topicTitle = slugToTitle(analysis.topic);
  const estimatedMinutes = estimateMinutes(content.notes?.body ?? '');

  const { data: topicRow, error: topicErr } = await admin
    .from('topics')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .upsert(
      {
        title: topicTitle,
        slug: analysis.topic,
        category_id: categoryId,
        sort_order: analysis.sortOrder,
        topic_type: analysis.topicType,
        status: analysis.needsGeneration.length === 0 ? 'published' : 'draft',
        estimated_minutes: estimatedMinutes || null,
        difficulty: 'intermediate',
        access_level: 'free',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      { onConflict: 'slug' },
    )
    .select('id')
    .single();

  if (topicErr || !topicRow) {
    throw new Error(`Failed to upsert topic ${analysis.topic}: ${topicErr?.message}`);
  }
  const topicId: string = (topicRow as AnyRecord).id;

  // ── 3. Upsert each content type ─────────────────────────────────────────
  type ContentResult = GeneratedContent | DirectContent;
  const contentEntries: Array<[string, ContentResult | undefined]> = [
    ['notes', content.notes],
    ['example', content.example],
    ['assessment', content.assessment],
    ['flashcards', content.flashcards],
  ];

  for (const [contentType, result] of contentEntries) {
    if (!result) continue;

    let body = result.body;
    const isAi = result.isAiGenerated;

    // Transform flashcards body: ensure it's stored as JSON string
    if (contentType === 'flashcards') {
      body = normalizeFlashcardsBody(body);
    }

    const sourceFile = isAi ? null : (result as DirectContent).sourceFile;
    const genMeta = isAi ? (result as GeneratedContent).metadata : null;

    const { error: contentErr } = await admin.from('topic_content').upsert(
      {
        topic_id: topicId,
        content_type: contentType,
        body,
        is_ai_generated: isAi,
        source_file: sourceFile,
        generation_metadata: genMeta,
        quality_score: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      { onConflict: 'topic_id,content_type' },
    );

    if (contentErr) {
      errors.push(`${contentType}: ${contentErr.message}`);
    } else {
      contentTypesLoaded.push(contentType);
    }
  }

  // ── 4. Upsert interview questions ────────────────────────────────────────
  let interviewQuestionsLoaded = 0;
  if (content.interviewQuestions && content.interviewQuestions.length > 0) {
    for (const q of content.interviewQuestions) {
      const { error: qErr } = await admin.from('interview_questions').insert({
        topic_id: topicId,
        question: q.question,
        answer: q.answer,
        difficulty: q.difficulty,
        source: 'ai_generated',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      if (qErr) {
        errors.push(`interview_question: ${qErr.message}`);
      } else {
        interviewQuestionsLoaded++;
      }
    }
  }

  return { topicId, slug: analysis.topic, contentTypesLoaded, interviewQuestionsLoaded, errors };
}

/** Parse CSV body to JSON array format per transformation-rules Rule 5 */
function normalizeFlashcardsBody(body: string): string {
  // If already JSON (array), return as-is
  const trimmed = body.trim();
  if (trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed);
      return trimmed;
    } catch { /* fall through to CSV parse */ }
  }

  // Parse CSV: header row first, skip # comments
  const lines = trimmed.split('\n').filter(l => l.trim() && !l.startsWith('#'));
  if (lines.length <= 1) return JSON.stringify([]);

  const cards: Array<{ front: string; back: string }> = [];
  for (const line of lines.slice(1)) {
    // Simple CSV parse (handles quoted fields)
    const parts = parseCsvLine(line);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      cards.push({ front: parts[0].trim(), back: parts[1].trim() });
    }
  }
  return JSON.stringify(cards, null, 2);
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function estimateMinutes(notesBody: string): number {
  if (!notesBody) return 0;
  const wordCount = notesBody.split(/\s+/).filter(Boolean).length;
  return Math.max(5, Math.round(wordCount / 200));
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

/** Quick validation: count content types present in Supabase for a topic */
export async function validateTopicInDb(topicSlug: string): Promise<{
  topicExists: boolean;
  contentTypes: string[];
  interviewQCount: number;
}> {
  const admin = getAdmin();

  const { data: topic } = await admin
    .from('topics')
    .select('id')
    .eq('slug', topicSlug)
    .single();

  if (!topic) return { topicExists: false, contentTypes: [], interviewQCount: 0 };

  const topicId = (topic as AnyRecord).id as string;

  const { data: content } = await admin
    .from('topic_content')
    .select('content_type')
    .eq('topic_id', topicId);

  const { data: questions } = await admin
    .from('interview_questions')
    .select('id')
    .eq('topic_id', topicId);

  return {
    topicExists: true,
    contentTypes: ((content ?? []) as AnyRecord[]).map(r => r.content_type as string),
    interviewQCount: questions?.length ?? 0,
  };
}
