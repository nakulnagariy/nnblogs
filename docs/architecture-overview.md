# Architecture Overview

## System Architecture

NNBlogs follows **Clean Architecture** principles with strict layer separation and Server-First architecture using Next.js 14+ App Router.

## Core Principles

### 1. Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│         UI Layer (Presentation)         │
│  React Components, Pages, Layouts       │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│      Service Layer (Business Logic)     │
│  Hooks, API Routes, Utilities           │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│        Data Layer (Data Access)         │
│  Database Queries, External APIs        │
└─────────────────────────────────────────┘
```

**Rules:**

- **UI Layer** depends on Service Layer
- **Service Layer** depends on Data Layer
- **Data Layer** has no dependencies
- **No layer skipping** - UI cannot directly call Data Layer

### 2. Server-First Architecture

```typescript
// Default: Server Component (runs on server)
export default async function BlogPage() {
  const posts = await getPosts(); // Direct data access
  return <BlogList posts={posts} />;
}

// Explicit: Client Component (runs on browser)
'use client';
export function InteractiveWidget() {
  const [state, setState] = useState();
  // Interactive logic
}
```

**Decision Tree:**

- **Use Server Components** for static content, data fetching, SEO
- **Use Client Components** for interactivity, browser APIs, event handlers

## Project Structure

### Directory Layout

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── admin/             # Protected admin routes
│   │   ├── posts/
│   │   ├── videos/
│   │   └── analytics/
│   ├── api/               # API route handlers
│   │   ├── posts/
│   │   ├── videos/
│   │   ├── search/
│   │   └── ai/
│   ├── blog/              # Public blog pages
│   ├── videos/            # Video pages
│   ├── projects/          # Portfolio pages
│   ├── search/            # Search page
│   └── about/             # About page
├── components/            # React components
│   ├── ui/               # Primitives (Button, Card, Input)
│   ├── blog/             # Blog components
│   ├── videos/           # Video components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── providers/        # Context providers
│   └── analytics/        # Analytics tracking
├── hooks/                 # Custom React hooks
│   ├── usePosts.ts       # Blog data fetching
│   ├── useSearch.ts      # Search functionality
│   └── useGitHub.ts      # GitHub integration
├── lib/                   # Utilities and integrations
│   ├── supabase/         # Database layer
│   │   ├── client.ts     # Browser client
│   │   ├── server.ts     # Server client
│   │   └── queries.ts    # All database queries
│   ├── utils.ts          # Helper functions
│   ├── markdown.ts       # Markdown processing
│   ├── github.ts         # GitHub API
│   ├── ai.ts             # OpenAI integration
│   └── analytics.ts      # Google Analytics
├── types/                 # TypeScript definitions
│   └── index.ts          # Shared types
└── middleware.ts          # Auth middleware (Clerk)
```

### Route Organization

**Public Routes:**

- `/` - Landing page
- `/blog` - Blog list
- `/blog/[slug]` - Blog post
- `/videos` - Video list
- `/videos/[slug]` - Video page
- `/projects` - Portfolio
- `/search` - Search
- `/about` - About page

**Auth Routes:**

- `/sign-in` - Clerk sign-in
- `/sign-up` - Clerk sign-up

**Protected Routes:**

- `/admin` - Admin dashboard
- `/admin/posts` - Manage posts
- `/admin/videos` - Manage videos
- `/admin/projects` - Manage projects
- `/admin/analytics` - View analytics

**API Routes:**

- `/api/posts` - CRUD operations for posts
- `/api/videos` - CRUD operations for videos
- `/api/projects` - CRUD operations for projects
- `/api/search` - Full-text search
- `/api/ai` - AI content generation
- `/api/github` - GitHub integration

## Data Flow

### Read Operations (Server Component)

```
┌──────────────┐
│   Page.tsx   │ Server Component
│  (UI Layer)  │
└──────┬───────┘
       │ import
       ↓
┌──────────────────┐
│ queries.ts       │ Data Layer
│ getPosts()       │
└──────┬───────────┘
       │ Supabase client
       ↓
┌──────────────────┐
│   Database       │
│   (Supabase)     │
└──────────────────┘
```

### Write Operations (API Route)

```
┌──────────────┐
│  Component   │ Client Component (UI Layer)
└──────┬───────┘
       │ fetch('/api/posts')
       ↓
┌──────────────────┐
│  API Route       │ Service Layer
│  1. Authenticate │
│  2. Validate     │
│  3. Process      │
└──────┬───────────┘
       │ call
       ↓
┌──────────────────┐
│ queries.ts       │ Data Layer
│ createPost()     │
└──────┬───────────┘
       │ Supabase client
       ↓
┌──────────────────┐
│   Database       │
└──────────────────┘
```

### Client-Side Data Fetching

```
┌──────────────┐
│  Component   │ Client Component (UI Layer)
└──────┬───────┘
       │ useQuery (React Query)
       ↓
┌──────────────────┐
│  Custom Hook     │ Service Layer
│  usePosts()      │
└──────┬───────────┘
       │ fetch API
       ↓
┌──────────────────┐
│  API Route       │ Service Layer
└──────┬───────────┘
       │ call
       ↓
┌──────────────────┐
│   queries.ts     │ Data Layer
└──────────────────┘
```

## Authentication Flow

### Middleware Protection

```typescript
// middleware.ts
export default clerkMiddleware((auth, req) => {
  // Protect admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    auth().protect();
  }
});
```

### API Route Protection

```typescript
export async function POST(request: NextRequest) {
  // 1. Authenticate
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validate input
  const body = await request.json();
  // ... validation

  // 3. Process request
  const result = await createPost({ ...body, author_id: userId });
  return NextResponse.json(result);
}
```

## Database Architecture

### Schema Design

**Tables:**

- `posts` - Blog posts with markdown content
- `videos` - Video metadata and YouTube links
- `projects` - Portfolio projects with GitHub integration
- `categories` - Content categorization
- `post_views` - View tracking for analytics
- `video_views` - Video view tracking

**Key Features:**

- **Row Level Security (RLS)** - Supabase policies enforce access control
- **Indexes** - Optimized for common queries (published posts, categories, search)
- **Foreign Keys** - Referential integrity
- **Timestamps** - created_at, updated_at on all tables

### Query Patterns

**Centralized in `lib/supabase/queries.ts`:**

```typescript
// Paginated query
export async function getPosts(page = 1, pageSize = 10) {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;

  const { data, error, count } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  return {
    data: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}
```

## State Management

### Server State (React Query)

```typescript
"use client";
import { useQuery } from "@tanstack/react-query";

export function usePosts(page: number) {
  return useQuery({
    queryKey: ["posts", page],
    queryFn: () => fetchPosts(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Local State (React Hooks)

```typescript
"use client";
import { useState } from "react";

export function SearchInput() {
  const [query, setQuery] = useState("");
  // Component logic
}
```

## Integration Points

### GitHub Integration

- Fetch profile data via GitHub API
- Display repositories with stats
- Show contribution activity
- Cache responses for performance

### Google Analytics

- Page view tracking
- Event tracking (post views, video plays)
- Custom dimensions
- Privacy-compliant

### OpenAI Integration

- Generate blog post drafts
- Auto-generate excerpts
- Suggest tags
- Content improvement suggestions

## Performance Optimizations

### Server Components

- Zero client-side JavaScript by default
- Direct database access (no API calls)
- Streaming with Suspense boundaries
- Automatic code splitting

### Caching Strategy

- React Query for client-side caching
- Next.js automatic caching for fetch requests
- Supabase connection pooling
- CDN caching for static assets

### Database Optimization

- Indexes on frequently queried columns
- Select only needed columns
- Pagination for large datasets
- RPC functions for complex operations

### Bundle Optimization

- Dynamic imports for large components
- Tree-shaking with ES modules
- Code splitting by route
- Next.js automatic optimization

## Security Architecture

### Defense in Depth

1. **Authentication** - Clerk handles auth, sessions, JWTs
2. **Authorization** - Middleware protects routes, RLS in database
3. **Input Validation** - All API routes validate and sanitize input
4. **Output Encoding** - DOMPurify sanitizes HTML/Markdown
5. **Secrets Management** - Environment variables, never in client bundle
6. **HTTPS** - Enforced in production
7. **CORS** - Configured for API routes
8. **Rate Limiting** - Protection against abuse (to be implemented)

### Threat Mitigation

- **XSS** - DOMPurify sanitization, React auto-escaping
- **SQL Injection** - Parameterized queries (Supabase handles)
- **CSRF** - SameSite cookies, Clerk protection
- **Auth Bypass** - Middleware enforcement, RLS policies
- **Data Exposure** - Generic error messages, proper RLS

## Deployment Architecture

### Static Export (Amplify, Netlify)

- Next.js standalone output
- Static pages pre-rendered
- API routes as serverless functions
- Environment variables configured

### Docker Container

- Multi-stage build
- Optimized image size
- Health checks
- Production-ready

### CI/CD Pipeline

- Automated testing (Vitest)
- ESLint checks
- TypeScript compilation
- Deployment on push to main

## Monitoring & Observability

### Logging

- Server-side console logs
- Error boundaries for React errors
- Supabase query logs
- Clerk auth logs

### Analytics

- Google Analytics for user behavior
- Custom events for key actions
- Performance metrics
- Error tracking (to be implemented)

### Health Checks

- Database connectivity
- API route availability
- External service status

---

## Architecture Decision Records (ADRs)

### ADR-001: Server Components by Default

**Decision**: Use Server Components as default, Client Components for interactivity  
**Rationale**: Reduces client JS, improves performance, better for SEO  
**Trade-offs**: Some patterns require Client Components

### ADR-002: Supabase for Database

**Decision**: Use Supabase (PostgreSQL) over other solutions  
**Rationale**: Open source, RLS, real-time, auth integration  
**Trade-offs**: Vendor lock-in (mitigated by PostgreSQL compatibility)

### ADR-003: Clerk for Authentication

**Decision**: Use Clerk instead of NextAuth or custom solution  
**Rationale**: Better DX, built-in UI, social auth, security  
**Trade-offs**: Paid service for scale

### ADR-004: React Query for Client State

**Decision**: Use TanStack Query for server state management  
**Rationale**: Caching, deduplication, automatic refetching  
**Trade-offs**: Additional dependency

### ADR-005: Centralized Database Queries

**Decision**: All queries in `lib/supabase/queries.ts`  
**Rationale**: Single source of truth, easier to test, consistent patterns  
**Trade-offs**: Larger file (mitigated by code organization)

---

**Last Updated**: 2026-02-18  
**Version**: 1.0.0
