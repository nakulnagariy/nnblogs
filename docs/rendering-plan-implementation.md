# Interview Prep Content Rendering — Implementation Plan

> Status: Approved — ready to implement
> Phase: Planning → Implementation
> Epic: Epic 5 — Interview Prep UI
> Author: Claude Code

## Context

108 topics across 12 categories have been migrated into Supabase (`topics`, `topic_content`, `interview_questions` tables) but no UI renders them yet. This plan covers everything needed to make that content visible at `nnblogs.com/learn` — matching the existing blog's design system exactly.

**Decisions confirmed:**
- URL: `/learn` subdirectory (same domain, same Next.js app)
- Premium/paywall: Phase 2 — ship all content free now; `access_level` field in DB is the future hook
- Topic layout: Tabbed sections (Notes | Examples | Assessment | Flashcards | Q&A)
- DB status: Promote all `draft` → `published` via SQL before rendering
- Data flow: RSC pages + API routes call `queries.ts` (Supabase); client hooks call `/api/learn/...` only

---

## How This Plan Works

Each User Story has:
1. **Tasks** — concrete implementation steps
2. **Verification** — what to check before calling it done
3. **🚦 Human Gate** — stop, show the user what was built, await approval
4. **CLAUDE.md update** — record completed work and next action in the project instructions

Do not proceed to the next US until the current gate is approved.

---

## US-5.0 — DB Preparation

**Goal:** Promote all migrated topics from `draft` → `published` so they appear in queries.

### Task 5.0.1
Create and apply migration file:
```sql
-- supabase/migrations/20260619000000_promote_topics_to_published.sql
UPDATE topics SET status = 'published' WHERE status = 'draft';
```
Run via: `npx supabase db push` or paste directly into Supabase SQL editor.

### Verification
- Query `SELECT count(*) FROM topics WHERE status = 'published'` in Supabase → should return 108
- Query `SELECT count(*) FROM topics WHERE status = 'draft'` → should return 0

### 🚦 Human Gate — US-5.0
Show user the row counts. Confirm 108 topics are now published before proceeding.

### CLAUDE.md Update after US-5.0
```
Last completed:
- US-5.0: SQL migration applied — 108 topics promoted from draft → published in Supabase

Next action: US-5.1 — Types & Data Layer
Current US: US-5.1
```

---

## US-5.1 — Types & Data Layer

**Goal:** TypeScript interfaces, server-side query functions, API routes, and React Query hooks.

### Task 5.1.1 — TypeScript interfaces
File: `src/types/index.ts` (extend, do not replace)

Add:
```ts
interface TopicCategory {
  id: string; name: string; slug: string; description: string;
  icon: string; color: string; sort_order: number;
  topic_count?: number;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type ContentType = 'notes' | 'example' | 'assessment' | 'flashcards';
type TopicStatus = 'draft' | 'published' | 'archived';
type AccessLevel = 'free' | 'premium';

interface Topic {
  id: string; title: string; slug: string;
  category_id: string; category?: TopicCategory;
  sort_order: number; difficulty: Difficulty;
  estimated_minutes: number; status: TopicStatus;
  access_level: AccessLevel; created_at: string; updated_at: string;
}

interface Flashcard { front: string; back: string; }

interface InterviewQuestion {
  id: string; topic_id: string; question: string; answer: string;
  difficulty: Difficulty; source: 'ai_generated' | 'community' | 'curated';
}

interface TopicDetail extends Topic {
  notes: string | null;
  example: string | null;
  assessment: string | null;
  flashcards: Flashcard[];
  questions: InterviewQuestion[];
}
```

Also extend `SearchResult.type` to `'post' | 'video' | 'project' | 'topic'`.

### Task 5.1.2 — Server-side query functions
File: `src/lib/supabase/queries.ts` (append only)

Used **only** by RSC pages and API route handlers — never imported in Client Components.

| Function | Returns |
|---|---|
| `getTopicCategories()` | `TopicCategory[]` |
| `getTopicsByCategory(categorySlug, page?, pageSize?, difficulty?)` | `PaginatedResponse<Topic>` |
| `getTopicBySlug(categorySlug, topicSlug)` | `TopicDetail \| null` |
| `incrementTopicViews(topicId)` | `void` (RPC, silent fail) |
| `getRelatedTopics(categorySlug, topicSlug, limit?)` | `Topic[]` |

`getTopicBySlug` logic:
1. Join `topics` + `topic_categories` on category slug AND topic slug
2. Fetch all 4 `topic_content` rows by `content_type`
3. Fetch `interview_questions` for the topic
4. Assemble and return `TopicDetail` object

### Task 5.1.3 — API route handlers
Three new routes — each calls the corresponding query function from 5.1.2:

| Route | File | Query |
|---|---|---|
| `GET /api/learn/categories` | `src/app/api/learn/categories/route.ts` | `getTopicCategories()` |
| `GET /api/learn/[category]?page=&pageSize=&difficulty=` | `src/app/api/learn/[category]/route.ts` | `getTopicsByCategory()` |
| `GET /api/learn/[category]/[topic]` | `src/app/api/learn/[category]/[topic]/route.ts` | `getTopicBySlug()` |

All follow the existing pattern: validate params → query → `{ error: string }` on failure.

### Task 5.1.4 — React Query hooks
New file: `src/hooks/useLearn.ts`

Hooks call `fetch('/api/learn/...')` only — **no Supabase imports**.

```ts
useTopicCategories()
useTopicsByCategory(categorySlug, page, pageSize, difficulty?)
useTopic(categorySlug, topicSlug)
useRelatedTopics(categorySlug, topicSlug)
```

### Verification
- `npm run type-check` — 0 errors
- `npm run lint` — 0 errors
- `curl http://localhost:3000/api/learn/categories` → returns array of 12 categories
- `curl http://localhost:3000/api/learn/async-js` → returns paginated topic list
- `curl http://localhost:3000/api/learn/async-js/promises` → returns full topic detail with content

### 🚦 Human Gate — US-5.1
Show user the 3 API responses above. Confirm shape matches expectations (especially `TopicDetail` with all content types present) before building UI.

### CLAUDE.md Update after US-5.1
```
Last completed:
- US-5.0: SQL migration applied — 108 topics published
- US-5.1: Types, query functions, API routes, and useLearn hooks complete. Gate passed.

Next action: US-5.2 — UI Components
Current US: US-5.2
```

---

## US-5.2 — UI Components

**Goal:** All reusable components for the learn section. No pages yet — components only.

### Task 5.2.1 — `DifficultyBadge.tsx`
File: `src/components/learn/DifficultyBadge.tsx`

Thin wrapper around existing `<Badge>`:
- `easy` → green (use `secondary` variant + override color or add a `success` variant)
- `medium` → amber/yellow
- `hard` → `destructive`

### Task 5.2.2 — `TopicCardSkeleton.tsx`
File: `src/components/learn/TopicCardSkeleton.tsx`

Direct copy of `BlogCardSkeleton` shape. Exports `TopicCardSkeleton` (single) + `TopicListSkeleton` (grid of 6).

### Task 5.2.3 — `TopicCard.tsx`
File: `src/components/learn/TopicCard.tsx`

Mirrors `BlogCard.tsx`. Key differences:
- `DifficultyBadge` instead of reading-time chip
- `estimated_minutes` display
- Color gradient from `topic_categories.color` hex (same mechanism as `getCategoryGradient` in blog)
- Premium lock icon (`access_level === 'premium'`) — visible but no action in Phase 1
- Link: `/learn/[category.slug]/[topic.slug]`

### Task 5.2.4 — `CategoryCard.tsx`
File: `src/components/learn/CategoryCard.tsx`

Card for `/learn` homepage grid:
- Large emoji icon + category name + description
- Topic count badge
- Left border or top accent using `topic_categories.color`
- Link: `/learn/[category.slug]`

### Task 5.2.5 — `TopicDetailTabs.tsx`
File: `src/components/learn/TopicDetailTabs.tsx` (Client Component)

`useState` for active tab. Render only tabs where content exists (skip tab if content is null/empty).

| Tab | Render method |
|---|---|
| **Notes** | Existing `<MarkdownRenderer content={notes} />` — reused as-is |
| **Examples** | Existing `<MarkdownRenderer content={example} />` — hljs auto-highlights |
| **Assessment** | `dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(assessment) }}` in `.prose` div |
| **Flashcards** | `framer-motion` 3D flip cards — click to reveal back. Extracted to `FlashcardDeck.tsx`. |
| **Q&A** | Accordion — question always visible, `framer-motion` height animation reveals answer on click |

### Task 5.2.6 — `FlashcardDeck.tsx`
File: `src/components/learn/FlashcardDeck.tsx`

Extracted from `TopicDetailTabs` for lazy loading. CSS 3D perspective flip using `framer-motion`. Shows card number + navigation (prev/next).

### Task 5.2.7 — `PremiumGate.tsx`
File: `src/components/learn/PremiumGate.tsx`

Phase 1 stub. Simple card: lock icon + "Premium content — coming soon". No Stripe logic.

### Task 5.2.8 — `TopicDetailWrapper.tsx`
File: `src/components/learn/TopicDetailWrapper.tsx` (Client Component)

Thin client wrapper (mirrors `BlogPostClientWrapper`): mounts `<ReadingProgress />` around children.

### Task 5.2.9 — Update `dynamic/index.tsx`
File: `src/components/dynamic/index.tsx`

Add lazy entry:
```ts
export const FlashcardDeck = dynamic(
  () => import('../learn/FlashcardDeck'),
  { loading: () => <Skeleton className="h-64 w-full" />, ssr: false }
);
```

### Verification
- `npm run type-check` + `npm run lint` — 0 errors
- Visually: render `TopicCard`, `CategoryCard`, `DifficultyBadge` in isolation (or a quick test page) to confirm styling matches blog design
- `TopicDetailTabs` renders all 5 tabs with mock data
- Flashcard flip animation works

### 🚦 Human Gate — US-5.2
Show user screenshots or a live preview of: `TopicCard`, `CategoryCard`, `DifficultyBadge`, and `TopicDetailTabs` with all 5 tabs. User approves visual design before wiring up pages.

### CLAUDE.md Update after US-5.2
```
Last completed:
- US-5.0: SQL migration applied
- US-5.1: Data layer complete (types, queries, API routes, hooks). Gate passed.
- US-5.2: All UI components built — TopicCard, CategoryCard, DifficultyBadge, TopicDetailTabs, FlashcardDeck, PremiumGate. Gate passed.

Next action: US-5.3 — App Router Pages
Current US: US-5.3
```

---

## US-5.3 — App Router Pages

**Goal:** Wire the three route levels. Pages compose the components from US-5.2.

### Task 5.3.1 — `/learn` root layout
File: `src/app/learn/layout.tsx`

Wraps children in `<Container>`. No auth required (all public).

### Task 5.3.2 — `/learn` category index page
Files:
- `src/app/learn/page.tsx` — RSC, `export const revalidate = 3600`, fetches `getTopicCategories()`, passes to `<LearnClient />`
- `src/components/learn/LearnClient.tsx` — Client Component, renders 12 `CategoryCard` in a responsive grid

Metadata:
```ts
title: "Interview Prep | NNBlogs"
description: "Master frontend engineering with structured notes, code examples, and practice questions"
```

### Task 5.3.3 — `/learn/[category]` topic list page
Files:
- `src/app/learn/[category]/layout.tsx` — breadcrumb `Learn → [Category]`
- `src/app/learn/[category]/page.tsx` — RSC, `revalidate: 1800`, validates category slug (404 if not found), passes data to `<CategoryClient />`
- `src/components/learn/CategoryClient.tsx` — Client Component mirroring `BlogClient.tsx`:
  - `useTopicsByCategory` hook
  - Difficulty filter strip (All | Easy | Medium | Hard)
  - Sort by `sort_order` (default)
  - Pagination
  - `TopicCard` grid + `TopicListSkeleton` on loading
- `generateStaticParams` — pre-render all 12 category slugs at build time

Metadata: `"[Category Name] — Interview Prep | NNBlogs"`

### Task 5.3.4 — `/learn/[category]/[topic]` detail page
Files:
- `src/app/learn/[category]/[topic]/page.tsx` — RSC, mirrors `blog/[slug]/page.tsx`

Page structure:
1. `getTopicBySlug(categorySlug, topicSlug)` → 404 if null
2. `incrementTopicViews(topic.id)` non-blocking
3. `extractHeadings(topic.notes)` for TOC (reuse existing util)
4. Render:
   ```
   <TopicDetailWrapper>          {/* mounts ReadingProgress */}
     <topic header>              {/* title, DifficultyBadge, est. minutes, breadcrumb */}
     <two-column layout>
       <TableOfContents />       {/* sticky sidebar, reused as-is */}
       <TopicDetailTabs />       {/* main content area */}
     </two-column>
     <RelatedTopics />           {/* 3 TopicCards from getRelatedTopics */}
   </TopicDetailWrapper>
   ```
5. `generateStaticParams` — all published topic slugs grouped by category
6. Metadata: `"[Topic Title] — [Category] | NNBlogs"` + first 160 chars of notes

### Verification
- `npm run dev`
- `/learn` → 12 category cards load
- `/learn/async-js` → topic list renders, difficulty filter works
- `/learn/async-js/promises` → tabbed detail page loads with all content
- `npm run type-check` — 0 errors
- `npm run build` — static params pre-render without errors

### 🚦 Human Gate — US-5.3
Walk user through all 3 page levels in the browser. Confirm:
- Category grid looks correct
- Topic list filter + pagination work
- Topic detail tab switching works
- Dark mode correct on all pages
- Mobile layout acceptable

User approves before adding nav and finalizing.

### CLAUDE.md Update after US-5.3
```
Last completed:
- US-5.0: SQL migration applied
- US-5.1: Data layer complete. Gate passed.
- US-5.2: UI components built. Gate passed.
- US-5.3: All 3 route levels live (/learn, /learn/[cat], /learn/[cat]/[topic]). Gate passed.

Next action: US-5.4 — Navigation & Breadcrumbs
Current US: US-5.4
```

---

## US-5.4 — Navigation & Breadcrumbs

### Task 5.4.1 — Header nav link
File: `src/components/layout/Header.tsx`

Add `/learn` to the nav items array. Active state via `usePathname()` — same pattern as Blog/Videos/Projects links.

### Task 5.4.2 — Breadcrumbs
Already added via layouts in 5.3.3 and 5.3.4. Verify the semantic markup:
```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/learn">Learn</a></li>
    <li><a href="/learn/async-js">Async JavaScript</a></li>
    <li aria-current="page">Promises</li>
  </ol>
</nav>
```

### Verification
- "Learn" link appears in site header and highlights correctly when on `/learn/**`
- Breadcrumbs render correctly on category and topic pages
- Mobile menu includes Learn link

### 🚦 Human Gate — US-5.4
Show user the full site with nav link in place. Confirm placement and active state styling. Confirm breadcrumbs read correctly.

### CLAUDE.md Update after US-5.4
```
Last completed:
- US-5.0 → US-5.3: Data layer, components, and pages complete. All gates passed.
- US-5.4: /learn added to site nav, breadcrumbs wired. Gate passed.

Next action: US-5.5 — Search & Sitemap
Current US: US-5.5
```

---

## US-5.5 — Search & Sitemap

### Task 5.5.1 — Extend site search
File: `src/lib/supabase/queries.ts` → `searchContent()` function

Add a parallel query against `topics` table (`ilike` on `title`). Map results to `SearchResult` with `type: 'topic'`. Merge + sort with existing post/video/project results. Update `SearchResult.type` union in `src/types/index.ts`.

File: `src/app/api/search/route.ts` — no change needed; it already calls `searchContent()`.

### Task 5.5.2 — Sitemap
File: `src/app/sitemap.ts` (create if absent)

```ts
// Include all /learn routes
/learn                                  priority: 0.8
/learn/[category]     (×12)            priority: 0.7
/learn/[category]/[topic]  (×108)      priority: 0.6
```

### Verification
- Search "promises" on the site → returns topic results alongside blog posts
- `/sitemap.xml` in browser → includes all learn URLs

### 🚦 Human Gate — US-5.5
Show user a search result that surfaces a topic. Confirm sitemap output includes learn URLs.

### CLAUDE.md Update after US-5.5
```
Last completed:
- US-5.0 → US-5.4: All previous gates passed.
- US-5.5: Search extended to include topics, sitemap includes /learn URLs. Gate passed.

Next action: US-5.6 — Premium scaffolding stubs
Current US: US-5.6
```

---

## US-5.6 — Premium Scaffolding

**Goal:** No paywall logic — just future-proof hooks so Phase 2 is a clean addition.

### Task 5.6.1
- `TopicCard`: show lock icon when `access_level === 'premium'` (visually only)
- `TopicDetailTabs`: if `topic.access_level === 'premium'`, render `<PremiumGate />` instead of tab content
- Confirm `PremiumGate` renders correctly at `/learn/[category]/[topic]` if forced via test data

### Verification
- Temporarily set one topic's `access_level = 'premium'` in Supabase → visit its page → `PremiumGate` renders
- Revert to `free` after testing

### 🚦 Human Gate — US-5.6 (Final Gate)
Full end-to-end walkthrough:
1. `/learn` → category grid
2. `/learn/react-hooks` → topic list with difficulty filter
3. `/learn/react-hooks/[topic]` → full tabbed content
4. Search for a topic keyword → topic appears in results
5. `/sitemap.xml` → learn URLs present
6. Dark mode, mobile (375px), keyboard nav on tabs
7. `npm run type-check` → 0 errors
8. `npm run lint` → 0 errors
9. `npm run build` → passes

User signs off → Epic 5 complete.

### CLAUDE.md Update after US-5.6 (final)
```
Phase: Complete
Current Epic: Epic 5 — Interview Prep UI ✅

Last completed:
- US-5.0: DB promotion (108 topics published)
- US-5.1: Types, queries, API routes, hooks
- US-5.2: UI components (TopicCard, CategoryCard, TopicDetailTabs, FlashcardDeck, etc.)
- US-5.3: All 3 route levels (/learn, /learn/[cat], /learn/[cat]/[topic])
- US-5.4: Nav link + breadcrumbs
- US-5.5: Search + sitemap
- US-5.6: Premium scaffolding stubs

Next Epic: Epic 6 (TBD — Admin UI for learn content, or Premium/Paywall)
```

---

## Complete File Tree (new files only)

```
src/
├── app/
│   ├── learn/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── [category]/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       └── [topic]/
│   │           └── page.tsx
│   ├── api/
│   │   └── learn/
│   │       ├── categories/route.ts
│   │       ├── [category]/route.ts
│   │       └── [category]/[topic]/route.ts
│   └── sitemap.ts
├── components/
│   └── learn/
│       ├── CategoryCard.tsx
│       ├── CategoryClient.tsx
│       ├── DifficultyBadge.tsx
│       ├── FlashcardDeck.tsx
│       ├── LearnClient.tsx
│       ├── PremiumGate.tsx
│       ├── TopicCard.tsx
│       ├── TopicCardSkeleton.tsx
│       ├── TopicDetailTabs.tsx
│       └── TopicDetailWrapper.tsx
├── hooks/
│   └── useLearn.ts
└── types/index.ts     (extended)

supabase/migrations/
└── 20260619000000_promote_topics_to_published.sql
```

## Existing Files Modified

| File | Change |
|---|---|
| `src/types/index.ts` | +7 interfaces, extend `SearchResult.type` |
| `src/lib/supabase/queries.ts` | +5 server-side query functions + extend `searchContent()` |
| `src/components/dynamic/index.tsx` | +`FlashcardDeck` lazy entry |
| `src/components/layout/Header.tsx` | +`/learn` nav link |

---

## Execution Order with Gates

```
US-5.0  →  🚦 Gate (row count check)
  ↓
US-5.1  →  🚦 Gate (API response shape review)
  ↓
US-5.2  →  🚦 Gate (visual component review)
  ↓
US-5.3  →  🚦 Gate (full browser walkthrough of 3 pages)
  ↓
US-5.4  →  🚦 Gate (nav + breadcrumb review)
  ↓
US-5.5  →  🚦 Gate (search result + sitemap check)
  ↓
US-5.6  →  🚦 FINAL GATE (end-to-end sign-off)
```

**Total estimate: ~6 hours implementation + gate reviews**

---

## Out of Scope (Phase 2)

- Stripe / LemonSqueezy subscription integration
- `company_questions` premium table rendering
- User progress tracking (`user_topic_progress`)
- Admin CRUD UI for interview prep content
- Subdomain routing
