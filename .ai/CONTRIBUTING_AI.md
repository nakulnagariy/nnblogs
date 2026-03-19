# AI Contribution Guidelines for NNBlogs

This document provides guidelines for AI coding assistants contributing to the NNBlogs project. Following these guidelines ensures consistent, high-quality code that aligns with project standards.

---

## 🎯 Before You Start

### Understand the Context

1. **Read the project mission** in `.claude/CLAUDE.md`
2. **Review relevant rule files** in `.claude/rules/`
3. **Examine existing code** for established patterns
4. **Check the type definitions** in `src/types/index.ts`

### Ask Clarifying Questions

If requirements are unclear:

- ✅ Ask specific questions about desired behavior
- ✅ Present options and trade-offs
- ✅ Suggest reasonable defaults based on existing patterns
- ❌ Don't make assumptions without user input
- ❌ Don't proceed if security implications are unclear

---

## 📝 Writing Code

### 1. Type Safety First

```typescript
// ✅ GOOD: Explicit types
interface CreatePostInput {
  title: string;
  content: string;
  published: boolean;
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  // Implementation
}

// ❌ BAD: Missing types
export async function createPost(input) {
  // Implementation
}
```

### 2. Component Design

```typescript
// ✅ GOOD: Server Component (default)
// app/blog/page.tsx
import { getPosts } from '@/lib/supabase/queries';

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogList posts={posts} />;
}

// ✅ GOOD: Client Component (when needed)
// components/SearchInput.tsx
'use client';

import { useState } from 'react';

export function SearchInput() {
  const [query, setQuery] = useState('');
  // Interactive logic
}

// ❌ BAD: Unnecessary Client Component
'use client';

export function StaticContent() {
  return <div>This has no interactivity</div>;
}
```

### 3. API Route Design

```typescript
// ✅ GOOD: Complete API route
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createPost } from "@/lib/supabase/queries";

export async function POST(request: NextRequest) {
  // Authentication
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  // Parse body
  const body = await request.json();

  // Validate input
  if (!body.title || typeof body.title !== "string") {
    return NextResponse.json(
      { error: "Title is required and must be a string" },
      { status: 400 },
    );
  }

  if (body.title.length < 3 || body.title.length > 200) {
    return NextResponse.json(
      { error: "Title must be 3-200 characters" },
      { status: 400 },
    );
  }

  // Process
  try {
    const post = await createPost({
      ...body,
      author_id: userId, // From auth, not body!
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}

// ❌ BAD: Missing validation and auth
export async function POST(request: NextRequest) {
  const body = await request.json();
  const post = await createPost(body); // No auth, no validation!
  return NextResponse.json(post);
}
```

### 4. Database Queries

```typescript
// ✅ GOOD: Centralized, parameterized query
// lib/supabase/queries.ts
export async function getPostsByCategory(
  category: string,
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<Post>> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;

  const { data, error, count } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, created_at, category, views", {
      count: "exact",
    })
    .eq("published", true)
    .eq("category", category)
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

// ❌ BAD: Query in component with SQL injection risk
export function BlogPage({ category }) {
  const supabase = createClient();
  const query = `SELECT * FROM posts WHERE category = '${category}'`; // SQL injection!
  const posts = await supabase.raw(query);
}
```

---

## 🔒 Security Requirements

### Always Implement:

1. **Authentication on Protected Routes**

```typescript
const { userId } = await auth();
if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

2. **Input Validation**

```typescript
// Check type, length, format
if (!input.email || !input.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
  return NextResponse.json({ error: "Valid email required" }, { status: 400 });
}
```

3. **HTML Sanitization**

```typescript
import DOMPurify from 'isomorphic-dompurify';

const html = marked(markdown);
const clean = DOMPurify.sanitize(html);
<div dangerouslySetInnerHTML={{ __html: clean }} />
```

4. **Generic Error Messages**

```typescript
// ✅ GOOD: Generic message to client
return NextResponse.json({ error: "Failed to create post" }, { status: 500 });

// ❌ BAD: Exposes internal details
return NextResponse.json({ error: error.message }, { status: 500 });
```

---

## 🧪 Testing Requirements

### Write Tests For:

- ✅ New features
- ✅ Bug fixes (test first)
- ✅ Complex utility functions
- ✅ Public components

### Test Structure (AAA Pattern):

```typescript
describe("formatDate", () => {
  it("formats date string in MMM DD, YYYY format", () => {
    // Arrange
    const date = new Date("2026-02-18");

    // Act
    const formatted = formatDate(date);

    // Assert
    expect(formatted).toBe("Feb 18, 2026");
  });
});
```

### Coverage Standards:

- **Minimum**: 70% overall
- **Critical paths**: 90%+ (auth, payments, data mutations)

---

## 📚 Documentation Standards

### JSDoc for Public APIs

````typescript
/**
 * Converts a string into a URL-safe slug.
 *
 * @param title - The string to convert
 * @returns URL-safe slug with hyphens
 *
 * @example
 * ```typescript
 * slugify('Hello World!');
 * // Returns: 'hello-world'
 * ```
 */
export function slugify(title: string): string {
  // Implementation
}
````

### Update Documentation When:

- Adding new public API
- Changing function signatures
- Introducing breaking changes
- Adding new features

---

## ♿ Accessibility Checklist

For all UI components, ensure:

- [ ] Semantic HTML elements used
- [ ] ARIA labels where appropriate
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets 4.5:1 ratio
- [ ] Alt text for images
- [ ] Form labels associated with inputs

---

## 🚀 Performance Best Practices

### Optimize from the Start:

1. **Use Server Components** unless interactivity required
2. **Code split** large client components

```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});
```

3. **Optimize database queries**

```typescript
// ✅ Select only needed columns
.select('id, title, excerpt')

// ✅ Use indexes for filtering
.eq('published', true) // 'published' should be indexed

// ✅ Paginate large results
.range(from, to)
```

4. **Cache with React Query**

```typescript
const { data } = useQuery({
  queryKey: ["posts", page],
  queryFn: () => fetchPosts(page),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## 🔄 Git Workflow

### Commit Messages (Conventional Commits)

```
feat: add video view counter
fix: resolve XSS in markdown rendering
docs: update API documentation
refactor: simplify post query
test: add BlogCard tests
chore: update dependencies
perf: optimize image loading
```

### Branch Naming

```
feat/video-view-counter
fix/markdown-xss
refactor/post-queries
```

---

## 🛠️ Common Patterns

### Environment Variables

```typescript
// ✅ Client-safe (prefixed with NEXT_PUBLIC_)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// ✅ Server-only (no prefix)
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Never in client!
```

### Error Boundaries

```typescript
export function ErrorBoundary({ error }: { error: Error }) {
  console.error('Error:', error);
  return (
    <div>
      <h2>Something went wrong</h2>
      <p>Please try again later.</p>
    </div>
  );
}
```

### Loading States

```typescript
export default function Page() {
  return (
    <Suspense fallback={<BlogListSkeleton />}>
      <BlogList />
    </Suspense>
  );
}
```

---

## ❌ Common Mistakes to Avoid

### Don't:

1. **Use `any` type** - Use `unknown` or proper types
2. **Forget authentication** on protected routes
3. **Skip input validation** on user data
4. **Expose secrets** in client code
5. **Make unnecessary Client Components**
6. **Write unoptimized database queries**
7. **Forget error handling**
8. **Skip accessibility attributes**
9. **Ignore TypeScript errors**
10. **Commit without testing**

---

## 📖 Learning Resources

### Project Documentation:

- `.claude/CLAUDE.md` - Main AI configuration
- `.claude/rules/` - Detailed engineering rules
- `.claude/skills/` - Structured task patterns
- `docs/` - Project roadmap and guides

### External References:

- [Next.js App Router](https://nextjs.org/docs/app)
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🤝 Collaboration Etiquette

### When Working with Other AI Agents:

- Follow established patterns in the codebase
- Don't override previous work without discussion
- Document significant decisions in comments
- Run checks before completing tasks

### When Working with Human Developers:

- Explain your decisions clearly
- Highlight potential implications of changes
- Suggest alternatives when appropriate
- Ask for feedback on complex changes

---

## ✅ Pre-Commit Checklist

Before completing any task:

- [ ] Code compiles without TypeScript errors
- [ ] ESLint passes
- [ ] Security requirements met (auth, validation, sanitization)
- [ ] Performance optimized (Server Components, queries, etc.)
- [ ] Accessibility standards followed
- [ ] Tests written (if applicable)
- [ ] Documentation updated
- [ ] No console errors in development

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-18  
**Maintained By**: NNBlogs Development Team
