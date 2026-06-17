# Content Transformation Rules

**Phase:** Architecture (Phase 2)  
**Date:** 2026-06-17  
**Agent:** Claude Code (Sonnet 4.6) — Phase 2 Architect

These rules define exactly how each source file type from `C:\personal projects\Bench-interview-preparation\app\static\content\` maps to rows in the target Supabase schema.

---

## Source → Target Table Mapping Overview

```
Source File                     →  Target Table / Column
─────────────────────────────────────────────────────────────────────
<category>/<topic>/              →  topics (one row per topic folder)
  notes.md / notes-generated.md →  topic_content WHERE content_type = 'notes'
  example.js / example-gen.js   →  topic_content WHERE content_type = 'example'
  assessment.html / *-gen.html  →  topic_content WHERE content_type = 'assessment'
  flashcards.csv / *-gen.csv    →  topic_content WHERE content_type = 'flashcards'
  (derived from notes content)  →  interview_questions (3–5 rows per topic)
```

---

## Rule 1 — Topics (`topics` table)

**Trigger:** One row per subfolder inside a category folder.

| Source | Target column | Transformation |
|--------|---------------|----------------|
| Folder name (e.g. `hoisting-var-vs-let-vs-const-tdz`) | `slug` | Use folder name as-is (already kebab-case) |
| Folder name | `title` | Convert kebab to Title Case: `Hoisting — Var vs Let vs Const (TDZ)` |
| Parent category folder name | `category_id` | Look up UUID from `topic_categories` by `slug` |
| Folder position in sorted directory listing | `sort_order` | 0-indexed integer within category |
| Completeness (from manifest) | `status` | `complete` → `'published'`; `placeholder` → `'placeholder'` |
| manifest `topic_type` field | `topic_type` | `'standard'` or `'exercise'` (5 async-js exercise folders) |
| Not in source | `difficulty` | Default `'intermediate'`; override manually or via generator |
| Not in source | `estimated_minutes` | Derived by generator: word_count ÷ 200 (reading speed) |
| Not in source | `access_level` | Default `'free'` |

**Title conversion algorithm:**
```js
function folderToTitle(slug) {
  return slug
    .replace(/-+/g, ' ')
    .replace(/\bvs\b/gi, 'vs')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bApi\b/g, 'API')
    .replace(/\bDom\b/g, 'DOM')
    .replace(/\bHtml\b/g, 'HTML')
    .replace(/\bCss\b/g, 'CSS')
    .replace(/\bJs\b/g, 'JS')
    .replace(/\bTdz\b/g, 'TDZ');
}
```

**Idempotency:** `INSERT INTO topics ... ON CONFLICT (slug) DO UPDATE SET updated_at = now()`

---

## Rule 2 — Notes (`topic_content` WHERE `content_type = 'notes'`)

**Source files (priority order):**
1. `notes.md` if word count > 200 and no TODO — use as-is
2. `notes-generated.md` if word count > 200 and no TODO — use as-is  
3. `notes-generated.md` if word count 100–200 — use as generation base (expand to 800–1,500w)
4. `notes.md` if stub (< 100w or has TODO) and no `notes-generated.md` — generate from scratch
5. Neither exists — generate from scratch

**When both `notes.md` and `notes-generated.md` exist:** always prefer `notes-generated.md` as the base.

| Source | Target column | Notes |
|--------|---------------|-------|
| File content (raw markdown) | `body` | Strip YAML frontmatter if present. Store as UTF-8 markdown. |
| File origin | `source_file` | Relative path from content root e.g. `js-core/hoisting/notes.md` |
| Whether content was AI-generated | `is_ai_generated` | `false` for hand-written; `true` for generated/expanded |
| LLM call metadata | `generation_metadata` | `{ model, input_tokens, output_tokens, cost_usd, prompt_version, generated_at }` |
| QA agent score | `quality_score` | Float 0–1; `null` for hand-written files (trusted) |

**Body storage format:** Raw markdown string. No MDX. No HTML conversion. Client renders with `react-markdown`.

---

## Rule 3 — Examples (`topic_content` WHERE `content_type = 'example'`)

**Source files (priority order):**
1. `example.js` with > 5 functions — use as-is
2. `example-generated.js` with > 5 functions — use as-is
3. `example-generated.js` with ≤ 5 functions — use as generation reference (regenerate with 6+ functions)
4. Multiple pattern files (`fundamentals-01-*.js`, `combinators-02-*.js`) — **concatenate** into single string with section comments
5. Neither exists — generate from scratch

**async-js non-standard exercise files** (5 topics with `topic_type = 'exercise'`):
- Map exercise `.js` files into `body` verbatim
- Set `is_ai_generated = false` (these are hand-crafted)
- Do NOT attempt to normalize to 6+ functions — exercises are intentionally minimal

| Source | Target column | Notes |
|--------|---------------|-------|
| File content | `body` | Raw JavaScript string. No transpilation. |
| Source file path | `source_file` | Relative path |
| Origin | `is_ai_generated` | Hand-written → `false`; generated → `true` |

**Multi-file concatenation format (async-js pattern files):**
```js
// ── fundamentals-01-then-catch.js ──────────────────────
<content of fundamentals-01-then-catch.js>

// ── combinators-02-race-timeout.js ─────────────────────
<content of combinators-02-race-timeout.js>
```

---

## Rule 4 — Assessments (`topic_content` WHERE `content_type = 'assessment'`)

**Source files (priority order):**
1. `assessment.html` with > 3 questions or size > 15,000B — use as-is
2. `assessment-generated.html` with > 3 questions or size > 15,000B — use as-is
3. Any HTML file ≤ 1,700B (empty template shell) — **generate from scratch** (5–8 MCQs)
4. Neither exists — generate from scratch

**Body storage:** Store full HTML string. The `AssessmentQuiz` React component will:
1. Parse HTML using DOMPurify (server-side sanitization during migration)
2. Render via `dangerouslySetInnerHTML` in a scoped container
3. Inject the shared `assessment.css` from Svelte (or re-implement in Tailwind)

**Generated assessment format spec:**
```html
<div class="assessment-container">
  <div class="question-block" id="q1">
    <h3 class="question-text">Question text here</h3>
    <div class="options">
      <label><input type="radio" name="q1" value="a"> Option A</label>
      <label><input type="radio" name="q1" value="b"> Option B</label>
      <label><input type="radio" name="q1" value="c"> Option C</label>
      <label><input type="radio" name="q1" value="d"> Option D</label>
    </div>
    <div class="explanation" data-correct="a" hidden>Explanation text</div>
  </div>
  <!-- repeat for q2–q8 -->
</div>
```

---

## Rule 5 — Flashcards (`topic_content` WHERE `content_type = 'flashcards'`)

**Source files:** `flashcards.csv` or `flashcards-generated.csv` (all pass ≥ 3 row heuristic)

**CSV format in source:**
```
front,back
"What is X?","X is Y because Z"
```

**Target body format:** JSON string (stored in `TEXT` column)
```json
[
  { "front": "What is X?", "back": "X is Y because Z" },
  ...
]
```

**Transformation steps:**
1. Parse CSV (header row first, skip `#` comment lines)
2. Map each row to `{ front: row[0].trim(), back: row[1].trim() }`
3. Filter out empty rows
4. If row count < 10: flag for augmentation (add 5–10 rows to reach 10–15 target)
5. `JSON.stringify(cards)` → store in `body`

**Augmentation threshold:** If parsed row count < 10, mark `status = 'draft'` on the parent topic; generator will add cards in a second pass.

---

## Rule 6 — Interview Questions (`interview_questions` table)

These are **derived** from notes content — not a direct file mapping.

**Source:** `notes.md` / `notes-generated.md` body after Rule 2 processing  
**When generated:** During content generation pass, after notes are finalized  
**Count:** 3–5 questions per topic

| Derived field | Value |
|---------------|-------|
| `topic_id` | From parent topic row |
| `question` | AI-extracted from notes body |
| `answer` | AI-generated concise answer |
| `difficulty` | Inferred from topic's difficulty field |
| `source` | `'ai_generated'` or `'curated'` (for hand-written notes) |

---

## Rule 7 — Topic Relations (`topic_relations` table)

**Source:** Derived — not from individual files.  
**When populated:** After all topics and content are loaded.  
**Method:** Content Analyzer agent compares topic slugs and notes bodies to identify:
- Explicit cross-references (`useCallback` notes mention `useMemo` → `related`)
- Category ordering for prerequisites (`js-core/closures` is prerequisite of `react-hooks/custom-hooks`)
- Manually curated from the source app's navigation structure

**Initial relation seed:**
- All topics within `react-hooks` relate to each other as `'related'`
- `js-core` topics set as `'prerequisite'` for `react-fundamentals` topics
- `async-js` topics set as `'prerequisite'` for `react-hooks/use-effect*` topics

---

## Idempotency Contract

All migration inserts use `ON CONFLICT ... DO UPDATE` (upsert):

```sql
INSERT INTO topic_content (topic_id, content_type, body, is_ai_generated, source_file, generation_metadata, quality_score)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (topic_id, content_type) DO UPDATE
  SET body                = EXCLUDED.body,
      is_ai_generated     = EXCLUDED.is_ai_generated,
      generation_metadata = EXCLUDED.generation_metadata,
      quality_score       = EXCLUDED.quality_score,
      updated_at          = now();
```

Running the migration pipeline multiple times is safe — subsequent runs overwrite with improved content.

---

## File Selection Priority Summary

| Content type | First choice | Fallback | Generation trigger |
|---|---|---|---|
| Notes | `notes.md` (> 200w, no TODO) | `notes-generated.md` (> 200w) | < 200w or TODO in both |
| Example | `example.js` (> 5 fn) | `example-generated.js` (> 5 fn) | ≤ 5 functions in all |
| Assessment | `assessment.html` (> 3q or > 15KB) | `assessment-generated.html` | Empty template (≤ 1,700B) |
| Flashcards | `flashcards.csv` (> 3 rows) | `flashcards-generated.csv` | Always load; augment if < 10 rows |

---

## async-js Exercise Topics (Special Case)

These 5 topic folders do not follow the standard 4-file pattern:

| Folder | Special handling |
|--------|------------------|
| `async-microtask-prediction/` | Exercise JS files → concatenated `example` body; no notes generation needed |
| `concurrency-limiter-n-at-a-time/` | Single pattern file → `example` body |
| `implement-retrywithbackoff/` | Pattern file → `example`; generate assessment separately |
| `microtask-queue-output-prediction/` | Has assessment + flashcards; generate notes + example |
| `promise-all-vs-allsettled-vs-race-vs-any/` | Multiple combinator files → concatenated `example` |

All 5 set `topic_type = 'exercise'` in the `topics` table. The UI renders exercise topics with a different tab layout (no "Notes" tab if body is empty; "Exercise" tab instead of "Example").
