# Engineering Principles

This document outlines the engineering principles and best practices that guide NNBlogs development, enforced by the AI-powered development framework.

---

## Core Principles

### 1. Type Safety First

**Principle**: Leverage TypeScript's type system to catch errors at compile time, not runtime.

**Rules:**

- ✅ Use TypeScript strict mode
- ✅ Explicit return types for all functions
- ✅ Interface over type for object shapes
- ✅ Const assertions where appropriate
- ❌ Never use `any` (use `unknown` if necessary)

**Example:**

```typescript
// ✅ GOOD: Explicit types
interface CreatePostInput {
  title: string;
  content: string;
  category: string;
  published: boolean;
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  // Implementation
}

// ❌ BAD: Implicit any
export async function createPost(input) {
  // No type safety
}
```

### 2. Clean Architecture

**Principle**: Separate concerns into distinct layers with clear dependencies.

**Layers:**

1. **UI Layer** - React components, pages, layouts
2. **Service Layer** - Hooks, API routes, business logic
3. **Data Layer** - Database queries, external APIs

**Rules:**

- UI depends on Service
- Service depends on Data
- Data has no dependencies
- No layer skipping

**Example:**

```typescript
// ✅ GOOD: Proper layering
// UI Layer
export default async function BlogPage() {
  const posts = await getPosts(); // From Data Layer
  return <BlogList posts={posts} />;
}

// Data Layer
export async function getPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('posts').select('*');
  return data || [];
}

// ❌ BAD: UI directly accessing database
export default async function BlogPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('posts').select('*'); // Direct DB access
  return <BlogList posts={data} />;
}
```

### 3. Server-First Development

**Principle**: Minimize client-side JavaScript by defaulting to Server Components.

**Decision Tree:**

- **Server Component** if:
  - No interactivity needed
  - Fetching data
  - SEO important
  - No browser APIs used

- **Client Component** if:
  - Using hooks (useState, useEffect)
  - Event handlers
  - Browser APIs (window, localStorage)
  - Third-party client libraries

**Example:**

```typescript
// ✅ Server Component (default)
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  return <MarkdownRenderer content={post.content} />;
}

// ✅ Client Component (interactive)
'use client';
export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>Like</button>;
}
```

### 4. Security by Default

**Principle**: Security is not optional—it's built into every layer.

**Mandatory Security Measures:**

#### Authentication

```typescript
// ✅ GOOD: Verify auth on protected routes
export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Continue...
}
```

#### Input Validation

```typescript
// ✅ GOOD: Validate all inputs
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.title || body.title.length < 3 || body.title.length > 200) {
    return NextResponse.json(
      { error: "Title must be 3-200 characters" },
      { status: 400 },
    );
  }
  // Continue...
}
```

#### HTML Sanitization

```typescript
// ✅ GOOD: Sanitize before rendering
import DOMPurify from 'isomorphic-dompurify';

const html = marked(markdown);
const clean = DOMPurify.sanitize(html);
<div dangerouslySetInnerHTML={{ __html: clean }} />

// ❌ BAD: Unsanitized HTML
<div dangerouslySetInnerHTML={{ __html: marked(markdown) }} />
```

#### Secrets Management

```typescript
// ✅ GOOD: Server-only secrets
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // No NEXT_PUBLIC_

// ✅ GOOD: Client-safe variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// ❌ BAD: Secret in client
const apiKey = "sk-1234567890"; // Hardcoded secret!
```

### 5. Test-Driven Quality

**Principle**: Tests are documentation, safety nets, and design feedback.

**Coverage Targets:**

- **Minimum**: 70% overall coverage
- **Critical paths**: 90%+ coverage (auth, payments, mutations)

**AAA Pattern:**

```typescript
describe("slugify", () => {
  it("converts text to lowercase slug", () => {
    // Arrange
    const text = "Hello World";

    // Act
    const result = slugify(text);

    // Assert
    expect(result).toBe("hello-world");
  });
});
```

**What to Test:**

- ✅ Public functions and utilities
- ✅ React components (behavior, not implementation)
- ✅ API routes (happy path and error cases)
- ✅ Custom hooks
- ✅ Edge cases and error handling

### 6. Performance Optimization

**Principle**: Fast by default through architectural choices, not afterthoughts.

**Optimization Strategies:**

#### Server Components

```typescript
// ✅ Zero client JS for static content
export default async function Page() {
  const data = await fetchData();
  return <StaticContent data={data} />;
}
```

#### Code Splitting

```typescript
// ✅ Dynamic imports for large components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

#### Database Optimization

```typescript
// ✅ Select only needed columns
.select('id, title, excerpt')

// ✅ Use indexes for filtering
.eq('published', true) // 'published' is indexed

// ✅ Paginate large results
.range(from, to)
```

#### React Query Caching

```typescript
const { data } = useQuery({
  queryKey: ["posts", page],
  queryFn: () => fetchPosts(page),
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
});
```

### 7. Accessibility is Non-Negotiable

**Principle**: Build for everyone—accessibility is a requirement, not a feature.

**Standards**: WCAG 2.1 AA compliance

**Checklist:**

- ✅ Semantic HTML elements
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support
- ✅ 4.5:1 text contrast ratio
- ✅ Focus indicators visible
- ✅ Alt text for images
- ✅ Form labels associated with inputs
- ✅ Screen reader testing

**Example:**

```typescript
// ✅ GOOD: Accessible button
<button
  aria-label="Close dialog"
  onClick={handleClose}
  className="focus:ring-2 focus:ring-blue-500"
>
  <X aria-hidden="true" />
</button>

// ❌ BAD: Div as button
<div onClick={handleClose}>
  <X />
</div>
```

### 8. Code is Communication

**Principle**: Code should be self-documenting, but documentation adds context.

**Documentation Standards:**

#### JSDoc for Public APIs

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

#### Component Documentation

```typescript
/**
 * Blog card displaying post preview.
 *
 * @param post - Blog post data
 * @param showExcerpt - Whether to show excerpt (default: true)
 */
export function BlogCard({ post, showExcerpt = true }: BlogCardProps) {
  // Implementation
}
```

### 9. Consistency Over Cleverness

**Principle**: Predictable patterns are more valuable than clever solutions.

**Naming Conventions:**

- **Components**: PascalCase (`BlogCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`usePosts.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`Post`, `User`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_PAGE_SIZE`)

**Import Organization:**

```typescript
// 1. External packages
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 2. Internal modules
import { getPosts } from "@/lib/supabase/queries";

// 3. Relative imports
import { BlogCard } from "./BlogCard";

// 4. Types
import type { Post } from "@/types";
```

**File Structure:**

```
component-name/
├── ComponentName.tsx      # Main component
├── ComponentName.test.tsx # Tests
├── index.ts              # Exports
└── styles.module.css     # Styles (if needed)
```

### 10. Git Workflow and Commits

**Principle**: Commits tell a story—make it easy to follow.

**Conventional Commits:**

```
feat: add video view tracking
fix: resolve markdown XSS vulnerability
docs: update API documentation
refactor: simplify post query logic
test: add BlogCard component tests
chore: update dependencies
perf: optimize image loading
```

**Branch Naming:**

```
feat/video-analytics
fix/markdown-xss
refactor/post-queries
docs/api-reference
```

**Commit Guidelines:**

- ✅ Atomic commits (one logical change per commit)
- ✅ Descriptive commit messages
- ✅ Reference issue numbers when applicable
- ✅ Separate refactoring from feature changes

---

## Development Workflow

### 1. Feature Development

1. **Understand requirements** - Read specs, ask questions
2. **Design approach** - Plan layers, components, types
3. **Write tests first** - Define expected behavior
4. **Implement feature** - Follow established patterns
5. **Refactor** - Improve code quality
6. **Document** - Update docs and JSDoc
7. **Commit** - Use conventional commits

### 2. Bug Fixing

1. **Reproduce bug** - Write failing test
2. **Identify root cause** - Debug systematically
3. **Fix bug** - Minimal change to fix issue
4. **Verify fix** - Test passes, no regressions
5. **Document** - Update docs if needed
6. **Commit** - Reference issue number

### 3. Refactoring

1. **Identify code smell** - What needs improvement?
2. **Ensure tests exist** - Safety net for changes
3. **Refactor incrementally** - Small, safe changes
4. **Verify behavior preserved** - Tests still pass
5. **Document changes** - Update relevant docs
6. **Commit** - Explain refactoring rationale

### 4. Code Review

**As Author:**

- ✅ Self-review before requesting review
- ✅ Provide context in PR description
- ✅ Highlight areas needing attention
- ✅ Respond to feedback promptly

**As Reviewer:**

- ✅ Check for security vulnerabilities
- ✅ Verify tests are included
- ✅ Look for performance issues
- ✅ Ensure accessibility standards met
- ✅ Confirm documentation updated

---

## Error Handling Patterns

### API Routes

```typescript
try {
  const result = await processData(input);
  return NextResponse.json(result);
} catch (error) {
  console.error("Error processing data:", error); // Log details
  return NextResponse.json(
    { error: "Failed to process request" }, // Generic message
    { status: 500 },
  );
}
```

### Client Components

```typescript
function Component() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage />;

  return <Content data={data} />;
}
```

### Error Boundaries

```typescript
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error('Error boundary caught:', error);

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Quality Checklist

Before committing code, verify:

### Functionality

- [ ] Feature works as expected
- [ ] Edge cases handled
- [ ] Error cases handled gracefully

### Security

- [ ] Authentication verified where needed
- [ ] Input validated and sanitized
- [ ] HTML/Markdown sanitized
- [ ] No secrets exposed

### Performance

- [ ] Server Components used where possible
- [ ] Code split appropriately
- [ ] Database queries optimized
- [ ] No unnecessary re-renders

### Accessibility

- [ ] Semantic HTML used
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Contrast ratios sufficient

### Code Quality

- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Tests pass
- [ ] No console errors

### Documentation

- [ ] JSDoc for public functions
- [ ] Component props documented
- [ ] README updated if needed
- [ ] Architecture docs updated if needed

---

## Anti-Patterns to Avoid

### 1. The "Any" Escape Hatch

```typescript
// ❌ BAD
const data: any = await fetchData();

// ✅ GOOD
const data: Post = await fetchData();
```

### 2. Props Drilling

```typescript
// ❌ BAD: Passing props through many levels
<Parent user={user}>
  <Child user={user}>
    <GrandChild user={user}>
      <GreatGrandChild user={user} />

// ✅ GOOD: Use context or composition
<UserProvider value={user}>
  <Parent>
    <Child />
  </Parent>
</UserProvider>
```

### 3. Premature Optimization

```typescript
// ❌ BAD: Complex caching before measuring
const [cache, setCache] = useState(new Map());
// Lots of complex cache logic

// ✅ GOOD: Simple first, optimize if needed
const data = await fetchData();
```

### 4. God Components

```typescript
// ❌ BAD: Component doing too much
export function BlogPage() {
  // 500 lines of logic
  // Multiple responsibilities
}

// ✅ GOOD: Single responsibility
export function BlogPage() {
  return (
    <>
      <BlogHeader />
      <BlogList />
      <BlogPagination />
    </>
  );
}
```

---

## Resources

### Internal Documentation

- [Architecture Overview](./architecture-overview.md)
- [Strategic Plan](./STRATEGIC_PLAN.md)
- [AWS Deployment Guide](./AWS_DEPLOYMENT.md)
- [Linting Guide](./LINTING_GUIDE.md)

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated**: 2026-02-18  
**Version**: 1.0.0  
**Maintained By**: NNBlogs Development Team
