# Epic 3: Video System - Task Breakdown

**Epic Goal:** Support both YouTube embeds and self-hosted videos with metadata and performance optimization.

**Total Estimated Time:** ~10-12 hours across 2 weeks

---

## Phase 3A: YouTube Integration (Week 2, Days 4-5)

### Task 3.1: Create YouTube Embed Component
**Time:** 1-2 hours  
**Depends On:** Design System

**What to Build:**
- Component: `src/components/videos/YouTubeEmbed.tsx`
- Features:
  - Accepts YouTube URL or video ID
  - Renders responsive iframe (16:9 aspect ratio)
  - Lazy loads on scroll (Intersection Observer)
  - Fallback image if embed fails
  - No auto-play (user clicks to play)

**Technical Details:**
- Extract video ID from URL: `youtube.com/watch?v=ID` → extract `ID`
- iframe src: `https://www.youtube-nocookie.com/embed/{ID}`
- Use Intersection Observer for lazy load
- CSS: aspect-ratio container (16/9)

**Files to Create:**
- `src/components/videos/YouTubeEmbed.tsx`
- `src/lib/youtube.ts` (utility functions)

**Success Criteria:**
- [ ] Renders YouTube video
- [ ] Responsive on mobile/desktop
- [ ] Lazy loads (check Network tab)
- [ ] Aspect ratio maintained (no CLS)
- [ ] No TypeScript errors

**Testing:**
- [ ] Render with video ID, verify iframe shows
- [ ] Check Network tab, verify lazy load
- [ ] Load on mobile, verify responsive
- [ ] Check Lighthouse, verify no CLS

---

### Task 3.2: Add YouTube Form Fields to Video CRUD
**Time:** 1 hour  
**Depends On:** Task 1.4 (form pattern)

**What to Build:**
- Enhance: Video form fields
- Add: "Video Source" selector (YouTube or Self-Hosted)
- If YouTube:
  - YouTube URL input (e.g., youtube.com/watch?v=...)
  - Auto-extract video ID on blur
  - Show video preview in real-time
- Store: video URL in DB (as YouTube URL or file path)

**Technical Details:**
- Conditional form fields based on source selector
- Extract ID and validate URL format
- Show preview of video (iframe)

**Files to Modify:**
- `src/components/videos/VideoForm.tsx` (create or enhance)

**Success Criteria:**
- [ ] Can select YouTube as source
- [ ] Can paste YouTube URL
- [ ] Preview shows video
- [ ] URL validation works
- [ ] Saves to DB correctly

**Testing:**
- [ ] Paste valid YouTube URL, verify preview
- [ ] Paste invalid URL, verify error message
- [ ] Submit form, verify URL saved in DB

---

### Task 3.3: Create Video Detail Page (YouTube)
**Time:** 2-3 hours  
**Depends On:** Task 3.1, Design System

**What to Build:**
- Page: `src/app/videos/[slug]/page.tsx` (already partially created, enhance)
- Features:
  - Fetch video by slug
  - Display title, description, date, views
  - Render YouTube embed or HTML5 player
  - Show category & tags
  - Next/previous video navigation
  - Related videos (optional)
  - SEO metadata

**Technical Details:**
- Use `getVideoBySlug(slug)` to fetch
- Check video_url format (YouTube URL or file path)
- Render appropriate player
- Generate SEO metadata with `generateMetadata()`

**Files to Enhance:**
- `src/app/videos/[slug]/page.tsx`

**Success Criteria:**
- [ ] Page loads video
- [ ] YouTube video plays
- [ ] Metadata displays
- [ ] SEO tags generated
- [ ] Navigation works
- [ ] Lighthouse > 85

**Testing:**
- [ ] Load YouTube video page
- [ ] Video plays
- [ ] Check page metadata in browser dev tools

---

## Phase 3B: Self-Hosted Videos (Week 3, Days 1-2)

### Task 3.4: Build HTML5 Video Player Component
**Time:** 2-3 hours  
**Depends On:** Design System

**What to Build:**
- Component: `src/components/videos/VideoPlayer.tsx`
- Features:
  - HTML5 `<video>` element
  - Controls: play, pause, seek, volume, fullscreen
  - Speed control (0.5x, 1x, 1.5x, 2x)
  - Keyboard shortcuts (space to play, arrows to seek)
  - Progress bar with hover preview
  - Picture-in-picture support
  - Responsive & mobile-friendly
  - Lazy loads video (don't fetch until play)

**Technical Details:**
- Custom controls (don't use browser default)
- Use `<video>` element with `src` or `<source>`
- CSS: 16:9 aspect ratio container
- JavaScript: event listeners for controls
- Accessibility: ARIA labels, keyboard support

**Files to Create:**
- `src/components/videos/VideoPlayer.tsx`
- `src/components/videos/VideoPlayerControls.tsx`

**Success Criteria:**
- [ ] Video plays/pauses
- [ ] Seek works
- [ ] Volume control works
- [ ] Speed control works
- [ ] Fullscreen works
- [ ] Keyboard shortcuts work
- [ ] Responsive on mobile
- [ ] No TypeScript errors

**Testing:**
- [ ] Click play, video plays
- [ ] Keyboard: spacebar pauses/resumes
- [ ] Keyboard: arrow right seeks forward 5s
- [ ] Click fullscreen, verifies fullscreen
- [ ] Test on mobile, verify responsive

---

### Task 3.5: Add Self-Hosted Video Upload to Form
**Time:** 1-2 hours  
**Depends On:** Tasks 2.10, 3.2

**What to Build:**
- Enhance: Video form
- Add: Video file upload field
- Features:
  - Drag-and-drop or file picker
  - Accepts mp4, webm, mov
  - Max 100MB
  - Progress bar during upload
  - Displays video URL after upload
  - Can use `<video>` preview to verify file

**Technical Details:**
- POST to `/api/admin/upload` with file
- Upload to `videos` Supabase bucket
- Return URL to form
- Store in `video_url` field

**Files to Modify:**
- `src/components/videos/VideoForm.tsx`
- Use: `src/components/admin/VideoUpload.tsx` (from Epic 2, Task 2.12)

**Success Criteria:**
- [ ] Can upload video file
- [ ] Shows progress
- [ ] Returns URL
- [ ] Form saves URL correctly

**Testing:**
- [ ] Upload video, verify in Supabase Storage
- [ ] Access video via URL, verify plays

---

### Task 3.6: Create Video Detail Page (Self-Hosted)
**Time:** 1-2 hours  
**Depends On:** Tasks 3.3, 3.4

**What to Build:**
- Enhance: `src/app/videos/[slug]/page.tsx`
- Add logic to:
  - Detect video source (YouTube vs. self-hosted)
  - Render appropriate player (YouTubeEmbed or VideoPlayer)
  - Load video URL from DB and pass to player

**Technical Details:**
- Check `video_url` format:
  - If contains "youtube.com" or "youtu.be": render YouTubeEmbed
  - Otherwise: render VideoPlayer

**Files to Modify:**
- `src/app/videos/[slug]/page.tsx`

**Success Criteria:**
- [ ] Self-hosted video plays with VideoPlayer
- [ ] YouTube video plays with YouTubeEmbed
- [ ] Auto-detects source correctly

**Testing:**
- [ ] Load YouTube video, verify YouTubeEmbed renders
- [ ] Load self-hosted video, verify VideoPlayer renders

---

## Phase 3C: Videos Listing & Management (Week 3, Day 2-3)

### Task 3.7: Build Videos Listing Page
**Time:** 2-3 hours  
**Depends On:** Design System, `getVideos()` query

**What to Build:**
- Page: `src/app/videos/page.tsx` (already created, enhance)
- Features:
  - List all published videos (paginated)
  - Grid layout: 3 columns (desktop), 1 column (mobile)
  - Each card: thumbnail, title, duration, date, views, [Watch] link
  - Filter by category, search by title
  - Pagination (10 per page)

**Technical Details:**
- Use `getVideos(page, category)` from queries
- Map over results and use `VideoCard` component
- Show loading skeleton while fetching
- Lazy load video thumbnails

**Files to Create:**
- Enhance: `src/app/videos/page.tsx`
- Create: `src/components/videos/VideoCard.tsx`
- Create: `src/components/videos/VideoGrid.tsx`

**Success Criteria:**
- [ ] Videos grid displays
- [ ] Pagination works
- [ ] Filters work
- [ ] Responsive layout
- [ ] Lighthouse > 85

**Testing:**
- [ ] Load `/videos`, verify list appears
- [ ] Test pagination
- [ ] View on mobile, verify 1 column

---

### Task 3.8: Enhance Video Form with Thumbnail Upload
**Time:** 1-2 hours  
**Depends On:** Tasks 3.2, 3.5, 2.10

**What to Build:**
- Enhance: Video form
- Add: Thumbnail upload field
- Features:
  - Upload image (jpg, png, webp)
  - Max 10MB
  - Show preview of thumbnail
  - Auto-fill from YouTube thumbnail (optional)
  - Display in all video cards

**Technical Details:**
- POST to `/api/admin/upload` with thumbnail
- Upload to `videos-thumbnails` bucket
- Store URL in `thumbnail_url` field

**Files to Modify:**
- `src/components/videos/VideoForm.tsx`

**Success Criteria:**
- [ ] Can upload thumbnail
- [ ] Preview shows
- [ ] URL saves correctly
- [ ] Shows in video cards

**Testing:**
- [ ] Upload thumbnail, verify in cards
- [ ] Create video with thumbnail, verify displays

---

### Task 3.9: Build Admin Video CRUD Pages
**Time:** 1-2 hours  
**Depends On:** Epic 2 tasks (already built similar for posts)

**What to Build:**
- Enhance: `/admin/videos` and `/admin/videos/new` pages
- Add video-form component with all fields
- Reuse patterns from posts manager

**Files to Modify:**
- `src/app/admin/videos/page.tsx` (enhance with search/filters)
- Create: `src/app/admin/videos/new/page.tsx`
- Create: `src/app/admin/videos/[id]/page.tsx`

**Success Criteria:**
- [ ] Can create video
- [ ] Can edit video
- [ ] Can delete video
- [ ] Search & filters work

**Testing:**
- [ ] Create video via admin, verify in DB
- [ ] Edit video, verify updates
- [ ] Delete video, verify removed

---

## Phase 3D: SEO & Performance (Week 3, Day 4)

### Task 3.10: Implement Video SEO Metadata
**Time:** 1-2 hours  
**Depends On:** Task 3.3

**What to Build:**
- SEO fields for videos:
  - Page title (from video.title)
  - Meta description (from video.description)
  - OG image (from thumbnail_url)
  - OG video URL (embed URL)
  - Schema.org markup (VideoObject)
  - Twitter Card tags

**Technical Details:**
- Use Next.js `generateMetadata()` in `[slug]/page.tsx`
- Build absolute URLs
- Include all required OpenGraph tags
- Add VideoObject schema

**Files to Modify:**
- `src/app/videos/[slug]/page.tsx`

**Success Criteria:**
- [ ] Meta tags render in HTML
- [ ] OG video tag present
- [ ] Social share preview works
- [ ] No TypeScript errors

**Testing:**
- [ ] View page source, verify meta tags
- [ ] Paste URL into Twitter card validator

---

### Task 3.11: Optimize Video Delivery Performance
**Time:** 1-2 hours  
**Depends On:** All video tasks

**What to Build:**
- Optimizations:
  - Lazy load video thumbnails
  - Defer loading of video player code (dynamic import)
  - Cache video queries (revalidate 1 hour)
  - Use CloudFlare or Supabase CDN for videos
  - Add video bitrate variants (if time allows)

**Technical Details:**
- Add `loading="lazy"` to thumbnail images
- Use `React.lazy()` for video player
- Next.js `revalidateTag` for ISR
- Document CDN setup in `docs/`

**Success Criteria:**
- [ ] Lighthouse Performance > 90
- [ ] Video page LCP < 2.5s
- [ ] CLS < 0.1

**Testing:**
- [ ] Run Lighthouse on video page
- [ ] Check Core Web Vitals

---

### Task 3.12: Add Video Statistics Tracking
**Time:** 1 hour  
**Depends On:** Task 3.3 (add incrementVideoViews function)

**What to Build:**
- Enhance: tracking views for videos
- Add: increment view count on video page load
- Add: analytics in admin dashboard

**Technical Details:**
- Use similar pattern to posts (incrementPostViews)
- Call RPC function on page load
- Track in admin analytics

**Files to Modify:**
- `src/lib/supabase/queries.ts` (add incrementVideoViews)
- `src/app/videos/[slug]/page.tsx`

**Success Criteria:**
- [ ] View count increments on page load
- [ ] Shows in DB
- [ ] Shows in analytics dashboard

**Testing:**
- [ ] Load video page, check DB views increment

---

## 🎯 EPIC 3 Critical Path

```
3.1 → 3.2 → 3.3
      ↓
3.4 → 3.5 → 3.6
      ↓ (parallel)
3.7, 3.8, 3.9 → 3.10 → 3.11 → 3.12
```

---

## ✅ Epic 3 Completion Checklist

**MVP Requirements:**
- [ ] YouTube embed component works
- [ ] YouTube video detail page works
- [ ] Self-hosted video player works
- [ ] Self-hosted video upload works
- [ ] Videos listing page works
- [ ] Admin video CRUD works
- [ ] Video SEO metadata works
- [ ] Performance optimized (Lighthouse > 85)
- [ ] Mobile responsive

**Nice to Have:**
- [ ] Video transcoding (Phase 2)
- [ ] HLS streaming (Phase 2)
- [ ] Video captions/subtitles (Phase 2)
- [ ] Video playlists (Phase 2)
- [ ] Analytics per video (Phase 2)

---

## 📊 Estimated Timeline

| Phase | Tasks | Time | Dates |
|-------|-------|------|-------|
| 3A | 3.1-3.3 | 4-6 hrs | Week 2, Days 4-5 |
| 3B | 3.4-3.9 | 8-11 hrs | Week 3, Days 1-3 |
| 3C | 3.7-3.9 | Included above | |
| 3D | 3.10-3.12 | 3-5 hrs | Week 3, Day 4 |
| **TOTAL** | **12 tasks** | **15-22 hrs** | **2 weeks** |

---

## ⚠️ Blockers & Dependencies

- [ ] Supabase Storage buckets created (videos, videos-thumbnails)
- [ ] File upload API working (Epic 2, Task 2.10)
- [ ] Video queries in Supabase working
- [ ] Design System implemented
