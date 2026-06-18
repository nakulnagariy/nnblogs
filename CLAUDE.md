# NNBlogs & Interview Prep Migration Guide

This file provides context and operational boundaries to Claude Code (`claude.ai/code`) for this repository.

## Project Summary

Migrating a Svelte interview-prep app (~300-400 files, 13 categories) into this
existing Next.js 16.1.1 blog platform. The blog already works (auth, posts, Supabase).
We're ADDING a connected learning platform alongside it.

## 🛠️ Build & Development Commands

- **Dev Server:** `npm run dev` (Starts server at http://localhost:3000)
- **Production Build:** `npm run build` (Runs complete production build and TypeScript check)
- **TypeScript Only:** `npm run type-check` (`tsc --noEmit`)
- **Linting:** `npm run lint` (ESLint on `src/`) / `npm run lint:fix` (Auto-fix issues)
- **Full Verification:** `npm run check` (`type-check` + `lint` executed together)
- **Testing:** `npm test` (Run tests with Vitest) / `npm run test:watch` (Watch mode) / `npm run test:coverage`
- **Run Single Test File:** `npx vitest run tests/lib/utils.test.ts`
- **Commit Format:** Enforced by Commitlint (Conventional Commits), Husky, and lint-staged on staged files.

## 📐 Core Tech Stack & Architecture Standards

- **Framework Stack:** Next.js 16.1.1 (App Router), React 19.2.3, Tailwind CSS v4 (with PostCSS), TypeScript 5 (Strict Mode).
- **Data Flow Layers:** Public pages are Server Components calling `lib/supabase/queries.ts` directly. Client interactive sections use TanStack Query hooks from `hooks/` wrapping those queries. Admin pages POST/PUT/DELETE through `/api/admin/*` routes to `lib/supabase/admin-queries.ts`.
- **Dual Supabase Client Boundaries:**
  - `lib/supabase/client.ts` ➡️ Exports `supabase` (Anon key, public read). Used by `queries.ts` for public data fetching.
  - `lib/supabase/server.ts` ➡️ Exports `supabaseAdmin` (Service role key, bypasses RLS). Used **only** by `admin-queries.ts` for server-side write operations. _Never import this client in Client Components or public routes._
- **Authentication Boundaries:** Gated strictly by **Supabase Auth** (Migrated completely away from Clerk). Update any legacy references in `middleware.ts` or outdated instruction files when found.
- **Dynamic Imports:** Heavy components (`MarkdownEditor`, `Dialog`, `GitHubProfile`, `DataVizCharts`) are lazy-loaded via `components/dynamic/index.tsx` with skeleton fallbacks to disable SSR.
- **API Response Standard:** Route handlers in `app/api/[resource]/route.ts` must validate input before DB operations and return a consistent error structure: `{ error: string }`.

## 📦 Key File Registry

| Path                                | Purpose                                                          |
| :---------------------------------- | :--------------------------------------------------------------- |
| `src/lib/supabase/queries.ts`       | All public read queries                                          |
| `src/lib/supabase/admin-queries.ts` | All admin write operations (Service role)                        |
| `src/types/index.ts`                | Centralized domain models (`BlogPost`, `Video`, `Project`, etc.) |
| `src/middleware.ts`                 | Supabase Auth route protection configuration                     |
| `src/components/dynamic/index.tsx`  | Lazily loaded heavy client-side components                       |
| `tests/setup.ts`                    | Vitest global testing suite setup                                |

## 🔑 Environment Variables (`.env.local`)

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Secret — Server/Admin contexts only)
- `GITHUB_USERNAME`, `GITHUB_TOKEN` (Secret)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `OPENAI_API_KEY` (Secret), `NEXT_PUBLIC_SITE_URL`

## Source Project Location

The Svelte source files are at: C:\personal projects\Bench-interview-preparation\
Key content directory: app/static/content/ (13 category folders, ~80 topics)
Each topic has: notes.md, example.js, assessment.html, flashcards.csv

## Critical Rules

- NEVER modify existing blog functionality (posts, categories, auth, routes)
- All new tables are ADDITIVE to the existing schema
- All DB inserts must use ON CONFLICT / upserts (idempotent)
- Check docs/migration-prompt-full.md for the complete project specification
- Check docs/backlog.md for the current agile backlog and task status
- Check docs/reports/ for research findings and session reports

## Key Commands

- `npm run dev` — Start dev server
- `npx supabase db push` — Push schema changes
- `npx ts-node scripts/migration/orchestrator.ts` — Run migration pipeline

## 🚀 Interview Prep Platform Migration Phase

We are actively migrating an external Svelte app (~400 files, 13 categories) from `C:\personal projects\Bench-interview-preparation\` into this codebase as an additive learning platform. The blog engine remains untouched.

### Execution Constraints & Rules

- **Pre-requisite:** Read `docs/migration-prompt-full.md` before starting any migration task. It contains the complete architectural specifications, agile backlog, and system agent matrix.
- **Idempotency:** All migration pipelines and database interactions must be strictly idempotent (`ON CONFLICT` / upserts).
- **AI Tracking:** Every piece of automatically generated content must contain the structural flag `is_ai_generated: true`.
- **Cost Auditing:** All downstream LLM calls must be systematically logged with runtime cost-tracking.

### Detailed Engineering Rules & Custom AI Skills

Deeper domain context, styling frameworks, testing philosophies, and structured workflow steps are delegated to the local workspace directories:

- **Standards:** Look into `.claude/rules/` (`architecture.md`, `frontend.md`, `testing.md`, `security.md`).
- **Structured Skills:** Look into `.claude/skills/index.md` for deterministic task execution tools (e.g., _Architecture Review_, _Security Audit_, _Performance Audit_).

---

> UPDATE THIS AFTER EACH SESSION
> Phase: Implementation
> Current Epic: Epic 4 — Content Migration Pipeline
> Current US: US-4.2 — Batch content generation across all categories
>
> Last completed:
> - Phase 2: Schema applied to Supabase (13 tables, RLS, ENUMs, 13 category seed rows). ADR-001 confirmed: Supabase as single CMS.
> - Phase 3: Migration pipeline built — scripts/migration/{types,cost-tracker,analyzer,generator,loader,orchestrator}.ts. All TypeScript errors resolved.
> - Phase 4 (partial): js-core category fully processed — 18 topics, 4 content types + 4 interview questions each. Quality gate passed by user. Total cost: ~$0.09 for 3 topics at $0.03/topic with claude-haiku-4-5-20251001.
>
> Checkpoint state: docs/reports/checkpoint.json (js-core: 3 topics completed, quality gate approved)
> Cost log: docs/reports/cost-log.jsonl
>
> Remaining categories (13 total, 1 done):
>   arrays-objects | async-js | css-html | performance-tooling | practical-js
>   react-angular | react-fundamentals | react-hooks | react-patterns-architecture
>   shared | system-design | testing | typescript
>
> Next action: Run orchestrator for each remaining category (or all at once):
>   npx tsx scripts/migration/orchestrator.ts --categories arrays-objects,async-js,css-html,performance-tooling,practical-js,react-angular,react-fundamentals,react-hooks,react-patterns-architecture,shared,system-design,testing,typescript --approve-gate
>
> Key commands:
>   Dry run:  npx tsx scripts/migration/orchestrator.ts --categories <cat> --dry-run
>   Resume:   npx tsx scripts/migration/orchestrator.ts --categories <cat> --resume --approve-gate
>   Full run: npx tsx scripts/migration/orchestrator.ts --categories <all> --approve-gate
