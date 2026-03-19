# API Design Rules

## Next.js App Router API Routes

### Route Handler Structure

All API routes follow this pattern:

```typescript
// app/api/resource/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    // 1. Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // 2. Perform business logic
    const result = await fetchResource(page, limit);

    // 3. Return JSON response
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching resource:", error);
    return NextResponse.json(
      { error: "Failed to fetch resource" },
      { status: 500 },
    );
  }
}
```

### ✅ DO: Follow route structure

```typescript
// app/api/posts/route.ts - Collection endpoint
export async function GET(request: NextRequest) {}
export async function POST(request: NextRequest) {}

// app/api/posts/[id]/route.ts - Single resource endpoint
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {}
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {}
```

### ❌ DON'T: Mix concerns

```typescript
// ❌ BAD: Multiple resources in one file
// app/api/data/route.ts
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  if (type === "posts") {
    /* ... */
  }
  if (type === "videos") {
    /* ... */
  }
}

// ✅ GOOD: Separate routes
// app/api/posts/route.ts
// app/api/videos/route.ts
```

## Request Handling

### Query Parameters

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parse and validate
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("pageSize") || "10")),
  );
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;

  // Use in query
  const result = await getResources({ page, pageSize, category, search });

  return NextResponse.json(result);
}
```

### Request Body

```typescript
export async function POST(request: NextRequest) {
  try {
    // Parse body
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    // Validate types
    if (typeof body.title !== "string" || typeof body.content !== "string") {
      return NextResponse.json(
        { error: "Invalid data types" },
        { status: 400 },
      );
    }

    // Create resource
    const result = await createResource(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
```

### ✅ DO: Validate input

- **Validate required fields** - return 400 for missing data
- **Validate types** - ensure correct data types
- **Sanitize input** - prevent injection attacks
- **Set reasonable limits** - limit pagination size, string lengths
- **Return clear errors** - help clients fix their requests

## Response Formats

### Success Responses

```typescript
// Single resource
{
  "id": "123",
  "title": "Post Title",
  "content": "...",
  "created_at": "2026-02-18T10:00:00Z"
}

// Collection with pagination
{
  "data": [
    { "id": "1", "title": "Post 1" },
    { "id": "2", "title": "Post 2" }
  ],
  "total": 50,
  "page": 1,
  "pageSize": 10,
  "totalPages": 5
}

// Operation result
{
  "success": true,
  "message": "Post created successfully",
  "id": "123"
}
```

### Error Responses

```typescript
// Standard error format
{
  "error": "Human-readable error message"
}

// Detailed error format (optional)
{
  "error": "Validation failed",
  "details": {
    "title": "Title is required",
    "email": "Invalid email format"
  }
}
```

### ✅ DO: Be consistent

```typescript
// ✅ GOOD: Consistent pagination response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ✅ GOOD: Standard error format
function errorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status });
}
```

### ❌ DON'T: Use inconsistent formats

```typescript
// ❌ BAD: Different error formats
// Route 1
return NextResponse.json({ error: "Not found" }, { status: 404 });

// Route 2
return NextResponse.json({ message: "Not found", code: 404 });

// Route 3
throw new Error("Not found");
```

## HTTP Status Codes

Use appropriate status codes:

- **200 OK** - Successful GET, PUT, PATCH
- **201 Created** - Successful POST creating a resource
- **204 No Content** - Successful DELETE
- **400 Bad Request** - Invalid input, validation errors
- **401 Unauthorized** - Missing or invalid authentication
- **403 Forbidden** - Authenticated but not allowed
- **404 Not Found** - Resource doesn't exist
- **500 Internal Server Error** - Server-side errors

```typescript
// ✅ GOOD: Appropriate status codes
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const post = await createPost(body);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await deletePost(params.id);
  return new NextResponse(null, { status: 204 });
}
```

## Authentication & Authorization

### Protect Routes with Clerk

```typescript
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  // Check authentication
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  // Use userId in business logic
  const body = await request.json();
  const result = await createResource({ ...body, userId });

  return NextResponse.json(result, { status: 201 });
}
```

### Admin-only Routes

```typescript
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Protect admin endpoints
  const { userId } = await auth.protect();

  // Additional role check (if needed)
  const user = await getUserById(userId);
  if (user.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 },
    );
  }

  await deleteResource(params.id);
  return new NextResponse(null, { status: 204 });
}
```

## Pagination

### Standard Pagination Pattern

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parse pagination params
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("pageSize") || "10")),
  );

  // Fetch with pagination
  const result = await getResources(page, pageSize);

  // Return standardized format
  return NextResponse.json({
    data: result.data,
    total: result.total,
    page,
    pageSize,
    totalPages: Math.ceil(result.total / pageSize),
  });
}
```

### ✅ DO: Implement pagination

- **Always paginate collections** - don't return unbounded arrays
- **Set reasonable defaults** - e.g., 10 items per page
- **Set maximum limits** - e.g., max 100 items per page
- **Return total count** - for UI pagination controls
- **Include page metadata** - current page, total pages

## Error Handling

### ✅ DO: Handle errors gracefully

```typescript
export async function GET(request: NextRequest) {
  try {
    const result = await fetchData();
    return NextResponse.json(result);
  } catch (error) {
    // Log error details server-side
    console.error("Error in GET /api/resource:", error);

    // Return generic error to client
    return NextResponse.json(
      { error: "Failed to fetch resource" },
      { status: 500 },
    );
  }
}
```

### ❌ DON'T: Expose internal errors

```typescript
// ❌ BAD: Exposing stack traces
catch (error) {
  return NextResponse.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  );
}

// ❌ BAD: Exposing database errors
catch (error) {
  return NextResponse.json(
    { error: `Database error: ${error.code}` },
    { status: 500 }
  );
}
```

## CORS & Headers

### Set appropriate headers

```typescript
export async function GET(request: NextRequest) {
  const data = await fetchData();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}

// For OPTIONS (CORS preflight)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
```

## Strict Rules

1. **Always validate input** - never trust client data
2. **Use proper status codes** - 200, 201, 400, 401, 403, 404, 500
3. **Standardize error format** - `{ error: string }`
4. **Implement pagination** - for all collection endpoints
5. **Protect authenticated routes** - use `auth()` from Clerk
6. **Handle errors gracefully** - try/catch all async operations
7. **Log errors server-side** - but return generic messages to client
8. **Set appropriate headers** - Cache-Control, CORS when needed
9. **Keep routes RESTful** - follow resource-based patterns
10. **Document endpoints** - comment complex logic
