# NNBlogs — Project Guide

This file provides context and operational boundaries to Claude Code (`claude.ai/code`) for this repository.

## Project Summary

A git-native personal blog: Next.js 16.1.1, no database, no authentication
system. Posts are Markdown/YAML files under `content/posts/`, authored
locally through Keystatic (`/keystatic`, local storage mode) and published
by committing and pushing to `main` — GitHub's own PR/merge permissions on
this repo are the access control, since there is a single author.

An earlier version of this repo used Supabase (DB + Auth) and had grown to
include Videos, Projects, and an in-progress "Learn" (interview-prep)
vertical, each with its own DB tables and admin CRUD UI. All of that was
removed in a single migration (see `git log` on `feat/revamp-nnblog` for the
phase-by-phase history): Videos folds into posts, Projects is now a
GitHub-repos widget on `/about`, and Learn was cut entirely rather than
kept dormant. `docs/` still contains planning artifacts from the Learn
migration (backlog, epics, rendering plans) — these are historical, not an
active spec; nothing in `docs/` should be treated as current guidance
without checking it against the code first.

## 🛠️ Build & Development Commands

- **Dev Server:** `npm run dev` (Starts server at http://localhost:3000; also serves the Keystatic admin UI at `/keystatic`)
- **Production Build:** `npm run build` (Runs complete production build and TypeScript check)
- **TypeScript Only:** `npm run type-check` (`tsc --noEmit`)
- **Linting:** `npm run lint` (ESLint on `src/`) / `npm run lint:fix` (Auto-fix issues)
- **Full Verification:** `npm run check` (`type-check` + `lint` executed together)
- **Testing:** `npm test` (Run tests with Vitest) / `npm run test:watch` (Watch mode) / `npm run test:coverage`
- **Run Single Test File:** `npx vitest run tests/lib/utils.test.ts`
- **Commit Format:** Enforced by Commitlint (Conventional Commits), Husky, and lint-staged on staged files.

## 📐 Core Tech Stack & Architecture Standards

- **Framework Stack:** Next.js 16.1.1 (App Router), React 19.2.3, Tailwind CSS v4 (with PostCSS), TypeScript 5 (Strict Mode).
- **Data Flow Layers:** `/blog` and `/blog/[slug]` are Server Components calling `lib/content/posts.ts` directly — a thin wrapper over `@keystatic/core/reader` reading `content/posts/`. Client-side interactivity is limited to live search (`hooks/usePosts.ts`'s `useSearch`, backed by `/api/search`, using TanStack Query for its debounce/cache behavior) — everything else fetches server-side, since Keystatic's reader uses Node's `fs` and cannot run in the browser.
- **Content model:** `keystatic.config.ts` defines the `posts` collection schema. Post body content is a plain `fields.text({multiline: true})`, not Keystatic's rich-text/Markdoc field — this was a deliberate choice so the existing, tested Markdown pipeline (`marked` + custom renderers in `lib/markdown.ts`, sanitized via DOMPurify in `MarkdownRenderer.tsx`) keeps working unchanged against a plain string.
- **No database, no auth:** there is no `middleware.ts`, no session/auth check anywhere in the app. Writing a post means running Keystatic locally and committing the result; nothing gates `npm run dev` itself.
- **API Response Standard:** Route handlers in `app/api/[resource]/route.ts` must validate input and return a consistent error structure: `{ error: string }`.

## 📦 Key File Registry

| Path                          | Purpose                                                              |
| :----------------------------- | :-------------------------------------------------------------------- |
| `keystatic.config.ts`          | Keystatic collection schema — the source of truth for post fields    |
| `content/posts/*/index.yaml`   | Post content, one directory per slug                                 |
| `src/lib/content/posts.ts`     | All post read queries (file-based, replaces the old Supabase queries)|
| `src/types/index.ts`           | Centralized domain models (`BlogPost`, `SearchResult`, etc.)         |
| `src/lib/markdown.ts`          | Markdown parsing/rendering + pure string utilities (slug, excerpt, reading time, heading extraction) — covered by `tests/lib/markdown.test.ts` |
| `src/app/globals.css`          | Design tokens — imports `nn-design/tokens.css`, aliases the old shadcn-style utility names (`bg-background`, `text-muted-foreground`, etc.) onto it |
| `tests/setup.ts`               | Vitest global testing suite setup                                    |

## 🔑 Environment Variables (`.env.local`)

- `GITHUB_USERNAME`, `GITHUB_TOKEN` — powers the repos widget on `/about`; the site works without them, the widget just doesn't render
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — Google Analytics
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_DESCRIPTION`

Keystatic's local storage mode needs no env vars or secrets of its own.

## Critical Rules

- No database, no auth — do not reintroduce either without an explicit ask. If a feature seems to need persistence beyond the content in `content/posts/`, flag it rather than reaching for a DB by default.
- Post content stays a plain string field in Keystatic (see Content model above) — don't switch it to `fields.document`/Markdoc without deliberately deciding to rewrite the Markdown rendering pipeline along with it.
- `src/lib/content/posts.ts`'s exported function signatures (`getPosts`, `getPostBySlug`, `getFeaturedPosts`, `getRecentPosts`, `getRelatedPosts`, `getCategories`, `searchContent`) are relied on by both server components and the search API — keep them stable, or update every call site in the same change.

---

> Last session: completed the git-native migration end to end (nn-design
> tokens + spare homepage; Keystatic + content migration off Supabase;
> single-column Medium-style blog redesign; removed Supabase/auth/videos/
> projects/learn entirely; GitHub-repos widget on /about; dependency/env/doc
> cleanup). Committed as 6 separate commits on `feat/revamp-nnblog`, working
> tree clean, build/lint/tests all green.
>
> Known follow-ups, not yet done:
> - `.claude/rules/*.md` (11 files) and the rest of `docs/` still describe
>   the old Supabase/Clerk/multi-vertical architecture — accurate as
>   historical record, actively misleading as current guidance. Worth a
>   dedicated pass if this repo keeps using the rules/skills framework.
> - `GITHUB_TOKEN` in `.env.local` returns 401 Bad credentials against the
>   real GitHub API — needs rotating for the repos widget on `/about` to
>   show anything in production (unauthenticated requests still work, just
>   rate-limited).
> - `/about` page copy still reads like a portfolio ("precision and soul",
>   availability pulse dot) — out of scope for this migration, flagged for
>   whoever revisits that page next.
