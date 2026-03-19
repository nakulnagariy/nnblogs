# Epic 3: Video System

**Goal:** Support both YouTube embeds and self-hosted videos with metadata and performance optimization.

**Timeline:** Week 2-3

**Decision Point:** YouTube vs. Self-Hosted

---

## Decision: When to Use Each

### YouTube Embeds (Recommended Default)
✅ **When to use:**
- Existing YouTube videos
- Want free hosting/bandwidth
- Simple embedding
- Analytics via YouTube

❌ **Downsides:**
- Brand not on your domain
- YouTube ads (if account not monetized)
- Limited customization

### Self-Hosted (Supabase Storage)
✅ **When to use:**
- Want full control
- Custom branding
- Privacy concerns
- Want all analytics on your site

❌ **Downsides:**
- Storage + bandwidth costs
- Need to transcode/optimize
- Video delivery performance

### Recommendation
**Hybrid approach:**
- Default to YouTube for public videos
- Self-host only if needed for control
- Support both in the platform

---

## User Stories

### US 3.1: Admin - Add YouTube Video
**As an** admin  
**I want to** add a YouTube video to my platform  
**So that** I can share educational content

**Acceptance Criteria:**
- [ ] Form with: title, description, YouTube URL (or video ID), thumbnail, category, tags, duration
- [ ] Auto-extract video ID from URL
- [ ] Fetch video metadata from YouTube API (optional)
- [ ] Preview embedded video
- [ ] Store video metadata in DB
- [ ] Publish/draft workflow
- [ ] Same as blog post admin experience

---

### US 3.2: Admin - Upload Self-Hosted Video
**As an** admin  
**I want to** upload a video to my own storage  
**So that** I have full control and branding

**Acceptance Criteria:**
- [ ] File picker for video upload
- [ ] Progress bar during upload
- [ ] Validate format (mp4, webm, mov)
- [ ] Max file size 100MB (configurable)
- [ ] Generate thumbnail (from uploaded image or first frame)
- [ ] Store video URL in DB
- [ ] Same metadata fields as YouTube

**Technical Notes:**
- Upload to `videos` Supabase bucket
- Store file path in `videos.video_url`
- Thumbnail to `videos-thumbnails` bucket

---

### US 3.3: Public - Watch YouTube Video
**As a** visitor  
**I want to** watch a YouTube video embedded on your site  
**So that** I can learn from your channel

**Acceptance Criteria:**
- [ ] YouTube player embedded (responsive)
- [ ] Title, description, date, views displayed
- [ ] Category + tags shown
- [ ] Next/previous video navigation (optional)
- [ ] Related videos suggested (optional)
- [ ] Social share buttons
- [ ] SEO metadata (OpenGraph)

---

### US 3.4: Public - Watch Self-Hosted Video
**As a** visitor  
**I want to** watch a video hosted on your platform  
**So that** I can view your exclusive content

**Acceptance Criteria:**
- [ ] HTML5 video player (or use HLS.js for streaming)
- [ ] Responsive design (mobile-friendly)
- [ ] Play, pause, speed controls
- [ ] Progress bar
- [ ] Fullscreen support
- [ ] Lazy loading (don't load until play)
- [ ] Thumbnail preview before play

---

### US 3.5: Public - Videos Homepage
**As a** visitor  
**I want to** see all available videos  
**So that** I can browse your content

**Acceptance Criteria:**
- [ ] Grid of video cards (YouTube + self-hosted)
- [ ] Each card shows: thumbnail, title, duration, date
- [ ] Clickable card links to video detail page
- [ ] Filter by category (optional)
- [ ] Search by title/tags (optional)
- [ ] Pagination or "load more"

---

## Features

### Feature 3.1: YouTube Embed Component
**Component:** `YouTubeEmbed.tsx`

```tsx
interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  aspectRatio?: 'video' | 'thumbnail'; // 16:9 or responsive
}
```

**Responsibility:**
- Extract video ID from URL
- Render responsive iframe
- Handle lazy loading
- Fallback for disabled embeds

---

### Feature 3.2: HTML5 Video Player
**Component:** `VideoPlayer.tsx`

**Tech:** Native `<video>` element + optional `hls.js` for streaming

**Features:**
- Play, pause, seek
- Speed control (0.5x - 2x)
- Fullscreen
- Picture-in-picture
- Subtitle support (optional, Phase 2)
- Analytics events (on play, pause, complete)

---

### Feature 3.3: Video CRUD API
**Endpoints:**
- `POST /api/admin/videos` - Create
- `GET /api/admin/videos` - List (admin)
- `PUT /api/admin/videos/[id]` - Update
- `DELETE /api/admin/videos/[id]` - Delete
- `POST /api/admin/upload/video` - Upload to Storage

**Protection:** Clerk auth

---

### Feature 3.4: Video Queries
**File:** `src/lib/supabase/queries.ts`

**Functions:**
- `getVideos(page, category)` - Public list
- `getVideoBySlug(slug)` - Public single video
- `getFeaturedVideos(limit)` - Top viewed

**Already partially implemented**

---

### Feature 3.5: Video Metadata & SEO
**Tech:** Next.js Metadata API

**Fields:**
- Title, description, thumbnail (OG image)
- Duration, category, tags
- View count, publish date
- Schema.org `VideoObject` markup

---

## Database Schema

```sql
-- Already exists
CREATE TABLE videos (
  id UUID,
  title VARCHAR,
  slug VARCHAR UNIQUE,
  description TEXT,
  video_url TEXT, -- YouTube URL or Supabase file path
  thumbnail_url TEXT,
  duration VARCHAR,
  category VARCHAR,
  tags TEXT[],
  author_id VARCHAR,
  published BOOLEAN,
  views INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## Technical Decisions

### Q: Should we use YouTube API?
**A:** Only if you want to auto-fetch metadata. For MVP, manual entry is fine.

### Q: How to handle video transcoding?
**A:** Supabase Storage doesn't transcode. For Phase 2, consider:
- Cloudinary (free transcoding)
- Mux (streaming)
- AWS Elemental

### Q: How to optimize video delivery?
**A:** Use Supabase CDN or add a separate CDN like Cloudflare.

---

## Tasks

See `/docs/tasks/EPIC_3_TASKS.md`

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| YouTube videos slow page load | Lazy load iframes with intersection observer |
| Self-hosted videos are slow | Use CDN for video delivery |
| Storage costs spike | Monitor usage, set quotas in Supabase |
| Video player UX varies by device | Test on mobile, iOS, Android |
| Thumbnail missing | Provide fallback image + upload prompt |
