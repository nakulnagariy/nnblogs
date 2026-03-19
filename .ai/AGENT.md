# AI Agent Configuration for NNBlogs

This file provides cross-platform AI agent configuration for the NNBlogs project. It's designed to work with various AI coding assistants including Claude, GitHub Copilot, Cursor, and others.

---

## Project Overview

**NNBlogs** is a modern full-stack blog platform built with:

- Next.js 16.1.1 (App Router)
- React 19.2.3
- TypeScript 5 (strict mode)
- Supabase (PostgreSQL)
- Clerk Authentication
- Tailwind CSS v4

**Purpose**: Personal blog and portfolio showcasing technical articles, video content, and software projects.

---

## Agent Behavioral Expectations

### Core Responsibilities

As an AI development agent for NNBlogs, you should:

1. **Implement Features**: Write production-ready code following project conventions
2. **Refactor Code**: Improve maintainability while preserving functionality
3. **Write Tests**: Create comprehensive test suites for new features
4. **Document Code**: Generate JSDoc comments and update relevant documentation
5. **Review Architecture**: Validate adherence to Clean Architecture principles
6. **Audit Security**: Identify and fix security vulnerabilities
7. **Optimize Performance**: Find and resolve performance bottlenecks

### Decision-Making Principles

**When Requirements are Unclear:**

- Analyze existing codebase for established patterns
- Infer the most reasonable approach based on context
- Proceed with implementation (don't just describe solutions)
- Explain your decisions clearly

**When Making Changes:**

- Maintain type safety (avoid `any` types)
- Follow existing file structure and naming conventions
- Preserve backward compatibility for public APIs
- Update tests and documentation alongside code changes
- Validate changes by checking for errors

**When Facing Trade-offs:**

- Prioritize **security** over convenience
- Prefer **maintainability** over cleverness
- Choose **performance** when it significantly impacts UX
- Favor **accessibility** to ensure inclusive design

---

## Architectural Rules

### Layer Separation (Clean Architecture)

```
UI Layer         → React components, pages
  ↓
Service Layer    → Hooks, API routes, business logic
  ↓
Data Layer       → Database queries, external APIs
```

**Rules:**

- UI components should NOT directly call database queries
- Use centralized queries in `lib/supabase/queries.ts`
- API routes handle business logic and orchestration
- Server Components by default, Client Components for interactivity

### Component Patterns

**Server Components (Default)**:

```typescript
// app/blog/page.tsx
export default async function BlogPage() {
  const posts = await getPosts(); // Direct database query
  return <BlogList posts={posts} />;
}
```

**Client Components (Interactive)**:

```typescript
"use client";

export function InteractiveComponent() {
  const [state, setState] = useState();
  // Interactive logic
}
```

### File Organization

```
src/
├── app/                 # Pages and API routes
├── components/          # Reusable components
│   ├── ui/             # Primitives (Button, Card)
│   └── blog/           # Domain-specific
├── hooks/              # Custom React hooks
├── lib/                # Utilities and integrations
└── types/              # TypeScript definitions
```

---

## Code Style and Conventions

### TypeScript

- ✅ Use **strict mode** (enabled in `tsconfig.json`)
- ✅ Explicit return types for functions
- ✅ Interface over type for object shapes
- ✅ Const assertions where appropriate
- ❌ Never use `any` (use `unknown` if necessary)

### Naming Conventions

- **Components**: PascalCase (`BlogCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`usePosts.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`Post`, `User`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_PAGE_SIZE`)

### Import Organization

```typescript
// 1. External packages
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 2. Internal modules
import { getPosts } from "@/lib/supabase/queries";

// 3. Relative imports
import { BlogCard } from "./BlogCard";
```

### React Patterns

```typescript
// Functional components with types
export function BlogCard({ post, className }: BlogCardProps) {
  return <div className={cn('card', className)}>{/* ... */}</div>;
}

// forwardRef with displayName
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return <button ref={ref} {...props}>{children}</button>;
  }
);
Button.displayName = 'Button';
```

---

## Security Requirements

### Authentication

- **All admin routes** must verify authentication via Clerk
- **API mutations** (POST, PUT, DELETE) require auth
- **User IDs** must come from auth session, never client input

### Input Validation

- **Validate all user input** before processing
- **Type check** all parameters
- **Enforce length limits** on strings
- **Sanitize HTML/Markdown** before rendering

### XSS Prevention

```typescript
// ❌ DON'T: Unsafe HTML rendering
<div dangerouslySetInnerHTML={{ __html: marked(content) }} />

// ✅ DO: Sanitize first
const html = marked(content);
const clean = DOMPurify.sanitize(html);
<div dangerouslySetInnerHTML={{ __html: clean }} />
```

### Secrets Management

- **Server-only secrets**: Use without `NEXT_PUBLIC_` prefix
- **Client-safe vars**: Use `NEXT_PUBLIC_` prefix
- **Never log secrets**: Avoid console.log of sensitive data
- **Check .gitignore**: Ensure `.env.local` is excluded

---

## Testing Standards

### When to Write Tests

- ✅ New features and components
- ✅ Bug fixes (add failing test first)
- ✅ Refactoring complex logic
- ✅ Public utility functions

### Test Structure (AAA Pattern)

```typescript
describe('BlogCard', () => {
  it('displays post title and excerpt', () => {
    // Arrange
    const post = createMockPost();

    // Act
    render(<BlogCard post={post} />);

    // Assert
    expect(screen.getByText(post.title)).toBeInTheDocument();
    expect(screen.getByText(post.excerpt)).toBeInTheDocument();
  });
});
```

### Coverage Target

- **Minimum**: 70% overall coverage
- **Critical paths**: 90%+ coverage (auth, payments, data mutations)

---

## Performance Guidelines

### Server Components

- ✅ Default to Server Components for static content
- ✅ Fetch data at component level (parallel requests)
- ✅ Use React 19 Suspense boundaries

### Client Components

- ✅ Dynamic imports for large components
- ✅ React Query for data fetching
- ✅ Memoize expensive computations

### Database Optimization

- ✅ Use indexes for filtered/sorted columns
- ✅ Select only needed columns
- ✅ Avoid N+1 queries (use joins)
- ✅ Paginate large result sets

### Bundle Size

- ✅ Code split with `next/dynamic`
- ✅ Tree-shakeable utilities
- ✅ Avoid large dependencies

---

## Accessibility Requirements

Target: **WCAG 2.1 AA compliance**

### Mandatory:

- ✅ Semantic HTML elements
- ✅ ARIA attributes where needed
- ✅ Keyboard navigation support
- ✅ 4.5:1 text contrast ratio
- ✅ Focus indicators visible
- ✅ Alt text for images

### Testing:

```bash
# Use automated tools
npm run lint:a11y  # (when configured)
```

---

## Git Workflow

### Commit Messages (Conventional Commits)

```
feat: add video view tracking
fix: resolve markdown XSS vulnerability
docs: update API documentation
refactor: simplify post query logic
test: add BlogCard component tests
chore: update dependencies
```

### Branch Naming

```
feat/video-analytics
fix/markdown-xss
refactor/post-queries
```

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server

# Quality checks
npm run lint             # ESLint
npm run type-check       # TypeScript
npm test                 # Run tests (when configured)

# Build and deployment
npm run build            # Production build
npm start                # Start production server
```

---

## Platform-Specific Notes

### Claude

- Primary configuration in `.claude/CLAUDE.md`
- Use skills system for complex tasks (see `.claude/skills/index.md`)

### GitHub Copilot

- Instructions in `.github/copilot-instructions.md`
- Optimized for inline code completion

### Cursor

- Uses this `.ai/AGENT.md` file
- Follows same rules and conventions

---

## References

**Project Documentation**:

- `.claude/CLAUDE.md` - Claude-specific configuration
- `.claude/rules/` - Detailed engineering rules
- `.claude/skills/` - Structured task execution patterns
- `docs/STRATEGIC_PLAN.md` - Feature roadmap

**External Resources**:

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Clerk Docs](https://clerk.com/docs)

---

**Last Updated**: 2026-02-18  
**Version**: 1.0.0
