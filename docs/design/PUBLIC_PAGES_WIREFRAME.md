# Blog & Portfolio Public Pages - Wireframe & Specs

**Purpose:** Showcase content in professional, engaging way

**Goal:** Readers should easily understand content and want to read more

---

## 📖 Blog Listing Page

**Route:** `/blog`

### Layout
```
┌──────────────────────────────────────────────────┐
│  HEADER (fixed)                                 │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  PAGE TITLE & DESCRIPTION                       │
│  "Blog"                                         │
│  "Thoughts on web development, architecture..." │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  SEARCH & FILTERS                               │
│  [Search posts...]  [Category ▼] [All Tags ▼]  │
└──────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────┐
│  POSTS GRID (3 cols)     │  SIDEBAR (25%)       │
│                          │                      │
│  ┌────────┬────────┐     │  RECENT POSTS        │
│  │ Post 1 │ Post 2 │     │  • Post A (date)     │
│  │ Post 3 │ Post 4 │     │  • Post B (date)     │
│  │ Post 5 │        │     │                      │
│  └────────┴────────┘     │  CATEGORIES          │
│                          │  • React (4)         │
│  [← Prev] 1 2 3 [Next →] │  • TypeScript (3)    │
│                          │  • DevOps (2)        │
│                          │                      │
│                          │  TAGS                │
│                          │  #react #typescript  │
│                          │  #nextjs #devops     │
└──────────────────────────┴──────────────────────┘

┌──────────────────────────────────────────────────┐
│  FOOTER                                         │
└──────────────────────────────────────────────────┘
```

### Blog Card Design
```
┌───────────────────────────────┐
│  Featured Image (16:9)        │ ← Lazy load
│                               │
│  Category Badge               │
│  Title                        │
│  (H3, bold, 20px)             │
│                               │
│  Excerpt (2-3 lines)          │
│  "Lorem ipsum dolor sit amet" │
│                               │
│  Feb 5, 2024 | 5 min read     │
│  [Read More →]                │
│                               │
└───────────────────────────────┘
```

### Features:
- 3 columns on desktop (1200px+)
- 2 columns on tablet (640-1024px)
- 1 column on mobile
- Hover: card lift, image scale
- Lazy load images and pagination
- Filter by category / search / tags
- Show "No posts found" message if empty

---

## 📄 Blog Post Detail Page

**Route:** `/blog/[slug]`

### Layout
```
┌──────────────────────────────────┐
│  HEADER (fixed)                 │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  [← Back to Blog]               │
│                                  │
│  Category Badge                  │
│  #tag1 #tag2 #tag3              │
│                                  │
│  Post Title (H1)                │
│  "My Amazing Article"           │
│                                  │
│  Meta: Feb 5, 2024 | 5 min read│
│  By [Author] | 342 views        │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Featured Image (full-width)    │
│  (or hero image with gradient)  │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Article Content                │
│  (max-width 750px, centered)    │
│                                  │
│  Fully formatted markdown:       │
│  - Headings                      │
│  - Code blocks (syntax highlight│
│  - Images                        │
│  - Lists, quotes, etc.          │
│                                  │
│  [Social Share Buttons]          │
│  Share on: Twitter, LinkedIn     │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  RELATED POSTS (optional)       │
│  3 post cards in grid           │
│  "You might also like..."        │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  NAVIGATION                      │
│  [← Prev Post] [Archive] [Next →]
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  COMMENTS (Phase 2)              │
│  Disqus or custom comments       │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  FOOTER                         │
└──────────────────────────────────┘
```

### Content Features:
- Max-width: 750px (optimal reading)
- Line height: 1.6 for readability
- Code blocks: Dark background, syntax highlighting
- Images: Responsive, lazy load, click to expand
- Headings: Proper hierarchy (H2, H3)
- Blockquotes: Indented, different background
- Links: Underlined, color change on hover
- Line numbers on code (optional)

### Header Meta:
```
Category: [React] 
Tags: #react #typescript #hooks

Post Title
"Understanding React Hooks: A Deep Dive"

Feb 5, 2024 | 5 min read | 342 views
By [Author Name] | Share on [social icons]
```

### Table of Contents (Optional)
```
If post has many headings, show:
- Sticky table of contents on right
- Click to jump to section
- Smooth scroll
```

---

## 🎬 Videos Page

**Route:** `/videos`

### Layout (Similar to Blog)
```
┌──────────────────────────────────┐
│  PAGE TITLE                      │
│  "Video Tutorials & Talks"       │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  FILTER                          │
│  [Category ▼] [All Tags ▼]       │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  VIDEO GRID (3 columns)          │
│  ┌────────┬────────┬────────┐   │
│  │Video 1 │Video 2 │Video 3 │   │
│  │Video 4 │Video 5 │        │   │
│  └────────┴────────┴────────┘   │
│                                  │
│  [Pagination]                    │
└──────────────────────────────────┘
```

### Video Card
```
┌─────────────────────────────┐
│  Thumbnail with play icon   │ ← Lazy load
│  Duration badge (top-right) │
│                             │
│  Title (H4)                 │
│  Date | Category            │
│  342 views                  │
│                             │
│  [Watch →]                  │
└─────────────────────────────┘
```

---

## 🎬 Video Detail Page

**Route:** `/videos/[slug]`

### Layout
```
┌──────────────────────────────────┐
│  HEADER                         │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  [← Back to Videos]             │
│  Category Badge | Tags          │
│  Video Title (H1)               │
│  Date | Duration | Views        │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Video Player (16:9 aspect)     │
│                                  │
│  YouTube embed or HTML5 player  │
│  With: play, progress, volume,  │
│  speed, fullscreen controls     │
│                                  │
│  [Player takes full-width,      │
│   responsive]                   │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Description & Meta             │
│  Full text description          │
│  Links, transcripts (future)    │
│  Social share buttons           │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  RELATED VIDEOS                 │
│  3 video cards                  │
│  "More from this series..."     │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  FOOTER                         │
└──────────────────────────────────┘
```

### Video Player:
- For YouTube: Embedded iframe (responsive)
- For self-hosted: HTML5 `<video>` element
  - Play, pause, seek, volume, fullscreen
  - Speed control (0.5x, 1x, 1.5x, 2x)
  - Keyboard shortcuts (space to play, arrow keys)
  - Picture-in-picture mode
  - Thumbnail preview on hover

---

## 📦 Portfolio / Projects Page

**Route:** `/projects`

### Layout
```
┌──────────────────────────────────┐
│  PAGE TITLE                      │
│  "My Work"                       │
│  "Showcase of projects & work"   │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  TECH STACK FILTER (Pills)      │
│  [React] [Node.js] [TypeScript]  │
│  [Docker] [PostgreSQL] [AWS]     │
│  [Clear Filters]                 │
│                                  │
│  Showing: 8 projects             │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  PROJECTS GRID (3 columns)       │
│  ┌────────┬────────┬────────┐   │
│  │Project1│Project2│Project3│   │
│  │Project4│Project5│        │   │
│  └────────┴────────┴────────┘   │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  FOOTER                          │
└──────────────────────────────────┘
```

### Project Card
```
┌──────────────────────────────┐
│  Project Image (16:9)        │ ← Lazy load
│                              │
│  Project Name (H3)           │
│  Short description (2 lines) │
│                              │
│  Tech Badges:                │
│  [React] [Node] [TypeScript] │
│                              │
│  ⭐ 234  🔀 45  📅 Jan 2024  │
│  (GitHub stats if available) │
│                              │
│  [View Project →]            │
└──────────────────────────────┘
```

### Features:
- Filter by tech stack (multi-select, URL params)
- Show GitHub stars/forks if available
- Cards responsive (3 cols → 2 cols → 1 col)
- Search by project name (optional)
- Sort by: Featured, Date, Name

---

## 📋 Project Detail Page

**Route:** `/projects/[id]` (or slug)

### Layout
```
┌──────────────────────────────────┐
│  [← Back to Projects]           │
│                                  │
│  Featured Image (hero, full-width
│                                  │
│  Project Name (H1)              │
│  Brief tagline                  │
│                                  │
│  ┌──────────────┬──────────────┐│
│  │ LEFT (60%)   │ RIGHT (40%)  ││
│  │              │              ││
│  │ Long desc... │ Details Area:││
│  │              │ Tech Stack   ││
│  │ "Challenge"  │ [React]      ││
│  │ "Solution"   │ [Node.js]    ││
│  │ "Impact"     │ [PostgreSQL] ││
│  │              │              ││
│  │              │ Links:       ││
│  │              │ [GitHub]     ││
│  │              │ [Live Demo]  ││
│  │              │              ││
│  │              │ Date: Jan 24 ││
│  │              │ Role: Lead   ││
│  │              │              ││
│  │              │ GitHub Stats:││
│  │              │ ⭐ 234       ││
│  │              │ 🔀 45        ││
│  │              │ 📅 Jan 2024  ││
│  └──────────────┴──────────────┘│
│                                  │
│  [Architecture Diagram] (optional)
│  [Live Demo] [View Code]        │
│                                  │
│  RELATED PROJECTS               │
│  3 similar projects              │
│                                  │
│  [← Prev] [Archive] [Next →]    │
└──────────────────────────────────┘
```

### Right Sidebar Details
```
┌─────────────────────────┐
│  Tech Stack             │
│  [React] [Next.js]      │
│  [TypeScript]           │
│  [PostgreSQL]           │
│  [Redis]                │
│                         │
│  Links:                 │
│  🔗 View on GitHub      │
│  🌐 Live Demo           │
│                         │
│  Stats:                 │
│  Role: Lead Developer   │
│  Team: 3 people         │
│  Duration: 4 months     │
│                         │
│  GitHub Repo:           │
│  owner/project-name     │
│  ⭐ 234  🔀 45         │
│  Languages: TypeScript  │
│  📅 Updated Jan 2024    │
│                         │
│  [View on GitHub →]     │
└─────────────────────────┘
```

### Content Sections
```
## Challenge
What was the problem you solved?

## Solution
How did you approach it?

## Architecture
High-level system design (optional)
[Diagram or description]

## Impact
Results, outcomes, learnings

## Highlights
- Key decision 1
- Key decision 2
- Key decision 3

## Next Steps / Future Enhancements
What would you do differently?
```

---

## 🔍 Responsive Behavior

| Breakpoint | Blog | Video | Projects |
|-----------|------|-------|----------|
| Mobile (0-639px) | 1 col | 1 col | 1 col |
| Tablet (640-1023px) | 2 col | 2 col | 2 col |
| Desktop (1024px+) | 3 col | 3 col | 3 col |

---

## ♿ Accessibility

- [ ] Alt text on all images
- [ ] Heading hierarchy proper
- [ ] Links underlined or obvious
- [ ] Video captions (future)
- [ ] Keyboard navigation
- [ ] ARIA labels on buttons
- [ ] Color contrast > 4.5:1

---

## ⚡ Performance

- [ ] Lazy load images
- [ ] Lazy load videos (don't auto-play)
- [ ] Code splitting for detail pages
- [ ] Cache static content
- [ ] Optimize images (WebP, sizes)

---

## ✅ Success Metrics

- Blog post page: < 1s load
- Video page: < 2s load (includes video buffer)
- Portfolio: < 1.5s load
- Lighthouse > 85 on all public pages
