# Epic 4: Portfolio & Projects - Task Breakdown

**Epic Goal:** Showcase projects with GitHub integration, live demos, and portfolio pages.

**Total Estimated Time:** ~12-16 hours across 2-3 weeks

---

## Phase 4A: GitHub Integration (Week 3, Days 3-4)

### Task 4.1: Create GitHub API Wrapper
**Time:** 1-2 hours  
**Depends On:** GITHUB_TOKEN in env

**What to Build:**
- File: `src/lib/github.ts`
- Functions:
  - `getGitHubUser(username)` - fetch user profile (name, bio, followers, avatar)
  - `getGitHubRepos(username)` - fetch repos list with stats
  - `getRepoDetails(username, repoName)` - fetch single repo data (stars, forks, issues, language)
  - `getGitHubStats(username)` - aggregate stats (total stars, top languages, etc.)

**Technical Details:**
- Use GitHub REST API v3
- Cache results (2 hours) to avoid rate limiting
- Use fetch + GITHUB_TOKEN in headers
- Handle errors gracefully

**Files to Create:**
- `src/lib/github.ts`
- `src/lib/cache.ts` (simple in-memory cache)

**Success Criteria:**
- [ ] Can fetch user profile
- [ ] Can fetch repos list
- [ ] Can fetch repo details
- [ ] Errors handled gracefully
- [ ] 401 if no valid token
- [ ] No TypeScript errors

**Testing:**
- [ ] Call `getGitHubUser()`, verify user data returns
- [ ] Verify rate limit respected (cached)

---

### Task 4.2: Build GitHub Profile Component
**Time:** 1 hour  
**Depends On:** Task 4.1

**What to Build:**
- Component: `src/components/github/GitHubProfile.tsx` (already exists, enhance)
- Displays:
  - GitHub avatar (profile picture)
  - Name & bio
  - Followers count
  - Repositories count
  - Link to GitHub profile
  - View on GitHub button

**Technical Details:**
- Fetch user data via API route (server-side)
- Use `next/image` for avatar
- Responsive design

**Files to Modify:**
- `src/components/github/GitHubProfile.tsx`

**Success Criteria:**
- [ ] Displays GitHub user info
- [ ] Avatar loads
- [ ] Links work
- [ ] Responsive

**Testing:**
- [ ] Load component, verify user data shows
- [ ] Click GitHub link, verify navigates

---

### Task 4.3: Create GitHub Stats Component
**Time:** 1-2 hours  
**Depends On:** Task 4.1

**What to Build:**
- Component: `src/components/github/GitHubStats.tsx`
- Displays:
  - Total repositories
  - Total stars earned
  - Most used languages (pie/bar chart)
  - Top repositories by stars
  - Contribution stats (optional)

**Technical Details:**
- Fetch stats via `getGitHubStats()`
- Calculate aggregates (total stars, languages)
- Use Recharts or Nivo for charts (optional, simple HTML/CSS if time-limited)
- Responsive card layout

**Files to Create:**
- `src/components/github/GitHubStats.tsx`
- `src/components/github/LanguageChart.tsx` (optional)

**Success Criteria:**
- [ ] Displays stats correctly
- [ ] Chart renders (if included)
- [ ] Responsive layout
- [ ] No TypeScript errors

**Testing:**
- [ ] Load component, verify stats appear
- [ ] Check calculation accuracy

---

## Phase 4B: Portfolio Project Listing (Week 3, Day 5 & Week 4, Days 1-2)

### Task 4.4: Build Projects Listing Page
**Time:** 2-3 hours  
**Depends On:** Design System, DB queries

**What to Build:**
- Page: `src/app/projects/page.tsx`
- Features:
  - List all projects (published and featured)
  - Grid layout: 3 columns (desktop), 1 column (mobile)
  - Each card: image, title, description, tech stack (tags), [View] link
  - Filter by technology (optional)
  - Filter by featured status
  - Search by title (optional)

**Technical Details:**
- Use `getProjects()` from queries
- Map over projects and use `ProjectCard` component
- Show tech stack as tags
- Featured projects highlight/pin to top
- Lazy load images

**Files to Create:**
- `src/app/projects/page.tsx`
- `src/components/projects/ProjectCard.tsx`
- `src/components/projects/ProjectGrid.tsx`

**Success Criteria:**
- [ ] Projects grid displays
- [ ] Filters work
- [ ] Responsive layout
- [ ] Images lazy load
- [ ] Lighthouse > 85

**Testing:**
- [ ] Load `/projects`, verify list appears
- [ ] Filter by tech, verify results
- [ ] View on mobile, verify responsive

---

### Task 4.5: Build Project Detail Page
**Time:** 2-3 hours  
**Depends On:** Task 4.4, Design System

**What to Build:**
- Page: `src/app/projects/[slug]/page.tsx` (if using slug or [id])
- Features:
  - Fetch project by ID
  - Display: image, title, description, long description
  - Tech stack (display as colored tags)
  - Links: GitHub link, Live demo link
  - GitHub repo stats (if available): stars, forks, issues, language
  - Related projects (optional)
  - Navigation: back button, related projects carousel
  - SEO metadata

**Technical Details:**
- Use `getProjectById(id)` or `getProjectBySlug(slug)` query
- Show repo stats fetched via GitHub API
- Format tech stack elegantly
- Build absolute URLs for OG tags

**Files to Create:**
- `src/app/projects/[slug]/page.tsx`
- `src/components/projects/ProjectContent.tsx`
- `src/components/projects/TechStack.tsx`

**Success Criteria:**
- [ ] Project loads and displays
- [ ] GitHub stats show (stars, forks, etc.)
- [ ] Tech stack tags display nicely
- [ ] Links work (GitHub, live demo)
- [ ] SEO tags generated
- [ ] Lighthouse > 85

**Testing:**
- [ ] Load project detail page
- [ ] Verify GitHub stats fetch
- [ ] Check SEO meta tags

---

### Task 4.6: Build Featured Projects Section
**Time:** 1-2 hours  
**Depends On:** Task 4.4

**What to Build:**
- Component: `src/components/projects/FeaturedProjects.tsx`
- Displays:
  - 3-4 featured projects prominently
  - Larger cards than listing
  - Show more details (longer description)
  - Highlight featured status
  - Link to projects page

**Technical Details:**
- Query projects with `featured=true`
- Carousel or grid layout
- Enhanced typography and spacing

**Files to Create:**
- `src/components/projects/FeaturedProjects.tsx`

**Success Criteria:**
- [ ] Displays featured projects distinctly
- [ ] Takes more emphasis than regular cards
- [ ] Responsive layout

**Testing:**
- [ ] Load component, verify featured projects show
- [ ] Check styling distinctive

---

## Phase 4C: Admin Project Management (Week 4, Day 2-3)

### Task 4.7: Create Project Form Component
**Time:** 2-3 hours  
**Depends On:** Epic 2 form patterns

**What to Build:**
- Component: `src/components/projects/ProjectForm.tsx`
- Form fields:
  - Project name (required)
  - Slug (auto-generated)
  - Description (short, textarea)
  - Long description (markdown editor)
  - Featured image (upload)
  - Technologies (multi-select checkboxes or chip input)
  - GitHub URL (optional, validate URL format)
  - Live demo URL (optional, validate URL format)
  - Featured toggle (boolean)
  - Status toggle (draft/published)
- Layout: 2-column (form left, preview right)

**Technical Details:**
- Use `react-hook-form` for state
- Slug auto-generated from name (on blur)
- Tech stack multi-select
- URL validation
- Parse GitHub URL to fetch repo stats (optional)

**Files to Create:**
- `src/components/projects/ProjectForm.tsx`

**Success Criteria:**
- [ ] Form renders all fields
- [ ] Slug auto-generated
- [ ] Tech multi-select works
- [ ] URL validation works
- [ ] Preview pane shows nicely
- [ ] Save Draft and Publish buttons work

**Testing:**
- [ ] Fill form, click Save
- [ ] Verify data in DB
- [ ] Verify draft vs. published status

---

### Task 4.8: Build Admin Project CRUD Pages
**Time:** 2-3 hours  
**Depends On:** Tasks 4.7, existing admin patterns

**What to Build:**
- Pages:
  - `/admin/projects` - list all projects (search, filter, bulk actions)
  - `/admin/projects/new` - create new project
  - `/admin/projects/[id]` - edit existing project
- Features:
  - Search, filter (by featured, by tech)
  - Sort (newest, alphabetical, featured first)
  - Bulk publish/unpublish
  - Delete with confirmation

**Technical Details:**
- Reuse patterns from posts/videos manager
- Use existing API routes from `/api/admin/projects`

**Files to Create:**
- `src/app/admin/projects/page.tsx`
- `src/app/admin/projects/new/page.tsx`
- `src/app/admin/projects/[id]/page.tsx`

**Success Criteria:**
- [ ] Can list projects
- [ ] Can create project
- [ ] Can edit project
- [ ] Can delete project
- [ ] Search & filters work
- [ ] Bulk actions work

**Testing:**
- [ ] Create project with form
- [ ] Edit project, verify updates
- [ ] Delete project, verify removed

---

## Phase 4D: Landing Page Integration (Week 4, Day 3-4)

### Task 4.9: Build Landing Page Hero Section
**Time:** 2-3 hours  
**Depends On:** Design System

**What to Build:**
- Component: `src/components/landing/HeroSection.tsx`
- Features:
  - Headline (your name/tagline)
  - Subheading (your expertise/elevator pitch)
  - CTA buttons: [View Portfolio], [Read Blog], [Contact]
  - Background: gradient, image, or video (optional)
  - Professional photo/avatar (optional)
  - Responsive: mobile-first

**Technical Details:**
- Animated headline (fade-in on load)
- Responsive text sizes
- CTA buttons with hover effects
- Mobile: single column, desktop: two columns

**Files to Create:**
- `src/components/landing/HeroSection.tsx`
- `src/components/landing/HeroBackground.tsx` (optional)

**Success Criteria:**
- [ ] Renders with headline and CTAs
- [ ] Responsive
- [ ] CTAs navigate to correct pages
- [ ] Professional appearance
- [ ] Lighthouse > 85

**Testing:**
- [ ] Load landing page
- [ ] Test responsive (mobile, tablet, desktop)
- [ ] Click CTAs, verify navigation

---

### Task 4.10: Build Landing Page Featured Projects Section
**Time:** 1-2 hours  
**Depends On:** Tasks 4.6

**What to Build:**
- Component: `src/components/landing/FeaturedProjectsSection.tsx`
- Features:
  - "Featured Projects" heading
  - Display 3-4 featured projects
  - Reuse FeaturedProjects component
  - Link to full projects page

**Technical Details:**
- Use existing `FeaturedProjects` component
- Reuse, don't duplicate
- Add section heading and CTA

**Files to Create:**
- `src/components/landing/FeaturedProjectsSection.tsx`

**Success Criteria:**
- [ ] Section displays
- [ ] Projects show
- [ ] Link to projects page works

**Testing:**
- [ ] Load landing page
- [ ] Verify projects section shows

---

### Task 4.11: Build Landing Page Blog Section
**Time:** 1-2 hours  
**Depends On:** Epic 1 tasks (blog listing)

**What to Build:**
- Component: `src/components/landing/BlogSection.tsx`
- Features:
  - "Latest Blog Posts" heading
  - Display 3 recent posts
  - Reuse BlogCard component
  - Link to full blog page

**Technical Details:**
- Fetch latest 3 posts
- Reuse BlogCard from Epic 1
- Section layout similar to projects section

**Files to Create:**
- `src/components/landing/BlogSection.tsx`

**Success Criteria:**
- [ ] Section displays
- [ ] Posts show
- [ ] Link to blog works

**Testing:**
- [ ] Load landing page
- [ ] Verify blog section shows

---

### Task 4.12: Build Full Landing Page
**Time:** 2-3 hours  
**Depends On:** Tasks 4.9-4.11, plus Footer

**What to Build:**
- Page: `src/app/page.tsx` (enhance OR `/app/(main)/page.tsx` format)
- Sections in order:
  1. Hero section
  2. Featured projects
  3. Latest blog posts
  4. About snippet (brief, link to full about page)
  5. CTA section ([Contact], [Newsletter])
  6. Footer

**Technical Details:**
- Server-side fetch projects and blog posts
- Use existing components
- Compose on landing page
- Generate SEO metadata
- Cache queries (revalidate 1 hour)

**Files to Modify:**
- `src/app/page.tsx`

**Success Criteria:**
- [ ] All sections render
- [ ] Data fetches correctly
- [ ] Responsive design
- [ ] SEO metadata generated
- [ ] Lighthouse > 85
- [ ] Good Web Vitals

**Testing:**
- [ ] Load homepage
- [ ] Test responsive (mobile, tablet, desktop)
- [ ] Verify Lighthouse scores

---

### Task 4.13: Implement SEO for Portfolio Pages
**Time:** 1-2 hours  
**Depends On:** Tasks 4.5, 4.12

**What to Build:**
- SEO metadata for:
  - Landing page (meta description, OG tags, schema.org)
  - Projects listing (page title, meta description)
  - Project detail (dynamic title, OG image, schema.org Project)

**Technical Details:**
- Use Next.js `generateMetadata()` for each page
- Build absolute URLs
- Include all OpenGraph tags
- Include schema.org markup (Organization on landing page, Project on project page)

**Files to Modify:**
- `src/app/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/projects/[slug]/page.tsx`

**Success Criteria:**
- [ ] Meta tags present in HTML
- [ ] OG tags correct
- [ ] Social share preview works
- [ ] Schema.org markup valid

**Testing:**
- [ ] View page source, verify meta tags
- [ ] Paste URL in social validator

---

## Phase 4E: Polish & Optimization (Week 4, Day 4-5)

### Task 4.14: Optimize Project Images & Performance
**Time:** 1-2 hours  
**Depends On:** All project tasks

**What to Build:**
- Optimizations:
  - Lazy load project images
  - Use `next/image` with blur placeholder
  - Cache GitHub API calls (2 hours)
  - Defer loading of charts (dynamic import)

**Technical Details:**
- Add `loading="lazy"` to images
- Generate blur placeholder for images
- Cache GitHub data in memory or Redis
- Use `React.lazy()` for chart component

**Success Criteria:**
- [ ] Lighthouse Performance > 90
- [ ] LCP < 2.5s
- [ ] CLS < 0.1

**Testing:**
- [ ] Run Lighthouse on project pages
- [ ] Check Core Web Vitals

---

### Task 4.15: Add Project Statistics Dashboard (Optional)
**Time:** 2-3 hours  
**Depends On:** GitHub API wrapper

**What to Build:**
- Component: `src/components/projects/ProjectStats.tsx`
- Displays for projects with GitHub repos:
  - Total stars across all projects
  - Most popular project (by stars)
  - Languages used
  - Growth trend (optional, if tracking historical data)

**Technical Details:**
- Aggregate GitHub stats
- Calculate totals and trends
- Cache results

**Files to Create:**
- `src/components/projects/ProjectStats.tsx`

**Success Criteria:**
- [ ] Stats calculate correctly
- [ ] Display clearly
- [ ] Update when new projects added

**Testing:**
- [ ] Verify calculations
- [ ] Test with multiple projects

---

## 🎯 EPIC 4 Critical Path

```
4.1 → 4.2 → 4.3
      ↓
4.4 → 4.5 → 4.6
      ↓ (parallel)
4.7 → 4.8
      ↓ (parallel)
4.9 → 4.10, 4.11 → 4.12 → 4.13 → 4.14 → 4.15
```

---

## ✅ Epic 4 Completion Checklist

**MVP Requirements:**
- [ ] GitHub profile integration works
- [ ] Projects listing page works
- [ ] Project detail page works
- [ ] Admin project CRUD works
- [ ] Featured projects component works
- [ ] Landing page built
- [ ] Hero section compelling
- [ ] Featured projects section on landing
- [ ] Blog section on landing
- [ ] SEO metadata generated
- [ ] Lighthouse > 85
- [ ] Mobile responsive

**Nice to Have:**
- [ ] GitHub stats dashboard
- [ ] Project filtering by technology
- [ ] Live demo preview in modal (Phase 2)
- [ ] Project categories (Phase 2)
- [ ] Comparison tool for projects (Phase 2)

---

## 📊 Estimated Timeline

| Phase | Tasks | Time | Dates |
|-------|-------|------|-------|
| 4A | 4.1-4.3 | 3-5 hrs | Week 3, Days 3-4 |
| 4B | 4.4-4.6 | 5-7 hrs | Week 3 Day 5 + Week 4 Days 1-2 |
| 4C | 4.7-4.8 | 4-6 hrs | Week 4, Days 2-3 |
| 4D | 4.9-4.13 | 10-15 hrs | Week 4, Days 3-5 |
| 4E | 4.14-4.15 | 3-5 hrs | Week 4, Days 4-5 |
| **TOTAL** | **15 tasks** | **25-38 hrs** | **2-3 weeks** |

---

## ⚠️ Blockers & Dependencies

- [ ] GitHub token obtained and configured
- [ ] Project database schema deployed
- [ ] Epic 1 (blog) partially complete
- [ ] Design System implemented
- [ ] Landing page routes configured
