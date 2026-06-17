# ADR-001: CMS Strategy for Interview Prep Content

**Status:** Accepted  
**Date:** 2026-06-17  
**Decider:** Nakul Nagariya (Product Owner) + Claude Code (Architect Agent)  
**Phase:** Architecture (Phase 2)

---

## Context

The interview prep platform needs to store and serve 4 content types per topic:

1. **Notes** (Markdown, 800–1,500 words) — concept explanations, use cases, gotchas
2. **Examples** (JavaScript source code, 3–5 runnable functions)
3. **Assessments** (5–8 MCQs per topic, currently HTML; need structured query access)
4. **Flashcards** (10–15 Q&A pairs per topic, currently CSV)

Additionally:

- ~357 of 592 files are placeholders that will be AI-generated via an automated pipeline
- All generated content must carry `is_ai_generated: true` + full generation metadata
- Assessments need relational queries: "fetch all questions for topic X filtered by difficulty"
- User progress tracking requires joining content state with user records
- The pipeline writes programmatically; no external editing UI is required (solo dev)

Four options were evaluated against weighted criteria.

---

## Options Evaluated

### Option A: MDX files in repository (Contentlayer / Velite)

**Description:** Store all content as `.mdx` files in `content/` directory. Build-time compilation into typed objects.

| Criterion (weight)                   | Score         | Notes                                                                 |
| ------------------------------------ | ------------- | --------------------------------------------------------------------- |
| Code/markdown DX (HIGH)              | ✅ Excellent  | Native MDX, syntax highlighting in editor                             |
| AI pipeline write (HIGH)             | ⚠️ Limited    | Must write files + commit + redeploy to publish                       |
| Scale to 500+ topics (HIGH)          | ⚠️ Marginal   | Build times grow linearly; cold builds with 500 MDX files take 30–90s |
| Assessment structured queries (HIGH) | ❌ None       | HTML/JSON flat files, no query layer                                  |
| User progress tracking (HIGH)        | ❌ Impossible | No database, no user state                                            |
| Developer experience (HIGH)          | ✅ Excellent  | TypeScript types from schema, co-located                              |
| Cost (LOW)                           | ✅ Zero       | Static files                                                          |

**Verdict: Eliminated.** No user progress tracking and no structured query layer for assessments.

---

### Option B: Hybrid (MDX for content + Supabase for user data)

**Description:** Notes and examples in MDX files; assessments and progress in Supabase.

| Criterion (weight)                | Score      | Notes                                             |
| --------------------------------- | ---------- | ------------------------------------------------- |
| Code/markdown DX (HIGH)           | ✅ Good    | Notes in MDX; assessments as JSON in DB           |
| AI pipeline write (HIGH)          | ⚠️ Split   | Two write paths; MDX must redeploy, DB is instant |
| Scale (HIGH)                      | ⚠️ Partial | MDX build time still a ceiling                    |
| Assessment queries (HIGH)         | ✅ Good    | Assessments in Supabase                           |
| Progress tracking (HIGH)          | ✅ Good    | User tables in Supabase                           |
| Operational complexity (implicit) | ❌ High    | Two content systems, two sync problems            |

**Verdict: Eliminated.** Two content systems means two failure points, two CI/CD paths, and cache invalidation across two layers. The complexity cost outweighs the MDX DX advantage.

---

### Option C: Sanity CMS (free tier)

**Description:** Sanity as headless CMS; structured content with GROQ queries; Supabase only for user data.

| Criterion (weight)         | Score        | Notes                                           |
| -------------------------- | ------------ | ----------------------------------------------- |
| Code/markdown DX (HIGH)    | ✅ Excellent | Portable Text, custom code inputs               |
| AI pipeline write (HIGH)   | ✅ Good      | Sanity Content API supports programmatic writes |
| Scale (HIGH)               | ✅ Excellent | Purpose-built for content at scale              |
| Assessment queries (HIGH)  | ✅ Good      | GROQ handles structured queries                 |
| Progress tracking (HIGH)   | ⚠️ Partial   | Needs separate Supabase tables still            |
| External dependency (risk) | ❌ Medium    | Vendor lock-in; free tier has API call limits   |
| Two DB systems (implicit)  | ❌ Medium    | Content in Sanity, users/progress in Supabase   |

**Verdict: Eliminated.** Introducing a third-party CMS creates vendor dependency and still requires Supabase for auth/progress — two databases again. Free tier limits are a deployment risk.

---

### Option D: Supabase as the single CMS ✅ SELECTED

**Description:** All content stored as structured rows in Supabase tables. Notes/examples as `TEXT` (markdown). Assessments as structured HTML or extracted JSON in `topic_content.body`. Flashcards as JSON array. Full relational queries available.

| Criterion (weight)                   | Score               | Notes                                                         |
| ------------------------------------ | ------------------- | ------------------------------------------------------------- |
| Code/markdown DX (HIGH)              | ✅ Good             | Markdown rendered client-side (react-markdown + remark)       |
| AI pipeline write (HIGH)             | ✅ Excellent        | Direct `supabaseAdmin` upserts; instant publish               |
| Scale to 500+ topics (HIGH)          | ✅ Excellent        | PostgreSQL handles millions of rows; no build-time ceiling    |
| Assessment structured queries (HIGH) | ✅ Excellent        | SQL: `WHERE topic_id = X AND difficulty = 'hard'`             |
| User progress tracking (HIGH)        | ✅ Excellent        | Single DB; JOIN `user_topic_progress` with `topics` trivially |
| Operational simplicity (implicit)    | ✅ Excellent        | One database, one client, existing project infrastructure     |
| Developer experience (HIGH)          | ✅ Good             | TypeScript types generated via `supabase gen types`           |
| Cost (LOW)                           | ✅ Zero incremental | Already on Supabase; new tables are additive                  |

**Verdict: Selected.** Single system wins on every HIGH-weighted criterion. The only trade-off is that notes/examples render from a TEXT column (no MDX component support), which is acceptable — all content is pure markdown/code, not interactive React components.

---

## Decision

**Use Supabase (PostgreSQL) as the single CMS for all interview prep content.**

All 4 content types (notes, example, assessment, flashcards) are stored in the `topic_content` table, keyed by `(topic_id, content_type)`. The `body` column stores:

- `notes` → Markdown string
- `example` → JavaScript source string
- `assessment` → HTML string (full self-contained MCQ block)
- `flashcards` → JSON string (array of `{ front: string, back: string }`)

Rendering is handled client-side:

- Notes: `react-markdown` + `rehype-highlight` + `remark-gfm`
- Examples: `react-syntax-highlighter` or `shiki`
- Assessment: rendered from HTML via `dangerouslySetInnerHTML` with DOMPurify sanitization
- Flashcards: parsed from JSON, rendered with CSS flip animation

---

## Consequences

### Positive

- Single database, single client (`supabaseAdmin` for writes, `supabase` anon for reads)
- AI pipeline writes directly via upsert — no git commit, no redeploy required
- `generation_metadata` column stores full LLM provenance on each row
- Relational queries work natively: progress joins, difficulty filters, category rollups
- RLS handles public vs authenticated vs admin access uniformly

### Negative / Mitigations

- No MDX component embedding in notes (mitigation: notes are pure conceptual markdown — no need for interactive components)
- No version history for content edits (mitigation: `source_file` column + `generation_metadata.generated_at` provides provenance; full git history available for the migration pipeline scripts)
- Assessment HTML must be sanitized before render (mitigation: DOMPurify wrapper in `AssessmentQuiz` component)

---

## Final Decision

Approving this decision allows the team to move forward with a single, unified content management strategy that meets all functional and operational requirements while minimizing complexity and cost.

**Final Decision:** Use Supabase (PostgreSQL) as the single CMS for all interview prep content.

## Related Decisions

- ADR-002 (pending): Assessment storage format — full HTML vs extracted JSON structure
- ADR-003 (pending): Markdown rendering library selection
