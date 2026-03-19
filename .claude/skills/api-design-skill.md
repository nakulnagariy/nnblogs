# API Design Skill

## Purpose

Validate API endpoint design for consistency, proper error handling, authentication, and RESTful patterns.

## Triggers

- "review api"
- "validate endpoint"
- "check api design"
- "api audit"
- "validate api routes"

## Input Requirements

- **endpoints**: Specific API route(s) to review or entire `app/api/` directory
- **focus**: Optional focus area (authentication, error handling, response format)

## Execution Steps

### 1. Inventory API Endpoints

- List all route files in `app/api/`
- Identify HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Document route parameters and query strings
- Note authentication requirements

### 2. Validate RESTful Design

Check for proper resource-based structure:

- Collection endpoints: `/api/posts`
- Single resource: `/api/posts/[id]`
- Nested resources: `/api/posts/[id]/comments`
- Actions as methods not routes (POST `/api/posts` not `/api/createPost`)

### 3. Check Request Handling

For each endpoint, verify:

- **Query Parameters**: Properly extracted and validated
- **Request Body**: Parsed and validated
- **Path Parameters**: Correctly accessed
- **Headers**: Authentication headers checked

### 4. Validate Response Format

Check consistency:

- **Success responses**: Proper HTTP status codes
- **Error responses**: Consistent format `{ error: string }`
- **Pagination**: Standard format with `data`, `total`, `page`, `pageSize`
- **Content-Type**: `application/json` for JSON responses

### 5. Review Authentication

- Protected endpoints use `auth()` from Clerk
- 401 for unauthenticated requests
- 403 for unauthorized (authenticated but insufficient permissions)
- User ID from auth, never from request body

### 6. Check Error Handling

- All async code wrapped in try-catch
- Errors logged server-side
- Generic error messages to client
- Appropriate HTTP status codes
- No stack traces exposed

### 7. Validate Input Validation

- Required fields checked
- Data types validated
- Length constraints enforced
- Format validation (email, URL, etc.)
- Sanitization where needed

### 8. Review HTTP Status Codes

- 200: Success (GET, PUT, PATCH)
- 201: Created (POST)
- 204: No Content (DELETE)
- 400: Bad Request (validation errors)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (not authorized)
- 404: Not Found
- 500: Internal Server Error

## Output Format

```markdown
# API Design Review

## Summary

- **Endpoints Reviewed**: X
- **Issues Found**: Y
- **Compliance Score**: 85/100

## Endpoint Inventory

### GET /api/posts

- **Purpose**: Fetch paginated blog posts
- **Authentication**: Optional
- **Query Params**: `page`, `pageSize`, `category`
- **Response**: Paginated format
- **Status**: ✅ Compliant

### POST /api/posts

- **Purpose**: Create new blog post
- **Authentication**: Required
- **Request Body**: `{ title, content, category, tags }`
- **Response**: Created post
- **Status**: ⚠️ Issues found

### DELETE /api/posts/[id]

- **Purpose**: Delete blog post
- **Authentication**: Required (Admin)
- **Path Params**: `id`
- **Response**: 204 No Content
- **Status**: ⚠️ Issues found

## Issues Found

### High Priority

#### 1. Missing Authentication Check

**Endpoint**: `DELETE /api/posts/[id]`  
**File**: `app/api/posts/[id]/route.ts`  
**Lines**: 25-30

**Issue**: No authentication check before deletion
\`\`\`typescript
// ❌ CURRENT (No auth check)
export async function DELETE(request: NextRequest, { params }: Props) {
await deletePost(params.id);
return new NextResponse(null, { status: 204 });
}
\`\`\`

**Recommendation**:
\`\`\`typescript
// ✅ FIXED (With auth check)
export async function DELETE(request: NextRequest, { params }: Props) {
const { userId } = await auth();
if (!userId) {
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// Verify ownership or admin role
const post = await getPostById(params.id);
if (post.author_id !== userId && !isAdmin(userId)) {
return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

await deletePost(params.id);
return new NextResponse(null, { status: 204 });
}
\`\`\`

---

#### 2. Inconsistent Error Format

**Endpoint**: `POST /api/posts`  
**File**: `app/api/posts/route.ts`  
**Lines**: 15-20

**Issue**: Error response format differs from standard
\`\`\`typescript
// ❌ CURRENT (Inconsistent)
catch (error) {
return NextResponse.json(
{ message: 'Failed to create post', details: error.message },
{ status: 500 }
);
}
\`\`\`

**Recommendation**:
\`\`\`typescript
// ✅ FIXED (Consistent format)
catch (error) {
console.error('Error creating post:', error);
return NextResponse.json(
{ error: 'Failed to create post' },
{ status: 500 }
);
}
\`\`\`

---

### Medium Priority

#### 3. Missing Input Validation

**Endpoint**: `POST /api/posts`  
**File**: `app/api/posts/route.ts`  
**Lines**: 10-12

**Issue**: No validation of required fields
\`\`\`typescript
// ❌ CURRENT (No validation)
const body = await request.json();
const post = await createPost(body);
\`\`\`

**Recommendation**:
\`\`\`typescript
// ✅ FIXED (With validation)
const body = await request.json();

// Validate required fields
if (!body.title || typeof body.title !== 'string') {
return NextResponse.json(
{ error: 'Title is required and must be a string' },
{ status: 400 }
);
}

if (!body.content || typeof body.content !== 'string') {
return NextResponse.json(
{ error: 'Content is required and must be a string' },
{ status: 400 }
);
}

// Validate constraints
if (body.title.length < 3 || body.title.length > 200) {
return NextResponse.json(
{ error: 'Title must be between 3 and 200 characters' },
{ status: 400 }
);
}

const post = await createPost(body);
\`\`\`

---

#### 4. No Pagination Limit

**Endpoint**: `GET /api/posts`  
**File**: `app/api/posts/route.ts`  
**Lines**: 8

**Issue**: No maximum limit on page size
\`\`\`typescript
// ❌ CURRENT (Unbounded)
const pageSize = parseInt(searchParams.get('pageSize') || '10');
\`\`\`

**Recommendation**:
\`\`\`typescript
// ✅ FIXED (With maximum)
const pageSize = Math.min(
100,
Math.max(1, parseInt(searchParams.get('pageSize') || '10'))
);
\`\`\`

---

### Low Priority

#### 5. Missing CORS Headers

**Endpoint**: All endpoints  
**Issue**: No OPTIONS handler for CORS preflight

**Recommendation**: Add OPTIONS handler if API will be accessed from external domains
\`\`\`typescript
export async function OPTIONS(request: NextRequest) {
return new NextResponse(null, {
status: 204,
headers: {
'Access-Control-Allow-Origin': '\*',
'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
'Access-Control-Allow-Headers': 'Content-Type, Authorization',
},
});
}
\`\`\`

## Compliance Checklist

### RESTful Design

- ✅ Resource-based routes
- ✅ Proper HTTP methods
- ✅ Collection vs single resource structure
- ⚠️ Some action-based routes (consider refactoring)

### Request Handling

- ✅ Query parameters extracted properly
- ⚠️ Input validation missing in some endpoints
- ✅ Path parameters accessed correctly

### Response Format

- ⚠️ Error format inconsistent
- ✅ Success responses use proper status codes
- ✅ Pagination format standardized

### Authentication

- ⚠️ Missing auth checks on sensitive endpoints
- ✅ Proper use of Clerk auth where implemented
- ⚠️ No role-based access control

### Error Handling

- ⚠️ Not all async code has try-catch
- ⚠️ Some error responses expose internal details
- ✅ Server-side error logging present

### Status Codes

- ✅ Proper use of 200, 201
- ⚠️ Using 200 instead of 204 for DELETE
- ✅ Proper 400, 401, 500 usage

## Recommendations

### Immediate Actions (High Priority)

1. Add authentication to DELETE /api/posts/[id]
2. Standardize error response format across all endpoints
3. Add input validation to POST/PUT endpoints

### Future Improvements (Medium Priority)

1. Add pagination limits (max 100 items)
2. Implement role-based access control
3. Add comprehensive input validation helper
4. Create standard error response utility

### Best Practices (Low Priority)

1. Add OPTIONS handler for CORS if needed
2. Document all endpoints in README or separate API docs
3. Consider rate limiting for public endpoints
4. Add request logging middleware

## Security Audit

### ✅ Good Practices

- Using Clerk for authentication
- Not exposing full error details to client
- Using environment variables for secrets

### ⚠️ Concerns

- Missing auth on delete endpoint (HIGH RISK)
- No input validation (MEDIUM RISK)
- No rate limiting (LOW RISK)

## Next Steps

1. Fix high-priority issues first
2. Run tests after changes
3. Update API documentation
4. Re-run API design review
```

## Constraints

- **No breaking changes** to existing client code
- **Backward compatibility** for public APIs
- **Document changes** if API contracts change
- **Add tests** for new validation logic

## Validation Checklist

- [ ] All endpoints use consistent error format
- [ ] Protected endpoints check authentication
- [ ] Input validation on all write operations
- [ ] Proper HTTP status codes
- [ ] Pagination limits enforced
- [ ] No sensitive data exposed in errors
- [ ] RESTful resource naming

## Example Usage

**User**: "Review the posts API endpoints"

**Skill Output**: Analyzes all routes in `app/api/posts/`, checks authentication, validates response formats, identifies missing input validation, produces structured report with specific code fixes and prioritized recommendations.
