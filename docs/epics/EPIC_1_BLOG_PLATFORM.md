# Epic 1: Blog Platform Complete

**Goal:** Create a fully-featured blog authoring, publishing, and reading system.

**Timeline:** Week 1-2

**Success Criteria:**
- Users can create, edit, delete blog posts
- Posts support markdown with code syntax highlighting
- SEO fields (slug, title, description, OG image) functional
- Draft/published workflow enforced
- Public blog page shows all published posts
- Individual post pages render correctly

---

## User Stories

### US 1.1: Admin - Create Blog Post
**As an** admin user  
**I want to** create a new blog post with rich content  
**So that** I can publish my thoughts and expertise

**Acceptance Criteria:**
- [ ] Form with title, slug, content (editor), category, tags
- [ ] Markdown editor with:
  - [ ] Headings (H1-H6)
  - [ ] Bold, italic, code
  - [ ] Code blocks with syntax highlighting
  - [ ] Links, lists, blockquotes
  - [ ] Image upload (to Supabase Storage)
  - [ ] Live preview
- [ ] SEO fields: meta title, meta description, OG image
- [ ] Auto-generate slug from title
- [ ] Save as draft or publish immediately
- [ ] Success message on save
- [ ] Redirect to post after publish

**Technical Notes:**
- Use `marked` library for markdown parsing
- Use `highlight.js` for code syntax highlighting
- Image upload to `posts-images` Supabase bucket
- Store post thumbnail URL in DB

---

### US 1.2: Admin - Edit Blog Post
**As an** admin user  
**I want to** edit an existing blog post  
**So that** I can fix typos and improve content

**Acceptance Criteria:**
- [ ] Load existing post data into form
- [ ] Edit all fields (title, content, category, tags, published status)
- [ ] Track unsaved changes
- [ ] Show warning if trying to leave with unsaved changes
- [ ] Save button updates post
- [ ] Update timestamp changes

---

### US 1.3: Admin - Delete Blog Post
**As an** admin user  
**I want to** delete a blog post  
**So that** I can remove outdated or irrelevant content

**Acceptance Criteria:**
- [ ] Show delete confirmation dialog
- [ ] Include post title in confirmation
- [ ] Delete from database
- [ ] Delete associated images from Storage
- [ ] Redirect to posts list
- [ ] Show success message

---

### US 1.4: Admin - View/List All Posts
**As an** admin user  
**I want to** see a list of all my blog posts  
**So that** I can manage and organize my content

**Acceptance Criteria:**
- [ ] Table showing: title, status (draft/published), created date, views, actions
- [ ] Sort by: date, views, alphabetical
- [ ] Filter by: published, draft, category
- [ ] Pagination (10 posts per page)
- [ ] Search by title/slug
- [ ] Quick actions: edit, delete, preview, publish/unpublish

---

### US 1.5: Public - View Blog Homepage
**As a** visitor  
**I want to** see recent blog posts  
**So that** I can discover content

**Acceptance Criteria:**
- [ ] List all published posts (paginated)
- [ ] Show: title, excerpt, featured image, date, category, read time
- [ ] Clickable cards link to individual posts
- [ ] Filter by category (optional)
- [ ] Search by title/tags (optional)
- [ ] "Read More" link prominent

---

### US 1.6: Public - Read Blog Post
**As a** visitor  
**I want to** read a full blog post  
**So that** I can learn from the author's expertise

**Acceptance Criteria:**
- [ ] Post renders correctly with:
  - [ ] Title, date, author, read time
  - [ ] Category + tags
  - [ ] Formatted markdown (headings, code blocks, images)
  - [ ] OG metadata (social sharing)
- [ ] Breadcrumb navigation (Blog > Post)
- [ ] "Back to blog" link
- [ ] Next/previous post navigation
- [ ] Social share buttons (optional)
- [ ] Related posts sidebar (optional)
- [ ] Comments section (optional, Phase 2)

---

### US 1.7: SEO - Generate Meta Tags
**As a** visitor  
**I want to** see correct metadata when sharing a post  
**So that** the link preview looks professional

**Acceptance Criteria:**
- [ ] `<title>` = meta_title (or post title)
- [ ] `<meta description>` = meta_description
- [ ] Open Graph: og:title, og:description, og:image
- [ ] Twitter Card metadata
- [ ] Schema.org structured data (BlogPosting)
- [ ] Dynamic generation from post data

---

## Features

### Feature 1.1: Markdown Editor
**Tech Stack:** `marked`, `highlight.js`, textarea + preview panel

**Components:**
- `MarkdownEditor.tsx` - Edit panel
- `MarkdownPreview.tsx` - Live preview
- `CodeBlock.tsx` - With syntax highlighting

**API:** None (client-side parsing)

---

### Feature 1.2: Blog Post CRUD API
**Tech Stack:** Next.js API routes + Supabase

**Endpoints:**
- `POST /api/admin/posts` - Create post
- `GET /api/admin/posts` - List all posts
- `GET /api/admin/posts/[id]` - Get single post
- `PUT /api/admin/posts/[id]` - Update post
- `DELETE /api/admin/posts/[id]` - Delete post

**Protection:** Clerk authentication required

---

### Feature 1.3: Post Queries (Server-side)
**File:** `src/lib/supabase/queries.ts`

**Functions:**
- `getPosts(page, category)` - Public list with pagination
- `getPostBySlug(slug)` - Public single post
- `getFeaturedPosts(limit)` - Top 3 by views
- `getRecentPosts(limit)` - Latest 5 posts
- `incrementPostViews(slug)` - Track engagement

---

### Feature 1.4: SEO Metadata
**Tech Stack:** Next.js Metadata API

**Implementation:**
- Add `generateMetadata()` function to `[slug]/page.tsx`
- Extract from post data
- Generate OG image URL

---

## Database Schema (Already Exists)

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  category VARCHAR(100),
  tags TEXT[],
  author_id VARCHAR(255),
  published BOOLEAN,
  views INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## Tasks

See `/docs/tasks/EPIC_1_TASKS.md`

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Rich editor UX complexity | Use `react-markdown` + `react-hook-form` libraries |
| Image upload issues | Test with Supabase Storage bucket + CORS |
| Markdown parsing bugs | Add unit tests for markdown processing |
| SEO metadata not generating | Verify Next.js metadata API usage in `generateMetadata()` |

---

## Success Metrics (Post-Launch)

- Admin can create/edit/delete posts in < 2 minutes
- Blog post renders in < 1 second on 4G
- Lighthouse score > 85
- Zero TypeScript errors
