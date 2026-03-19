# Epic 6: UX/Design/Performance Optimization

**Goal:** Create a modern, performant, accessible website that achieves Lighthouse > 90 and positions you as a top-tier engineer.

**Timeline:** Week 2-4 (ongoing refinement)

**Success Criteria:**
- Lighthouse: Performance > 90, Accessibility > 90, Best Practices > 90
- Mobile responsive (tested on iOS, Android)
- WCAG AA compliant
- < 3s paint on 4G
- Zero console errors/warnings

---

## User Stories

### US 6.1: Marketing - Landing Page Hero
**As a** visitor  
**I want to** immediately understand who you are  
**So that** I decide to explore your content

**Acceptance Criteria:**
- [ ] Large, clear headline (e.g., "Full-Stack Engineer | 11+ Years | Open to Opportunities")
- [ ] Subheading with brief positioning
- [ ] Professional photo (or avatar)
- [ ] Primary CTA: "Hire Me" or "Explore Work"
- [ ] Secondary CTA: "Download Resume" or "Connect"
- [ ] Quick links to blog, projects, videos
- [ ] No scroll required for hero + CTAs

---

### US 6.2: UX - Navigation
**As a** visitor  
**I want to** easily navigate to different sections  
**So that** I find what I'm looking for

**Acceptance Criteria:**
- [ ] Fixed header with: logo, nav links, dark mode toggle
- [ ] Nav links: Home, Blog, Videos, Projects, About, Contact
- [ ] Mobile hamburger menu
- [ ] Active link indicator
- [ ] Keyboard accessible (tab through links)
- [ ] Smooth scroll anchor links

---

### US 6.3: UX - Dark Mode
**As a** visitor  
**I want to** use dark mode  
**So that** I'm comfortable reading at night

**Acceptance Criteria:**
- [ ] Toggle button in header
- [ ] Respect system preference (prefers-color-scheme)
- [ ] Save preference in localStorage
- [ ] All pages support dark mode
- [ ] Text contrast > 4.5:1 (WCAG AA)
- [ ] No flash of wrong theme on load

---

### US 6.4: Performance - Image Optimization
**As a** visitor  
**I want to** load pages quickly  
**So that** I don't bounce

**Acceptance Criteria:**
- [ ] Use next/image component
- [ ] Lazy load images (loading="lazy")
- [ ] Responsive srcset (multiple sizes)
- [ ] WebP format with JPEG fallback
- [ ] Compress all images
- [ ] Use blurred placeholder (blur data URI)
- [ ] No Cumulative Layout Shift (CLS < 0.1)

---

### US 6.5: Performance - Code Splitting
**As a** visitor  
**I want to** fast initial page load  
**So that** I can read content immediately

**Acceptance Criteria:**
- [ ] Use dynamic imports for non-critical components
- [ ] Route-based code splitting (Next.js automatic)
- [ ] Minimize JavaScript bundles
- [ ] Tree-shake unused code
- [ ] No unused dependencies
- [ ] First Contentful Paint (FCP) < 1.5s

---

### US 6.6: Accessibility - WCAG AA
**As a** visitor with disabilities  
**I want to** access content with assistive tech  
**So that** I can read your work regardless of ability

**Acceptance Criteria:**
- [ ] Semantic HTML (proper heading hierarchy)
- [ ] ARIA labels on buttons, links, forms
- [ ] Keyboard navigation (tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] Color not sole indicator (use text + icon)
- [ ] Form labels + error messages
- [ ] Skip to main content link
- [ ] No auto-playing media

---

### US 6.7: SEO - Meta Tags & Structured Data
**As a** visitor  
**I want to** see your site in search results  
**So that** people can discover you

**Acceptance Criteria:**
- [ ] Page titles (unique, < 60 chars)
- [ ] Meta descriptions (< 160 chars)
- [ ] Open Graph tags (og:title, og:description, og:image, og:url)
- [ ] Twitter Card tags
- [ ] Canonical URLs
- [ ] Schema.org markup (BlogPosting, Person, SoftwareApplication)
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Google Analytics integrated
- [ ] Search Console verification

---

### US 6.8: Responsive Design
**As a** mobile visitor  
**I want to** view this site on my phone  
**So that** I can read content on the go

**Acceptance Criteria:**
- [ ] Tested on: iPhone 12, iPhone SE, Pixel 5, tablet
- [ ] Touch targets > 44x44 px
- [ ] No horizontal scroll
- [ ] Readable font sizes (minimum 16px body)
- [ ] Proper spacing on mobile
- [ ] Images responsive (100vw on mobile)
- [ ] Buttons clickable on mobile
- [ ] No mobile-only broken features

---

## Features

### Feature 6.1: Landing Page
**Route:** `/`

**Sections:**
- Hero (headline, CTA, photo) - 100vh
- Quick intro (3-4 short paragraphs)
- Featured projects (3-4 projects)
- Latest blog posts (3 posts)
- About snippet + link to full about
- CTA: "Get in touch"
- Footer with links + social

**Style:** Modern gradient, subtle animations, clean typography

---

### Feature 6.2: Global Layout
**Component:** `RootLayout.tsx`

**Includes:**
- Header (nav, dark mode toggle)
- Main content slot
- Footer (links, copyright, social)
- Analytics (Google Analytics script)

---

### Feature 6.3: Dark Mode System
**Tech:** Tailwind CSS `dark:` utilities + `next-themes`

**Implementation:**
- Install `next-themes`
- Wrap app in `ThemeProvider`
- Add toggle button in Header
- Use Tailwind `dark:` classes

---

### Feature 6.4: Image Optimization
**Tech:** `next/image` component

**Usage:**
```tsx
<Image
  src={post.featured_image}
  alt={post.title}
  width={1200}
  height={630}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL={generateBlur(src)}
/>
```

---

### Feature 6.5: Accessibility Audit
**Tech:** axe DevTools, WAVE browser extension

**Fixes to implement:**
- Add `aria-label` to icon buttons
- Add `aria-current="page"` to nav
- Ensure heading hierarchy (h1 per page)
- Add skip links
- Test keyboard navigation

---

### Feature 6.6: SEO Components
**Files:**
- Update `layout.tsx` metadata
- Create `sitemap.ts`
- Create `robots.ts`
- Add `schema.json` to head

---

### Feature 6.7: Performance Monitoring
**Tools:**
- Lighthouse CI (GitHub Actions)
- Web Vitals (send to GA)
- Bundle analyzer (webpack-bundle-analyzer)

---

## Design System

### Colors
```
Light:
- Background: #FFFFFF
- Text: #1A1A1A
- Accent: #3B82F6 (Blue)
- Muted: #6B7280 (Gray)

Dark:
- Background: #0F172A
- Text: #F5F5F5
- Accent: #60A5FA (Light Blue)
- Muted: #9CA3AF
```

### Typography
```
Headings: Inter (sans-serif)
Body: Inter (sans-serif)
Code: Fira Code (mono)

Sizes:
- H1: 48px (mobile: 32px)
- H2: 36px (mobile: 24px)
- H3: 24px
- Body: 16px
- Small: 14px
```

### Spacing
Use Tailwind scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### Components
- Button: Primary (filled), Secondary (outline), Ghost
- Card: With shadow, no border
- Badge: For tags, categories, tech stack
- Input: With focus ring
- Textarea: With character count

---

## Testing Checklist

- [ ] Run Lighthouse (desktop + mobile) → all > 90
- [ ] Check Web Vitals → LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Test on iOS Safari
- [ ] Test on Chrome Android
- [ ] Test keyboard navigation (disable mouse)
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Run `npm run type-check` → zero errors
- [ ] Test all forms → submit, validation, errors
- [ ] Check console → zero errors, zero warnings
- [ ] Check Network tab → <3MB total, lazy load working

---

## Tasks

See `/docs/tasks/EPIC_6_TASKS.md`

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Lighthouse score won't improve | Profile with DevTools, fix largest bottlenecks |
| Dark mode broken on some pages | Test systematically, use CSS variables |
| Responsive broken on old devices | Test with real devices in dev tools |
| Accessibility issues found late | Test early with automated tools + manual |
| Bundle size too large | Analyze with webpack-bundle-analyzer |

---

## Success Criteria (Hard Requirements)

✅ **Must Have Before Launch:**
- Lighthouse > 85 (all categories)
- Mobile responsive (no horizontal scroll)
- WCAG AA (at least auto-checks pass)
- Zero TypeScript errors
- Zero console errors

⭐ **Nice to Have:**
- Lighthouse > 90 (all categories)
- WCAG AAA (full manual audit)
- Lighthouse CI in GitHub Actions
- Open Graph previews perfect
