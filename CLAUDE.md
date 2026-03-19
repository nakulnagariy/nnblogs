# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build (also runs TypeScript check)
npm run type-check   # TypeScript only (tsc --noEmit)
npm run lint         # ESLint on src/
npm run lint:fix     # ESLint with auto-fix
npm run check        # type-check + lint together
npm test             # Run tests with Vitest
npm run test:watch   # Watch mode
npm run test:coverage
```

Run a single test file:
```bash
npx vitest run tests/lib/utils.test.ts
```

Commitlint enforces Conventional Commits format. Husky + lint-staged run ESLint and related tests on staged files before commit.

## Architecture

### Data Flow

Public pages are **Server Components** that call `lib/supabase/queries.ts` directly. Client-side interactive sections use React Query hooks from `hooks/` which call the same query functions. Admin pages POST/PUT/DELETE through `/api/admin/*` routes, which use `lib/supabase/admin-queries.ts`.

### Two Supabase Clients

- `lib/supabase/client.ts` — exports `supabase` (anon key, public read). Used by `queries.ts` for all public data fetching.
- `lib/supabase/server.ts` — exports `supabaseAdmin` (service role key, bypasses RLS). Used **only** by `admin-queries.ts` for write operations. Never import this in client components or public routes.

### Auth Boundaries

`middleware.ts` uses Clerk to gate routes:
- Public: `/`, `/blog/*`, `/videos/*`, `/projects/*`, `/about`, `/search`, and their API counterparts
- Protected (requires `auth.protect()`): `/admin/*` and all `/api/admin/*`

### Query Patterns

All Supabase reads go through `lib/supabase/queries.ts`. All admin writes go through `lib/supabase/admin-queries.ts`. The `hooks/` directory wraps query functions with `useQuery` for Client Components. React Query keys follow the pattern `['resource', ...params]`.

### Dynamic Imports

Heavy components (MarkdownEditor, Dialog, GitHubProfile, DataVizCharts) are lazy-loaded via `components/dynamic/index.tsx` with skeleton fallbacks. Import from there rather than the original path when you need SSR disabled or want the loading state.

### Content Types

Three content types managed in Supabase: `BlogPost` (posts table), `Video` (videos table), `Project` (projects table). All public content is filtered by `published: true`. View counts are incremented via Supabase RPC functions (`increment_post_views`, `increment_video_views`) — these are fire-and-forget (silent fail).

### Admin Section

`/admin` is a separate layout (`app/admin/layout.tsx`) with `AdminSidebar`. Admin pages are Client Components that POST to `/api/admin/*` routes. The `@uiw/react-md-editor` package powers the markdown editor in admin (dynamically imported).

## Key Files

| Path | Purpose |
|------|---------|
| `src/lib/supabase/queries.ts` | All public read queries |
| `src/lib/supabase/admin-queries.ts` | All admin write operations (service role) |
| `src/types/index.ts` | `BlogPost`, `Video`, `Project`, `SearchResult`, `PaginatedResponse<T>` |
| `src/middleware.ts` | Clerk route protection config |
| `src/components/dynamic/index.tsx` | Lazily loaded heavy components |
| `tests/setup.ts` | Vitest global setup |

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — server/admin only
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- `GITHUB_USERNAME`, `GITHUB_TOKEN`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
