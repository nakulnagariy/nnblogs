# Landing Page - Wireframe & Specs

**Purpose:** Create powerful first impression and drive action

**Goal:** Show expertise (11+ years), credibility, and clear CTAs

---

## 📐 Page Structure

```
┌─────────────────────────────────────────────────────┐
│  HEADER (Sticky)                                    │
│  Logo | Nav (Blog, Videos, Projects, About) | Theme │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                                                     │
│              HERO SECTION (100vh)                   │
│                                                     │
│        "Senior Full-Stack Engineer"                 │
│        "Building scalable systems for 11+ years"    │
│                                                     │
│        [Primary CTA] [Secondary CTA]                │
│                                                     │
│        Professional Photo / Avatar (right side)     │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  INTRO SECTION                                      │
│  "Who I Am" - 3-4 short paragraphs                  │
│                                                     │
│  Highlights: 11+ years, expertise areas, values     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  FEATURED PROJECTS                                  │
│  3-4 project cards in grid (3 cols on desktop)     │
│  Each card: image, name, short desc, tech badges   │
│                                                     │
│  [View All Projects →]                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  LATEST BLOG POSTS                                  │
│  3 blog cards in grid                              │
│  Each card: featured image, title, date, excerpt   │
│                                                     │
│  [View All Blog Posts →]                            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ABOUT SNIPPET                                      │
│  Brief bio + photo                                  │
│  [Read Full Bio →]                                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  CTA SECTION                                        │
│  "Let's Work Together"                             │
│  "Open to freelance, consulting, opportunities"    │
│                                                     │
│  [Get in Touch] [Download Resume]                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  FOOTER                                             │
│  Copyright | Links | Social Icons                   │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Section Details

### 1. HEADER (Sticky, 64px height)

**Layout:**
```
[Logo] [Nav Links] [Theme Toggle] [Menu Button (mobile)]
```

**Components:**
- Logo (24px, left)
- Nav links: Home, Blog, Videos, Projects, About (hidden on mobile)
- Dark mode toggle (sun/moon icon)
- Hamburger menu (mobile only)

**Styling:**
- Background: White (light) / Dark Navy (dark)
- Border bottom: 1px gray divider
- Sticky positioning
- z-index: 100

---

### 2. HERO SECTION (100vh, gradient background)

**Layout (Desktop):**
```
┌─────────────────────────────────┬──────────────────┐
│  Left (60%)                     │  Right (40%)     │
│                                 │                  │
│  Headline (H1)                  │  Professional    │
│  Subheading (Large body)        │  Photo (500x500) │
│                                 │                  │
│  [Primary CTA] [Secondary CTA]  │                  │
│                                 │                  │
│  Quick stats:                   │                  │
│  "11+ Years | Full-Stack"       │                  │
└─────────────────────────────────┴──────────────────┘
```

**Layout (Mobile):**
```
┌──────────────────┐
│  Photo (centered)│
│                  │
│  Headline        │
│  Subheading      │
│  [Primary CTA]   │
│  [Secondary CTA] │
└──────────────────┘
```

**Content:**
```
Headline (H1, 48px):
"Senior Full-Stack Engineer"

Subheading (18px, muted):
"11+ years building scalable systems | Open to opportunities"

Stats (small, below text):
"11+ Years" | "50+ Projects" | "10+ Teams"
```

**CTAs:**
- Primary: "Hire Me" → mailto: or contact form
- Secondary: "Explore My Work" → scroll to projects

**Design Notes:**
- Background: Subtle gradient (blue to purple)
- Photo: Rounded corners, subtle shadow, lazy load
- No scroll required to see both CTAs
- Responsive text sizing (32px H1 on mobile)

---

### 3. INTRO SECTION (About Me)

**Layout:**
```
┌─────────────────────────────────┐
│  "About Me" (small label)       │
│  Headline (H2)                  │
│                                 │
│  3-4 paragraphs (60 chars wide) │
│                                 │
│  Highlights (bullet points):    │
│  • Years of Experience          │
│  • Expertise Areas              │
│  • Values & Vision              │
└─────────────────────────────────┘
```

**Content Ideas:**
- Brief personal story (not boring resume)
- What you enjoy building
- Industries or domains you excel in
- Why you love what you do

**Styling:**
- Max-width: 700px (centered)
- Padding: 96px vertical, 32px horizontal
- Light background (gray 50 light / gray 900 dark)

---

### 4. FEATURED PROJECTS

**Layout (Grid):**
```
Desktop (3 columns):
┌─────────────┬─────────────┬─────────────┐
│  Project 1  │  Project 2  │  Project 3  │
├─────────────┼─────────────┼─────────────┤
│  Card       │  Card       │  Card       │
└─────────────┴─────────────┴─────────────┘

Tablet (2 columns):
┌──────────────┬──────────────┐
│  Project 1   │  Project 2   │
├──────────────┼──────────────┤
│  Card        │  Card        │
├──────────────┼──────────────┤
│  Project 3   │              │
└──────────────┴──────────────┘

Mobile (1 column):
┌──────────┐
│Project 1 │
├──────────┤
│Project 2 │
├──────────┤
│Project 3 │
└──────────┘
```

**Card Design:**
```
┌────────────────────────────┐
│   Project Image (16:9)     │ ← Featured image, lazy load
├────────────────────────────┤
│  Project Name (H4, bold)   │
│  Short description (2 lines)
│                            │
│  [Tech badges] [Tech badges]
│                            │
│  [View Details →]          │
└────────────────────────────┘
```

**Styling:**
- Card shadow, border, rounded corners
- Hover effect: scale 1.02, shadow increase
- Tech badges: Small pill badges
- Gap: 24px between cards
- Padding: 96px vertical, 32px horizontal (centered container)

**Content:**
- Display 3-4 "featured" projects (toggle `featured` flag in admin)
- Show best/most impressive work
- Include projects that show different tech stacks

**CTA:**
- "[View All Projects →]" button below grid
- Links to /projects full page

---

### 5. LATEST BLOG POSTS

**Layout (Same as projects but 3 cards):**
```
┌─────────────┬─────────────┬─────────────┐
│  Post 1     │  Post 2     │  Post 3     │
└─────────────┴─────────────┴─────────────┘
```

**Card Design:**
```
┌────────────────────────────┐
│   Featured Image (16:9)    │ ← Lazy load, WebP
├────────────────────────────┤
│  Category Badge            │
│  Post Title (H4)           │
│  Excerpt (2-3 lines)       │
│  Date | Read Time          │
│                            │
│  [Read Article →]          │
└────────────────────────────┘
```

**Styling:**
- Same visual treatment as projects
- Hover: similar effects
- Date in small gray text

**Content:**
- Latest 3 published posts
- Fetch from DB with `getRecentPosts(3)`

**CTA:**
- "[Read All Blog Posts →]" below
- Links to /blog

---

### 6. ABOUT SNIPPET

**Layout:**
```
┌────────────┬─────────────────────┐
│ Photo      │  About Bio          │
│ (200x200)  │  2-3 paragraphs     │
│            │  [Full Bio →]       │
└────────────┴─────────────────────┘
```

**Styling:**
- Gray background (secondary)
- Two-column on desktop, stack on mobile
- Smaller section (not overwhelming)

---

### 7. CTA SECTION ("Let's Work Together")

**Layout:**
```
┌─────────────────────────────────┐
│  Headline (H2, centered)        │
│  "Let's Work Together"          │
│                                 │
│  Subtext (centered, smaller)    │
│  "Open to freelance, contracts" │
│                                 │
│  [Get in Touch] [Download CV]   │
│                                 │
│  Email + Social Links (small)   │
└─────────────────────────────────┘
```

**Styling:**
- Background: Gradient (accent color)
- White text
- Padding: 80px vertical
- Centered content
- Buttons side-by-side (desktop), stacked (mobile)

---

### 8. FOOTER

**Layout:**
```
┌──────────────┬──────────────┬──────────────┐
│  Links       │  Company     │  Social      │
│  • Blog      │  • Terms     │  • GitHub    │
│  • Projects  │  • Privacy   │  • Twitter   │
│  • About     │              │  • LinkedIn  │
└──────────────┴──────────────┴──────────────┘

Copyright © 2024. All Rights Reserved.
```

**Styling:**
- Gray background (darker)
- Small text, muted color
- Padding: 64px vertical, 32px horizontal

---

## 📱 Responsive Breakpoints

| Breakpoint | Hero | Projects | Posts |
|-----------|------|----------|-------|
| Mobile (0-639px) | Centered, stacked | 1 col | 1 col |
| Tablet (640-1023px) | Left-right stacked | 2 col | 2 col |
| Desktop (1024px+) | Optimized 60/40 | 3 col | 3 col |

---

## 🎨 Color & Styling

**Background:**
- Light mode: White (#FFFFFF)
- Dark mode: Dark navy (#0F172A)

**Accent Sections:**
- Intro: Gray 50 (light) / Gray 900 (dark)
- CTA: Gradient blend (primary to secondary)

**Typography:**
- Hero H1: 48px (mobile: 32px), bold
- Subheading: 18px, muted
- Body: 16px, standard
- Cards: H4 (20px) for titles

---

## ⚡ Performance Considerations

- [ ] Images lazy load (Intersection Observer)
- [ ] Use `next/image` for optimization
- [ ] WebP format with JPEG fallback
- [ ] Blurred placeholder images
- [ ] Infinite scroll or pagination for posts
- [ ] Hero background: simple gradient (no large images)

---

## ✅ Interaction Design

- Smooth scroll behavior
- Button hover states (scale, shadow)
- Navigation fixed position with transparency
- Dark mode toggle smooth transition
- Mobile menu slide-in from right
- Cards lift on hover
- Links underline on focus

---

## 🎯 Success Metrics (Post-Launch)

- Lighthouse score > 90
- Mobile responsive > 85
- Accessibility > 90
- Time to interactive < 2s
- First contentful paint < 1.5s
