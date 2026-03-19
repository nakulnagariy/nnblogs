# Epic 5: Admin Analytics Dashboard

**Goal:** Provide admin visibility into content performance, audience, and engagement.

**Timeline:** Week 3-4 (Phase 1 core, Phase 2 advanced)

**Success Criteria (MVP):**
- View total posts/videos/projects
- See traffic overview (Google Analytics integration)
- View post views count
- See most popular posts

---

## User Stories

### US 5.1: Admin - View Content Stats
**As an** admin  
**I want to** see statistics about my content  
**So that** I understand what's working

**Acceptance Criteria:**
- [ ] Dashboard cards showing:
  - [ ] Total posts (published + drafts)
  - [ ] Total videos
  - [ ] Total projects
  - [ ] Total views (sum of all)
  - [ ] Average post views
- [ ] Last 7/30/90 day comparison (optional)

---

### US 5.2: Admin - Top Content
**As an** admin  
**I want to** see my most popular posts and videos  
**So that** I can understand audience preferences

**Acceptance Criteria:**
- [ ] Table: top 10 posts by views
- [ ] Table: top 10 videos by views
- [ ] Show: title, type, date, view count
- [ ] Link to edit/view each item

---

### US 5.3: Admin - Traffic Sources (GA Integration)
**As an** admin  
**I want to** see where traffic comes from  
**So that** I can focus on effective channels

**Acceptance Criteria:**
- [ ] Google Analytics widget showing:
  - [ ] Total pageviews (last 7 days)
  - [ ] Unique visitors
  - [ ] Top referrers
  - [ ] Top landing pages
- [ ] Clickable link to full GA dashboard

---

### US 5.4: Admin - Post-Level Analytics
**As an** admin  
**I want to** see detailed analytics per post  
**So that** I can optimize content strategy

**Acceptance Criteria:**
- [ ] In post listing: show view count per post
- [ ] Click on post → see analytics:
  - [ ] Total views
  - [ ] Views over time (graph)
  - [ ] Top referrers
  - [ ] Average time on page
  - [ ] Bounce rate

---

## Features

### Feature 5.1: Admin Analytics Dashboard
**Route:** `/admin/analytics`

**Components:**
- `AnalyticsDashboard.tsx` - Main page
- `StatsCard.tsx` - Metric cards
- `TopContentTable.tsx` - Most viewed items
- `GAWidget.tsx` - Google Analytics embed
- `EngagementChart.tsx` - Views over time

---

### Feature 5.2: Google Analytics Integration
**Tech:** Google Analytics API v4

**Setup:**
1. Create Google Cloud project
2. Enable Google Analytics Data API
3. Create service account
4. Add API credentials to `.env`

**Implementation:**
- Server-side function to fetch GA data
- Revalidate every 24 hours
- Cache in Supabase (optional)

---

### Feature 5.3: View Count Tracking
**Current State:** `increment_post_views()` function exists

**Enhancement:**
- Call when user visits post page
- Track in Supabase `posts.views` column
- Use for "top content" ranking

**Note:** Not tracked in Google Analytics, only locally

---

### Feature 5.4: Engagement Metrics
**Data Points:**
- Page views (from GA)
- Time on page (from GA)
- Bounce rate (from GA)
- Social shares (optional)
- Comments (Phase 2)

---

## Database Schema (Enhancements)

```sql
-- Already exists: posts.views, videos.views

-- Future: engagement logs
CREATE TABLE engagement_events (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id),
  event_type VARCHAR, -- 'view', 'share', 'comment'
  user_session_id VARCHAR,
  timestamp TIMESTAMP
);

-- Future: user analytics
CREATE TABLE user_analytics (
  id UUID PRIMARY KEY,
  user_id VARCHAR,
  session_id VARCHAR,
  pages_visited TEXT[],
  first_visit TIMESTAMP,
  last_visit TIMESTAMP
);
```

---

## Environment Setup

```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: GA API credentials (for server-side data)
GOOGLE_APPLICATION_CREDENTIALS_JSON=... (Phase 2)
```

---

## Implementation Plan (MVP)

**Week 3:**
1. Add `/admin/analytics` page
2. Display basic stats cards
3. Integrate Google Analytics via `gtag`
4. Show top content table
5. Test data loading

**Week 4+:**
1. Post-level analytics detail pages
2. GA API server-side integration
3. Advanced charts & trends
4. Export reports (PDF/CSV)

---

## Technical Decisions

### Q: Use GA API or just display GA dashboard link?
**A:** MVP: Display GA dashboard link. Phase 2: Fetch data server-side for custom dashboard.

### Q: What about privacy (GDPR, etc.)?
**A:** GA is GDPR compliant with proper consent. We don't store personal data ourselves.

### Q: How to track engagement without Google Analytics?
**A:** For now, only track view counts in Supabase. Phase 2 add event logging.

---

## Tasks

See `/docs/tasks/EPIC_5_TASKS.md`

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| GA API quota exceeded | Cache results, check free tier limits |
| Slow dashboard load | Async load GA data, show skeleton |
| Privacy concerns with GA | Add privacy notice, ensure GDPR consent |
| Inaccurate view counts | Use indexed database queries |

---

## Success Metrics

- Admin loads analytics dashboard < 2 seconds
- GA data refreshes every 24 hours
- View count accuracy > 99%
- No TypeScript errors
