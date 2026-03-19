# Epic 2: Admin Content Management

**Goal:** Create a professional admin interface for managing posts, videos, projects with role-based access control.

**Timeline:** Week 1-3

**Success Criteria:**
- Admin dashboard shows overview of all content
- CRUD operations work for posts, videos, projects
- Role-based access control (ADMIN, EDITOR, VIEWER)
- File uploads integrated
- All operations protected by authentication

---

## User Stories

### US 2.1: Admin - Role-Based Access Control
**As a** content creator  
**I want to** have different permission levels  
**So that** I can manage who can edit/delete content

**Acceptance Criteria:**
- [ ] ADMIN: Full access to create, edit, delete, manage users
- [ ] EDITOR: Can create, edit own posts only
- [ ] VIEWER: Read-only access
- [ ] Roles stored in Clerk custom claims
- [ ] Verified on API routes
- [ ] UI hides actions user can't perform

**Technical Notes:**
- Store role in `user.publicMetadata.role` in Clerk
- Check role in middleware
- Return 403 Forbidden if unauthorized

---

### US 2.2: Admin - Dashboard Overview
**As an** admin  
**I want to** see a quick overview of my content  
**So that** I can understand platform metrics at a glance

**Acceptance Criteria:**
- [ ] Cards showing:
  - [ ] Total posts (published + drafts)
  - [ ] Total videos
  - [ ] Total projects
  - [ ] Total views (all content)
  - [ ] Recent activity (last 10 posts created)
- [ ] Quick actions (New Post, New Video, New Project)
- [ ] Links to content management pages
- [ ] Last updated timestamp

---

### US 2.3: Admin - Manage Videos (Full CRUD)
**As an** admin  
**I want to** manage videos the same way as posts  
**So that** my video content is organized

**Acceptance Criteria:**
- [ ] Create video: title, description, URL (YouTube or Storage), thumbnail, category, tags, duration
- [ ] Edit video: update all fields
- [ ] Delete video: with confirmation
- [ ] List videos: table with status, date, views
- [ ] Publish/unpublish workflow
- [ ] File upload for self-hosted videos

---

### US 2.4: Admin - Manage Projects (Full CRUD)
**As an** admin  
**I want to** manage my portfolio projects  
**So that** I can showcase my work

**Acceptance Criteria:**
- [ ] Create project: name, description, tech stack, GitHub URL, live URL, image, featured flag
- [ ] Edit project: update all fields
- [ ] Delete project: with confirmation
- [ ] List projects: table with featured status, tech count
- [ ] Toggle featured status
- [ ] Manage on admin panel

---

### US 2.5: Admin - Bulk Operations
**As an** admin  
**I want to** perform actions on multiple posts at once  
**So that** I can manage content efficiently

**Acceptance Criteria:**
- [ ] Select multiple posts using checkboxes
- [ ] Bulk actions: publish, unpublish, delete, add tag, change category
- [ ] Confirmation before bulk delete
- [ ] Show count of affected posts

---

### US 2.6: Admin - File Upload Management
**As an** admin  
**I want to** upload images and videos to Supabase Storage  
**So that** my content is hosted reliably

**Acceptance Criteria:**
- [ ] Drag-and-drop or file picker for uploading
- [ ] Progress bar while uploading
- [ ] Validate file types (jpg, png, webp, mp4, webm)
- [ ] Validate file size (max 10MB for images, 100MB for videos)
- [ ] Show upload status and URL
- [ ] Delete files from Storage when post deleted

---

## Features

### Feature 2.1: Admin Dashboard UI
**Components:**
- `AdminDashboard.tsx` - Main layout
- `StatsCard.tsx` - Metrics cards
- `QuickActions.tsx` - Buttons for new content
- `RecentActivity.tsx` - Activity list

**Route:** `/admin`

---

### Feature 2.2: CRUD Management Pages
**Components:**
- `PostsList.tsx` - Table of posts with actions
- `VideosList.tsx` - Table of videos
- `ProjectsList.tsx` - Table of projects
- `BulkActionBar.tsx` - Multi-select actions
- `ConfirmDialog.tsx` - Delete confirmation

**Routes:**
- `/admin/posts` - Manage posts
- `/admin/videos` - Manage videos
- `/admin/projects` - Manage projects

---

### Feature 2.3: Admin API Routes
**Endpoints:**
- `PUT /api/admin/posts/[id]` - Update post
- `DELETE /api/admin/posts/[id]` - Delete post
- Same for videos, projects
- `POST /api/admin/upload` - File upload

**Protection:** Clerk auth + role check

---

### Feature 2.4: File Upload Handler
**Tech:** Supabase Storage SDK

**Function:** `uploadFile(file, bucket, path)`

Returns: `{ url, error }`

---

### Feature 2.5: Role-Based Middleware
**File:** `src/middleware.ts`

**Protected Routes:**
- `/admin/*` - ADMIN or EDITOR only
- `/api/admin/*` - ADMIN or EDITOR only

**Behavior:** Redirect to 403 if unauthorized

---

## Database Schema

Uses existing schema. Adds:

```sql
-- User roles in Clerk custom claims (not in DB)
-- Verified on API routes
```

---

## Tasks

See `/docs/tasks/EPIC_2_TASKS.md`

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Bulk operations slow | Implement batch queries in Supabase |
| File upload fails | Add retry logic + error handling |
| Role checks missed | Middleware catches unauthorized |
| Large tables slow down | Add pagination + search filters |
