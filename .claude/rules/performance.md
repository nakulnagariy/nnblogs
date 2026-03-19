# Performance Rules

## React Server Components

### ✅ DO: Default to Server Components

```typescript
// ✅ GOOD: Server Component (default)
export default async function BlogPage() {
  // Direct data fetching, no client JS
  const posts = await getPosts();

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

// ✅ GOOD: Hybrid - Server wrapping Client
export default async function Page() {
  const data = await fetchData(); // Server-side

  return (
    <div>
      <StaticHeader />
      <InteractiveWidget data={data} /> {/* Client Component */}
      <StaticFooter />
    </div>
  );
}
```

### ❌ DON'T: Use Client Components unnecessarily

```typescript
// ❌ BAD: Client Component for static content
'use client';

export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Static content...</p> {/* Should be Server Component */}
    </div>
  );
}

// ❌ BAD: Fetching in Client Component
'use client';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(setPosts);
  }, []); // Should be Server Component with direct data fetch

  return <PostsList posts={posts} />;
}
```

## Code Splitting & Dynamic Imports

### ✅ DO: Split large components

```typescript
// ✅ GOOD: Lazy load heavy components
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  loading: () => <div>Loading player...</div>,
  ssr: false, // Don't render server-side if not needed
});

const ChartComponent = dynamic(() => import('@/components/Chart'), {
  loading: () => <Skeleton />,
});

export function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <ChartComponent data={data} />
    </div>
  );
}

// ✅ GOOD: Conditional imports
async function handleExport() {
  const { exportToCSV } = await import('@/lib/export');
  exportToCSV(data);
}
```

### ❌ DON'T: Bundle everything

```typescript
// ❌ BAD: Importing heavy library at top level
import * as d3 from 'd3'; // 100KB+ library
import Chart from 'some-heavy-chart-library';

// Even if not always used
export function OptionalChart({ show }: { show: boolean }) {
  if (!show) return null;
  return <Chart />; // Library already in bundle
}
```

## Image Optimization

### ✅ DO: Use Next.js Image component

```typescript
import Image from 'next/image';

// ✅ GOOD: Optimized images
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // LCP image
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// ✅ GOOD: Remote images
<Image
  src={post.image_url}
  alt={post.title}
  width={800}
  height={400}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
/>

// ✅ GOOD: Responsive images
<Image
  src="/banner.jpg"
  alt="Banner"
  fill
  style={{ objectFit: 'cover' }}
  sizes="100vw"
/>
```

### ❌ DON'T: Use unoptimized images

```typescript
// ❌ BAD: Regular img tag
<img src="/large-image.jpg" alt="Large" /> // No optimization

// ❌ BAD: Missing dimensions
<Image src="/photo.jpg" alt="Photo" /> // Causes layout shift

// ❌ BAD: Not using priority for LCP
<Image src="/hero.jpg" alt="Hero" width={1200} height={600} />
// Should have priority={true} if it's the main image
```

## React Query Configuration

### ✅ DO: Configure caching properly

```typescript
// ✅ GOOD: QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// ✅ GOOD: Smart query keys for cache invalidation
export function usePosts(page: number, category?: string) {
  return useQuery({
    queryKey: ['posts', { page, category }],
    queryFn: () => getPosts(page, category),
    staleTime: 2 * 60 * 1000, // Fresh for 2 minutes
  });
}

// ✅ GOOD: Prefetch on hover
function PostCard({ post }: { post: Post }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['post', post.slug],
      queryFn: () => getPostBySlug(post.slug),
    });
  };

  return <Link onMouseEnter={handleMouseEnter}>...</Link>;
}
```

## Memoization

### ✅ DO: Memoize expensive computations

```typescript
import { useMemo, useCallback } from 'react';

// ✅ GOOD: Memoize expensive calculations
function PostsList({ posts }: { posts: Post[] }) {
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [posts]);

  const groupedByCategory = useMemo(() => {
    return posts.reduce((acc, post) => {
      const category = post.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(post);
      return acc;
    }, {} as Record<string, Post[]>);
  }, [posts]);

  return <div>{/* ... */}</div>;
}

// ✅ GOOD: Memoize callbacks to prevent re-renders
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Clicked!');
  }, []); // Stable reference

  return <MemoizedChild onClick={handleClick} />;
}
```

### React Compiler Auto-optimization

```typescript
// ✅ GOOD: React Compiler (enabled in this project) auto-optimizes
// No need for manual useMemo/useCallback in many cases
function Component({ data }: Props) {
  // React Compiler automatically memoizes these
  const processed = data.map(item => transform(item));
  const filtered = processed.filter(item => item.valid);

  return <div>{/* ... */}</div>;
}
```

### ❌ DON'T: Over-memoize

```typescript
// ❌ BAD: Memoizing primitive calculations
const sum = useMemo(() => a + b, [a, b]); // Overhead > benefit

// ❌ BAD: Memoizing simple JSX
const element = useMemo(() => <div>Hello</div>, []); // Unnecessary
```

## Bundle Size Optimization

### ✅ DO: Monitor and optimize bundle

```typescript
// ✅ GOOD: Tree-shakeable imports
import { map, filter } from 'lodash-es';

// ✅ GOOD: Named imports
import { Button } from '@/components/ui/Button';

// ✅ GOOD: Analyze bundle
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}

// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

### ❌ DON'T: Import entire libraries

```typescript
// ❌ BAD: Importing entire library
import _ from "lodash"; // Entire library
import * as moment from "moment"; // Large library

// ✅ GOOD: Import specific functions
import map from "lodash/map";
import { formatDistance } from "date-fns"; // Smaller, tree-shakeable
```

## Database Query Optimization

### ✅ DO: Optimize queries

```typescript
// ✅ GOOD: Select only needed columns
const { data } = await supabase
  .from("posts")
  .select("id, title, slug, created_at") // Only what you need
  .limit(10);

// ✅ GOOD: Use indexes
// CREATE INDEX idx_posts_category ON posts(category);
// CREATE INDEX idx_posts_created_at ON posts(created_at);

const { data } = await supabase
  .from("posts")
  .select("*")
  .eq("category", "tech") // Fast with index
  .order("created_at", { ascending: false }) // Fast with index
  .limit(20);

// ✅ GOOD: Pagination with range
const { data } = await supabase
  .from("posts")
  .select("*", { count: "exact" })
  .range(0, 9); // First 10 items

// ✅ GOOD: Use joins instead of N+1 queries
const { data } = await supabase.from("posts").select(`
    *,
    author:profiles(name, avatar),
    comments:comments(count)
  `);
```

### ❌ DON'T: Create N+1 queries

```typescript
// ❌ BAD: N+1 query problem
const posts = await getPosts();
for (const post of posts) {
  const author = await getAuthor(post.author_id); // N additional queries
  const comments = await getComments(post.id); // N more queries
}
```

## Streaming & Suspense

### ✅ DO: Use Suspense boundaries

```typescript
import { Suspense } from 'react';

// ✅ GOOD: Stream content with Suspense
export default function Page() {
  return (
    <div>
      <h1>Page Title</h1>

      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>

      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
    </div>
  );
}

async function Posts() {
  const posts = await getPosts();
  return <PostsList posts={posts} />;
}

async function Sidebar() {
  const data = await getSidebarData();
  return <SidebarContent data={data} />;
}
```

## Font Optimization

### ✅ DO: Use next/font

```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

## Avoid Unnecessary Re-renders

### ✅ DO: Prevent unnecessary renders

```typescript
// ✅ GOOD: Memoize child component
import { memo } from 'react';

const ExpensiveChild = memo(function ExpensiveChild({ data }: Props) {
  // Only re-renders when data changes
  return <div>{/* Expensive rendering */}</div>;
});

// ✅ GOOD: Split state to reduce re-renders
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Name input re-renders only when name changes
  // Email input re-renders only when email changes
  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
    </>
  );
}
```

## Debouncing & Throttling

### ✅ DO: Debounce expensive operations

```typescript
// ✅ GOOD: Debounce search
function SearchBar() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: () => searchPosts(debouncedSearch),
    enabled: debouncedSearch.length > 2,
  });

  return <input value={search} onChange={e => setSearch(e.target.value)} />;
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

## Strict Rules

1. **Server Components by default** - reduce client JS
2. **Use next/image** - for all images
3. **Dynamic import heavy** - code split large components
4. **Optimize queries** - select only needed columns
5. **Use indexes** - for frequently queried columns
6. **Avoid N+1** - use joins for related data
7. **Configure React Query** - appropriate stale times
8. **Debounce user input** - for search and autocomplete
9. **Memoize expensive** - calculations and callbacks
10. **Monitor bundle size** - run analyze regularly
11. **Use Suspense** - stream content progressively
12. **prefetch on hover** - for better perceived performance
