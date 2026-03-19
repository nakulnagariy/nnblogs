# Architecture Rules

## Core Principles

This project follows **Clean Architecture** principles with clear layer separation and the **App Router** pattern from Next.js 14+.

### Architectural Philosophy

- **Server-first**: Default to Server Components for better performance
- **Type-safe**: Strict TypeScript throughout the stack
- **Layered**: Clear separation between UI, API, and Data layers
- **Modular**: Domain-based organization for scalability

## Tech Stack

- **Framework**: Next.js 16.1.1 with App Router
- **Language**: TypeScript 5 (strict mode)
- **React**: 19.2.3 (React Compiler enabled)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Clerk
- **State**: TanStack Query (React Query)
- **Styling**: Tailwind CSS v4

## Layer Architecture

```
┌─────────────────────────────────────┐
│   UI Layer (Components)             │
│   - Server Components (default)     │
│   - Client Components ('use client')│
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   API Layer (app/api/*)             │
│   - Route Handlers                  │
│   - Request validation              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Service Layer (lib/*)             │
│   - Business logic                  │
│   - External integrations          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Data Layer (lib/supabase/*)       │
│   - Database queries                │
│   - Data transformations            │
└─────────────────────────────────────┘
```

## Server vs Client Components

### ✅ DO: Use Server Components

Default to Server Components for:

- Static content and layouts
- Data fetching at page level
- Accessing backend resources directly
- SEO-critical pages
- Initial page renders

```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  // Direct database access in Server Component
  const post = await getPostBySlug(params.slug);

  return <BlogPostContent post={post} />;
}
```

### ✅ DO: Use Client Components

Use Client Components (`'use client'`) for:

- Interactive UI (forms, buttons with state)
- Browser APIs (localStorage, window, etc.)
- React hooks (useState, useEffect, useReducer)
- Event handlers
- React Query hooks
- Third-party components requiring browser APIs

```typescript
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export function InteractiveComponent() {
  const [count, setCount] = useState(0);
  // ...
}
```

### ❌ DON'T: Mix concerns

```typescript
// ❌ BAD: Server Component with client hooks
export default function BadComponent() {
  const [state, setState] = useState(); // Error!
  return <div>...</div>;
}

// ❌ BAD: Client-side data fetching for server-renderable content
'use client';
export default function BadPage() {
  const [data, setData] = useState();

  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(setData);
  }, []);
  // Should be Server Component with direct data access
}
```

## File Organization

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route group: authentication
│   ├── admin/             # Protected admin routes
│   ├── api/               # API routes
│   │   ├── posts/         # Resource-based organization
│   │   │   └── route.ts
│   │   └── admin/
│   ├── blog/
│   │   ├── page.tsx       # Blog listing page
│   │   └── [slug]/        # Dynamic route
│   │       └── page.tsx
│   └── layout.tsx
├── components/            # React components
│   ├── ui/               # Reusable primitives (Button, Card)
│   ├── blog/             # Domain: blog-specific
│   ├── videos/           # Domain: videos
│   ├── projects/         # Domain: projects
│   ├── layout/           # Layout components (Header, Footer)
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and services
│   ├── supabase/         # Database layer
│   │   ├── client.ts     # Client instances
│   │   └── queries.ts    # Query functions
│   ├── utils.ts          # Shared utilities
│   └── markdown.ts       # Markdown processing
└── types/                # TypeScript definitions
```

### ✅ DO: Follow conventions

- **Route groups**: Use `(groupName)` for logical grouping without URL segments
- **Dynamic routes**: Use `[param]` for dynamic segments
- **API routes**: Organize by resource (`api/posts/`, `api/videos/`)
- **Components**: Group by domain or reusability (ui, blog, videos)
- **Co-locate**: Keep related files close (components with their styles/tests)

### ❌ DON'T: Break conventions

- Don't mix API logic in page components
- Don't create deeply nested route structures unnecessarily
- Don't put business logic in components
- Don't create circular dependencies between layers

## State Management

### React Query for Server State

Use TanStack Query for all server state:

```typescript
// hooks/usePosts.ts
export function usePosts(page: number = 1) {
  return useQuery({
    queryKey: ["posts", page],
    queryFn: () => getPosts(page),
  });
}
```

### Local State Management

- **useState**: For simple component state
- **useReducer**: For complex state logic
- **Context**: For shared state across component tree (minimal use)

### ❌ DON'T: Over-engineer state

- Don't use global state for server data (use React Query)
- Don't prop-drill deeply (use composition or Context)
- Don't store derived state (compute from source)

## Authentication & Authorization

### Clerk Middleware Pattern

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/blog(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});
```

### ✅ DO: Protect routes properly

- Use middleware for route-level protection
- Use `auth.protect()` for admin routes
- Check user permissions in API routes
- Handle unauthenticated state gracefully

## Database Access

### Supabase Client Usage

```typescript
// Server-side (Server Components, API Routes)
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const { data } = await supabase.from("posts").select("*");
```

```typescript
// Client-side (Client Components)
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const { data } = await supabase.from("posts").select("*");
```

### ✅ DO: Use proper client

- Server Components/API routes: Use `createClient()` from `supabase/server`
- Client Components: Use `createClient()` from `supabase/client`
- Keep queries in `lib/supabase/queries.ts`
- Use TypeScript types for database responses

### ❌ DON'T: Mix clients

- Don't use browser client in Server Components
- Don't expose service role key to client
- Don't query databases directly in components
- Don't skip error handling

## Dependency Rules

### Layer Dependencies

```
UI Layer
  ↓ can import
Service Layer (lib/*)
  ↓ can import
Data Layer (lib/supabase/*)
```

### ✅ DO: Follow dependency direction

- UI components can import from `lib/*` and `hooks/*`
- Hooks can import from `lib/*`
- `lib/*` files should be independent or import from other `lib/*`
- Data layer (`lib/supabase/*`) should have no dependencies on UI

### ❌ DON'T: Create circular dependencies

- Don't import components in `lib/*` files
- Don't import hooks in `lib/*` files
- Don't import UI layer in data layer

## Performance Considerations

- **React Compiler**: Enabled automatically (babel-plugin-react-compiler)
- **Code Splitting**: Use dynamic imports for heavy components
- **Server Components**: Reduce JavaScript bundle size
- **Streaming**: Leverage Suspense boundaries for progressive rendering

## Strict Rules

1. **No breaking changes** without explicit discussion
2. **Server Components by default** - only use Client when needed
3. **Type everything** - no `any` types without justification
4. **Layer separation** - respect the dependency rules
5. **Error handling** - always handle errors gracefully
6. **Authentication** - protect all admin/user-specific routes
7. **Database queries** - centralize in `lib/supabase/queries.ts`
