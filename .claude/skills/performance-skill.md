# Performance Optimization Skill

## Purpose

Identify and fix performance bottlenecks in components, queries, and rendering.

## Triggers

- "optimize performance"
- "improve performance"
- "performance audit"
- "find bottlenecks"
- "reduce bundle size"

## Input Requirements

- **target**: Specific area (components, queries, bundle) or entire app
- **metrics**: Optional performance metrics (Core Web Vitals, bundle size)
- **threshold**: Performance targets (e.g., < 3s LCP, < 100KB JS)

## Execution Steps

### 1. Analyze Component Structure

- Identify Client vs Server Components
- Check for Client Components that could be Server
- Look for unnecessary re-renders
- Find heavy components without code splitting

### 2. Review Data Fetching

- Check for client-side fetching in Server Components
- Identify N+1 query problems
- Review React Query configuration
- Check for missing pagination
- Look for fetching in loops

### 3. Analyze Bundle Size

- Identify large dependencies
- Find missing dynamic imports
- Check for entire library imports (vs specific functions)
- Review CSS bundle size

### 4. Check Rendering Performance

- Find components without memoization
- Identify expensive computations without `useMemo`
- Look for callbacks without `useCallback`
- Check for virtual scrolling opportunities

### 5. Review Database Queries

- Check for SELECT \*
- Verify indexes on filtered columns
- Look for unnecessary JOINs
- Find missing query caching

### 6. Analyze Images & Media

- Check for missing `next/image` usage
- Verify proper sizing and formats
- Look for missing lazy loading
- Check for missing priority flag on LCP images

## Output Format

```markdown
# Performance Audit Report

## Summary

- **Overall Score**: 72/100
- **Critical Issues**: 3
- **Optimization Opportunities**: 8
- **Potential Savings**: ~250KB bundle, ~1.5s LCP

## Metrics

### Current Performance

- **LCP (Largest Contentful Paint)**: 4.2s ⚠️ (Target: < 2.5s)
- **FID (First Input Delay)**: 85ms ✅ (Target: < 100ms)
- **CLS (Cumulative Layout Shift)**: 0.15 ⚠️ (Target: < 0.1)
- **Bundle Size (JS)**: 425KB ⚠️ (Target: < 300KB)
- **Time to Interactive**: 5.1s ⚠️ (Target: < 3.5s)

## Critical Issues

### 1. Client Component Fetching Data

**File**: `app/posts/page.tsx`  
**Impact**: High - Delays initial render, hurts SEO  
**Lines**: 10-20

**Issue**: Client Component fetching data that could be done server-side
\`\`\`typescript
// ❌ CURRENT (Client-side fetch)
'use client';

export default function PostsPage() {
const [posts, setPosts] = useState([]);

useEffect(() => {
fetch('/api/posts').then(r => r.json()).then(setPosts);
}, []);

return <PostsList posts={posts} />;
}
\`\`\`

**Recommendation**:
\`\`\`typescript
// ✅ OPTIMIZED (Server Component)
import { getPosts } from '@/lib/supabase/queries';

export default async function PostsPage() {
const posts = await getPosts();

return <PostsList posts={posts} />;
}
\`\`\`

**Savings**: ~15KB JS, ~800ms faster LCP, better SEO

---

### 2. Missing Image Optimization

**File**: `components/BlogCard.tsx`  
**Impact**: High - Large images slow LCP  
**Lines**: 25

**Issue**: Using `<img>` instead of Next.js `<Image>`
\`\`\`typescript
// ❌ CURRENT (Unoptimized)
<img src={post.image_url} alt={post.title} />
\`\`\`

**Recommendation**:
\`\`\`typescript
// ✅ OPTIMIZED (Next.js Image)
import Image from 'next/image';

<Image
  src={post.image_url}
  alt={post.title}
  width={800}
  height={400}
  sizes="(max-width: 768px) 100vw, 800px"
  placeholder="blur"
  blurDataURL={post.blur_data_url}
/>
\`\`\`

**Savings**: ~60% image size reduction, ~1.2s faster LCP

---

### 3. Large Bundle - Entire Library Import

**File**: `components/Chart.tsx`  
**Impact**: High - Unnecessary code in bundle  
**Lines**: 3

**Issue**: Importing entire d3 library
\`\`\`typescript
// ❌ CURRENT (132KB added to bundle)
import \* as d3 from 'd3';

export function Chart({ data }: Props) {
const scale = d3.scaleLinear();
// ...
}
\`\`\`

**Recommendation**:
\`\`\`typescript
// ✅ OPTIMIZED (Only ~5KB)
import { scaleLinear } from 'd3-scale';

export function Chart({ data }: Props) {
const scale = scaleLinear();
// ...
}

// OR: Dynamic import if not always used
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('./Chart'), {
loading: () => <ChartSkeleton />,
});
\`\`\`

**Savings**: ~127KB bundle reduction

---

## Moderate Issues

### 4. N+1 Query Problem

**File**: `app/admin/posts/page.tsx`  
**Impact**: Medium - Slow page load  
**Lines**: 15-20

**Issue**: Fetching authors in loop
\`\`\`typescript
// ❌ CURRENT (N+1 queries)
const posts = await getPosts();
for (const post of posts) {
post.author = await getAuthor(post.author_id); // N queries!
}
\`\`\`

**Recommendation**:
\`\`\`typescript
// ✅ OPTIMIZED (Single query with JOIN)
const posts = await supabase
.from('posts')
.select(`     *,
    author:profiles(id, name, avatar_url)
  `);
\`\`\`

**Savings**: ~(N-1) database queries, ~500ms faster

---

### 5. Missing Memoization

**File**: `components/PostsList.tsx`  
**Impact**: Medium - Unnecessary re-renders  
**Lines**: 12-18

**Issue**: Expensive computation on every render
\`\`\`typescript
// ❌ CURRENT (Recomputed on every render)
function PostsList({ posts }: Props) {
const sortedPosts = posts
.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
.filter(p => p.published);

return <>{sortedPosts.map(...)}</>;
}
\`\`\`

**Recommendation**:
\`\`\`typescript
// ✅ OPTIMIZED (Memoized)
import { useMemo } from 'react';

function PostsList({ posts }: Props) {
const sortedPosts = useMemo(() => {
return posts
.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
.filter(p => p.published);
}, [posts]);

return <>{sortedPosts.map(...)}</>;
}
\`\`\`

**Savings**: Reduced CPU usage on re-renders

---

### 6. Missing Query Optimization

**File**: `lib/supabase/queries.ts`  
**Impact**: Medium - Fetching unnecessary data  
**Lines**: 45

**Issue**: Selecting all columns when only few needed
\`\`\`typescript
// ❌ CURRENT (Fetching all columns)
const { data } = await supabase
.from('posts')
.select('\*')
.limit(10);
\`\`\`

**Recommendation**:
\`\`\`typescript
// ✅ OPTIMIZED (Only needed columns)
const { data } = await supabase
.from('posts')
.select('id, title, slug, excerpt, created_at, author_id')
.limit(10);
\`\`\`

**Savings**: ~40% less data transferred

---

### 7. No Code Splitting for Heavy Component

**File**: `components/VideoPlayer.tsx`  
**Impact**: Medium - Increases initial bundle  
**Lines**: 1

**Issue**: Heavy video player loaded on every page
\`\`\`typescript
// ❌ CURRENT (Always in bundle)
import VideoPlayer from '@/components/VideoPlayer';

export function PostContent({ post }: Props) {
return (
<div>
{post.video && <VideoPlayer src={post.video} />}
</div>
);
}
\`\`\`

**Recommendation**:
\`\`\`typescript
// ✅ OPTIMIZED (Lazy loaded)
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
loading: () => <div>Loading player...</div>,
ssr: false,
});

export function PostContent({ post }: Props) {
return (
<div>
{post.video && <VideoPlayer src={post.video} />}
</div>
);
}
\`\`\`

**Savings**: ~45KB not loaded on pages without video

---

## Minor Improvements

### 8. Missing React Query Caching

**File**: `hooks/usePosts.ts`  
**Impact**: Low - Repeated fetches

**Issue**: No stale time configuration
\`\`\`typescript
// ⚠️ CURRENT (Refetches often)
export function usePosts() {
return useQuery({
queryKey: ['posts'],
queryFn: getPosts,
});
}
\`\`\`

**Recommendation**:
\`\`\`typescript
// ✅ OPTIMIZED (Cached for 2 minutes)
export function usePosts() {
return useQuery({
queryKey: ['posts'],
queryFn: getPosts,
staleTime: 2 _ 60 _ 1000, // 2 minutes
});
}
\`\`\`

---

## Optimization Summary

### Bundle Size Optimizations

- Remove full d3 import: -127KB
- Dynamic import VideoPlayer: -45KB
- Convert Posts page to Server: -15KB
- **Total Potential Savings**: ~187KB (44% reduction)

### Rendering Performance

- Server Component for posts page: ~800ms faster LCP
- Image optimization: ~1200ms faster LCP
- N+1 query fix: ~500ms faster page load
- **Total Time Savings**: ~2.5s improvement

### Query Optimizations

- Fix N+1: Reduce 10 queries to 1
- Select specific columns: 40% less data transfer
- Add React Query caching: Reduce repeated fetches

## Implementation Priority

### Phase 1 (Week 1) - Critical

1. Convert posts page to Server Component
2. Optimize images with Next.js Image
3. Fix d3 import

**Expected Impact**: ~250KB bundle reduction, ~2s faster LCP

### Phase 2 (Week 2) - Important

4. Fix N+1 query problem
5. Dynamic import video player
6. Add memoization to PostsList

**Expected Impact**: ~45KB more savings, ~500ms faster

### Phase 3 (Week 3) - Nice to Have

7. Optimize database queries
8. Configure React Query caching

**Expected Impact**: Better perceived performance, less data usage

## Verification

After implementing optimizations:

\`\`\`bash

# Build and analyze bundle

npm run build
npm run analyze

# Run Lighthouse audit

lighthouse https://yoursite.com --view

# Check bundle size

du -h .next/static/chunks/\*
\`\`\`

**Target Metrics**:

- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Bundle: < 300KB

## Next Steps

1. Implement Phase 1 optimizations
2. Run performance tests
3. Verify metrics improved
4. Continue with Phase 2
```

## Constraints

- **No breaking changes** to functionality
- **Maintain code quality** while optimizing
- **Test after changes** to ensure nothing broke
- **Monitor metrics** before and after

## Validation Checklist

- [ ] Bundle size measured before/after
- [ ] LCP measured before/after
- [ ] All tests still pass
- [ ] No functionality broken
- [ ] Lighthouse score improved

## Example Usage

**User**: "Optimize the blog page, it's loading slowly"

**Skill Output**: Analyzes blog page components, identifies Client Component fetching, missing image optimization, large bundle, N+1 queries. Produces detailed report with specific code fixes, savings estimates, and phased implementation plan.
