# Admin Dashboard - Wireframe & Specs

**Purpose:** Provide intuitive content management interface

**Goal:** Admin can create/edit/delete all content types with ease

---

## 📐 Admin Layout

```
┌──────────────────────────────────────────────────────┐
│  HEADER (same as public site)                       │
└──────────────────────────────────────────────────────┘

┌──────────┬──────────────────────────────────────────┐
│          │                                          │
│ SIDEBAR  │  MAIN CONTENT AREA                       │
│ (240px)  │  (1fr)                                   │
│          │                                          │
│  Admin   │  Current page content:                   │
│  Menu    │  - Dashboard                             │
│          │  - Posts Manager                         │
│          │  - Videos Manager                        │
│  • Home  │  - Projects Manager                      │
│  • Posts │  - Analytics                             │
│  • Videos│  - Settings                              │
│  • Projects
│  • Analytics
│  • Logout
│          │                                          │
└──────────┴──────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  FOOTER                                             │
└──────────────────────────────────────────────────────┘
```

---

## 🎯 Admin Dashboard (Main)

**Route:** `/admin`

**Sections:**

### A. Welcome Banner
```
┌─────────────────────────────┐
│  Welcome Back, [Name]!      │
│  Last update: 2 hours ago   │
└─────────────────────────────┘
```

### B. Stats Cards Row (4 columns on desktop)
```
┌────────────┬────────────┬────────────┬────────────┐
│  📝 Posts  │  🎥 Videos │  📦 Project│  👁️ Views  │
│  12        │  5         │  8         │  2.4k      │
│  2 drafts  │ 1 draft    │ Featured: 3│ This month │
└────────────┴────────────┴────────────┴────────────┘
```

### C. Quick Actions (2 columns)
```
┌──────────────────┬──────────────────┐
│ [+ New Post]     │ [+ New Video]    │
├──────────────────┼──────────────────┤
│ [+ New Project]  │ [View Analytics] │
└──────────────────┴──────────────────┘
```

### D. Recent Activity
```
┌─────────────────────────────────────────┐
│  Recent Activity (last 10)              │
├─────────────────────────────────────────┤
│  • Created post: "React Tips" (2h ago)  │
│  • Edited project: "E-commerce App"     │
│  • Published video: "Docker Tutorial"   │
│  • Uploaded image: featured-blog.jpg    │
│  ...                                    │
│  [View All Activity →]                  │
└─────────────────────────────────────────┘
```

---

## 📝 Posts Manager

**Route:** `/admin/posts`

### Header
```
┌──────────────────────────────────────────┐
│  [← Back] Manage Posts      [+ New Post] │
└──────────────────────────────────────────┘
```

### Search & Filters
```
┌─────────────────────────────────────────┐
│  [Search by title...]                   │
│  Status: [All ▼] | [Draft ▼] | [Published]
│  Category: [All ▼]                      │
│  Sort: [Newest ▼]                       │
└─────────────────────────────────────────┘
```

### Posts Table
```
┌────────┬─────────────────┬──────────┬────────┬──────────┬─────────┐
│ Select │ Title           │ Status   │ Date   │ Views    │ Actions │
├────────┼─────────────────┼──────────┼────────┼──────────┼─────────┤
│ ☐      │ React Tips...   │ Published│ Feb 5  │ 342 👁   │ ✏️  🗑   │
│ ☐      │ Docker Intro... │ Draft    │ Feb 3  │ 0        │ ✏️  🗑   │
│ ☐      │ Next.js 14...   │ Published│ Jan 30 │ 1.2k     │ ✏️  🗑   │
└────────┴─────────────────┴──────────┴────────┴──────────┴─────────┘

Pagination: [← Previous] 1 2 3 [Next →]
```

### Bulk Actions (when items selected)
```
┌──────────────────────────────────────────────────┐
│ 3 selected | [Publish] [Unpublish] [Delete] [x] │
└──────────────────────────────────────────────────┘
```

---

## ➕ New / Edit Post Form

**Route:** `/admin/posts/new` or `/admin/posts/[id]`

### Layout
```
┌──────────────────────────────────────────┐
│  [← Back] Create New Post | [Save Draft] │
└──────────────────────────────────────────┘

┌──────────────────┬──────────────────────┐
│  LEFT (60%)      │  RIGHT (40%)         │
│                  │                      │
│  Form Fields:    │  Preview Pane:       │
│  - Title         │  Live preview of     │
│  - Slug (auto)   │  rendered article    │
│  - Content       │                      │
│  - Category      │  Updates as you type │
│  - Tags          │                      │
│  - Featured Img  │                      │
│  - Meta Title    │                      │
│  - Meta Desc     │                      │
│                  │                      │
│  [Save + Pub] or │                      │
│  [Save Draft]    │                      │
│                  │                      │
└──────────────────┴──────────────────────┘
```

### Form Fields Detail

```
┌─ Basic Info ────────────────────────────┐
│                                         │
│  Title *                                │
│  [Text input (required)]                │
│                                         │
│  Slug (auto-generated)                  │
│  [post-url-slug-here]                   │
│                                         │
│  Category *                             │
│  [Dropdown: Tech, Web Dev, Career, ...]│
│                                         │
│  Tags                                   │
│  [+ react] [+ typescript] [+ x]         │
│  [Input] [Add tag]                      │
│                                         │
└─────────────────────────────────────────┘

┌─ Content Editor ────────────────────────┐
│                                         │
│  Content *                              │
│  ┌─────────────────────────────────────┐│
│  │ # Heading                           ││
│  │ **Bold** *italic* `code`            ││
│  │                                     ││
│  │ - Bullet 1                          ││
│  │ - Bullet 2                          ││
│  │                                     ││
│  │ ```javascript                       ││
│  │ const hello = () => { };            ││
│  │ ```                                 ││
│  │                                     ││
│  │ [Toolbar: B I _ Code Image Link]    ││
│  └─────────────────────────────────────┘│
│                                         │
│  Toolbar buttons:                       │
│  [B] [I] [_] [H1] [Code] [Image] [Link]
│                                         │
└─────────────────────────────────────────┘

┌─ SEO & Meta ────────────────────────────┐
│                                         │
│  Featured Image                         │
│  [Upload or drag image]                 │
│  [Preview 1200x630px]                   │
│                                         │
│  Meta Title (for search results)        │
│  [Text input - 60 chars max]            │
│  Characters: 42/60                      │
│                                         │
│  Meta Description                       │
│  [Textarea - 160 chars max]             │
│  Characters: 128/160                    │
│                                         │
│  OG Image (social sharing)              │
│  [Pulled from featured image]           │
│                                         │
└─────────────────────────────────────────┘

┌─ Publish Options ────────────────────────┐
│                                         │
│  Status:                                │
│  ☑ Published     ☐ Draft                │
│                                         │
│  Publish Date                           │
│  [Date picker] (optional, Phase 2)      │
│                                         │
│  Reading Time (auto-calculated)         │
│  ≈ 5 minutes                            │
│                                         │
│  [Save + Publish] [Save Draft]          │
│  [Preview] [Delete]                     │
│                                         │
└─────────────────────────────────────────┘
```

### Section: Editor Toolbar

```
Markdown Editor Toolbar (sticky at top of content area):

[B] [I] [_] [H1▼] [Code] [~~] [Link] [Image] [Quote] [...More]

Icons represent:
- B: Bold (**text**)
- I: Italic (*text*)
- _: Underline/strikethrough
- H1▼: Heading dropdown (H1-H6)
- Code: Inline code (`code`)
- ~~: Strikethrough
- Link: Insert link
- Image: Upload image
- Quote: Blockquote
- More: Lists, tables, etc.

Click inserts markdown at cursor position
```

### Preview Pane Details

```
┌─────────────────────────────────────┐
│  PREVIEW                            │
├─────────────────────────────────────┤
│  [Read time: 5 min]                 │
│  [Published on: Feb 7, 2024]        │
│  [Category: Tech]                   │
│  #react #typescript #nextjs         │
│                                     │
│  # My Awesome Post Title            │
│                                     │
│  This is the formatted content      │
│  as it would appear on the public   │
│  blog post page.                    │
│                                     │
│  Code blocks render with            │
│  syntax highlighting:               │
│                                     │
│  const greet = () => "Hello!";      │
│                                     │
│  Tables, lists, links all render    │
│  properly in the preview.           │
│                                     │
│  [← Back to blog]                   │
│  [Tweet This] [Share]               │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎥 Videos & 📦 Projects Manager

**Similar to Posts Manager:**
- Same table layout
- Same search/filter pattern
- New/Edit forms with video/project-specific fields

### Videos Form Key Fields:
- Title, Description, Video URL (YouTube or file)
- Thumbnail upload
- Duration (auto-fill from YouTube?)
- Category, Tags

### Projects Form Key Fields:
- Name, Description, Long description
- Tech stack (multi-select)
- GitHub URL, Live URL
- Project image
- Featured toggle

---

## 📊 Analytics Page

**Route:** `/admin/analytics`

### Stats Overview
```
┌────────────┬────────────┬────────────┬────────────┐
│  12 Posts  │  5 Videos  │  8 Projects│  2.4k Views│
│  This Month│  This Month│ Featured: 3│ All Time   │
└────────────┴────────────┴────────────┴────────────┘
```

### Top Content
```
┌─ Top Posts by Views ────────────────────┐
│  1. "React Tips" - 342 views           │
│  2. "Next.js 14" - 1.2k views          │
│  3. "Docker Intro" - 89 views          │
└────────────────────────────────────────┘

┌─ Top Videos ────────────────────────────┐
│  1. "React Hooks" - 500 views          │
│  2. "TypeScript" - 234 views           │
└────────────────────────────────────────┘
```

### Traffic Overview
```
┌─ Google Analytics (Last 7 days) ────────┐
│  Pageviews: 1,234                      │
│  Users: 432                             │
│  Avg. Session: 3m 24s                   │
│                                         │
│  Top Referrers:                         │
│  1. Direct - 40%                        │
│  2. Google - 35%                        │
│  3. Twitter - 15%                       │
│                                         │
│  [View Full Analytics →]                │
└────────────────────────────────────────┘
```

---

## 📱 Mobile Responsive

**Sidebar collapses:**
- On mobile: Hamburger menu, sidebar slides from left
- Tablet: Sidebar stays but narrower

**Tables:**
- Mobile: Horizontal scroll or card view
- Show selected columns on mobile

**Forms:**
- Full screen on mobile, centered on desktop
- Single column on mobile

---

## ⚡ Interactions

- **Edit button:** Modal or new page (new page better for complex forms)
- **Delete button:** Confirmation dialog with post title
- **Save:** Toast notification on success
- **Upload:** Progress bar, then show image preview
- **Keyboard:**
  - Cmd+S or Ctrl+S: Save draft
  - Escape: Close modal/menu

---

## 🎨 Admin Color Scheme

- Sidebar: Gray 900 (light mode) / Gray 950 (dark mode)
- Main: Gray 50 (light) / Gray 900 (dark)
- Accent: Blue 600 (light) / Blue 400 (dark)
- Status badges: Green (published), Yellow (draft), Red (error)

---

## ✅ Admin Usability

- [ ] Can create post in < 2 minutes
- [ ] Edit form loads in < 1 second
- [ ] Auto-save draft every 30 seconds
- [ ] Clear error messages
- [ ] Confirm before delete
- [ ] Keyboard shortcuts for power users
- [ ] Mobile-friendly (but desktop-optimized)
