# Documentation Rules

## Code Documentation

### JSDoc for Public APIs

````typescript
/**
 * Fetches a paginated list of published blog posts.
 *
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of posts per page (default: 10, max: 100)
 * @param category - Optional category filter
 * @returns Paginated response with posts and metadata
 * @throws {Error} When database query fails
 *
 * @example
 * ```typescript
 * const result = await getPosts(1, 10, 'tech');
 * console.log(result.data); // Array of posts
 * console.log(result.totalPages); // Total number of pages
 * ```
 */
export async function getPosts(
  page: number = 1,
  pageSize: number = 10,
  category?: string,
): Promise<PaginatedResponse<Post>> {
  // Implementation
}
````

### ✅ DO: Document public APIs

```typescript
// ✅ GOOD: Component documentation
/**
 * Blog card component displaying post preview.
 *
 * @param post - Blog post data
 * @param showExcerpt - Whether to display post excerpt (default: true)
 * @param onLike - Callback when like button is clicked
 */
export function BlogCard({ post, showExcerpt = true, onLike }: BlogCardProps) {
  // Implementation
}

// ✅ GOOD: Complex function documentation
/**
 * Generates a URL-safe slug from a title.
 *
 * Converts to lowercase, replaces spaces with hyphens,
 * removes special characters, and trims excess hyphens.
 *
 * @param title - The title to slugify
 * @returns URL-safe slug
 *
 * @example
 * slugify('Hello World!') // 'hello-world'
 * slugify('React & Next.js') // 'react-nextjs'
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ✅ GOOD: Type documentation
/**
 * Pagination response wrapper for list queries.
 *
 * @template T - Type of items in the data array
 */
export interface PaginatedResponse<T> {
  /** Array of items for current page */
  data: T[];
  /** Total number of items across all pages */
  total: number;
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of pages */
  totalPages: number;
}
```

### ❌ DON'T: Over-document or under-document

```typescript
// ❌ BAD: Obvious documentation
/**
 * Sets the count
 * @param count - The count
 */
function setCount(count: number) {}

// ❌ BAD: No documentation for complex logic
export function complexAlgorithm(data: unknown[]) {
  // 50 lines of complex logic with no explanation
}
```

## Inline Comments

### ✅ DO: Explain WHY, not WHAT

```typescript
// ✅ GOOD: Explains reasoning
// Use debounce to prevent excessive API calls during typing
const debouncedSearch = useDebounce(searchTerm, 300);

// ✅ GOOD: Explains workaround
// WORKAROUND: Safari doesn't support scrollIntoView with smooth option
// so we use a polyfill for consistent behavior
if (!element.scrollIntoView || isSafari) {
  smoothScrollPolyfill(element);
}

// ✅ GOOD: Explains business logic
// Free users limited to 10 posts, premium users get unlimited
const postLimit = user.isPremium ? Infinity : 10;

// ✅ GOOD: Warns about gotchas
// NOTE: This must run AFTER the DOM update, hence the setTimeout
setTimeout(() => {
  focusInput();
}, 0);
```

### ❌ DON'T: State the obvious

```typescript
// ❌ BAD: Obvious comments
// Increment counter by 1
counter++;

// ❌ BAD: Commented-out code
// const oldFunction = () => { }
// const deprecatedLogic = false;

// ❌ BAD: Misleading comments
// Fetch user data
const posts = await getPosts(); // Comment doesn't match code
```

## README Documentation

### ✅ DO: Maintain comprehensive README

```markdown
# Project Name

Brief description of what the project does.

## Features

- Feature 1
- Feature 2
- Feature 3

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

\`\`\`bash
npm install
\`\`\`

### Environment Variables

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

## Project Structure

\`\`\`
src/
├── app/ # Next.js pages
├── components/ # React components
└── lib/ # Utilities
\`\`\`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
```

## API Documentation

### ✅ DO: Document API endpoints

```markdown
# API Documentation

## Posts

### GET /api/posts

Fetches a paginated list of published blog posts.

**Query Parameters:**

- `page` (number, optional): Page number, default 1
- `pageSize` (number, optional): Items per page, default 10, max 100
- `category` (string, optional): Filter by category

**Response:**
\`\`\`json
{
"data": [
{
"id": "123",
"title": "Post Title",
"slug": "post-title",
"excerpt": "Post excerpt...",
"created_at": "2026-02-18T10:00:00Z"
}
],
"total": 50,
"page": 1,
"pageSize": 10,
"totalPages": 5
}
\`\`\`

**Error Responses:**

- `500`: Server error
  \`\`\`json
  { "error": "Failed to fetch posts" }
  \`\`\`

### POST /api/posts

Creates a new blog post. Requires authentication.

**Headers:**

- `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
"title": "Post Title",
"content": "Post content in markdown",
"category": "tech",
"tags": ["nextjs", "react"],
"published": true
}
\`\`\`

**Response:**
\`\`\`json
{
"id": "123",
"title": "Post Title",
"slug": "post-title",
"created_at": "2026-02-18T10:00:00Z"
}
\`\`\`

**Error Responses:**

- `400`: Validation error
- `401`: Unauthorized
- `500`: Server error
```

## Architecture Documentation

### ✅ DO: Document system architecture

Create `docs/architecture-overview.md`:

```markdown
# Architecture Overview

## High-Level Architecture

\`\`\`
┌─────────────────────────────────────┐
│ Client (Browser) │
│ - React Components │
│ - TanStack Query (State) │
└─────────────────────────────────────┘
↓
┌─────────────────────────────────────┐
│ Next.js App Router │
│ - Server Components │
│ - API Routes │
│ - Server Actions │
└─────────────────────────────────────┘
↓
┌─────────────────────────────────────┐
│ Services Layer │
│ - Database Queries │
│ - External APIs │
│ - Business Logic │
└─────────────────────────────────────┘
↓
┌─────────────────────────────────────┐
│ Data Layer │
│ - Supabase (PostgreSQL) │
│ - Clerk (Auth) │
│ - External Services │
└─────────────────────────────────────┘
\`\`\`

## Component Structure

### Server Components

Used for static content and data fetching.

### Client Components

Used for interactive UI and state management.

## State Management

- **Server State**: TanStack Query
- **Client State**: useState, useReducer
- **Shared State**: React Context (minimal use)

## Authentication Flow

1. User signs in via Clerk
2. Clerk issues JWT
3. Middleware validates JWT on requests
4. Protected routes require valid session

## Database Schema

See [supabase/schema.sql](../supabase/schema.sql)
```

## Component Documentation

### ✅ DO: Document complex components

````typescript
/**
 * MarkdownEditor Component
 *
 * A rich markdown editor with live preview, syntax highlighting,
 * and toolbar for common formatting operations.
 *
 * Features:
 * - Real-time markdown preview
 * - Syntax highlighting for code blocks
 * - Toolbar with formatting buttons
 * - Image upload support
 * - Auto-save draft functionality
 *
 * @example
 * ```tsx
 * <MarkdownEditor
 *   initialValue={post.content}
 *   onChange={(content) => setContent(content)}
 *   onImageUpload={handleImageUpload}
 *   autoSave={true}
 * />
 * ```
 */
export function MarkdownEditor({
  initialValue = "",
  onChange,
  onImageUpload,
  autoSave = false,
}: MarkdownEditorProps) {
  // Implementation
}
````

## Change Documentation

### ✅ DO: Maintain CHANGELOG

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Video content support with YouTube integration
- Advanced search with filters

### Changed

- Improved blog post editor with auto-save
- Updated Tailwind CSS to v4

### Fixed

- Fixed pagination bug on search results
- Fixed dark mode toggle persistence

## [1.1.0] - 2026-02-15

### Added

- GitHub repository showcase
- Google Analytics integration

### Changed

- Migrated to Next.js 16

## [1.0.0] - 2026-01-10

Initial release
```

## Migration Guides

### ✅ DO: Document migrations

Create `docs/migrations/` for breaking changes:

```markdown
# Migration Guide: Next.js 14 to 16

## Breaking Changes

### 1. Server Actions Changes

**Before:**
\`\`\`typescript
export async function myAction() {
'use server';
// ...
}
\`\`\`

**After:**
\`\`\`typescript
'use server';

export async function myAction() {
// ...
}
\`\`\`

### 2. Metadata API

**Before:**
\`\`\`typescript
export const metadata = { title: 'Page' };
\`\`\`

**After:**
\`\`\`typescript
export const metadata: Metadata = { title: 'Page' };
\`\`\`

## Migration Steps

1. Update dependencies
2. Run type check: `npm run type-check`
3. Fix any errors
4. Test thoroughly
```

## Decision Records

### ✅ DO: Document architectural decisions

Create `docs/decisions/` for ADRs:

```markdown
# ADR 001: Use React Query for Server State

## Status

Accepted

## Context

We need a solution for managing server state (API requests, caching, etc.)

## Decision

Use TanStack Query (React Query) for all server state management.

## Consequences

### Positive

- Automatic caching and refetching
- Built-in loading/error states
- Optimistic updates support
- Reduced boilerplate

### Negative

- Additional dependency
- Learning curve for team
- Client-side only (need to handle SSR carefully)

## Alternatives Considered

- Redux Toolkit with RTK Query
- SWR
- Custom fetch hooks
```

## Keep Documentation Updated

### ✅ DO: Update docs with code changes

```typescript
// When changing function signature, update JSDoc
/**
 * OLD DOCS (out of date)
 * @param id - Post ID
 */

/**
 * UPDATED DOCS
 * @param slug - Post slug (changed from ID to slug)
 */
export async function getPost(slug: string) {
  // Also update API docs, README examples, etc.
}
```

## Strict Rules

1. **JSDoc for public APIs** - functions, components, types
2. **Comment WHY not WHAT** - explain reasoning
3. **Update README** - when adding features
4. **Document API endpoints** - parameters, responses, errors
5. **Maintain CHANGELOG** - for version tracking
6. **Create migration guides** - for breaking changes
7. **Document architecture** - high-level system design
8. **Write ADRs** - for significant decisions
9. **Remove obsolete docs** - don't leave stale documentation
10. **Keep examples current** - update when APIs change
11. **Document environment variables** - in README and .env.example
12. **No commented-out code** - remove it or document why it's there
