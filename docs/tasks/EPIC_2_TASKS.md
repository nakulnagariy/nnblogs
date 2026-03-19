# Epic 2: Admin Content Management - Task Breakdown

**Epic Goal:** Create a professional admin interface for managing posts, videos, projects with role-based access control.

**Total Estimated Time:** ~10-14 hours across 2-3 weeks

---

## Phase 2A: Role-Based Access Control (Week 1, Day 5 & Week 2, Day 1)

### Task 2.1: Setup Clerk Roles & Custom Claims
**Time:** 1-2 hours  
**Depends On:** Clerk integration already working

**What to Build:**
- Configure Clerk to store roles in custom claims
- Roles: ADMIN, EDITOR, VIEWER
- Set default role for new users (VIEWER)

**Technical Details:**
- In Clerk dashboard: Create custom claims for `role`
- Use `user.publicMetadata.role` to store role
- API: Will check this in middleware

**Files to Create/Modify:**
- Document in: `docs/SETUP_GUIDE.md` (add role setup steps)

**Success Criteria:**
- [ ] Can set role in Clerk dashboard for users
- [ ] User object contains `publicMetadata.role`
- [ ] Role is accessible in Next.js via `auth().sessionClaims`

**Testing:**
- [ ] Set user role to ADMIN in Clerk dashboard
- [ ] Verify `user.publicMetadata.role === 'ADMIN'` in app

---

### Task 2.2: Update Middleware for Role Checks
**Time:** 1-2 hours  
**Depends On:** Task 2.1

**What to Build:**
- File: `src/middleware.ts` (already exists, enhance)
- Check routes: `/admin/*` and `/api/admin/*`
- Verify user has ADMIN or EDITOR role
- Return 403 Forbidden if not authorized
- Redirect to 403 error page

**Technical Details:**
- Use Clerk middleware
- Extract role from `auth().sessionClaims.meta.role`
- Check against allowed roles
- Return `NextResponse.redirect()` or `NextResponse.error()`

**Files to Modify:**
- `src/middleware.ts`

**Success Criteria:**
- [ ] Admin routes blocked if user has VIEWER role
- [ ] Admin routes allowed if user has ADMIN/EDITOR role
- [ ] API routes return 403 if unauthorized
- [ ] User redirected to error page or dashboard

**Testing:**
- [ ] Login as VIEWER, try to access `/admin`, verify 403
- [ ] Login as ADMIN, try to access `/admin`, verify allowed
- [ ] Try API call without auth header, verify 401
- [ ] Try API call with VIEWER role, verify 403

---

### Task 2.3: Add Role checks to Admin API Routes
**Time:** 1.5 hours  
**Depends On:** Task 2.2

**What to Build:**
- Enhance existing API routes: `/api/admin/posts`, `/api/admin/videos`, `/api/admin/projects`
- Add role check at beginning of each route handler
- Return 403 if not ADMIN/EDITOR

**Technical Details:**
- Extract role from `auth().sessionClaims.meta.role`
- Check if role is in `['ADMIN', 'EDITOR']`
- Return `NextResponse.json({ error: 'Forbidden' }, { status: 403 })`

**Files to Modify:**
- `src/app/api/admin/posts/route.ts`
- `src/app/api/admin/videos/route.ts`
- `src/app/api/admin/projects/route.ts`

**Success Criteria:**
- [ ] API returns 403 for VIEWER role
- [ ] API allows ADMIN/EDITOR role
- [ ] Error message is clear

**Testing:**
- [ ] API call with VIEWER token, verify 403
- [ ] API call with ADMIN token, verify allowed

---

## Phase 2B: Admin Dashboard (Week 2, Days 1-2)

### Task 2.4: Build Admin Dashboard Main Page
**Time:** 2-3 hours  
**Depends On:** Task 1.5 (blog CRUD API)

**What to Build:**
- Page: `src/app/admin/page.tsx` (already basic, enhance)
- Features:
  - Welcome message with user name
  - Stats cards: total posts, videos, projects, views
  - Quick action buttons: [+ New Post], [+ New Video], [+ New Project], [View Analytics]
  - Recent activity list (last 10 changes)
  - Quick links to management pages

**Technical Details:**
- Fetch stats from API (create `/api/admin/stats` endpoint)
- Display in cards with icons
- Show timestamp of last update
- Responsive grid: 4 columns (desktop) → 2 cols (tablet) → 1 col (mobile)

**Files to Create:**
- Enhance: `src/app/admin/page.tsx`
- Create: `src/components/admin/StatsCard.tsx`
- Create: `src/components/admin/RecentActivity.tsx`
- Create: `src/app/api/admin/stats/route.ts` (new endpoint)

**Success Criteria:**
- [ ] Dashboard loads with all stats
- [ ] Stats cards display correctly
- [ ] Quick action buttons navigate to correct pages
- [ ] Recent activity shows last 10 items
- [ ] Responsive on mobile

**Testing:**
- [ ] Load `/admin`, verify stats appear
- [ ] Click [+ New Post], verify navigates to `/admin/posts/new`
- [ ] Check on mobile, verify responsive

---

### Task 2.5: Create Admin Stats API Endpoint
**Time:** 1.5 hours  
**Depends On:** Existing Supabase queries

**What to Build:**
- Endpoint: `src/app/api/admin/stats/route.ts`
- Returns JSON:
  ```json
  {
    "totalPosts": 12,
    "draftPosts": 2,
    "totalVideos": 5,
    "draftVideos": 1,
    "totalProjects": 8,
    "featuredProjects": 3,
    "totalViews": 2400,
    "recentActivity": [...]
  }
  ```

**Technical Details:**
- Query posts count (WHERE author_id = current_user)
- Query videos count
- Query projects count
- Sum views from all tables
- Get recent activity (last 10 posts/videos/projects ordered by created_at)

**Files to Create:**
- `src/app/api/admin/stats/route.ts`

**Success Criteria:**
- [ ] Endpoint returns correct counts
- [ ] Returns 401 if not authenticated
- [ ] No TypeScript errors

**Testing:**
- [ ] Call endpoint, verify JSON structure
- [ ] Verify counts match DB

---

## Phase 2C: CRUD Management Pages (Week 2, Days 2-3)

### Task 2.6: Enhance Posts Manager with Search & Filters
**Time:** 2 hours  
**Depends On:** Task 1.5, existing admin/posts page

**What to Build:**
- File: `src/app/admin/posts/page.tsx` (already created, enhance)
- Features:
  - Search input (search by title/slug)
  - Status filter dropdown (All, Draft, Published)
  - Category filter dropdown
  - Sort dropdown (Newest, Oldest, Most Viewed, Alphabetical)
  - Results show: 10 per page
  - Pagination controls

**Technical Details:**
- Client-side filtering (posts already fetched)
- Filter state in useState hooks
- URL params for shareability (optional, Phase 2)

**Files to Modify:**
- `src/app/admin/posts/page.tsx`
- Create: `src/components/admin/SearchBar.tsx`
- Create: `src/components/admin/FilterBar.tsx`

**Success Criteria:**
- [ ] Can search posts by title
- [ ] Can filter by status (draft/published)
- [ ] Can filter by category
- [ ] Can sort by different columns
- [ ] Pagination works
- [ ] Responsive on mobile

**Testing:**
- [ ] Search for "React", verify filtered
- [ ] Filter by "Draft", verify only drafts shown
- [ ] Sort by "Most Viewed", verify sorted correctly

---

### Task 2.7: Implement Bulk Actions for Posts
**Time:** 1-2 hours  
**Depends On:** Task 2.6

**What to Build:**
- Features:
  - Checkboxes to select multiple posts
  - Bulk action bar appears when items selected
  - Actions: [Publish All], [Unpublish All], [Delete Selected]
  - Confirmation modal before bulk delete
  - Show count: "3 posts selected"

**Technical Details:**
- Track selected IDs in state
- Bulk API endpoint: `PATCH /api/admin/posts/bulk` for publish/unpublish
- Bulk delete: send array of IDs to DELETE

**Files to Create:**
- Enhance: `src/app/admin/posts/page.tsx`
- Create: `src/components/admin/BulkActionBar.tsx`
- Create: `src/app/api/admin/posts/bulk/route.ts` (bulk operations)

**Success Criteria:**
- [ ] Can select multiple posts with checkboxes
- [ ] Bulk action bar shows with selected count
- [ ] Bulk publish works
- [ ] Bulk delete with confirmation works
- [ ] Proper error handling

**Testing:**
- [ ] Select 2 posts, click Bulk Publish, verify all published
- [ ] Select 3 posts, click Delete, verify confirmation, then deleted

---

### Task 2.8: Build Videos Manager (Similar to Posts)
**Time:** 2-3 hours  
**Depends On:** Task 2.6 pattern

**What to Build:**
- Page: `src/app/admin/videos/page.tsx`
- Same features as posts:
  - Search, filter (by status, category)
  - Sort options
  - Pagination
  - Bulk actions
  - Edit/delete buttons

**Technical Details:**
- Reuse UI components from posts manager
- Adapt to video-specific fields
- Use existing `/api/admin/videos` routes

**Files to Create:**
- `src/app/admin/videos/page.tsx`

**Success Criteria:**
- [ ] Can list videos
- [ ] Can create video (click [+ New Video])
- [ ] Can edit video
- [ ] Can delete video
- [ ] Responsive on mobile

**Testing:**
- [ ] Load videos page, verify list
- [ ] Create new video, verify in list
- [ ] Edit video, verify updates

---

### Task 2.9: Build Projects Manager (Similar to Posts)
**Time:** 2-3 hours  
**Depends On:** Task 2.6 pattern

**What to Build:**
- Page: `src/app/admin/projects/page.tsx`
- Same features as posts/videos:
  - Search, filters (by featured status, tech)
  - Sort options
  - Pagination
  - Bulk actions
  - Edit/delete buttons

**Technical Details:**
- Reuse UI components
- Adapt to project-specific fields
- Use existing `/api/admin/projects` routes

**Files to Create:**
- `src/app/admin/projects/page.tsx`

**Success Criteria:**
- [ ] Can list projects
- [ ] Can create project
- [ ] Can edit project
- [ ] Can delete project
- [ ] Can toggle featured status

**Testing:**
- [ ] Load projects page
- [ ] Create new project
- [ ] Edit and save

---

## Phase 2D: File Upload & Storage (Week 2, Days 3-4)

### Task 2.10: Build File Upload API Endpoint
**Time:** 2-3 hours  
**Depends On:** Supabase Storage setup

**What to Build:**
- Endpoint: `src/app/api/admin/upload/route.ts`
- Features:
  - Accepts POST with multipart form data (file + bucket)
  - Validates: file type, file size
  - Uploads to Supabase Storage
  - Returns: `{ url, error }`

**Technical Details:**
- Parse multipart form data
- Validate file (jpg, png, webp, mp4, webm, mov)
- Max size: 10MB for images, 100MB for videos
- Upload to appropriate bucket
- Return public URL

**Files to Create:**
- `src/app/api/admin/upload/route.ts`

**Success Criteria:**
- [ ] Can upload image file
- [ ] Can upload video file
- [ ] Returns public URL
- [ ] Rejects files that are too large
- [ ] Rejects wrong file types
- [ ] 401 if not authenticated

**Testing:**
- [ ] Upload image, verify returns URL
- [ ] Try uploading 200MB file, verify error
- [ ] Try uploading .exe file, verify error

---

### Task 2.11: Integrate File Upload in Post Form
**Time:** 1-2 hours  
**Depends On:** Tasks 1.4, 2.10

**What to Build:**
- Enhance: `src/components/blog/PostForm.tsx`
- Features:
  - Featured image field uses file upload component
  - Drag-and-drop zone or file picker
  - Shows preview of selected image
  - Progress bar during upload
  - Error message if upload fails

**Technical Details:**
- Use existing `ImageUpload` component
- POST to `/api/admin/upload`
- Store URL in form state

**Files to Modify:**
- `src/components/blog/PostForm.tsx`
- Enhance: `src/components/blog/ImageUpload.tsx`

**Success Criteria:**
- [ ] Can upload image in post form
- [ ] Shows preview after upload
- [ ] URL stored in form
- [ ] Can submit form with image

**Testing:**
- [ ] Create post with image upload
- [ ] Verify image URL shows in preview
- [ ] Submit post, verify image saved in DB

---

### Task 2.12: Create File Upload Component for Videos/Projects
**Time:** 1 hour  
**Depends On:** Task 2.10

**What to Build:**
- Component: `src/components/admin/VideoUpload.tsx`
- Similar to ImageUpload but for videos
- Max 100MB, accepts mp4, webm, mov
- Progress bar
- Preview (show video player after upload)

**Files to Create:**
- `src/components/admin/VideoUpload.tsx`

**Success Criteria:**
- [ ] Can upload video file
- [ ] Shows progress
- [ ] Returns URL
- [ ] Video player preview works

**Testing:**
- [ ] Upload video, verify player works

---

## Phase 2E: Polish & Error Handling (Week 3, Days 1-2)

### Task 2.13: Add Error Handling & Validation
**Time:** 2 hours  
**Depends On:** All tasks

**What to Build:**
- Fixes:
  - Form validation (required fields, format checks)
  - Clear error messages
  - Prevent duplicate slugs
  - Handle network errors gracefully
  - Show toast notifications (success/error)

**Technical Details:**
- Add try-catch blocks to API routes
- Return meaningful error messages
- Front-end: Show toast on error
- Backend: Validate all inputs

**Files to Modify:**
- All API routes in `/app/api/admin/*`
- All form components

**Success Criteria:**
- [ ] Try submit empty form, verify error
- [ ] Try upload too-large file, verify error
- [ ] Network error shows graceful message
- [ ] Success message shows on save

**Testing:**
- [ ] Try creating post without title
- [ ] Try uploading 200MB file
- [ ] Simulate network error (offline mode)

---

### Task 2.14: Add Confirmation Dialogs
**Time:** 1-2 hours  
**Depends On:** All delete functions

**What to Build:**
- Components:
  - Confirmation modal before delete
  - Shows item being deleted (title, preview)
  - Two buttons: [Cancel], [Delete]
  - Keyboard support (Escape to cancel, Enter to delete)

**Files to Create:**
- `src/components/admin/ConfirmDialog.tsx`

**Success Criteria:**
- [ ] Delete button shows confirmation
- [ ] Shows item being deleted
- [ ] Cancel button closes dialog
- [ ] Confirm button deletes item
- [ ] Keyboard shortcuts work

**Testing:**
- [ ] Click delete, verify modal appears
- [ ] Click Cancel, verify modal closes
- [ ] Click Confirm, verify deleted

---

### Task 2.15: Setup Toast Notifications
**Time:** 1 hour  
**Depends On:** Form components

**What to Build:**
- Library: Use `react-hot-toast` or `sonner`
- Show on: save success, save error, delete success, upload error
- Toast should: show message, auto-dismiss after 3s, have action button

**Files to Modify:**
- All form pages and API integrations

**Success Criteria:**
- [ ] Toast shows on successful save
- [ ] Toast shows on error
- [ ] Toast auto-dismisses
- [ ] Multiple toasts can show

**Testing:**
- [ ] Save post, verify toast shows
- [ ] Trigger error, verify error toast shows

---

## Phase 2F: Admin Navigation & UI Polish (Week 3, Day 2)

### Task 2.16: Build Admin Sidebar Navigation
**Time:** 1-2 hours  
**Depends On:** Clerk roles setup

**What to Build:**
- Component: Sticky sidebar (240px wide on desktop)
- Menu items:
  - Dashboard (icon + "Admin Dashboard")
  - Posts (icon + count)
  - Videos (icon + count)
  - Projects (icon + count)
  - Analytics (icon)
  - Settings (icon)
  - Logout
- Active link indicator
- Collapse on mobile (hamburger menu)

**Technical Details:**
- Use Next.js `usePathname()` to detect active route
- Icons from Lucide React
- Responsive: sidebar slides from left on mobile

**Files to Create:**
- `src/components/admin/Sidebar.tsx`
- `src/components/admin/Navbar.tsx` (top bar)

**Success Criteria:**
- [ ] Sidebar renders on desktop
- [ ] Active link highlighted
- [ ] Hamburger menu on mobile
- [ ] Menu slides in/out on mobile
- [ ] Logout works

**Testing:**
- [ ] Navigate to `/admin/posts`, verify "Posts" highlighted
- [ ] On mobile, click hamburger, verify menu opens
- [ ] Click logout, verify redirects to login

---

### Task 2.17: Add Loading States & Skeleton Screens
**Time:** 1-2 hours  
**Depends On:** All data-fetching pages

**What to Build:**
- Skeleton loaders for:
  - Admin dashboard stats cards
  - Posts table
  - Form fields
- Show while data loads
- Improve perceived performance

**Technical Details:**
- Create `Skeleton.tsx` component
- Use during initial data fetch
- Replace with content when data loads

**Files to Create:**
- `src/components/ui/Skeleton.tsx`

**Success Criteria:**
- [ ] Skeleton shows while loading
- [ ] Replaced with content when ready
- [ ] Lighthouse performance improves

**Testing:**
- [ ] Load admin page, verify skeleton briefly shows
- [ ] Content loads after skeleton

---

## 🎯 EPIC 2 Critical Path

```
2.1 → 2.2 → 2.3 (parallel)
      ↓
2.4 → 2.5
      ↓
2.6 → 2.7
      ↓ (parallel)
2.8, 2.9 → 2.10 → 2.11, 2.12
      ↓
2.13 → 2.14 → 2.15 → 2.16 → 2.17
```

---

## ✅ Epic 2 Completion Checklist

**MVP Requirements:**
- [ ] Role-based access control working
- [ ] Admin dashboard shows stats
- [ ] Can CRUD posts, videos, projects
- [ ] Search & filters working
- [ ] Bulk actions working
- [ ] File upload working
- [ ] Error handling & validation in place
- [ ] Confirmation dialogs for delete
- [ ] Toast notifications show
- [ ] Sidebar navigation working
- [ ] Mobile responsive

**Nice to Have:**
- [ ] Undo/Redo for edits
- [ ] Draft auto-save every 30s
- [ ] Activity log/audit trail
- [ ] User management (create/edit/delete users)
- [ ] Permissions per user

---

## 📊 Estimated Timeline

| Phase | Tasks | Time | Dates |
|-------|-------|------|-------|
| 2A | 2.1-2.3 | 3-5 hrs | Week 1 Day 5 + Week 2 Day 1 |
| 2B | 2.4-2.5 | 3-4 hrs | Week 2, Days 1-2 |
| 2C | 2.6-2.9 | 7-10 hrs | Week 2, Days 2-3 |
| 2D | 2.10-2.12 | 4-6 hrs | Week 2, Days 3-4 |
| 2E | 2.13-2.15 | 4-5 hrs | Week 3, Days 1-2 |
| 2F | 2.16-2.17 | 2-4 hrs | Week 3, Day 2 |
| **TOTAL** | **17 tasks** | **23-34 hrs** | **3 weeks** |

---

## ⚠️ Blockers & Dependencies

- [ ] Epic 1 (Blog Platform) mostly complete
- [ ] Clerk roles configured
- [ ] Supabase Storage buckets created
- [ ] API routes from Epic 1 working
