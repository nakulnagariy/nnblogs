# Security Rules

## Authentication & Authorization

### Clerk Authentication

```typescript
// ✅ GOOD: Protect routes with Clerk
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  // Continue with authenticated user
}

// ✅ GOOD: Protect admin routes
export async function DELETE(request: NextRequest) {
  const { userId } = await auth.protect();

  // Check admin role
  const user = await getUserById(userId);
  if (user.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 },
    );
  }

  // Continue with admin action
}
```

### ❌ DON'T: Skip authentication

```typescript
// ❌ BAD: No auth check on sensitive endpoint
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await deletePost(id); // Anyone can delete!
  return NextResponse.json({ success: true });
}

// ❌ BAD: Trust client-sent user IDs
export async function POST(request: NextRequest) {
  const { userId, content } = await request.json();
  // Attacker can impersonate any user!
  await createPost({ userId, content });
}
```

## Input Validation & Sanitization

### ✅ DO: Validate all input

```typescript
// Server-side validation
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Validate required fields
  if (!body.title || typeof body.title !== "string") {
    return NextResponse.json(
      { error: "Title is required and must be a string" },
      { status: 400 },
    );
  }

  // Validate length constraints
  if (body.title.length < 3 || body.title.length > 200) {
    return NextResponse.json(
      { error: "Title must be between 3 and 200 characters" },
      { status: 400 },
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (body.email && !emailRegex.test(body.email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 },
    );
  }

  // Sanitize content (especially for markdown)
  const sanitizedTitle = body.title.trim();

  // Continue with validated data
}
```

### Sanitize HTML/Markdown

```typescript
// ✅ GOOD: Sanitize user-generated HTML
import DOMPurify from "isomorphic-dompurify";

function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "a", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

// ✅ GOOD: Configure marked.js securely
import { marked } from "marked";

marked.setOptions({
  sanitize: false, // We handle sanitization separately
  gfm: true,
  breaks: true,
});

// Apply DOMPurify after marked rendering
const html = marked(markdown);
const clean = DOMPurify.sanitize(html);
```

### ❌ DON'T: Trust user input

```typescript
// ❌ BAD: No validation
export async function POST(request: NextRequest) {
  const body = await request.json();
  await createPost(body); // Dangerous!
}

// ❌ BAD: Rendering unsanitized HTML
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ❌ BAD: Eval or Function constructor
eval(userCode); // Never do this!
new Function(userCode)(); // Never do this!
```

## Environment Variables & Secrets

### ✅ DO: Protect sensitive data

```typescript
// ✅ GOOD: Server-side only secrets
// .env.local
SUPABASE_SERVICE_ROLE_KEY = your_secret_key; // Server only
OPENAI_API_KEY = your_api_key; // Server only
GITHUB_TOKEN = your_token; // Server only

// Public variables (safe for client)
NEXT_PUBLIC_SUPABASE_URL = your_url;
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = your_key;

// ✅ GOOD: Access server secrets only in server code
// app/api/admin/route.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Server-side only
);

// ✅ GOOD: Validate all environment variables
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}
```

### ❌ DON'T: Expose secrets

```typescript
// ❌ BAD: Exposing secret to client
"use client";

const apiKey = process.env.OPENAI_API_KEY; // Will be undefined or bundled!

// ❌ BAD: Hardcoded secrets
const API_KEY = "sk_live_abc123..."; // Never hardcode!

// ❌ BAD: Logging secrets
console.log("API Key:", process.env.OPENAI_API_KEY);
```

## SQL Injection Prevention

### ✅ DO: Use parameterized queries

```typescript
// ✅ GOOD: Supabase uses parameterized queries automatically
const { data, error } = await supabase
  .from("posts")
  .select("*")
  .eq("slug", userInputSlug) // Safe: parameterized
  .single();

// ✅ GOOD: Using RPC with parameters
await supabase.rpc("search_posts", {
  search_term: userInput, // Safe: parameterized
});
```

### ❌ DON'T: Concatenate SQL

```typescript
// ❌ BAD: String concatenation (if you were using raw SQL)
const query = `SELECT * FROM posts WHERE title = '${userInput}'`; // SQL injection!

// ❌ BAD: Dynamic query building without sanitization
const query = `SELECT * FROM posts WHERE ${userColumn} = '${userValue}'`;
```

## XSS (Cross-Site Scripting) Prevention

### ✅ DO: Escape output

```typescript
// ✅ GOOD: React automatically escapes text
<p>{userInput}</p> // Safe: React escapes

// ✅ GOOD: Use libraries for markdown rendering
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

const html = marked(markdown);
const clean = DOMPurify.sanitize(html);

<div dangerouslySetInnerHTML={{ __html: clean }} />

// ✅ GOOD: Sanitize attributes
<a
  href={sanitizeUrl(userUrl)}
  target="_blank"
  rel="noopener noreferrer"
>
  Link
</a>
```

### ❌ DON'T: Inject raw HTML

```typescript
// ❌ BAD: Unsanitized dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ❌ BAD: Setting innerHTML
element.innerHTML = userInput;

// ❌ BAD: Unsafe URL construction
<a href={userInput}>Click</a> // Can be javascript:alert(1)
```

## CSRF Protection

### ✅ DO: Leverage Next.js built-in protection

```typescript
// ✅ GOOD: Next.js API routes have CSRF protection by default

// ✅ GOOD: Verify origin for sensitive operations
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  // Verify origin matches host for sensitive operations
  if (origin && !origin.includes(host || "")) {
    return NextResponse.json(
      { error: "Invalid request origin" },
      { status: 403 },
    );
  }

  // Continue with operation
}

// ✅ GOOD: Use SameSite cookies (Clerk handles this)
```

## Rate Limiting

### ✅ DO: Implement rate limiting

```typescript
// ✅ GOOD: Rate limit sensitive endpoints
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
});

export async function POST(request: NextRequest) {
  const ip = request.ip || "anonymous";
  const { success, limit, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Continue with request
}

// ✅ GOOD: Different limits for different endpoints
// Public: 100/hour
// Authenticated: 1000/hour
// Admin: unlimited
```

## Data Access Control

### ✅ DO: Use Row Level Security

```sql
-- ✅ GOOD: RLS policies in Supabase
-- Users can only read published posts
CREATE POLICY "Published posts are viewable"
ON posts FOR SELECT
USING (published = true);

-- Users can only update their own posts
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = author_id);

-- Only admins can delete
CREATE POLICY "Admins can delete"
ON posts FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Verify ownership in API routes

```typescript
// ✅ GOOD: Verify resource ownership
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify user owns this resource
  const post = await getPostById(params.id);
  if (post.author_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Continue with update
}
```

## File Upload Security

### ✅ DO: Validate file uploads

```typescript
// ✅ GOOD: Validate file type and size
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  // Sanitize filename
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

  // Upload to secure storage (Supabase Storage with RLS)
  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(`${userId}/${sanitizedName}`, file);

  if (error) throw error;
  return NextResponse.json({ path: data.path });
}
```

## Secure Headers

### ✅ DO: Set security headers

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
```

## Dependency Security

### ✅ DO: Keep dependencies updated

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies regularly
npm update

# Use specific versions (not ^)
# package.json
{
  "dependencies": {
    "next": "16.1.1", // Not "^16.1.1"
  }
}
```

## Strict Rules

1. **Always authenticate** - protect sensitive endpoints
2. **Validate all input** - never trust client data
3. **Sanitize output** - prevent XSS
4. **Use environment variables** - for all secrets
5. **Never expose secrets** - to client-side code
6. **Use parameterized queries** - prevent SQL injection
7. **Implement RLS** - in Supabase for data access control
8. **Verify ownership** - before allowing updates/deletes
9. **Rate limit** - sensitive endpoints
10. **Set security headers** - in Next.js config
11. **Validate file uploads** - type, size, content
12. **Keep dependencies updated** - run npm audit regularly
