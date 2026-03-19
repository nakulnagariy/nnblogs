# Epic 1: Blog Platform - Task Breakdown

**Epic Goal:** Create a fully-featured blog authoring, publishing, and reading system.

**Total Estimated Time:** ~16-20 hours across 2 weeks

---

## Phase 1A: Blog Editor Components (Week 1, Days 1-2)

### Task 1.1: Create Markdown Editor Component
**Time:** 2-3 hours  
**Depends On:** Design System (color variables, fonts setup)

**What to Build:**
- Component: `src/components/blog/MarkdownEditor.tsx`
- Features:
  - Textarea for markdown input
  - Toolbar with buttons: Bold, Italic, Code, Headings, Lists, Links, Images
  - Button click inserts markdown syntax at cursor position
  - Read-only preview panel below editor (splits 50/50)
  - Tracks dirty state (unsaved changes)

**Technical Details:**
- Use React hooks (useState, useRef)
- Textarea with monospace font (Fira Code)
- Keyboard shortcuts: Cmd/Ctrl+B for bold, Cmd/Ctrl+I for italic
- CSS Grid: editor left, preview right

**Files to Create:**
- `src/components/blog/MarkdownEditor.tsx`
- `src/components/blog/EditorToolbar.tsx`
- `src/components/blog/CodeBlock.tsx`

**Success Criteria:**
- [ ] Textarea renders with proper styles
- [ ] Toolbar buttons insert markdown syntax
- [ ] Preview pane updates in real-time
- [ ] Keyboard shortcuts work (Cmd/Ctrl+B, etc.)
- [ ] Dirty state tracked (shows unsaved indicator)
- [ ] No TypeScript errors

**Testing:**
- [ ] Type text, verify both panels update
- [ ] Click toolbar buttons, verify syntax inserted
- [ ] Test keyboard shortcuts
- [ ] Verify preview pane reflects changes

---

### Task 1.2: Create Markdown Preview Component
**Time:** 1-2 hours  
**Depends On:** Task 1.1

**What to Build:**
- Component: `src/components/blog/MarkdownPreview.tsx`
- Uses `marked` library to parse markdown → HTML
- Uses `highlight.js` for code block syntax highlighting
- Renders safely with `dangerouslySetInnerHTML` (markdown is trusted)

**Technical Details:**
- Install: `npm install marked highlight.js`
- Parse markdown to HTML with `marked.parse()`
- Detect code blocks, apply syntax highlighting
- CSS: `prose` classes for formatting (via Tailwind plugin or custom CSS)

**Files to Create:**
- `src/components/blog/MarkdownPreview.tsx`
- `src/lib/markdown.ts` (markdown parsing utilities)

**Success Criteria:**
- [ ] Markdown renders to HTML correctly
- [ ] Code blocks have syntax highlighting
- [ ] Headings, lists, links render properly
- [ ] Images show with `<img>` tags
- [ ] No XSS vulnerabilities (sanitized)

**Testing:**
- [ ] Type markdown in editor, verify rendering in preview
- [ ] Paste code block (```js), verify syntax highlighting
- [ ] Insert link: [text](url), verify renders as `<a>`
- [ ] Insert image: ![alt](url), verify renders as `<img>`

---

### Task 1.3: Create Image Upload Component
**Time:** 2-3 hours  
**Depends On:** Supabase Storage bucket created (`posts-images`)

**What to Build:**
- Component: `src/components/blog/ImageUpload.tsx`
- Features:
  - Drag-and-drop zone or file picker
  - Upload to Supabase Storage (`posts-images` bucket)
  - Progress bar during upload
  - Show preview of uploaded image
  - Copy image URL to clipboard
  - Error handling (max 10MB, image types only)

**Technical Details:**
- Use Supabase storage SDK
- Upload to: `posts-images/[timestamp]-[filename]`
- Return URL: `https://[project].supabase.co/storage/v1/object/public/posts-images/...`
- Validate: file type (jpg, png, webp), size < 10MB

**Files to Create:**
- `src/components/blog/ImageUpload.tsx`
- `src/lib/supabase/storage.ts` (upload utilities)

**Success Criteria:**
- [ ] Drag-drop zone renders
- [ ] Can select file via picker
- [ ] File uploads to Supabase Storage
- [ ] Progress bar shows upload %
- [ ] URL copied to clipboard or shown in input
- [ ] Error message if file too large
- [ ] No TypeScript errors

**Testing:**
- [ ] Drag image file into drop zone, verify upload
- [ ] Click picker, select image, verify upload
- [ ] Check Supabase Storage dashboard, verify file there
- [ ] Try uploading 20MB file, verify error message

---

### Task 1.4: Build New Post Form
**Time:** 3-4 hours  
**Depends On:** Tasks 1.1, 1.2, 1.3

**What to Build:**
- Page: `src/app/admin/posts/new/page.tsx`
- Form with fields:
  - Title (text input, required)
  - Slug (text input, auto-filled from title)
  - Category (select dropdown, required)
  - Tags (multi-select or chip input)
  - Featured Image (image upload component)
  - Meta Title (text input, SEO)
  - Meta Description (textarea, SEO)
  - Content (markdown editor)
  - Status (radio: Draft or Published)
  - Buttons: Save Draft, Save + Publish, Delete

**Technical Details:**
- Use `react-hook-form` for form state
- Layout: Left 60% (form), Right 40% (preview pane)
- On save: POST to `/api/admin/posts` with form data
- On error: show error toast message
- On success: redirect to `/admin/posts` with success message
- Auto-save to draft every 30 seconds (Phase 2)

**Files to Create:**
- `src/app/admin/posts/new/page.tsx`
- `src/components/blog/PostForm.tsx` (reusable form component)

**Success Criteria:**
- [ ] Form renders all fields
- [ ] Title auto-generates slug (on blur)
- [ ] Can select category from dropdown
- [ ] Can add/remove tags
- [ ] Image upload works in form
- [ ] Save Draft button saves (sets published=false)
- [ ] Save + Publish button saves & publishes (published=true)
- [ ] Error messages display clearly
- [ ] Unsaved changes warning on page leave (Phase 2)

**Testing:**
- [ ] Fill form, click Save Draft, verify post in DB as draft
- [ ] Fill form, click Save + Publish, verify published=true
- [ ] Leave title blank, try save, verify error
- [ ] Upload image, verify URL in form
- [ ] Check DB schema matches form fields

---

## Phase 1B: Blog API Routes (Week 1, Days 3)

### Task 1.5: Create Blog Post CRUD API Route
**Time:** 2-3 hours  
**Depends On:** Task 1.4, existing admin-queries

**What to Build:**
- Already created in earlier phase
- File: `src/app/api/admin/posts/route.ts`
- GET: List all posts (admin), return with pagination
- POST: Create new post, validate fields, save to DB
- PUT: Update post by ID, validate, save
- DELETE: Delete post by ID, also delete image from storage

**Enhancements:**
- Add input validation (title required, slug unique)
- Check Clerk auth + ADMIN/EDITOR role
- Generate slug from title if not provided
- Set timestamps (created_at, updated_at)
- Handle errors gracefully

**Files to Modify:**
- `src/app/api/admin/posts/route.ts` (already exists, enhance)
- `src/lib/supabase/admin-queries.ts` (already exists, use)

**Success Criteria:**
- [ ] GET returns list of posts
- [ ] POST creates post, returns created post
- [ ] PUT updates post, returns updated
- [ ] DELETE removes post and image
- [ ] Returns 401 if not authenticated
- [ ] Returns 403 if not ADMIN/EDITOR
- [ ] Returns 400 if validation fails
- [ ] No TypeScript errors

**Testing:**
- [ ] Postman: GET /api/admin/posts, verify list
- [ ] Create post via form, verify POST succeeds
- [ ] Edit post via form, verify PUT succeeds
- [ ] Delete post via form, verify DELETE succeeds
- [ ] Try DELETE without auth header, verify 401

---

### Task 1.6: Implement View Increment Functionality
**Time:** 1 hour  
**Depends On:** Existing schema (posts.views column)

**What to Build:**
- Function: `src/lib/supabase/queries.ts` → `incrementPostViews(slug)`
- Calls Supabase RPC function `increment_post_views(post_slug)`
- Called on post page load (server-side, only once per session)

**Technical Details:**
- Use Supabase RPC: `await supabase.rpc('increment_post_views', { post_slug: slug })`
- Safe from duplicate increments (use session storage check)
- RPC function exists in schema

**Success Criteria:**
- [ ] Function increments post.views by 1
- [ ] Called on post load
- [ ] View count increases in DB
- [ ] No TypeScript errors

**Testing:**
- [ ] Load post page, check DB views count increases
- [ ] Reload page, verify views increment again

---

## Phase 1C: Public Blog Pages (Week 1, Days 4-5 & Week 2, Days 1)

### Task 1.7: Build Blog Listing Page
**Time:** 3-4 hours  
**Depends On:** Design System, Task 1.5

**What to Build:**
- Page: `src/app/blog/page.tsx`
- Features:
  - List all published posts (paginated)
  - Filter by category (optional)
  - Search by title (optional)
  - Grid layout: 3 columns (desktop), 1 column (mobile)
  - Each post card: image, title, excerpt, date, read time, category, [Read More] link
  - Pagination: show page numbers, prev/next

**Technical Details:**
- Use `getPosts(page, category)` from queries
- Show 10 posts per page
- Use `next/image` for responsive images
- Lazy load images with `loading="lazy"`
- Extract read time from content length

**Files to Create:**
- `src/app/blog/page.tsx`
- `src/components/blog/BlogCard.tsx` (reusable post card)
- `src/components/blog/BlogGrid.tsx` (grid layout)
- `src/components/blog/Pagination.tsx` (reusable)

**Success Criteria:**
- [ ] Page renders list of posts
- [ ] Posts grid responsive (3 cols → 1 col)
- [ ] Images lazy load
- [ ] Pagination works (next/prev buttons)
- [ ] Click post card → navigates to `/blog/[slug]`
- [ ] Read time calculated correctly
- [ ] Lighthouse score > 85

**Testing:**
- [ ] Load `/blog`, verify posts appear
- [ ] Test pagination (click next, verify page 2)
- [ ] View on mobile, verify 1 column layout
- [ ] Click post card, verify navigates to detail page

---

### Task 1.8: Build Blog Post Detail Page
**Time:** 3-4 hours  
**Depends On:** Task 1.7, Markdown rendering

**What to Build:**
- Page: `src/app/blog/[slug]/page.tsx`
- Features:
  - Fetch post by slug
  - Show: title, date, author, read time, category, tags, featured image
  - Render content (markdown → HTML with syntax highlighting)
  - Increment view count on load
  - Navigation: [← Back], [← Prev Post], [Next Post →]
  - Social share buttons (optional)
  - Related posts (optional)
  - SEO metadata (title, description, OG image)

**Technical Details:**
- Use `getPostBySlug(slug)` to fetch
- Use `MarkdownPreview` component to render content
- Use `incrementPostViews(slug)` on page load
- Next.js `generateMetadata()` for SEO
- Featured image uses `next/image`

**Files to Create:**
- `src/app/blog/[slug]/page.tsx`
- `src/components/blog/PostHeader.tsx` (title, meta)
- `src/components/blog/PostContent.tsx` (rendered markdown)
- `src/components/blog/PostNavigation.tsx` (prev/next)

**Success Criteria:**
- [ ] Page loads post by slug
- [ ] Markdown renders correctly (headings, code, lists)
- [ ] Code blocks have syntax highlighting
- [ ] Featured image displays
- [ ] View count increments
- [ ] SEO metadata generated correctly
- [ ] Navigation links work
- [ ] Lighthouse score > 85

**Testing:**
- [ ] Visit `/blog/test-post-slug`, verify post loads
- [ ] Check DB, verify views incremented
- [ ] Check page source, verify OG tags present
- [ ] Test on Lighthouse, verify score > 85
- [ ] Test code block rendering (paste markdown with ```js block)

---

### Task 1.9: Implement SEO Metadata
**Time:** 1-2 hours  
**Depends On:** Task 1.8

**What to Build:**
- Function: `generateMetadata()` in `[slug]/page.tsx`
- Generates:
  - Page title (from post.meta_title or post.title)
  - Meta description (from post.meta_description)
  - OG image (from featured_image)
  - OG title, OG description, OG URL
  - Twitter Card tags
  - Schema.org markup (BlogPosting)
  - Canonical URL

**Technical Details:**
- Use Next.js Metadata API (`export const metadata = {...}`)
- Build absolute URLs (use `NEXT_PUBLIC_SITE_URL` env var)
- Include all Open Graph tags
- Include Twitter Card tags

**Success Criteria:**
- [ ] Meta tags rendered in HTML head
- [ ] OG tags have correct values
- [ ] Social share shows correct preview
- [ ] Canonical URL correct
- [ ] No TypeScript errors

**Testing:**
- [ ] View page source, verify meta tags present
- [ ] Paste URL into Twitter card validator, verify preview
- [ ] Paste URL into LinkedIn post composer, verify preview

---

### Task 1.10: Add Blog Search Functionality
**Time:** 2 hours  
**Depends On:** Task 1.7 (optional, Phase 2)

**What to Build:**
- Component: `src/components/blog/BlogSearch.tsx`
- Features:
  - Search input on blog page
  - Search by title, tags
  - Filter results in real-time (client-side)
  - Show "No results" message

**Technical Details:**
- Client-side filtering of posts already loaded
- Use fuzzy search (optional, can use simple `includes`)

**Files to Create:**
- `src/components/blog/BlogSearch.tsx`

**Success Criteria:**
- [ ] Can search posts
- [ ] Results filter in real-time
- [ ] Show "No results" when no matches

**Testing:**
- [ ] Search for "React", verify filtered results
- [ ] Search for nonexistent term, verify "No results"

---

## Phase 1D: Testing & Polish (Week 2, Days 2-3)

### Task 1.11: Write Unit Tests
**Time:** 2-3 hours  
**Depends On:** All tasks

**What to Build:**
- Tests for:
  - Markdown parsing (marked library)
  - Slug generation
  - Read time calculation
  - Image upload validation
  - Post validation

**Files to Create:**
- `src/lib/__tests__/markdown.test.ts`
- `src/lib/__tests__/utils.test.ts`

**Success Criteria:**
- [ ] All tests pass
- [ ] > 80% code coverage for utils
- [ ] No console errors

**Testing:**
- [ ] Run `npm test`

---

### Task 1.12: Performance Optimization
**Time:** 1-2 hours  
**Depends On:** Task 1.8

**What to Build:**
- Optimizations:
  - Lazy load images with blur placeholder
  - Code split markdown components
  - Cache post queries (revalidate 1 hour)
  - Compress images (use next/image)

**Technical Details:**
- Add `placeholder="blur"` + `blurDataURL` to images
- Use Next.js `revalidateTag` for ISR

**Success Criteria:**
- [ ] Lighthouse Performance > 90
- [ ] LCP < 2.5s
- [ ] CLS < 0.1

**Testing:**
- [ ] Run Lighthouse on blog post page
- [ ] Check Core Web Vitals

---

### Task 1.13: Accessibility Audit
**Time:** 1-2 hours  
**Depends On:** All tasks

**What to Build:**
- Fixes:
  - Alt text on all images
  - Heading hierarchy correct (h1 per page)
  - ARIA labels on buttons
  - Color contrast > 4.5:1
  - Focus visible on all interactive elements
  - Skip to main content link

**Technical Details:**
- Use axe DevTools browser extension
- Run WAVE accessibility validator

**Success Criteria:**
- [ ] Lighthouse Accessibility > 90
- [ ] No axe violations
- [ ] Keyboard navigation works (Tab through all links)
- [ ] Screen reader test (VoiceOver on Mac)

**Testing:**
- [ ] Run axe DevTools, verify no violations
- [ ] Test keyboard navigation (Tab key through page)
- [ ] Test with Lighthouse Accessibility score

---

## Phase 1E: Admin CRUD & Edit Page (Week 2, Days 3-5)

### Task 1.14: Build Edit Post Page
**Time:** 2 hours  
**Depends On:** Task 1.4

**What to Build:**
- Page: `src/app/admin/posts/[id]/page.tsx`
- Features:
  - Load existing post data
  - Reuse PostForm component
  - Populate all fields with current data
  - Update post on save
  - Delete post with confirmation

**Technical Details:**
- Fetch post by ID from API
- Reuse `PostForm` component (pass `initialData`)
- PUT request to update

**Files to Modify:**
- `src/components/blog/PostForm.tsx` (add `initialData` prop)
- Create: `src/app/admin/posts/[id]/page.tsx`

**Success Criteria:**
- [ ] Post data loads into form
- [ ] Can update fields
- [ ] Save updates post
- [ ] Delete button removes post
- [ ] Redirect to posts list after delete

**Testing:**
- [ ] Navigate to edit page, verify data populated
- [ ] Change title, save, verify in DB
- [ ] Delete post, verify removed from DB

---

### Task 1.15: Polish Admin Posts Manager
**Time:** 2 hours  
**Depends On:** Tasks 1.5, 1.14

**What to Build:**
- Page: `src/app/admin/posts/page.tsx` already created
- Enhancements:
  - Add search functionality
  - Add filters (status, category)
  - Add bulk delete with confirmation
  - Add sort options (date, views, title)
  - Show read time in table
  - Show post preview modal

**Technical Details:**
- Client-side filtering of posts
- Bulk select with checkboxes
- Confirmation modal before bulk delete

**Success Criteria:**
- [ ] Can search posts
- [ ] Can filter by status/category
- [ ] Can bulk select & delete
- [ ] Table sorts by different columns
- [ ] UI responsive on mobile

**Testing:**
- [ ] Search for post, verify filtered
- [ ] Select multiple posts, bulk delete
- [ ] Verify sort works

---

## 🎯 EPIC 1 Critical Path

```
1.1 → 1.2 → 1.3 → 1.4 → 1.5
      ↓ (parallel)
1.7 → 1.8 → 1.9 → 1.10
      (parallel) 1.11 → 1.12 → 1.13
                      (parallel) 1.14 → 1.15
```

---

## ✅ Epic 1 Completion Checklist

**MVP Requirements:**
- [ ] Blog post creation works end-to-end
- [ ] Blog post editing works
- [ ] Blog post deletion works
- [ ] Public blog listing page works
- [ ] Public blog detail page works
- [ ] SEO metadata generated
- [ ] View count tracking works
- [ ] Markdown editor functional
- [ ] Lighthouse > 85 on public pages
- [ ] Mobile responsive
- [ ] No TypeScript errors
- [ ] All API routes protected by auth

**Nice to Have:**
- [ ] Blog search
- [ ] Auto-save drafts
- [ ] Scheduled publishing
- [ ] Comments section
- [ ] Related posts

---

## 📊 Estimated Timeline

| Phase | Tasks | Time | Dates |
|-------|-------|------|-------|
| 1A | 1.1-1.4 | 8-11 hrs | Week 1, Days 1-2 |
| 1B | 1.5-1.6 | 3-4 hrs | Week 1, Day 3 |
| 1C | 1.7-1.10 | 9-12 hrs | Week 1 Day 4-5 + Week 2 Day 1 |
| 1D | 1.11-1.13 | 4-7 hrs | Week 2, Days 2-3 |
| 1E | 1.14-1.15 | 4 hrs | Week 2, Days 4-5 |
| **TOTAL** | **15 tasks** | **28-38 hrs** | **2 weeks** |

---

## ⚠️ Blockers & Dependencies

- [ ] Supabase buckets created (posts-images, etc.)
- [ ] Design System implemented (colors, fonts, components)
- [ ] Clerk authentication working
- [ ] Database schema deployed
- [ ] Environment variables configured
