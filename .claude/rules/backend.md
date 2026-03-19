# Backend & Database Rules

## Supabase Database Patterns

### Client Instances

Two separate client instances based on context:

```typescript
// Server-side (Server Components, API Routes, Server Actions)
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );
}
```

```typescript
// Client-side (Client Components)
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

### ✅ DO: Use correct client

- **Server Components**: Use `createClient()` from `@/lib/supabase/server`
- **Client Components**: Use `createClient()` from `@/lib/supabase/client`
- **API Routes**: Use server client
- **Keep service role key secret**: Never expose to client

### ❌ DON'T: Mix clients

```typescript
// ❌ BAD: Using browser client in Server Component
import { createClient } from "@/lib/supabase/client";

export default async function ServerPage() {
  const supabase = createClient(); // Wrong!
  // ...
}

// ❌ BAD: Using server client in Client Component
("use client");
import { createClient } from "@/lib/supabase/server";

export function ClientComponent() {
  const supabase = await createClient(); // Wrong!
  // ...
}
```

## Query Patterns

### Centralize Queries

Keep all database queries in `lib/supabase/queries.ts`:

```typescript
// lib/supabase/queries.ts
import { createClient } from "@/lib/supabase/server";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getPosts(
  page: number = 1,
  pageSize: number = 10,
  category?: string,
): Promise<PaginatedResponse<Post>> {
  const supabase = await createClient();

  // Build query
  let query = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("created_at", { ascending: false });

  // Apply filters
  if (category) {
    query = query.eq("category", category);
  }

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}
```

### ✅ DO: Follow query patterns

- **Use `.select()`** with count for pagination: `.select('*', { count: 'exact' })`
- **Chain filters** conditionally
- **Use `.range()`** for pagination
- **Check for errors** and handle appropriately
- **Return consistent format** with PaginatedResponse type

### Filtering & Ordering

```typescript
// Multiple filters
export async function searchPosts(searchTerm: string, tags?: string[]) {
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .ilike("title", `%${searchTerm}%`); // Case-insensitive search

  if (tags && tags.length > 0) {
    query = query.contains("tags", tags); // Array contains
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}
```

### Joins & Related Data

```typescript
// Fetch with related data
export async function getPostWithAuthor(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles(id, name, avatar_url)
    `,
    )
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}
```

## Insert & Update Operations

### Create Records

```typescript
export async function createPost(
  post: Omit<Post, "id" | "created_at" | "updated_at">,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .insert({
      ...post,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### Update Records

```typescript
export async function updatePost(id: string, updates: Partial<Post>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### Delete Records

```typescript
export async function deletePost(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) throw error;
}
```

## RPC Functions

Use PostgreSQL functions for complex operations:

```typescript
// Increment view count (fire-and-forget)
export async function incrementViews(postId: string) {
  const supabase = await createClient();

  try {
    await supabase.rpc("increment_post_views", { post_id: postId });
  } catch (error) {
    // Silent fail for non-critical operations
    console.error("Failed to increment views:", error);
  }
}

// Get aggregated statistics
export async function getStatistics() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_blog_statistics");

  if (error) throw error;
  return data;
}
```

### ✅ DO: Use RPC for

- Complex aggregations
- Atomic operations (increment counters)
- Operations requiring multiple queries
- Operations that benefit from database-level logic

### ❌ DON'T: Overuse RPC

- Simple CRUD operations (use direct queries)
- Operations better suited for application logic
- When you need strong TypeScript typing

## Error Handling

### Throw vs Silent Fail

```typescript
// ✅ GOOD: Throw for critical operations
export async function getPostBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error; // Critical: page needs this data
  return data;
}

// ✅ GOOD: Silent fail for non-critical operations
export async function trackPageView(pageId: string) {
  try {
    const supabase = await createClient();
    await supabase.rpc("track_view", { page_id: pageId });
  } catch (error) {
    // Non-critical: don't break the page
    console.error("Failed to track view:", error);
  }
}
```

### Error Types

```typescript
// Handle specific error codes
export async function createUniquePost(post: Post) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      throw new Error("A post with this slug already exists");
    }
    throw error;
  }

  return data;
}
```

## Transactions

### Using Supabase Transactions

```typescript
// For operations requiring atomicity, use RPC functions
// Create a PostgreSQL function in Supabase SQL Editor:
/*
CREATE OR REPLACE FUNCTION create_post_with_tags(
  post_data jsonb,
  tag_ids uuid[]
)
RETURNS json AS $$
DECLARE
  new_post_id uuid;
  result json;
BEGIN
  -- Insert post
  INSERT INTO posts (title, content, author_id)
  VALUES (
    post_data->>'title',
    post_data->>'content',
    (post_data->>'author_id')::uuid
  )
  RETURNING id INTO new_post_id;
  
  -- Insert post_tags relationships
  INSERT INTO post_tags (post_id, tag_id)
  SELECT new_post_id, unnest(tag_ids);
  
  -- Return created post
  SELECT json_build_object('id', new_post_id) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
*/

export async function createPostWithTags(
  post: Partial<Post>,
  tagIds: string[],
) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_post_with_tags", {
    post_data: post,
    tag_ids: tagIds,
  });

  if (error) throw error;
  return data;
}
```

## Row Level Security (RLS)

### Understand RLS Policies

Queries run with RLS policies applied automatically:

```sql
-- Example RLS policy in Supabase
CREATE POLICY "Public posts are viewable by everyone"
ON posts FOR SELECT
USING (published = true);

CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
USING (auth.uid() = author_id);
```

### ✅ DO: Leverage RLS

- **Enable RLS** on all tables
- **Write policies** for access control
- **Test policies** in Supabase dashboard
- **Use auth.uid()** for user-specific policies

### ❌ DON'T: Bypass RLS unnecessarily

```typescript
// ❌ BAD: Using service role key to bypass RLS
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Only when absolutely necessary
);

// ✅ GOOD: Let RLS handle permissions
const supabase = await createClient(); // Uses anon key with RLS
```

## TypeScript Types

### Generate Types from Database

```bash
# Generate TypeScript types from Supabase schema
npx supabase gen types typescript --project-id <project-id> > types/database.ts
```

```typescript
// types/index.ts
import { Database } from "./database";

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];
```

### ✅ DO: Use generated types

```typescript
import type { Post, PostInsert } from "@/types";

export async function createPost(post: PostInsert): Promise<Post> {
  // TypeScript knows the exact structure
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

## Performance Optimization

### ✅ DO: Optimize queries

```typescript
// ✅ GOOD: Select only needed columns
const { data } = await supabase
  .from("posts")
  .select("id, title, excerpt, created_at")
  .limit(10);

// ✅ GOOD: Use indexes (create in database)
// CREATE INDEX idx_posts_slug ON posts(slug);
const { data } = await supabase
  .from("posts")
  .select("*")
  .eq("slug", slug) // Fast lookup with index
  .single();

// ✅ GOOD: Limit results
const { data } = await supabase.from("posts").select("*").limit(100); // Prevent fetching thousands of rows
```

### ❌ DON'T: Create N+1 queries

```typescript
// ❌ BAD: N+1 query problem
const posts = await getPosts();
for (const post of posts) {
  const author = await getAuthor(post.author_id); // N additional queries!
}

// ✅ GOOD: Use joins
const posts = await supabase.from("posts").select(`
    *,
    author:profiles(id, name, avatar_url)
  `);
```

## Strict Rules

1. **Use correct client** - server client for server, browser client for client
2. **Centralize queries** - all queries in `lib/supabase/queries.ts`
3. **Handle errors** - always check error responses
4. **Use pagination** - never fetch unbounded data
5. **Leverage RLS** - use Row Level Security for access control
6. **Type everything** - use generated Supabase types
7. **Optimize queries** - select only needed columns, use indexes
8. **Avoid N+1** - use joins for related data
9. **Safe RPC usage** - use for complex operations, silent fail when appropriate
10. **Never expose service role key** - to client code
