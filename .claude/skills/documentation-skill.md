# Documentation Skill

## Purpose

Generate and update documentation including JSDoc comments, README sections, API docs, and architecture documentation.

## Triggers

- "document code"
- "add documentation"
- "update docs"
- "generate jsdoc"
- "create api docs"

## Input Requirements

- **target**: Specific files/functions or entire codebase
- **type**: JSDoc, README, API docs, architecture docs
- **update_existing**: Whether to update existing docs or create new

## Execution Steps

### 1. Analyze Target Code

- Read target file(s) completely
- Identify:
  - Public functions and their signatures
  - Components and their props
  - API endpoints and parameters
  - Configuration options
  - Exported types and interfaces

### 2. Determine Documentation Needs

**For Functions**:

- Purpose and behavior
- Parameters and types
- Return value
- Exceptions thrown
- Usage examples
- Edge cases

**For Components**:

- Purpose and usage
- Props documentation
- Event handlers
- Composition patterns
- Accessibility notes

**For API Endpoints**:

- Purpose
- HTTP method
- Parameters (query, path, body)
- Response format
- Error responses
- Authentication requirements

### 3. Generate JSDoc Comments

- Use proper JSDoc syntax
- Document parameters with `@param`
- Document return with `@returns`
- Add examples with `@example`
- Note exceptions with `@throws`
- Link related items with `@see`

### 4. Update README

- Project description
- Installation instructions
- Usage examples
- Configuration
- API reference (or link to it)
- Contributing guidelines

### 5. Create API Documentation

- List all endpoints
- Document request/response formats
- Include authentication requirements
- Provide curl examples
- Document error codes

### 6. Generate Architecture Docs

- System overview
- Component diagrams
- Data flow
- Key decisions
- Tech stack

## Output Format

```markdown
# Documentation Report

## Summary

- **Files Documented**: 5
- **Functions**: 12
- **Components**: 3
- **API Endpoints**: 4
- **Documentation Coverage**: 85%

## JSDoc Comments Added

### File: `lib/utils.ts`

#### Function: `slugify`

**Before** (No documentation):
\`\`\`typescript
export function slugify(title: string): string {
return title
.toLowerCase()
.trim()
.replace(/[^\w\s-]/g, '')
.replace(/[\s_-]+/g, '-')
.replace(/^-+|-+$/g, '');
}
\`\`\`

**After** (With JSDoc):
\`\`\`typescript
/\*\*

- Converts a string into a URL-safe slug.
-
- Transforms the input by converting to lowercase, removing special
- characters, replacing spaces with hyphens, and trimming excess hyphens.
-
- @param title - The string to convert into a slug
- @returns A URL-safe slug string
-
- @example
- \`\`\`typescript
- slugify('Hello World!');
- // Returns: 'hello-world'
-
- slugify('React & Next.js Guide');
- // Returns: 'react-nextjs-guide'
-
- slugify(' Multiple Spaces ');
- // Returns: 'multiple-spaces'
- \`\`\`
-
- @see {@link getPostBySlug} for slug usage in database queries
  \*/
  export function slugify(title: string): string {
  return title
  .toLowerCase()
  .trim()
  .replace(/[^\w\s-]/g, '')
  .replace(/[\s_-]+/g, '-')
  .replace(/^-+|-+$/g, '');
  }
  \`\`\`

---

#### Function: `formatDate`

\`\`\`typescript
/\*\*

- Formats a date for display in blog posts and cards.
-
- @param date - The date to format (Date object or ISO string)
- @returns Formatted date string in "MMM DD, YYYY" format
-
- @example
- \`\`\`typescript
- formatDate(new Date('2026-02-18'));
- // Returns: 'Feb 18, 2026'
-
- formatDate('2026-02-18T10:00:00Z');
- // Returns: 'Feb 18, 2026'
- \`\`\`
  \*/
  export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  });
  }
  \`\`\`

---

### File: `lib/supabase/queries.ts`

#### Function: `getPosts`

\`\`\`typescript
/\*\*

- Fetches a paginated list of published blog posts.
-
- Results are ordered by creation date (newest first) and filtered
- to only include published posts. Optional category filtering is supported.
-
- @param page - Page number (1-indexed), defaults to 1
- @param pageSize - Number of posts per page, defaults to 10
- @param category - Optional category slug to filter by
- @returns Promise resolving to paginated response with posts and metadata
- @throws {Error} When database query fails
-
- @example
- \`\`\`typescript
- // Get first page with default page size
- const result = await getPosts(1);
- console.log(result.data); // Array of 10 posts
-
- // Get second page with custom page size
- const result = await getPosts(2, 20);
- console.log(result.totalPages); // Total number of pages
-
- // Filter by category
- const techPosts = await getPosts(1, 10, 'tech');
- \`\`\`
-
- @see {@link PaginatedResponse} for response structure
- @see {@link Post} for post data structure
  \*/
  export async function getPosts(
  page: number = 1,
  pageSize: number = 10,
  category?: string
  ): Promise<PaginatedResponse<Post>> {
  // Implementation...
  }
  \`\`\`

---

## Component Documentation

### File: `components/BlogCard.tsx`

\`\`\`typescript
/\*\*

- Blog card component displaying a post preview.
-
- Renders a card with post title, excerpt, metadata (date, category, views),
- and a link to the full post. Supports responsive design and hover effects.
-
- @component
-
- @param props - Component props
- @param props.post - Blog post data to display
- @param props.showExcerpt - Whether to show post excerpt, defaults to true
- @param props.className - Additional CSS classes to apply
-
- @example
- \`\`\`tsx
- <BlogCard post={post} />
-
- // Without excerpt
- <BlogCard post={post} showExcerpt={false} />
-
- // With custom styling
- <BlogCard post={post} className="shadow-xl" />
- \`\`\`
  \*/
  export function BlogCard({
  post,
  showExcerpt = true,
  className,
  }: BlogCardProps) {
  // Implementation...
  }

/\*\*

- Props for the BlogCard component.
  _/
  export interface BlogCardProps {
  /\*\* Blog post data to display _/
  post: Post;

/\*_ Whether to show the post excerpt (default: true) _/
showExcerpt?: boolean;

/\*_ Additional CSS classes for styling _/
className?: string;
}
\`\`\`

---

## API Documentation Generated

### File: `docs/API.md` (NEW)

\`\`\`markdown

# API Documentation

## Posts

### GET /api/posts

Fetches a paginated list of published blog posts.

**Authentication**: None (public endpoint)

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number (1-indexed) |
| `pageSize` | number | No | 10 | Posts per page (max 100) |
| `category` | string | No | - | Filter by category slug |
| `search` | string | No | - | Search in title and content |

**Success Response** (200):
\`\`\`json
{
"data": [
{
"id": "550e8400-e29b-41d4-a716-446655440000",
"title": "Getting Started with Next.js",
"slug": "getting-started-nextjs",
"excerpt": "Learn how to build modern web applications...",
"created_at": "2026-02-18T10:00:00Z",
"category": "tech",
"tags": ["nextjs", "react"],
"views": 1234,
"author_id": "user_123"
}
],
"total": 50,
"page": 1,
"pageSize": 10,
"totalPages": 5
}
\`\`\`

**Error Responses**:

- `500 Internal Server Error`: Database query failed
  \`\`\`json
  { "error": "Failed to fetch posts" }
  \`\`\`

**Example Requests**:
\`\`\`bash

# Get first page

curl https://api.example.com/api/posts

# Get specific page with custom size

curl https://api.example.com/api/posts?page=2&pageSize=20

# Filter by category

curl https://api.example.com/api/posts?category=tech

# Search posts

curl https://api.example.com/api/posts?search=nextjs
\`\`\`

---

### POST /api/posts

Creates a new blog post.

**Authentication**: Required (Bearer token)

**Headers**:
\`\`\`
Authorization: Bearer <token>
Content-Type: application/json
\`\`\`

**Request Body**:
\`\`\`json
{
"title": "My Blog Post",
"content": "Post content in **markdown**",
"category": "tech",
"tags": ["nextjs", "react"],
"published": true,
"image_url": "https://example.com/image.jpg"
}
\`\`\`

**Field Validation**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | Yes | 3-200 characters |
| `content` | string | Yes | Max 100KB |
| `category` | string | Yes | Valid category slug |
| `tags` | string[] | No | Max 10 tags |
| `published` | boolean | No | Defaults to false |
| `image_url` | string | No | Valid URL |

**Success Response** (201):
\`\`\`json
{
"id": "550e8400-e29b-41d4-a716-446655440000",
"title": "My Blog Post",
"slug": "my-blog-post",
"created_at": "2026-02-18T12:00:00Z",
"author_id": "user_123"
}
\`\`\`

**Error Responses**:

- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing or invalid authentication
- `500 Internal Server Error`: Server error

**Example Request**:
\`\`\`bash
curl -X POST https://api.example.com/api/posts \
 -H "Authorization: Bearer your_token" \
 -H "Content-Type: application/json" \
 -d '{
"title": "My Blog Post",
"content": "Post content here...",
"category": "tech",
"published": true
}'
\`\`\`
\`\`\`

---

## README Updates

### Added Section: Project Structure

\`\`\`markdown

## Project Structure

\`\`\`
src/
├── app/ # Next.js App Router
│ ├── (auth)/ # Authentication routes (sign-in, sign-up)
│ ├── admin/ # Protected admin dashboard
│ ├── api/ # API route handlers
│ ├── blog/ # Blog pages
│ └── layout.tsx # Root layout
├── components/ # React components
│ ├── ui/ # Reusable UI primitives (Button, Card, etc.)
│ ├── blog/ # Blog-specific components
│ ├── layout/ # Layout components (Header, Footer)
│ └── providers/ # Context providers
├── hooks/ # Custom React hooks
│ ├── usePosts.ts # Blog posts data fetching
│ └── useSearch.ts # Search functionality
├── lib/ # Utility libraries
│ ├── supabase/ # Database client and queries
│ ├── utils.ts # Shared utility functions
│ └── markdown.ts # Markdown processing
└── types/ # TypeScript type definitions
\`\`\`
\`\`\`

---

### Added Section: API Reference

\`\`\`markdown

## API Reference

The application provides a RESTful API for managing blog posts, videos, and projects.

### Base URL

\`\`\`
https://api.example.com
\`\`\`

### Authentication

Most endpoints require authentication using Clerk. Include the Bearer token in the Authorization header:

\`\`\`
Authorization: Bearer your_token
\`\`\`

### Endpoints

See [API Documentation](docs/API.md) for complete endpoint reference.

**Posts**:

- `GET /api/posts` - List posts
- `GET /api/posts/[slug]` - Get single post
- `POST /api/posts` - Create post (auth required)
- `PUT /api/posts/[id]` - Update post (auth required)
- `DELETE /api/posts/[id]` - Delete post (auth required)

**Videos**: Similar structure at `/api/videos`
**Projects**: Similar structure at `/api/projects`
\`\`\`

---

## Documentation Coverage

### Before:

- Functions with JSDoc: 15%
- Components with docs: 20%
- API endpoints documented: 0%
- README completeness: 60%

### After:

- Functions with JSDoc: 85%
- Components with docs: 80%
- API endpoints documented: 100%
- README completeness: 90%

## Files Modified/Created

### Modified:

- `lib/utils.ts` - Added JSDoc to 4 functions
- `lib/supabase/queries.ts` - Added JSDoc to 6 functions
- `components/BlogCard.tsx` - Added component documentation
- `README.md` - Added structure and API reference sections

### Created:

- `docs/API.md` - Complete API documentation
- `docs/ARCHITECTURE.md` - System architecture overview

## Next Steps

1. Review generated documentation
2. Add examples where needed
3. Keep docs updated with code changes
4. Consider auto-generating docs from JSDoc
```

## Documentation Standards

### JSDoc Format

\`\`\`typescript
/\*\*

- Brief one-line description.
-
- Longer description explaining behavior, edge cases, etc.
-
- @param paramName - Description of parameter
- @returns Description of return value
- @throws {ErrorType} When this error occurs
-
- @example
- \`\`\`typescript
- functionName(arg);
- // Result
- \`\`\`
-
- @see {@link RelatedFunction} for related functionality
  \*/
  \`\`\`

## Constraints

- **Keep docs up to date** with code changes
- **Write clear examples** that actually work
- **Document public APIs** - not private implementation details
- **Use proper JSDoc syntax** for IDE support

## Validation Checklist

- [ ] All public functions have JSDoc
- [ ] Component props documented
- [ ] API endpoints documented with examples
- [ ] README is comprehensive
- [ ] Examples are tested and working
- [ ] TypeScript types documented

## Example Usage

**User**: "Document the utils.ts file"

**Skill Output**: Analyzes all functions in `utils.ts`, generates comprehensive JSDoc comments with descriptions, parameters, return values, and usage examples. Updates file with proper documentation.
