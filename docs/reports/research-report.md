# Phase 1 — Research & Discovery Report

**Generated:** 2026-06-16  
**Analyst:** Claude Code (Sonnet 4.6) — Phase 1 Agent  
**Source:** `C:\personal projects\Bench-interview-preparation\app\static\content\`  
**Manifest:** `docs/reports/migration-manifest.json`

---

## Executive Summary

The Svelte interview-prep codebase contains **592 files** across **13 content categories** and **115 topic folders**. Only **235 files (40%)** pass the completeness heuristics. The remaining **357 files (60%)** are stubs, templates, or AI-generated placeholders that fall below the spec thresholds defined in `docs/improved-prompt-v3-final.md`.

**Bottom line:** ~60% of content requires generation before migration can proceed. The content pipeline (Epic 4) is the critical path.

---

## Classification Heuristics Applied

| File Type | Threshold                                | Rationale                                         |
| --------- | ---------------------------------------- | ------------------------------------------------- |
| `.md`     | > 200 words AND no `TODO` marker         | Below 200w = stub; TODO = explicitly incomplete   |
| `.js`     | > 5 functions                            | Single-function stubs are templates, not examples |
| `.csv`    | > 3 data rows                            | Minimum viable flashcard deck                     |
| `.html`   | > 3 detected questions OR size > 15,000B | Small files (~1,700B) are empty templates         |

---

## Results by Category

| Category                    | Total   | Complete | Placeholder | % Complete |
| --------------------------- | ------- | -------- | ----------- | ---------- |
| arrays-objects              | 50      | 14       | 36          | 28%        |
| async-js                    | 49      | 10       | 39          | 20%        |
| css-html                    | 60      | 20       | 40          | 33%        |
| js-core                     | 87      | 28       | 59          | 32%        |
| performance-tooling         | 41      | 15       | 26          | 37%        |
| practical-js                | 4       | 4        | 0           | 100%       |
| react-angular               | 28      | 14       | 14          | 50%        |
| react-fundamentals          | 40      | 21       | 19          | 53%        |
| react-hooks                 | 46      | 26       | 20          | 57%        |
| react-patterns-architecture | 52      | 35       | 17          | 67%        |
| shared                      | 2       | 1        | 1           | 50%        |
| system-design               | 48      | 17       | 31          | 35%        |
| testing                     | 40      | 15       | 25          | 38%        |
| typescript                  | 45      | 15       | 30          | 33%        |
| **TOTAL**                   | **592** | **235**  | **357**     | **40%**    |

---

## Gap Analysis by File Type

### 1. Notes (`.md` / `notes-generated.md`)

**Spec:** 800–1,500 words per topic  
**Finding:** Two distinct populations exist:

- **Stub `notes.md`** (~90 files): ~70–77 words. Each contains exactly one `TODO` marker. These are scaffolded placeholders, zero content value.
- **AI-generated `notes-generated.md`** (~90 files): ~188–218 words. Fail the 200-word threshold or contain TODO markers. Below the 800w spec minimum by 4–6×.
- **Hand-written notes** (~35 files): 800–5,305 words. No TODOs. Full spec compliance. Examples:
  - `react-angular/react-vs-angular/notes.md` — 5,305w
  - `js-core/event-loop-call-stack-microtask-macrotask/notes.md` — 1,729w
  - `react-hooks/usestate-batching-functional-updates-stale-closure/notes.md` — 1,729w

**Gap:** ~155 topics need notes generated at 800–1,500w. Estimated LLM cost: ~$8–15 at Claude Haiku 4.5 pricing.

### 2. Examples (`.js` / `example-generated.js`)

**Spec:** 3–5 runnable, commented examples per topic  
**Finding:**

- **`example-generated.js` stubs** (~85 files): Almost universally 1 function. Template function with `// TODO` comments.
- **Hand-written JS files** (~20 topics): 6–37 functions. Full spec compliance or exceed it. Notable:
  - `react-hooks/usecontext.../example-generated.js` — 37 functions (AI-generated quality)
  - `js-core/hoisting-var-vs-let-vs-const-tdz/example.js` — 15 functions
  - `async-js/promises-states-chaining-combinators/promise.js` — 24 functions
- **Pattern JS files** (async-js): Multiple focused files per topic (e.g., `fundamentals-01-then-catch.js`, `combinators-02-race-timeout.js`). These are complete but use non-standard naming.

**Gap:** ~85 topics need example files regenerated with 6+ functions. Non-standard async-js files need normalization to `example.js` naming.

### 3. Assessments (`.html` / `assessment-generated.html`)

**Spec:** 5–8 MCQs per topic  
**Finding:** Most stark gap — two completely different populations:

- **Template `assessment-generated.html`** (~85 files): ~1,662–2,000B. Zero detected questions. HTML shell with no content.
- **Hand-crafted `assessment.html`** (~15 files): 17,000–32,159B. 4–20+ detected question elements. Production quality. Notable:
  - `react-patterns-architecture/micro-frontend.../assessment.html` — 32,159B, complex MCQs
  - `react-hooks/usestate-batching.../assessment.html` — 20,957B
  - `react-hooks/usecontext.../assessment-generated.html` — 30,754B (AI-generated high quality)

**Gap:** ~85 topics need full assessment HTML regenerated with 5+ MCQs. Highest LLM cost category.

### 4. Flashcards (`.csv` / `flashcards-generated.csv`)

**Spec:** 10–15 Q&A pairs per topic  
**Finding:** All flashcard CSVs pass the "> 3 rows" heuristic, but actual row counts are typically 5–10, below the 10–15 spec target.

- **All `flashcards-generated.csv`** files: 5–10 rows. Pass ≥3 threshold but fall short of spec.
- **Exception:** `react-patterns-architecture/performance-memo.../flashcards.csv` — 52 rows; `flashcards-alt.csv` — 49 rows.

**Gap:** While all CSVs pass the heuristic and are classified as "complete," they are below spec. In practice, ~90 topics need 5–10 additional flashcard rows to hit the 10–15 spec minimum. Lower priority than notes/examples/assessments.

---

## Topic-Level Completeness

### Fully Complete Topics (all 4 file types pass heuristics)

These topics have hand-crafted, production-quality content and should be migrated as-is:

| Topic                    | Category       | Notes (w)    | Examples (fns) | Assessment (B) |
| ------------------------ | -------------- | ------------ | -------------- | -------------- |
| closure-scope-chain      | js-core        | 1,086w       | —              | —              |
| event-loop-call-stack... | js-core        | 1,729w       | 7+             | 17KB+          |
| hoisting-var-vs-let...   | js-core        | 1,095w       | 15             | —              |
| usestate-batching...     | react-hooks    | 1,729w       | —              | 20,957B        |
| usememo-vs-usecallback   | react-hooks    | 1,356w       | —              | —              |
| useeffect-deps-array     | react-hooks    | 994w         | —              | 24,151B        |
| usecontext...            | react-hooks    | 982w         | 37             | 30,754B        |
| usereducer...            | react-hooks    | —            | —              | 30,962B        |
| react-vs-angular         | react-angular  | 5,305w       | —              | —              |
| react-hooks-vs-angular   | react-angular  | 4,945w       | —              | —              |
| micro-frontend...        | react-patterns | —            | —              | 32,159B        |
| performance-memo...      | react-patterns | —            | —              | —              |
| practical-js (all 4)     | practical-js   | 3,708–5,539w | —              | —              |

### Topics Requiring Full Generation (all 4 file types missing)

Categories with highest placeholder density (>70% placeholder):

- `async-js`: 80% placeholder — most content is empty templates
- `arrays-objects`: 72% placeholder
- `typescript`: 67% placeholder
- `css-html`: 67% placeholder
- `js-core`: 68% placeholder

---

## Architecture & Structural Findings

### Naming Convention Inconsistencies

The source codebase uses multiple file naming patterns that need normalization:

| Pattern Found                                | Count | Intended File Type | Action                 |
| -------------------------------------------- | ----- | ------------------ | ---------------------- |
| `notes.md` (stub)                            | ~90   | notes              | Replace content        |
| `notes-generated.md`                         | ~90   | notes              | Replace/augment        |
| `example-generated.js`                       | ~85   | example            | Replace                |
| `assessment-generated.html`                  | ~90   | assessment         | Replace                |
| `flashcards-generated.csv`                   | ~90   | flashcards         | Augment                |
| `example.js` (hand-crafted)                  | ~15   | example            | Migrate as-is          |
| `assessment.html` (hand-crafted)             | ~15   | assessment         | Migrate as-is          |
| `patterns-01-*.js`, `fundamentals-01-*.js`   | ~12   | example            | Normalize → example.js |
| `notes-generated.md` + `notes.md` both exist | ~85   | notes              | Merge/pick best        |

### Topics with Both `notes.md` and `notes-generated.md`

Most topics have both files: `notes.md` (stub, 70w, TODO) and `notes-generated.md` (generated, ~200w, below spec). The generated version is always the better base for augmentation.

### Non-Standard Topic Structures (async-js)

`async-js` contains atypical subtopics designed as coding exercises rather than notes-based content:

- `async-microtask-prediction/` — 3 `.js` exercise files, no notes
- `concurrency-limiter-n-at-a-time/` — 1 `.js` pattern file
- `implement-retrywithbackoff/` — 1 `.js` pattern file, missing assessment
- `microtask-queue-output-prediction/` — no example.js (only assessment + flashcards)
- `promise-all-vs-allsettled-vs-race-vs-any/` — 3 combinator `.js` files, no standard example

These exercise topics require custom migration logic; they cannot use the standard 4-file pipeline.

---

## Risk Register

| Risk                                                                    | Severity | Probability | Mitigation                                                                        |
| ----------------------------------------------------------------------- | -------- | ----------- | --------------------------------------------------------------------------------- |
| **LLM cost overrun** — 357 files × avg $0.02/file                       | High     | Medium      | Use Claude Haiku 4.5 for generation; cap per-run budget in orchestrator           |
| **Quality regression** — AI-generated content below expert level        | High     | High        | Human review gate after first 3 topics (per spec); quality score threshold ≥0.7   |
| **Non-standard topic structures break pipeline** (async-js)             | Medium   | High        | Add special-case handler in orchestrator for exercise-type topics                 |
| **Duplicate notes files** cause import conflicts                        | Medium   | High        | Pre-migration deduplication: always prefer `notes-generated.md` as base           |
| **CSV flashcards below spec** (5-10 rows vs. 10-15 target)              | Low      | High        | Secondary augmentation pass; not blocking for Phase 1                             |
| **HTML assessment template parsing** — empty templates may trip parsers | Medium   | Medium      | Skip-if-empty guard in migration pipeline                                         |
| **Context window limits** on long notes files                           | Low      | Low         | react-angular notes are 4,945–5,305w; chunk for generation but render as-is       |
| **Blog breakage during schema migration**                               | Critical | Low         | All new tables are ADDITIVE; no existing table altered; RLS applied per CLAUDE.md |

---

## Recommendations for Phase 2 (Architecture)

1. **CMS Decision First** — Before any migration code, decide on content storage: rich-text+Supabase (recommended for structured MCQs) vs. MDX. The assessment HTML files suggest Supabase structured storage is the better fit.

Yes, lets go with Supabase. The structured nature of the assessments and the need for relational queries (e.g., fetching questions by topic, tracking user progress) make it a more suitable choice than MDX.

2. **Content Pipeline Priority Order:**
   1. Notes (blocking — all UI depends on them)
   2. Flashcards augmentation (fast, high ROI)
   3. Example JS (needed for code display)
   4. Assessment HTML (most expensive to generate)

3. **Migrate complete topics first** — ~35 topics have production-ready content. Build the migration pipeline, validate schema, then run generation for the remaining 80 topics.

4. **Normalize async-js exercise topics** — Flag these 5 topics as `topic_type: 'exercise'` in the schema rather than forcing them into the standard `notes/example/assessment/flashcards` structure.

5. **Quality gate at 3 topics** — Per the project spec, stop and request human approval after generating the first 3 topics to validate content quality before running the full batch.

---

## Files Generated by This Phase

- `docs/reports/migration-manifest.json` — 592-entry flat classification manifest with metrics
- `docs/reports/research-report.md` — This document

---

## Session Metadata

```json
{
  "agent": "Phase 1 — Research & Discovery",
  "model": "claude-sonnet-4-6",
  "is_ai_generated": true,
  "phase": "research",
  "files_analyzed": 592,
  "complete": 235,
  "placeholder": 357,
  "completion_rate_pct": 40.0
}
```
