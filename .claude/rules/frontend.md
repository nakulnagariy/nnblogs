# Frontend Rules

## React 19 & Next.js 14+ Patterns

### Component Structure

All components should follow this pattern:

```typescript
// Define props interface
interface ComponentProps {
  required: string;
  optional?: number;
  children?: React.ReactNode;
}

// Functional component with TypeScript
export function ComponentName({ required, optional, children }: ComponentProps) {
  // Implementation
  return <div>{children}</div>;
}
```

### ✅ DO: Follow React 19 conventions

- **No React import needed** for JSX (automatic runtime)
- **Use functional components** exclusively
- **Define prop interfaces** for all components
- **Use TypeScript** for all component files

```typescript
// ✅ GOOD: React 19 style
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### ❌ DON'T: Use legacy patterns

```typescript
// ❌ BAD: No need to import React for JSX
import React from "react"; // Unnecessary in React 19

// ❌ BAD: Class components
class MyComponent extends React.Component {}

// ❌ BAD: PropTypes (use TypeScript instead)
MyComponent.propTypes = {};
```

## Server vs Client Components

### Server Component (Default)

```typescript
// No 'use client' directive = Server Component
export default async function BlogPage() {
  // Can do async data fetching directly
  const posts = await getPosts();

  return (
    <div>
      {posts.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Client Component

```typescript
'use client';

import { useState } from 'react';

export function InteractiveForm() {
  const [value, setValue] = useState('');

  return (
    <form>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
    </form>
  );
}
```

### ✅ DO: Choose wisely

- **Server Components**: Static content, data fetching, SEO
- **Client Components**: Interactivity, hooks, browser APIs, event handlers
- **Hybrid**: Server Component wrapping Client Components for data

```typescript
// ✅ GOOD: Server Component with Client child
export default async function Page() {
  const data = await fetchData(); // Server-side

  return (
    <div>
      <h1>Static Header</h1>
      <InteractiveWidget data={data} /> {/* Client Component */}
    </div>
  );
}
```

### ❌ DON'T: Misuse component boundaries

```typescript
// ❌ BAD: Client Component fetching when Server could do it
'use client';
export default function Page() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);

  return <div>{/* ... */}</div>;
}
```

## UI Component Patterns

### shadcn/ui Style Components

Follow the established UI component pattern:

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  // Additional props
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };
```

### ✅ DO: Follow UI patterns

- **Use `cn()` utility** for className merging
- **Use `React.forwardRef`** for ref passing
- **Set `displayName`** for debugging
- **Extend HTML props** with `React.HTMLAttributes`
- **Export all subcomponents** together
- **Keep components composable** (Card, CardHeader, CardContent, etc.)

### ❌ DON'T: Break composition patterns

```typescript
// ❌ BAD: Monolithic component
export function Card({ title, description, footer, actions }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      {footer}
      {actions}
    </div>
  );
}

// ✅ GOOD: Composable components
export function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Description</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  );
}
```

## Styling with Tailwind CSS

### ✅ DO: Use Tailwind effectively

```typescript
// ✅ GOOD: Responsive, semantic classes
<div className="flex flex-col gap-4 md:flex-row md:gap-6">
  <article className="rounded-lg border border-border bg-card p-6 shadow-sm">
    <h2 className="text-2xl font-bold text-foreground">Title</h2>
    <p className="mt-2 text-muted-foreground">Description</p>
  </article>
</div>

// ✅ GOOD: Using cn() for conditional classes
<button
  className={cn(
    "rounded-md px-4 py-2 font-medium",
    isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
    className
  )}
>
  Button
</button>
```

### ❌ DON'T: Misuse Tailwind

```typescript
// ❌ BAD: Inline styles instead of Tailwind
<div style={{ display: 'flex', padding: '16px' }}>

// ❌ BAD: Arbitrary values without reason
<div className="p-[13px] text-[17.5px]"> {/* Use standard spacing */}

// ❌ BAD: Not using design tokens
<div className="bg-[#3b82f6]"> {/* Use bg-primary or bg-blue-500 */}
```

## State Management

### Local State

```typescript
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Complex State

```typescript
'use client';

import { useReducer } from 'react';

type State = { count: number; step: number };
type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'setStep'; step: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.step };
    default:
      return state;
  }
}

export function AdvancedCounter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
```

### Server State (React Query)

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

export function PostsList() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {posts?.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

## Forms & Validation

### React Hook Form Pattern

```typescript
'use client';

import { useForm } from 'react-hook-form';

interface FormData {
  title: string;
  content: string;
  published: boolean;
}

export function BlogPostForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // Handle submission
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    // ...
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title', { required: 'Title is required' })} />
      {errors.title && <span>{errors.title.message}</span>}

      <textarea {...register('content', { required: 'Content is required' })} />
      {errors.content && <span>{errors.content.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

## Animations with Framer Motion

### ✅ DO: Use motion components

```typescript
'use client';

import { motion } from 'framer-motion';

export function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border bg-card p-6"
    >
      Content
    </motion.div>
  );
}
```

### ❌ DON'T: Overuse animations

- Don't animate everything (performance)
- Don't use long durations (usually < 300ms)
- Don't block user interaction with animations

## Accessibility

### ✅ DO: Build accessible components

```typescript
// ✅ GOOD: Semantic HTML, ARIA labels
<button
  type="button"
  aria-label="Close dialog"
  onClick={onClose}
>
  <X className="h-4 w-4" />
</button>

// ✅ GOOD: Form labels
<label htmlFor="email">
  Email
  <input id="email" type="email" />
</label>

// ✅ GOOD: Focus management
<dialog ref={dialogRef} aria-labelledby="dialog-title">
  <h2 id="dialog-title">Title</h2>
  {/* ... */}
</dialog>
```

### ❌ DON'T: Ignore accessibility

```typescript
// ❌ BAD: div as button
<div onClick={handleClick}>Click me</div>

// ❌ BAD: No alt text
<img src="photo.jpg" />

// ❌ BAD: Missing labels
<input type="text" placeholder="Name" />
```

## Component Naming & Organization

### ✅ DO: Use clear names

- **PascalCase** for components: `BlogCard`, `UserProfile`
- **Descriptive names**: What it does, not how
- **Single Responsibility**: One component, one purpose
- **Co-locate**: Keep related files together

```
components/
├── blog/
│   ├── BlogCard.tsx
│   ├── BlogList.tsx
│   ├── BlogPostContent.tsx
│   └── index.ts          # Export aggregation
```

## Strict Rules

1. **No `any` types** - use proper TypeScript types
2. **Use `cn()` for className merging** - never concat strings manually
3. **Client Components must have `'use client'`** - mark directives clearly
4. **Set `displayName` on forwardRef components** - for debugging
5. **Always handle loading and error states** - no blank screens
6. **Prefer Server Components** - only use Client when necessary
7. **Use semantic HTML** - `<button>` not `<div onClick>`
8. **Validate forms** - never trust user input
9. **Keep components small** - split large components
10. **Write accessible markup** - ARIA labels, semantic elements
