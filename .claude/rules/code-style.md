# Code Style Rules

## TypeScript Configuration

### Strict Mode Enabled

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
  },
}
```

### ✅ DO: Follow TypeScript best practices

```typescript
// ✅ GOOD: Explicit types for function parameters and returns
export function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0);
}

// ✅ GOOD: Interface for object shapes
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string; // Optional property
}

// ✅ GOOD: Union types for limited options
type Status = "pending" | "approved" | "rejected";

// ✅ GOOD: Generic types for reusable functions
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

// ✅ GOOD: Type guards
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

### ❌ DON'T: Use bad practices

```typescript
// ❌ BAD: Using `any`
function process(data: any) {} // Avoid any

// ❌ BAD: Non-null assertion without justification
const value = getValue()!; // Dangerous if getValue() can return null

// ❌ BAD: Type assertion without reason
const user = data as User; // Ensure type safety

// ❌ BAD: Unused variables
function calculate(a: number, b: number) {
  return a; // b is unused
}
```

## Naming Conventions

### Components

```typescript
// ✅ GOOD: PascalCase for components
export function BlogCard() {}
export function UserProfile() {}
export function SearchResultsList() {}
```

### Hooks

```typescript
// ✅ GOOD: camelCase with 'use' prefix
export function usePosts() {}
export function useAuth() {}
export function useLocalStorage() {}
```

### Utilities

```typescript
// ✅ GOOD: camelCase for functions
export function formatDate() {}
export function slugify() {}
export function calculateReadingTime() {}
```

### Constants

```typescript
// ✅ GOOD: UPPER_SNAKE_CASE for true constants
export const API_BASE_URL = "https://api.example.com";
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ✅ GOOD: camelCase for configuration objects
export const queryConfig = {
  staleTime: 60000,
  cacheTime: 300000,
};
```

### Files

```typescript
// Components: PascalCase
BlogCard.tsx;
UserProfile.tsx;
SearchBar.tsx;

// Hooks: camelCase with 'use' prefix
usePosts.ts;
useAuth.ts;
useDebounce.ts;

// Utilities: camelCase
utils.ts;
markdown.ts;
validation.ts;

// Types: camelCase with .types suffix (optional)
index.ts;
types.ts;
database.types.ts;

// Tests: match source file with .test suffix
BlogCard.test.tsx;
utils.test.ts;
```

## Import Organization

### ✅ DO: Organize imports

```typescript
// 1. External dependencies (React, Next.js, libraries)
import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

// 2. Internal absolute imports (@ alias)
import { Button } from "@/components/ui/Button";
import { usePosts } from "@/hooks/usePosts";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

// 3. Relative imports
import { PostCard } from "./PostCard";
import styles from "./Page.module.css";

// 4. Type-only imports at the end
import type { ComponentProps } from "./types";
```

### ❌ DON'T: Mix import styles

```typescript
// ❌ BAD: Inconsistent import organization
import { PostCard } from "./PostCard";
import { useState } from "react";
import type { Post } from "@/types";
import { Button } from "@/components/ui/Button";
```

## Code Formatting

### Use Prettier (if configured)

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

### ✅ DO: Follow formatting conventions

```typescript
// ✅ GOOD: Consistent spacing
function calculate(a: number, b: number): number {
  const result = a + b;
  return result;
}

// ✅ GOOD: Object literal formatting
const config = {
  title: 'My App',
  description: 'A great app',
  version: '1.0.0',
};

// ✅ GOOD: Array formatting (multi-line for readability)
const colors = [
  'red',
  'green',
  'blue',
  'yellow',
];

// ✅ GOOD: JSX formatting
<BlogCard
  post={post}
  showExcerpt={true}
  onLike={handleLike}
/>
```

## Function Structure

### ✅ DO: Keep functions small and focused

```typescript
// ✅ GOOD: Single responsibility
function formatPostDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// ✅ GOOD: Extract complex logic
function isPostPublishable(post: Post): boolean {
  return (
    hasRequiredFields(post) && hasValidContent(post) && hasValidCategory(post)
  );
}
```

### ❌ DON'T: Create monolithic functions

```typescript
// ❌ BAD: Doing too much
function processPost(post: Post) {
  // Validates
  if (!post.title) throw new Error("No title");
  if (!post.content) throw new Error("No content");

  // Transforms
  const slug = post.title.toLowerCase().replace(/\s+/g, "-");
  const excerpt = post.content.substring(0, 200);

  // Saves
  saveToDatabase({ ...post, slug, excerpt });

  // Notifies
  sendNotification(post.author);

  // Returns
  return { success: true };
}

// ✅ GOOD: Split into focused functions
function validatePost(post: Post): void {}
function generateSlug(title: string): string {}
function createExcerpt(content: string): string {}
function savePost(post: Post): Promise<void> {}
function notifyAuthor(authorId: string): Promise<void> {}
```

## Comments & Documentation

### ✅ DO: Write helpful comments

```typescript
// ✅ GOOD: Explain WHY, not WHAT
// Use debounce to avoid excessive API calls during typing
const debouncedSearch = useDebounce(searchTerm, 300);

// ✅ GOOD: Document complex logic
/**
 * Calculates pagination range for "load more" functionality.
 * Returns the start and end indices for the next page of results.
 *
 * @param currentPage - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Tuple of [fromIndex, toIndex] for Supabase .range()
 */
function getPaginationRange(
  currentPage: number,
  pageSize: number,
): [number, number] {
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;
  return [from, to];
}

// ✅ GOOD: TODOs with context
// TODO(nakul): Add caching layer after user testing shows performance issues
// TODO: Replace with server action when Next.js 15 is stable
```

### ❌ DON'T: Write obvious comments

```typescript
// ❌ BAD: Stating the obvious
// Set the count to 0
const count = 0;

// ❌ BAD: Commented-out code (remove it)
// const oldFunction = () => { ... }

// ❌ BAD: Misleading comments
// Fetch user data
const posts = await getPosts(); // Comment doesn't match code
```

## ESLint Rules

### Strict ESLint Configuration

```javascript
// eslint.config.mjs
export default [
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
```

### ✅ DO: Follow ESLint rules

```typescript
// ✅ GOOD: No unused variables
export function formatName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`;
}

// ✅ GOOD: Use const for non-reassigned variables
const API_URL = "https://api.example.com";

// ✅ GOOD: Proper hook dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]); // userId in dependency array
```

## Error Handling

### ✅ DO: Handle errors gracefully

```typescript
// ✅ GOOD: Try-catch for async operations
async function fetchPost(slug: string): Promise<Post> {
  try {
    const post = await getPostBySlug(slug);
    return post;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    throw new Error('Post not found');
  }
}

// ✅ GOOD: Error boundaries for React components
class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error caught by boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

// ✅ GOOD: Graceful degradation
function getAuthorName(author?: { name: string }): string {
  return author?.name ?? 'Anonymous';
}
```

### ❌ DON'T: Ignore errors

```typescript
// ❌ BAD: Empty catch block
try {
  await saveData();
} catch (error) {
  // Silently failing
}

// ❌ BAD: Swallowing errors
async function getData() {
  try {
    return await fetch("/api/data");
  } catch {
    return null; // No logging or handling
  }
}
```

## Consistent Patterns

### Object Property Shorthand

```typescript
// ✅ GOOD: Use shorthand
const name = "John";
const age = 30;
const user = { name, age };

// ❌ BAD: Redundant
const user = { name: name, age: age };
```

### Template Literals

```typescript
// ✅ GOOD: Template literals for strings with variables
const message = `Hello, ${name}!`;
const url = `/blog/${slug}`;

// ❌ BAD: String concatenation
const message = "Hello, " + name + "!";
```

### Destructuring

```typescript
// ✅ GOOD: Destructure props and objects
function UserCard({ name, email, avatar }: UserProps) {
  return <div>{name}</div>;
}

const { data, error, isLoading } = useQuery({ ... });

// ❌ BAD: Accessing properties repeatedly
function UserCard(props: UserProps) {
  return <div>{props.name} - {props.email}</div>;
}
```

### Optional Chaining & Nullish Coalescing

```typescript
// ✅ GOOD: Safe property access
const userName = user?.profile?.name ?? "Guest";

// ❌ BAD: Nested ternaries
const userName = user ? (user.profile ? user.profile.name : "Guest") : "Guest";
```

## Strict Rules

1. **TypeScript strict mode** - always enabled
2. **No `any` types** - use `unknown` or proper types
3. **No unused variables** - remove or prefix with `_`
4. **PascalCase components** - consistent naming
5. **camelCase functions/hooks** - follow conventions
6. **Organize imports** - external → internal → relative
7. **Handle errors** - try-catch async operations
8. **Comment WHY** - not WHAT
9. **Small functions** - single responsibility
10. **ESLint compliance** - fix all warnings/errors
