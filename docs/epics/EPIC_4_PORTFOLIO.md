# Epic 4: Portfolio Showcase

**Goal:** Create an impressive portfolio section that showcases 11+ years of expertise with projects, tech stack filters, and GitHub integration.

**Timeline:** Week 2-3

**Success Criteria:**
- Projects section displays all portfolios
- Individual project pages show full details
- GitHub repo links work
- Tech stack filtering works
- Responsive grid/gallery layout

---

## User Stories

### US 4.1: Admin - Create Project
**As an** admin  
**I want to** create a portfolio project  
**So that** I can showcase my work

**Acceptance Criteria:**
- [ ] Form with:
  - [ ] Project name
  - [ ] Description (short, 1-2 sentences)
  - [ ] Long description (detailed explanation)
  - [ ] Tech stack (multi-select: React, Node, Python, etc.)
  - [ ] GitHub repo URL
  - [ ] Live demo URL (optional)
  - [ ] Project image (upload to Storage)
  - [ ] Featured flag (for homepage showcase)
- [ ] Save project to database
- [ ] Show success message
- [ ] Redirect to projects list

---

### US 4.2: Admin - Edit/Delete Project
**As an** admin  
**I want to** edit or delete a project  
**So that** I can keep portfolio current

**Acceptance Criteria:**
- [ ] Load project data into form
- [ ] Edit all fields
- [ ] Delete with confirmation
- [ ] Remove associated image from Storage

---

### US 4.3: Admin - Manage Projects
**As an** admin  
**I want to** see all my projects  
**So that** I can organize my portfolio

**Acceptance Criteria:**
- [ ] Table showing: name, tech count, featured status, actions
- [ ] Sort by: date, featured, alphabetical
- [ ] Toggle featured status
- [ ] Edit/delete buttons
- [ ] Add new project button

---

### US 4.4: Public - Projects Grid
**As a** visitor  
**I want to** see a gallery of your projects  
**So that** I can understand your expertise and work quality

**Acceptance Criteria:**
- [ ] Grid layout (3+ columns on desktop, 1 on mobile)
- [ ] Each card shows:
  - [ ] Project image (with fallback)
  - [ ] Project name
  - [ ] Description
  - [ ] Tech stack badges
  - [ ] "View details" link
- [ ] Hover effects (subtle parallax or scale)
- [ ] Responsive design
- [ ] Lazy load images

---

### US 4.5: Public - Project Detail Page
**As a** visitor  
**I want to** read details about a specific project  
**So that** I understand the problem solved and technologies used

**Acceptance Criteria:**
- [ ] Large project image
- [ ] Project name + description
- [ ] Tech stack (clickable tags for filtering)
- [ ] Long description (why built, challenges, learnings)
- [ ] GitHub repo link (with GitHub icon + "View on GitHub")
- [ ] Live demo link (if available)
- [ ] Related/similar projects (optional)
- [ ] Breadcrumb navigation
- [ ] Back to portfolio link
- [ ] Meta tags / SEO

---

### US 4.6: Public - Filter by Tech Stack
**As a** visitor  
**I want to** filter projects by technology  
**So that** I can see what you built with specific tools

**Acceptance Criteria:**
- [ ] Tech stack filter sidebar/chip group
- [ ] Click to filter projects
- [ ] Multi-select (show projects with ANY selected tech)
- [ ] Show count: "4 projects match React"
- [ ] Clear filters button
- [ ] Update URL with filter params (shareable)

---

### US 4.7: GitHub Integration
**As a** visitor  
**I want to** see GitHub repo stats  
**So that** I can understand project quality/activity

**Acceptance Criteria:**
- [ ] On project card: show ⭐ stars, 🔀 forks, 📝 last updated
- [ ] Link directly to GitHub repo
- [ ] Tooltip showing repo description
- [ ] Data synced daily (Supabase cron or Night Runner)

---

## Features

### Feature 4.1: Project CRUD API
**Endpoints:**
- `POST /api/admin/projects` - Create
- `GET /api/admin/projects` - List (admin)
- `PUT /api/admin/projects/[id]` - Update
- `DELETE /api/admin/projects/[id]` - Delete

**Protection:** Clerk auth

---

### Feature 4.2: Project Queries
**File:** `src/lib/supabase/queries.ts`

**Functions:**
- `getProjects()` - All projects, sorted
- `getFeaturedProjects()` - Top featured only
- `getProjectsByTech(tech)` - Filter by technology

---

### Feature 4.3: Project Grid Component
**Component:** `ProjectsGrid.tsx`

**Props:**
```tsx
{
  projects: Project[];
  loading?: boolean;
  onFilterChange?: (tech: string[]) => void;
}
```

**Features:**
- Responsive grid (CSS Grid or Tailwind)
- Hover effects (opacity, scale)
- Lazy load images
- Fallback image

---

### Feature 4.4: Project Card
**Component:** `ProjectCard.tsx`

Shows:
- Image
- Name
- Description (truncated)
- Tech badges
- Link

---

### Feature 4.5: Project Detail Page
**Route:** `/projects/[slug]`

**Components:**
- Hero section with image
- Title + description
- Tech stack (chips)
- Long description
- Links (GitHub, Demo)
- Related projects carousel (optional)

---

### Feature 4.6: Tech Stack Filter
**Component:** `TechFilter.tsx`

**Features:**
- Multi-select chips
- Show available techs from all projects
- Count projects per tech
- URL-based state (shareable)
- Analytics event on filter

---

### Feature 4.7: GitHub Stats
**Function:** `fetchGitHubRepoStats(owner, repo)`

**Uses:** GitHub REST API (free tier)

**Returns:**
```json
{
  "stars": 234,
  "forks": 45,
  "language": "TypeScript",
  "lastUpdated": "2024-02-07"
}
```

**Caching:** Store in Supabase, refresh daily

---

## Database Schema

```sql
-- Already exists
CREATE TABLE projects (
  id UUID,
  name VARCHAR,
  description TEXT,
  long_description TEXT,
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  technologies TEXT[],
  featured BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Future: repo stats table
CREATE TABLE IF NOT EXISTS repo_stats (
  id UUID PRIMARY KEY,
  repo_url VARCHAR UNIQUE,
  stars INTEGER,
  forks INTEGER,
  language VARCHAR,
  last_synced TIMESTAMP
);
```

---

## Technical Decisions

### Q: Random project order or by featured/date?
**A:** Featured first, then by date descending.

### Q: Should we sync GitHub stats in real-time?
**A:** No, too slow. Fetch once on load, cache for 24h. Fetch fresh daily via background job (Phase 2).

### Q: How to store GitHub stats?
**A:** Cache in Supabase `repo_stats` table. Query once per session.

---

## Tasks

See `/docs/tasks/EPIC_4_TASKS.md`

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Large project images slow load | Use next/image for optimization |
| GitHub API rate limits | Cache results, use personal token |
| Filtering janky on large lists | Client-side filter fine <100 projects |
| Page metrics polluted by project filters | Track analytics events properly |
