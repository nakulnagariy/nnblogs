# Epic 6: UX Polish & Performance - Task Breakdown

**Epic Goal:** Refine user experience, ensure accessibility standards, and optimize performance for production.

**Total Estimated Time:** ~10-14 hours across 2-3 weeks

---

## Phase 6A: Dark Mode Implementation (Week 4, Days 3-5)

### Task 6.1: Install & Configure Next Themes
**Time:** 1-2 hours  
**Depends On:** Design System (dark mode tokens)

**What to Build:**
- Install: `npm install next-themes`
- Setup `ThemeProvider` in app layout
- Store theme preference in localStorage
- Support: light, dark, system (default)

**Technical Details:**
- Wrap app in `<ThemeProvider>`
- Use CSS variables for colors (light/dark)
- Respect `prefers-color-scheme` media query
- No flash of unstyled content (FOUC)

**Files to Modify:**
- `src/app/layout.tsx` (add ThemeProvider)
- `src/styles/globals.css` (add CSS variables for dark mode)
- `tailwind.config.ts` (if using Tailwind dark mode)

**Success Criteria:**
- [ ] Theme provider initializes
- [ ] CSS variables defined for light/dark
- [ ] No FOUC on page load
- [ ] No TypeScript errors

**Testing:**
- [ ] Load page, verify light mode
- [ ] Toggle theme, verify dark mode
- [ ] Refresh page, verify theme persists
- [ ] Check system preference, verify respected

---

### Task 6.2: Create Theme Toggle Component
**Time:** 1 hour  
**Depends On:** Task 6.1

**What to Build:**
- Component: `src/components/ui/ThemeToggle.tsx`
- Features:
  - Button to toggle light/dark/system
  - Show current theme (icon changes)
  - Place in header navbar
  - Tooltip: "Toggle dark mode"

**Technical Details:**
- Use `useTheme()` hook from next-themes
- SVG icons for sun/moon
- Smooth transition between themes
- Accessible (ARIA labels)

**Files to Create:**
- `src/components/ui/ThemeToggle.tsx`

**Success Criteria:**
- [ ] Button renders
- [ ] Toggles theme on click
- [ ] Icon changes
- [ ] Smooth transition
- [ ] Accessible (keyboard, screen reader)

**Testing:**
- [ ] Click theme toggle
- [ ] Verify light/dark mode switches
- [ ] Tab to button, press Space, verify toggle
- [ ] Test with screen reader

---

### Task 6.3: Apply Dark Mode Styling Throughout
**Time:** 2-3 hours  
**Depends On:** Tasks 6.1, 6.2

**What to Build:**
- Update all components with dark mode colors:
  - Backgrounds (light mode: white → dark mode: gray-950)
  - Text colors (light mode: gray-900 → dark mode: white)
  - Cards (light mode: white + shadow → dark mode: gray-900 + subtle shadow)
  - Borders (light mode: gray-200 → dark mode: gray-800)
  - Links, buttons, inputs

**Technical Details:**
- Use Tailwind CSS `dark:` prefix
- Or use CSS variables in `globals.css`
- Test contrast ratios (WCAG AA: 4.5:1)
- Consistent color scheme across all pages

**Files to Modify:**
- All component files (*.tsx)
- `src/styles/globals.css`

**Success Criteria:**
- [ ] All components support dark mode
- [ ] Good contrast in both modes
- [ ] No visual issues in dark mode
- [ ] Consistent color scheme

**Testing:**
- [ ] Toggle theme
- [ ] Verify all pages look good
- [ ] Check contrast ratios (use accessibility tools)

---

## Phase 6B: Responsive Design Polish (Week 4, Day 3 & Week 5, Day 1)

### Task 6.4: Audit & Fix Mobile Responsiveness
**Time:** 2-3 hours  
**Depends On:** All pages built

**What to Build:**
- Test on multiple breakpoints:
  - Mobile: 320px (iPhone SE)
  - Tablet: 768px (iPad)
  - Desktop: 1440px (MacBook Pro)
- Fix:
  - Text sizes (readable on mobile)
  - Touch targets (min 44x44px)
  - Padding/margins (adequate on mobile)
  - Images (responsive, not overflow)
  - Navigation (hamburger menu on mobile)

**Technical Details:**
- Use Chrome DevTools device emulation
- Test real devices if possible
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`

**Files to Modify:**
- All component files with responsive issues

**Success Criteria:**
- [ ] Mobile (320px) looks good
- [ ] Tablet (768px) looks good
- [ ] Desktop (1440px) looks good
- [ ] Images responsive
- [ ] Text readable
- [ ] Touch targets adequate

**Testing:**
- [ ] Test on Chrome DevTools (iPhone, iPad, MacBook)
- [ ] Test on real mobile device if possible
- [ ] Verify text readable without zoom

---

### Task 6.5: Add Mobile Navigation Menu
**Time:** 1-2 hours  
**Depends On:** Task 6.4

**What to Build:**
- Component: `src/components/layout/MobileMenu.tsx`
- Features:
  - Hamburger icon (3 lines)
  - Click opens sidebar/drawer
  - Menu items: Home, Blog, Videos, Projects, About, Contact, Admin
  - Close button or click outside to close
  - Smooth slide animation
  - Overlay (semi-transparent background)

**Technical Details:**
- Use state for open/closed
- CSS animations (smooth slide)
- Overlay: `position: fixed`, `z-index` layering
- Accessible: ARIA labels, keyboard support (Escape to close)

**Files to Create:**
- `src/components/layout/MobileMenu.tsx`
- `src/components/layout/Hamburger.tsx`

**Success Criteria:**
- [ ] Hamburger appears on mobile only
- [ ] Menu opens on click
- [ ] Menu closes on click outside
- [ ] Menu closes on Escape key
- [ ] Animation smooth
- [ ] Links work
- [ ] Accessible

**Testing:**
- [ ] Load on iPhone emulation
- [ ] Click hamburger, verify menu opens
- [ ] Click outside, verify menu closes
- [ ] Press Escape, verify menu closes
- [ ] Click link, verify navigates

---

### Task 6.6: Optimize Layout for Tablets
**Time:** 1 hour  
**Depends On:** Task 6.4

**What to Build:**
- Ensure good experience on tablets:
  - Use 2-column layouts where feasible
  - Adequate spacing for touch
  - Sidebar navigation (if admin)
  - Large buttons for touch

**Technical Details:**
- Test iPad (1024px width)
- Use `md:` and `lg:` Tailwind breakpoints
- Double-check readability

**Files to Modify:**
- Component files with layout issues

**Success Criteria:**
- [ ] Tablet (768px and 1024px) looks good
- [ ] Single column layout on portrait
- [ ] Two column layout on landscape (optional)

**Testing:**
- [ ] Test iPad (portrait and landscape)
- [ ] Verify readable and usable

---

## Phase 6C: Accessibility Implementation (Week 5, Days 1-2)

### Task 6.7: Audit Accessibility Issues with axe
**Time:** 1-2 hours  
**Depends On:** All pages built

**What to Build:**
- Install: axe DevTools browser extension
- Audit each page for:
  - Missing alt text on images
  - Color contrast issues
  - Missing form labels
  - Keyboard navigation issues
  - Screen reader issues
  - ARIA issues

**Technical Details:**
- Run axe on each major page
- Record all violations
- Categorize: critical (must fix), moderate, minor
- Create task list for fixes

**Files to Create:**
- `docs/ACCESSIBILITY_AUDIT.md` (document issues)

**Success Criteria:**
- [ ] All pages audited
- [ ] Issues documented
- [ ] Critical issues identified

**Testing:**
- [ ] Run axe DevTools on each page
- [ ] Review violations

---

### Task 6.8: Fix Accessibility Violations
**Time:** 2-3 hours  
**Depends On:** Task 6.7

**What to Build:**
- Fixes:
  - Add alt text to all images
  - Fix color contrast (min 4.5:1 for text)
  - Add labels to form inputs
  - Add ARIA labels to interactive elements
  - Fix keyboard navigation (tab order, focus visible)
  - Add skip-to-main-content link
  - Fix heading hierarchy (h1 per page, logical order)

**Technical Details:**
- Use `alt=""` for decorative images
- Use meaningful `alt` for content images
- Use `aria-label`, `aria-describedby` for unlabeled buttons
- Ensure focus outline visible (`:focus-visible`)
- Order headings logically (h1 → h2 → h3)

**Files to Modify:**
- All component files with accessibility issues

**Success Criteria:**
- [ ] No critical axe violations
- [ ] All images have alt text
- [ ] Color contrast >= 4.5:1
- [ ] All form inputs labeled
- [ ] Keyboard navigation works
- [ ] Focus visible on all interactive elements
- [ ] Heading hierarchy correct

**Testing:**
- [ ] Run axe DevTools, verify no violations
- [ ] Tab through page, verify focus visible
- [ ] Test with screen reader (NVDA on Windows, JAWS, etc.)

---

### Task 6.9: Test Keyboard Navigation
**Time:** 1-2 hours  
**Depends On:** Task 6.8

**What to Build:**
- Test keyboard-only navigation:
  - Tab through all interactive elements
  - Shift+Tab backwards
  - Enter/Space on buttons
  - Arrow keys in menus/selects
  - Escape to close modals

**Technical Details:**
- Disable mouse
- Use only keyboard (Tab, Shift+Tab, Enter, Space, Arrow keys, Escape)
- Verify all functionality works

**Files to Modify:**
- Fix keyboard support where needed

**Success Criteria:**
- [ ] Can tab through all links/buttons
- [ ] Tab order logical (left to right, top to bottom)
- [ ] Enter works on buttons/links
- [ ] Space works on buttons
- [ ] Escape closes modals
- [ ] Focus indicator always visible
- [ ] No keyboard traps

**Testing:**
- [ ] Disable mouse (or unplug)
- [ ] Tab through whole page
- [ ] Test all interactions with keyboard only

---

### Task 6.10: Test with Screen Reader
**Time:** 1-2 hours  
**Depends On:** Task 6.8

**What to Build:**
- Test with screen reader (NVDA on Windows, VoiceOver on Mac, JAWS if available):
  - Page heading announced
  - Images alt text announced
  - Form labels announced
  - Interactive elements announced
  - Link destinations clear
  - Errors announced

**Technical Details:**
- Use NVDA (free, Windows) or built-in VoiceOver (Mac)
- Turn on screen reader
- Navigate through page
- Verify all content accessible

**Files to Modify:**
- Add labels, ARIA attributes where needed

**Success Criteria:**
- [ ] Page title announced
- [ ] Headings announced
- [ ] Image alt text read
- [ ] Form inputs and labels read
- [ ] Button names clear
- [ ] Links identified
- [ ] Errors announced

**Testing:**
- [ ] Enable NVDA/VoiceOver
- [ ] Navigate page
- [ ] Verify screen reader announces everything

---

## Phase 6D: Performance Optimization (Week 5, Days 2-3)

### Task 6.11: Optimize Images & Media
**Time:** 1-2 hours  
**Depends On:** All content built

**What to Build:**
- Optimizations:
  - Use `next/image` for all images
  - Add blur placeholder for perceived performance
  - Convert images to WebP (Supabase/CDN should handle)
  - Lazy load images (default with next/image)
  - Responsive image sizes (srcset via next/image)
  - Optimize video thumbnails

**Technical Details:**
- Replace `<img>` with `<Image>` from next/image
- Generate blur data URLs for images
- Set responsive image sizes: `sizes="(max-width: 640px) 100vw, ..."`
- Check Supabase CDN settings for WebP conversion

**Files to Modify:**
- All components with images

**Success Criteria:**
- [ ] All images use next/image
- [ ] Blur placeholders show
- [ ] Images lazy load
- [ ] Responsive image sizes set
- [ ] WebP used when possible
- [ ] Lighthouse Performance > 90

**Testing:**
- [ ] Load pages
- [ ] Check Network tab: images lazy load, WebP used
- [ ] Run Lighthouse

---

### Task 6.12: Code Splitting & Lazy Loading
**Time:** 1-2 hours  
**Depends On:** All components built

**What to Build:**
- Optimizations:
  - Lazy load heavy components (analytics charts, video player)
  - Use `React.lazy()` + `Suspense`
  - Dynamic imports for large libraries
  - Code split by route (Next.js handles this)

**Technical Details:**
- Identify heavy components (use bundle analyzer)
- Wrap in `React.lazy(() => import(...))`
- Add `<Suspense fallback={...}>` with loading UI
- Test with Chrome DevTools Network tab

**Files to Modify:**
- Components with heavy dependencies

**Success Criteria:**
- [ ] Heavy components lazy loaded
- [ ] Loading skeletons show
- [ ] Performance improved
- [ ] Lighthouse Performance > 90

**Testing:**
- [ ] Check Network tab: chunks loaded on demand
- [ ] Run Lighthouse

---

### Task 6.13: Optimize Font Loading
**Time:** 1 hour  
**Depends On:** Design System (fonts)

**What to Build:**
- Optimizations:
  - Use system fonts (fast) or Google Fonts with preload
  - Reduce font variants (avoid all weights/styles)
  - Use `font-display: swap` for web fonts
  - Preload critical fonts

**Technical Details:**
- In `next.config.ts` or `layout.tsx`:
  - Import fonts (use next/font if available)
  - Use `font-display: swap`
  - Preload with `<link rel="preload">`

**Files to Modify:**
- `src/app/layout.tsx`
- `tailwind.config.ts`

**Success Criteria:**
- [ ] Fonts load quickly
- [ ] FOUT minimal (Flash of Unstyled Text)
- [ ] Lighthouse Performance > 90
- [ ] FCP (First Contentful Paint) < 1.8s

**Testing:**
- [ ] Run Lighthouse
- [ ] Check font load time in Network tab

---

### Task 6.14: Database Query Optimization
**Time:** 1-2 hours  
**Depends On:** All queries built

**What to Build:**
- Optimizations:
  - Add database indexes on frequently queried columns
  - Optimize N+1 queries (fetch related data in one query)
  - Cache query results (revalidate 1 hour)
  - Use pagination for large result sets
  - Add `select` to only fetch needed columns

**Technical Details:**
- Review all queries in `src/lib/supabase/*.ts`
- Add indexes: posts(published), posts(slug), videos(slug), projects(featured)
- Use Supabase RLS policies for security
- Cache with Next.js `revalidateTag`, `revalidatePath`

**Files to Modify:**
- `src/lib/supabase/queries.ts`
- `src/lib/supabase/admin-queries.ts`
- `supabase/schema.sql` (add indexes)

**Success Criteria:**
- [ ] Queries run < 200ms
- [ ] No N+1 queries
- [ ] Pagination works for large datasets
- [ ] Cache hits reduce API calls

**Testing:**
- [ ] Monitor Supabase query times
- [ ] Check Network tab for API timing

---

## Phase 6E: Lighthouse & Performance Auditing (Week 5, Days 3-4)

### Task 6.15: Run Lighthouse Audit
**Time:** 1-2 hours  
**Depends On:** All optimization tasks

**What to Build:**
- Run Google Lighthouse on all major pages:
  - Landing page
  - Blog listing
  - Blog detail (post)
  - Videos listing
  - Video detail
  - Projects listing
  - Project detail
  - Admin dashboard (optional)
- Target scores:
  - Performance: > 90
  - Accessibility: >= 95
  - Best Practices: >= 90
  - SEO: >= 95

**Technical Details:**
- Use Chrome DevTools Lighthouse tab
- Test on: Desktop, Mobile
- Note scores and issues
- Repeat after fixes

**Files to Create:**
- `docs/LIGHTHOUSE_RESULTS.md` (document scores)

**Success Criteria:**
- [ ] Performance > 90 on all pages
- [ ] Accessibility >= 95
- [ ] Best Practices >= 90
- [ ] SEO >= 95

**Testing:**
- [ ] Run Lighthouse on each page
- [ ] Document scores
- [ ] Identify opportunities

---

### Task 6.16: Fix Lighthouse Issues
**Time:** 2-3 hours  
**Depends On:** Task 6.15

**What to Build:**
- Address top Lighthouse opportunities:
  - Reduce unused JavaScript
  - Defer off-screen images
  - Minify CSS/JavaScript (handled by Next.js)
  - Remove render-blocking resources
  - Properly size images
  - Use modern image formats (WebP)

**Technical Details:**
- Review Lighthouse report
- Prioritize by impact
- Apply fixes from earlier tasks
- Re-run Lighthouse to verify

**Files to Modify:**
- Based on Lighthouse issues

**Success Criteria:**
- [ ] Performance >= 85 (target 90+)
- [ ] All critical issues fixed
- [ ] Excellent Core Web Vitals

**Testing:**
- [ ] Run Lighthouse again
- [ ] Verify scores improved

---

### Task 6.17: Monitor Core Web Vitals
**Time:** 1 hour  
**Depends On:** Task 6.16

**What to Build:**
- Setup monitoring:
  - LCP (Largest Contentful Paint): < 2.5s ✅
  - FID (First Input Delay): < 100ms ✅
  - CLS (Cumulative Layout Shift): < 0.1 ✅

**Technical Details:**
- Use web-vitals library or built-in Chrome UX Report
- Monitor via Google Analytics custom events
- Set up alerts for degradation

**Files to Create:**
- Monitoring implementation in analytics

**Success Criteria:**
- [ ] All Core Web Vitals in green
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

**Testing:**
- [ ] Use PageSpeed Insights to verify
- [ ] Monitor over time

---

## Phase 6F: Cross-Browser & Device Testing (Week 5, Day 5)

### Task 6.18: Test on Multiple Browsers
**Time:** 1-2 hours  
**Depends On:** All pages built

**What to Build:**
- Test on:
  - Chrome (latest)
  - Firefox (latest)
  - Safari (latest)
  - Edge (latest)
  - Mobile Safari (iOS)
  - Chrome Mobile (Android)

- Check for:
  - Layout issues
  - JavaScript errors
  - CSS issues
  - Performance
  - Responsiveness

**Technical Details:**
- Use real devices or cloud testing (BrowserStack, CrossBrowserTesting)
- Check browser console for errors
- Test touch interactions on real mobile

**Files to Create:**
- `docs/BROWSER_COMPATIBILITY.md` (document results)

**Success Criteria:**
- [ ] Works on Chrome (desktop & mobile)
- [ ] Works on Firefox
- [ ] Works on Safari (desktop & iOS)
- [ ] Works on Edge
- [ ] No console errors
- [ ] Responsive on all devices

**Testing:**
- [ ] Test on actual devices or cloud service
- [ ] Document any issues

---

### Task 6.19: Test on Real Mobile Devices
**Time:** 1-2 hours  
**Depends On:** Task 6.18

**What to Build:**
- Test on real phones:
  - iPhone (if access to Safari)
  - Android phone (Chrome, Firefox)
  - Network: Wi-Fi and cellular (3G/4G simulation)

- Check:
  - Responsiveness
  - Touch interactions
  - Performance on slow networks
  - Battery usage (no excessive CPU)
  - Camera/photo upload on mobile

**Technical Details:**
- Connect mobile device to development machine
- Use Chrome DevTools remote debugging (Android)
- Use Safari DevTools (iOS with Xcode)
- Simulate slow network (Chrome DevTools)

**Success Criteria:**
- [ ] Works on real iPhone
- [ ] Works on real Android
- [ ] Touch interactions smooth
- [ ] Performance acceptable on mobile
- [ ] No battery drain

**Testing:**
- [ ] Navigate all pages
- [ ] Test forms
- [ ] Test slow network

---

## 🎯 EPIC 6 Critical Path

```
6.1 → 6.2 → 6.3 → 6.4 → 6.5 → 6.6
      ↓ (parallel)
6.7 → 6.8 → 6.9 → 6.10
      ↓ (parallel)
6.11 → 6.12 → 6.13 → 6.14 → 6.15 → 6.16 → 6.17
      ↓ (parallel)
6.18 → 6.19
```

---

## ✅ Epic 6 Completion Checklist

**MVP Requirements:**
- [ ] Dark mode implemented
- [ ] Mobile responsive (320px - 1440px)
- [ ] Mobile menu works
- [ ] No axe accessibility violations
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Images optimized
- [ ] Code split & lazy loaded
- [ ] Fonts optimized
- [ ] Database queries optimized
- [ ] Lighthouse Performance >= 90
- [ ] Lighthouse Accessibility >= 95
- [ ] Lighthouse Best Practices >= 90
- [ ] Lighthouse SEO >= 95
- [ ] All Core Web Vitals in green
- [ ] Works on all major browsers
- [ ] Works on iOS & Android

**Nice to Have:**
- [ ] PWA (Progressive Web App)
- [ ] Offline support
- [ ] Advanced performance monitoring
- [ ] Custom error pages (404, 500, etc.)

---

## 📊 Estimated Timeline

| Phase | Tasks | Time | Dates |
|-------|-------|------|-------|
| 6A | 6.1-6.3 | 4-5 hrs | Week 4, Days 3-5 |
| 6B | 6.4-6.6 | 4-6 hrs | Week 4 Day 5 + Week 5 Day 1 |
| 6C | 6.7-6.10 | 5-7 hrs | Week 5, Days 1-2 |
| 6D | 6.11-6.14 | 5-7 hrs | Week 5, Days 2-3 |
| 6E | 6.15-6.17 | 4-5 hrs | Week 5, Days 3-4 |
| 6F | 6.18-6.19 | 2-4 hrs | Week 5, Day 5 |
| **TOTAL** | **19 tasks** | **24-34 hrs** | **2-3 weeks** |

---

## ⚠️ Blockers & Dependencies

- [ ] All Epics 1-5 mostly complete
- [ ] Design System finalized with dark mode colors
- [ ] All pages built
- [ ] All components styled
- [ ] Database optimized
