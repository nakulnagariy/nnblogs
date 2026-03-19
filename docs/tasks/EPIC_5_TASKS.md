# Epic 5: Analytics & Tracking - Task Breakdown

**Epic Goal:** Implement comprehensive analytics to track user behavior, content performance, and engagement.

**Total Estimated Time:** ~8-10 hours across 2 weeks

---

## Phase 5A: Google Analytics Setup (Week 4, Days 1-2)

### Task 5.1: Configure Google Analytics 4
**Time:** 1 hour  
**Depends On:** Google Analytics account + NEXT_PUBLIC_GA_MEASUREMENT_ID env var

**What to Build:**
- Setup Google Analytics 4 (GA4)
- Create measurement ID (already should be in env)
- Document setup steps in `docs/ANALYTICS_SETUP.md`

**Technical Details:**
- Sign up for GA4 at analytics.google.com
- Create property for website
- Get measurement ID
- Enable: PageView events, Custom events, Ecommerce tracking

**Files to Create:**
- `docs/ANALYTICS_SETUP.md` (guide)

**Success Criteria:**
- [ ] GA4 property created
- [ ] Measurement ID in env variables
- [ ] Documentation written

**Testing:**
- [ ] View GA property in console

---

### Task 5.2: Install Google Analytics Script
**Time:** 1-2 hours  
**Depends On:** Task 5.1

**What to Build:**
- Component: `src/components/analytics/GoogleAnalytics.tsx` (already exists, enhance)
- Install gtag.js on all pages
- Track default events (pageview)
- Initialize on app load

**Technical Details:**
- Use `next/script` component
- Strategy: `lazyOnload` for performance
- gtag script ID: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Let gtag auto-track pageviews

**Files to Modify:**
- `src/components/analytics/GoogleAnalytics.tsx`
- `src/app/layout.tsx` (add GoogleAnalytics component)

**Success Criteria:**
- [ ] gtag script loads
- [ ] Pageview events fire in GA4
- [ ] Events visible in GA4 dashboard (after 24h)
- [ ] No performance impact (lazy loaded)

**Testing:**
- [ ] Load website
- [ ] Check GA4 Realtime dashboard (should show visitors)

---

### Task 5.3: Track Custom Events
**Time:** 1-2 hours  
**Depends On:** Task 5.2

**What to Build:**
- Utility: `src/lib/analytics.ts`
- Functions to track:
  - `trackPostView(postId, postTitle)` - track blog post views
  - `trackVideoView(videoId, videoTitle)` - track video views
  - `trackProjectClick(projectId, projectName)` - track project clicks
  - `trackCTAClick(ctaName)` - track CTA button clicks
  - `trackSearch(query, resultCount)` - track search queries
  - `trackSignup()` - track Clerk signup

**Technical Details:**
- Use `gtag.event()` to send custom events
- Include relevant metadata (ID, title, timestamp)
- Non-blocking (wrap in try-catch)

**Files to Create:**
- `src/lib/analytics.ts`

**Success Criteria:**
- [ ] Custom events fire correctly
- [ ] Appear in GA4 Events dashboard
- [ ] No console errors
- [ ] No TypeScript errors

**Testing:**
- [ ] Trigger events manually
- [ ] Check GA4 Events dashboard

---

## Phase 5B: Custom Analytics Data (Week 4, Days 2-3)

### Task 5.4: Build View Count Tracking in Database
**Time:** 1-2 hours  
**Depends On:** Epic 1 & 3 tasks (post/video views)

**What to Build:**
- Already partially done (incrementPostViews RPC function)
- Enhance to track:
  - Total views per post/video/project
  - Views over time (optional graph)
  - Unique views (optional, cookie-based)

**Technical Details:**
- Use existing RPC function or create one
- Update views column on each page load
- Can track unique views via browser cookies

**Files to Modify:**
- `src/lib/supabase/queries.ts` (enhance view tracking)

**Success Criteria:**
- [ ] Views increment correctly
- [ ] Shows in DB
- [ ] Appears in admin dashboard

**Testing:**
- [ ] Load post page multiple times
- [ ] Check DB views column increased

---

### Task 5.5: Create Analytics Data Models
**Time:** 1 hour  
**Depends On:** Supabase setup

**What to Build:**
- Database schema additions (if not exists):
  - `analytics_events` table: id, event_type, event_data (JSON), created_at, user_id
  - Store custom events for deeper analysis
  - Retention policy: keep 90 days

**Technical Details:**
- Create table in Supabase
- Add RLS policies for security
- Retention job (optional, Phase 2)

**Files to Modify:**
- `supabase/schema.sql` (add table)

**Success Criteria:**
- [ ] Table created in Supabase
- [ ] RLS policies set
- [ ] Can insert events

**Testing:**
- [ ] Insert test event
- [ ] Query table

---

## Phase 5C: Admin Analytics Dashboard (Week 4, Days 3-4)

### Task 5.6: Create Analytics Stats API Endpoint
**Time:** 1-2 hours  
**Depends On:** Tasks 5.4, 5.5

**What to Build:**
- Endpoint: `src/app/api/admin/analytics/stats/route.ts`
- Returns:
  ```json
  {
    "totalPageViews": 5000,
    "totalUniqueVisitors": 450,
    "topPosts": [...],
    "topVideos": [...],
    "recentEvents": [...],
    "trafficSources": {...},
    "visitsPerDay": [...]
  }
  ```

**Technical Details:**
- Query GA4 API for traffic data
- Query DB for content views
- Aggregate and format data
- Cache results (24 hours)

**Files to Create:**
- `src/app/api/admin/analytics/stats/route.ts`
- `src/lib/ga4.ts` (GA4 API client, optional)

**Success Criteria:**
- [ ] Endpoint returns analytics data
- [ ] Data accurate
- [ ] Caching works
- [ ] 401 if not authenticated

**Testing:**
- [ ] Call endpoint, verify JSON
- [ ] Verify data matches GA4 dashboard

---

### Task 5.7: Build Analytics Dashboard Page
**Time:** 2-3 hours  
**Depends On:** Tasks 5.6

**What to Build:**
- Page: `src/app/admin/analytics/page.tsx`
- Features:
  - Key metrics: total views, unique visitors, avg session time
  - Metric cards with day-over-day change (↑/↓)
  - Graphs:
    - Visits per day (line chart, last 30 days)
    - Top content (bar chart, top 10 posts/videos)
    - Traffic sources (pie chart, organic/direct/referral)
    - Device breakdown (pie chart, desktop/mobile)
  - Traffic table (recent events, hit by hit)

**Technical Details:**
- Fetch from `/api/admin/analytics/stats`
- Use Recharts for charts
- Responsive grid layout
- Optional: date range picker

**Files to Create:**
- `src/app/admin/analytics/page.tsx`
- `src/components/admin/AnalyticsDashboard.tsx`
- `src/components/admin/ChartCard.tsx`

**Success Criteria:**
- [ ] Dashboard loads
- [ ] Charts render correctly
- [ ] Data updates when refreshed
- [ ] Responsive on mobile
- [ ] No TypeScript errors

**Testing:**
- [ ] Load analytics page
- [ ] Verify charts show data
- [ ] Test on mobile

---

### Task 5.8: Build Content Performance Report
**Time:** 1-2 hours  
**Depends On:** Task 5.4

**What to Build:**
- Endpoint: `src/app/api/admin/analytics/content-performance/route.ts`
- Returns per-content analytics:
  ```json
  {
    "contentType": "posts",
    "items": [
      {
        "id": "1",
        "title": "My Post",
        "views": 234,
        "engagement": 0.45,
        "avgTimeOnPage": 125
      }
    ]
  }
  ```

**Technical Details:**
- Query posts/videos/projects with view counts
- Calculate engagement rate (views / unique visitors)
- Query GA4 for time on page (optional)

**Files to Create:**
- `src/app/api/admin/analytics/content-performance/route.ts`

**Success Criteria:**
- [ ] Endpoint returns content performance data
- [ ] Data accurate
- [ ] Sorted by views/engagement

**Testing:**
- [ ] Call endpoint, verify JSON
- [ ] Verify calculations

---

### Task 5.9: Build Content Performance Table
**Time:** 1-2 hours  
**Depends On:** Task 5.8

**What to Build:**
- Component: `src/components/admin/ContentPerformance.tsx`
- Table showing:
  - Post/Video/Project title
  - Views count
  - Engagement rate
  - Avg time on page
  - Tags: trending, underperforming (optional)

**Technical Details:**
- Sortable columns (click header to sort)
- Pagination (10 rows per page)
- Color-code engagement levels (green=good, red=poor)

**Files to Create:**
- `src/components/admin/ContentPerformance.tsx`

**Success Criteria:**
- [ ] Table renders
- [ ] Sortable columns work
- [ ] Pagination works
- [ ] Responsive on mobile

**Testing:**
- [ ] Load table
- [ ] Sort by views
- [ ] Paginate

---

## Phase 5D: Audience Insights (Week 4, Days 4-5)

### Task 5.10: Build Audience Demographics Report
**Time:** 1-2 hours  
**Depends On:** GA4 setup

**What to Build:**
- Component: `src/components/admin/AudienceDemographics.tsx`
- Shows:
  - Geographic distribution (top countries)
  - Devices (desktop/mobile/tablet breakdown)
  - Browsers
  - Operating systems
  - Languages

**Technical Details:**
- Fetch from GA4 API
- Display as pie/doughnut charts
- Update daily

**Files to Create:**
- `src/components/admin/AudienceDemographics.tsx`

**Success Criteria:**
- [ ] Shows demographic data
- [ ] Charts render
- [ ] Data updates

**Testing:**
- [ ] Load component
- [ ] Verify data accuracy in GA4

---

### Task 5.11: Build Conversion Tracking
**Time:** 1 hour  
**Depends On:** Task 5.3

**What to Build:**
- Track key conversions:
  - Clicks on CTA buttons
  - Visits to external links (GitHub, live demos)
  - Newsletter signups (if added)
  - Contact form submissions (if added)

**Technical Details:**
- Use `trackEvent()` from Task 5.3
- Call on button click
- Log to GA4

**Files to Modify:**
- `src/lib/analytics.ts` (already created)
- Various components with CTAs

**Success Criteria:**
- [ ] Conversions tracked
- [ ] Appear in GA4 Conversions
- [ ] No blocking

**Testing:**
- [ ] Click CTA buttons
- [ ] Check GA4 Conversions dashboard

---

### Task 5.12: Build Funnel Analysis (Optional)
**Time:** 2-3 hours  
**Depends On:** Task 5.11

**What to Build:**
- Track user funnels:
  - Landing page → Blog → Project detail → GitHub link click (explore code)
  - Landing page → Instagram/GitHub (social conversion)
  
**Technical Details:**
- Define funnel steps
- Track each step
- Calculate drop-off rates

**Files to Modify:**
- `src/lib/analytics.ts`
- Components in funnel path

**Success Criteria:**
- [ ] Funnel events tracked
- [ ] GA4 Funnel analysis shows data
- [ ] Drop-off rates calculated

**Testing:**
- [ ] Complete funnel path
- [ ] Check GA4 Funnel Analysis

---

## 🎯 EPIC 5 Critical Path

```
5.1 → 5.2 → 5.3
      ↓ (parallel)
5.4 → 5.5 → 5.6 → 5.7 → 5.8 → 5.9
      ↓
5.10 → 5.11 → 5.12
```

---

## ✅ Epic 5 Completion Checklist

**MVP Requirements:**
- [ ] Google Analytics installed and working
- [ ] Pageviews tracked
- [ ] Custom events tracked
- [ ] View counts in DB updated
- [ ] Analytics dashboard built
- [ ] Top content report shows
- [ ] Traffic graph shows
- [ ] Mobile responsive

**Nice to Have:**
- [ ] Audience demographics dashboard
- [ ] Conversion tracking
- [ ] Funnel analysis
- [ ] Custom event filters
- [ ] Date range picker
- [ ] PDF reports (Phase 2)

---

## 📊 Estimated Timeline

| Phase | Tasks | Time | Dates |
|-------|-------|------|-------|
| 5A | 5.1-5.3 | 3-5 hrs | Week 4, Days 1-2 |
| 5B | 5.4-5.5 | 2-3 hrs | Week 4, Days 2-3 |
| 5C | 5.6-5.9 | 5-8 hrs | Week 4, Days 3-4 |
| 5D | 5.10-5.12 | 3-5 hrs | Week 4, Days 4-5 |
| **TOTAL** | **12 tasks** | **13-21 hrs** | **2 weeks** |

---

## ⚠️ Blockers & Dependencies

- [ ] Google Analytics account created
- [ ] GA4 measurement ID obtained
- [ ] Supabase view tracking working
- [ ] Custom events tracked in app
- [ ] Epic 1, 3, 4 partially complete for content data
