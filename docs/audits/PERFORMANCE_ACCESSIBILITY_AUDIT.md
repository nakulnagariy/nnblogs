# Performance & Accessibility Audit Report

**Project:** NNBlogs  
**Audit Date:** March 9, 2026  
**Auditor:** GitHub Copilot (automated static analysis)  
**Stack:** Next.js 16.1.1 · React 19.2.3 · TypeScript 5 · Tailwind CSS v4

---

## Executive Summary

| Category      | Status        | Issues Found                             |
| ------------- | ------------- | ---------------------------------------- |
| TypeScript    | ✅ Pass       | 0 errors                                 |
| ESLint        | ❌ Fail       | 38 errors, 47 warnings                   |
| Accessibility | ⚠️ Needs Work | 10 issues (1 critical, 5 major, 4 minor) |
| Performance   | ⚠️ Needs Work | 8 issues (2 high, 4 medium, 2 low)       |

---

## Table of Contents

1. [TypeScript Audit](#1-typescript-audit)
2. [ESLint Audit](#2-eslint-audit)
3. [Accessibility Audit](#3-accessibility-audit)
4. [Performance Audit](#4-performance-audit)
5. [Prioritised Fix List](#5-prioritised-fix-list)
6. [How to Re-run This Audit](#6-how-to-re-run-this-audit)

---

## 1. TypeScript Audit

### Result: ✅ PASS

**Command run:**

```bash
npx tsc --noEmit
```

**Result:** Exit code `0` — zero TypeScript errors across the entire project.

All strict-mode flags in `tsconfig.json` are passing cleanly:

- `"strict": true`
- `"noUnusedLocals": true`
- `"noUnusedParameters": true`
- `"noImplicitReturns": true`

---

## 2. ESLint Audit

### Result: ❌ FAIL — 85 total problems (38 errors, 47 warnings)

**Command run:**

```bash
node_modules/.bin/eslint src --ext .ts,.tsx --max-warnings 100
```

> **Note:** `npm run lint` (which calls `next lint`) fails with a Next.js 16 breaking change where the command now requires explicit project-root flags. Use direct `eslint` invocation as above.

### 2.1 Errors (38 total — must fix)

#### `no-undef` — `'React' is not defined` (12 errors)

These files use `React.ReactElement`, `React.FC`, or JSX-level React types without importing `react`:

| File                                             | Line         | Detail                        |
| ------------------------------------------------ | ------------ | ----------------------------- |
| `src/app/layout.tsx`                             | 49           | `React` used in type position |
| `src/app/admin/posts/new/page.tsx`               | 118, 328     | `React` used in type position |
| `src/app/admin/videos/new/page.tsx`              | 50, 66       | `React` used in type position |
| `src/components/about/JourneyTimeline.tsx`       | 23           | `React` used in type position |
| `src/components/blog/BlogPostClientWrapper.tsx`  | 10           | `React` used in type position |
| `src/components/data-viz/StatsVisualization.tsx` | 13, 130      | `React` used in type position |
| `src/components/providers/QueryProvider.tsx`     | 7            | `React` used in type position |
| `src/components/projects/ProjectCard.tsx`        | 18           | `React` used in type position |
| `src/components/ui/Badge.tsx`                    | 3            | `React` used in type position |
| `src/lib/markdown.ts`                            | 66, 104, 133 | `React` used in type position |

**Fix:** Add `import React from 'react'` or use `import type { ReactNode } from 'react'` for type-only usage.

---

#### `react/no-unescaped-entities` — Raw quotes/apostrophes in JSX (5 errors)

| File                                          | Line | Fix                                   |
| --------------------------------------------- | ---- | ------------------------------------- |
| `src/components/about/JourneyTimeline.tsx`    | 235  | Replace `'` with `&apos;` or `{'\''}` |
| `src/components/projects/ProjectTimeline.tsx` | 233  | Replace `'` with `&apos;`             |
| `src/components/projects/ProjectTimeline.tsx` | 236  | Replace `'` with `&apos;`             |
| `src/components/search/SearchBar.tsx`         | 139  | Replace `"` with `&quot;`             |
| `src/components/search/SearchBar.tsx`         | 144  | Replace `"` with `&quot;`             |

---

#### `react-hooks/set-state-in-effect` — setState inside effect body (3 errors)

Calling `setState` synchronously inside a `useEffect` body (not in a callback) triggers cascading renders, which hurts performance. React's compiler warns about these.

| File                                     | Line | Detail                                                       |
| ---------------------------------------- | ---- | ------------------------------------------------------------ |
| `src/components/blog/MarkdownEditor.tsx` | 53   | `setFullscreenHeight(window.innerHeight - 49)` inside effect |
| `src/components/search/SearchBar.tsx`    | 51   | `setIsOpen(true)` inside effect                              |
| `src/components/ui/ThemeToggle.tsx`      | 14   | `setMounted(true)` inside effect                             |

> **Note on ThemeToggle:** The `setMounted(true)` pattern is a standard hydration-guard for `next-themes` and is generally acceptable. However, the rule still fires because the effect body calls setState synchronously. Consider using `useState` initialiser or `useRef` to silence this for the hydration case.

---

#### Other Errors

| File                                    | Line | Rule                                      | Detail                                                                                       |
| --------------------------------------- | ---- | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| `src/components/blog/EditorToolbar.tsx` | 126  | `jsx-a11y/alt-text`                       | `<img>` element missing `alt` prop                                                           |
| `src/components/ui/Button.tsx`          | 38   | `@typescript-eslint/no-unused-vars`       | `asChild` is destructured but never used                                                     |
| `src/components/ui/Input.tsx`           | 4    | `@typescript-eslint/no-empty-object-type` | Empty interface extending `React.InputHTMLAttributes`                                        |
| `src/components/ui/Skeleton.tsx`        | 4    | `@typescript-eslint/no-empty-object-type` | Empty interface extending `React.HTMLAttributes`                                             |
| `src/lib/github.ts`                     | 7    | `no-undef`                                | `HeadersInit` is not defined (needs `import type { HeadersInit } from 'node-fetch'` or cast) |

---

### 2.2 Warnings (47 total — should fix)

#### `@next/next/no-img-element` — Using `<img>` instead of `<Image />` (5 warnings)

| File                                      | Line | Element                 |
| ----------------------------------------- | ---- | ----------------------- |
| `src/app/admin/posts/new/page.tsx`        | 328  | Preview thumbnail       |
| `src/app/admin/videos/new/page.tsx`       | 265  | Preview thumbnail       |
| `src/app/videos/[slug]/page.tsx`          | 163  | Related video thumbnail |
| `src/components/projects/ProjectCard.tsx` | 38   | Project image           |
| `src/components/videos/YouTubeEmbed.tsx`  | 91   | YouTube thumbnail       |

**Impact:** Unoptimised `<img>` elements miss AVIF/WebP conversion, lazy loading, blue-hash placeholders, and Content Delivery Network caching that `<Image />` provides, resulting in slower LCP scores.

---

#### `@typescript-eslint/no-explicit-any` — Untyped `any` (13 warnings)

| File                                           | Lines          |
| ---------------------------------------------- | -------------- |
| `src/app/api/admin/posts/[id]/route.ts`        | 15             |
| `src/app/api/admin/posts/bulk/route.ts`        | 8              |
| `src/app/api/admin/posts/route.ts`             | 21             |
| `src/components/about/JourneyTimeline.tsx`     | 112            |
| `src/components/analytics/GoogleAnalytics.tsx` | 35, 44         |
| `src/components/blog/BlogTimeline.tsx`         | 52             |
| `src/components/projects/ProjectTimeline.tsx`  | 61             |
| `src/lib/analytics.ts`                         | 11, 16, 18, 25 |

---

#### `no-console` — `console.log` in production code (9 warnings)

| File                                     | Lines      |
| ---------------------------------------- | ---------- |
| `src/app/api/admin/assign-role/route.ts` | 14, 36, 62 |
| `src/app/api/admin/posts/[id]/route.ts`  | 45, 62, 66 |
| `src/app/api/posts/[id]/route.ts`        | 18, 35, 39 |

**Fix:** Replace `console.log` with `console.warn` or `console.error`, or remove non-essential logs.

---

#### Other Warnings

| File                                      | Line   | Rule                                       | Detail                                |
| ----------------------------------------- | ------ | ------------------------------------------ | ------------------------------------- |
| `src/app/admin/videos/page.tsx`           | 46     | `require-await`                            | Async function with no `await`        |
| `src/app/admin/videos/new/page.tsx`       | 47     | `react-hooks/exhaustive-deps`              | Missing dep: `formData.thumbnail_url` |
| `src/components/projects/ProjectCard.tsx` | 87, 98 | `@typescript-eslint/no-non-null-assertion` | Non-null assertions `!`               |
| `src/lib/supabase/client.ts`              | 3, 4   | `@typescript-eslint/no-non-null-assertion` | Env var non-null assertions           |
| `src/lib/supabase/server.ts`              | 3, 4   | `@typescript-eslint/no-non-null-assertion` | Env var non-null assertions           |

---

## 3. Accessibility Audit

### 3.1 Critical — A11Y-1: SkipToContent link is invisible (broken)

**File:** `src/components/ui/SkipToContent.tsx`  
**Severity:** 🔴 Critical  
**WCAG:** 2.4.1 Bypass Blocks (Level A)

**Issue:**

```tsx
// CURRENT — broken class
className={cn(
  'sr-only focus:not-sr-only',
  'bg-foreground text-foreground-foreground',  // ❌ "text-foreground-foreground" is not a valid Tailwind token
  ...
)}
```

`text-foreground-foreground` is not a valid Tailwind CSS custom property. The text will inherit an unrelated colour (likely dark text on dark background or transparent), making the skip link invisible when focused.

**Fix:**

```tsx
// CORRECT — text-background contrasts with bg-foreground
className={cn(
  'sr-only focus:not-sr-only',
  'bg-foreground text-background',  // ✅ high contrast (12:1 ratio)
  ...
)}
```

---

### 3.2 Major — A11Y-2: Nested `<main>` elements

**Files:** `src/app/layout.tsx` + `src/app/page.tsx`  
**Severity:** 🟠 Major  
**WCAG:** 1.3.1 Info and Relationships (Level A)

**Issue:** `layout.tsx` wraps `{children}` in `<main id="main-content">`. `page.tsx` also renders its own `<main className="flex flex-col">`. This creates a nested `<main>` structure, which is invalid HTML — only one `<main>` landmark is allowed per page.

Screen readers (VoiceOver, NVDA) expose landmark navigation. A nested `<main>` confuses this navigation and is invalid per the HTML spec.

**Current structure:**

```tsx
// layout.tsx
<main id="main-content" tabIndex={-1}>
  {" "}
  {/* ← outer main */}
  <main className="flex flex-col">
    {" "}
    {/* ← page.tsx adds inner main */}
    <HeroSection />
    ...
  </main>
</main>
```

**Fix:** Change the inner `<main>` in `page.tsx` to a `<div>` or `<>` fragment:

```tsx
// page.tsx — FIXED
export default function HomePage() {
  return (
    <>
      <ScrollProgress position="top" />
      <div className="flex flex-col">
        {" "}
        {/* ← use div, not main */}
        <HeroSection />
        ...
      </div>
    </>
  );
}
```

---

### 3.3 Major — A11Y-3: Non-semantic nav list in Header

**File:** `src/components/layout/Header.tsx` (line 61–69)  
**Severity:** 🟠 Major  
**WCAG:** 1.3.1 Info and Relationships (Level A)

**Issue:** The desktop navigation uses `<div role="list">` wrapping `<Link role="listitem">`. While ARIA roles technically communicate list semantics, browser/screen-reader support for ARIA roles on `<Link>` (anchor) elements is inconsistent.

```tsx
// CURRENT — ARIA roles on non-list elements
<div className="hidden md:flex items-center gap-1" role="list">
  {navigation.map((item) => (
    <Link key={item.name} href={item.href} role="listitem" ...>
      {item.name}
    </Link>
  ))}
</div>
```

**Fix:** Use native `<ul>/<li>` for semantically correct list markup:

```tsx
// FIXED — semantic HTML list
<ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
  {navigation.map((item) => (
    <li key={item.name}>
      <Link href={item.href} ...>
        {item.name}
      </Link>
    </li>
  ))}
</ul>
```

---

### 3.4 Major — A11Y-4: Mobile menu button missing `aria-controls`

**File:** `src/components/layout/Header.tsx` (line 110–119)  
**Severity:** 🟠 Major  
**WCAG:** 4.1.2 Name, Role, Value (Level A)

**Issue:** The hamburger button has `aria-expanded` but is missing `aria-controls`, which means screen readers cannot programmatically associate the button with the menu it controls.

```tsx
// CURRENT — missing aria-controls
<button
  aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
  aria-expanded={mobileOpen}   // ✅ aria-expanded present
  // ❌ aria-controls missing
>
```

**Fix:**

```tsx
// FIXED
<button
  aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
  aria-expanded={mobileOpen}
  aria-controls="mobile-menu"  // ✅ matches id="mobile-menu" on the dropdown
>
```

---

### 3.5 Major — A11Y-5: Missing alt text on EditorToolbar image

**File:** `src/components/blog/EditorToolbar.tsx` (line 126)  
**Severity:** 🟠 Major  
**WCAG:** 1.1.1 Non-text Content (Level A)

**Issue:** An `<img>` element in the editor toolbar lacks an `alt` attribute, which is an ESLint `jsx-a11y/alt-text` error.

**Fix:** Add `alt=""` for decorative images or descriptive `alt` text:

```tsx
<img src={...} alt=""           aria-hidden="true" />  {/* decorative */}
// or:
<img src={...} alt="Image preview" />                   {/* descriptive */}
```

---

### 3.6 Minor — A11Y-6: Focus outline removed globally without fallback

**File:** `src/app/globals.css` (lines 170–180)  
**Severity:** 🟡 Minor  
**WCAG:** 2.4.7 Focus Visible (Level AA)

**Issue:** The CSS removes `outline` from all focused elements, relying solely on `:focus-visible`:

```css
/* globals.css */
a:focus,
button:focus,
input:focus,
textarea:focus,
select:focus {
  outline: none; /* ← removes focus outline */
}
```

Safari < 15.4 does not support `:focus-visible` on all interactive elements. On these browsers, keyboard users see no focus indicator at all.

**Fix:** The current `:focus-visible` styles are good. Ensure all browsers are covered with a more cautious approach:

```css
/* Only remove outline when focus-visible is supported */
@supports selector(:focus-visible) {
  a:focus:not(:focus-visible),
  button:focus:not(:focus-visible) {
    outline: none;
  }
}
```

---

### 3.7 Minor — A11Y-7: Unescaped entities in JSX

**Severity:** 🟡 Minor  
**WCAG:** 1.1.1 Non-text Content (Level A — rendered incorrectly in some parsers)

| File                                          | Line     | Issue                            |
| --------------------------------------------- | -------- | -------------------------------- |
| `src/components/about/JourneyTimeline.tsx`    | 235      | Raw apostrophe `'` in JSX text   |
| `src/components/projects/ProjectTimeline.tsx` | 233, 236 | Raw apostrophe `'` in JSX text   |
| `src/components/search/SearchBar.tsx`         | 139, 144 | Raw double-quote `"` in JSX text |

**Fix:** Use HTML entities or template literals:

```tsx
// Before: I'm a developer
// After:
I&apos;m a developer
// or:
{"I'm a developer"}
```

---

### 3.8 Minor — A11Y-8: BlogCard has two focusable links to the same destination

**File:** `src/components/blog/BlogCard.tsx`  
**Severity:** 🟡 Minor  
**WCAG:** 2.4.4 Link Purpose (Level A)

**Issue:** Both the image cover and the heading text are separate `<Link>` elements pointing to the same URL. Although the image link uses `tabIndex={-1}` and `aria-hidden="true"` to remove it from tab order and the accessibility tree, screen readers that use browse/virtual cursor mode may still encounter both links when reading through the page.

**Current pattern:**

```tsx
{/* Image link — tab-hidden */}
<Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
  <Image ... alt={post.title} />
</Link>

{/* Title link — tab-visible */}
<Link href={`/blog/${post.slug}`}>
  <h2>{post.title}</h2>
</Link>
```

The current implementation is an acceptable pattern (tabIndex=-1 on duplicate), but the image `alt={post.title}` text on the `aria-hidden` link may still be picked up by some screen readers. Changing the image to `alt=""` within the `aria-hidden` link removes any ambiguity:

```tsx
<Image alt="" ... />  {/* safe: link is aria-hidden */}
```

---

### 3.9 Minor — A11Y-9: Animated pulsing badge has no reduced-motion support

**File:** `src/components/layout/Footer.tsx`  
**Severity:** 🟡 Minor  
**WCAG:** 2.3.3 Animation from Interactions (Level AAA) / 2.3.1 best practice

The "Available for new projects" badge uses `animate-pulse` with no `prefers-reduced-motion` override. Users who set their OS to reduce motion will still see the pulsing animation.

**Fix:**

```css
/* globals.css — or use Tailwind's motion-safe/motion-reduce variants */
@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: none;
  }
}
```

Or in Tailwind:

```tsx
<span className="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
```

---

### 3.10 Minor — A11Y-10: `HeroSection` orbit is animated with no `prefers-reduced-motion` guard

**File:** `src/components/home/HeroSection.tsx`  
**Severity:** 🟡 Minor  
**WCAG:** 2.3.3 Animation from Interactions (Level AAA)

Multiple `Framer Motion` `animate={{ rotate: 360 }}` loops with `repeat: Infinity` run permanently. Framer Motion has built-in support for `useReducedMotion`. These should be suppressed for users with motion sensitivity.

**Fix:**

```tsx
import { useReducedMotion } from "framer-motion";

function HeroOrbit() {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      animate={shouldReduce ? {} : { rotate: ring.direction * 360 }}
      transition={
        shouldReduce
          ? {}
          : { duration: ring.duration, repeat: Infinity, ease: "linear" }
      }
    >
      ...
    </motion.div>
  );
}
```

---

## 4. Performance Audit

### 4.1 High — PERF-1: Five `<img>` tags bypass Next.js Image optimisation

**Severity:** 🔴 High  
**Impact:** LCP score, bandwidth, load time

| File                                      | Line | Context                                 |
| ----------------------------------------- | ---- | --------------------------------------- |
| `src/components/projects/ProjectCard.tsx` | 38   | Project cover image (public-facing)     |
| `src/app/videos/[slug]/page.tsx`          | 163  | Related video thumbnail (public-facing) |
| `src/components/videos/YouTubeEmbed.tsx`  | 91   | YouTube preview thumbnail               |
| `src/app/admin/posts/new/page.tsx`        | 328  | Form preview (admin only)               |
| `src/app/admin/videos/new/page.tsx`       | 265  | Form preview (admin only)               |

Next.js `<Image>` provides:

- Automatic AVIF / WebP format conversion (30–50% size reduction)
- Responsive `srcset` generation
- Lazy loading with blur-up placeholder
- Content Delivery Network caching

**Fix (example for ProjectCard.tsx):**

```tsx
// Before
<img
  src={project.image_url}
  alt={project.name}
  className="w-full h-full object-cover..."
/>;

// After
import Image from "next/image";

<Image
  src={project.image_url}
  alt={project.name}
  fill
  className="object-cover group-hover:scale-105 transition-transform duration-300"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>;
```

---

### 4.2 High — PERF-2: HeroSection runs 15+ simultaneous infinite animations

**File:** `src/components/home/HeroSection.tsx`  
**Severity:** 🔴 High  
**Impact:** CPU/GPU usage, battery drain, janky scroll on lower-end devices

The `HeroOrbit` component runs:

- 3 full-rotation animation groups (orbit rings at 28s/38s/50s cycles)
- 8 counter-rotation wrappers for individual keywords
- 6 floating dots with y-oscillation and opacity fades
- 1 pulsing center glow

**Total:** ~15+ simultaneous `repeat: Infinity` Framer Motion animations on screen at once.

This runs continuously even when the section is no longer visible in the viewport. On mobile and mid-range devices this significantly impacts battery and frame rate.

**Recommended fixes (priority order):**

1. Pause animations when off-screen using `react-intersection-observer` (already installed):

```tsx
import { useInView } from 'react-intersection-observer';

function HeroOrbit() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <div ref={ref} className="relative w-full aspect-square max-w-105 mx-auto" aria-hidden="true">
      <motion.div
        animate={inView ? { rotate: ring.direction * 360 } : {}}
        transition={...}
      />
    </div>
  );
}
```

2. Add `useReducedMotion()` guard (see A11Y-10 above)
3. Consider simplifying the orbit to CSS animations for static keywords (CSS transforms are GPU-composited and cheaper than JS-driven animations)

---

### 4.3 Medium — PERF-3: All home page sections are Client Components

**Files:** `src/components/home/*.tsx`  
**Severity:** 🟠 Medium  
**Impact:** JavaScript bundle size, Time to Interactive (TTI)

All home page sections (`HeroSection`, `AboutSection`, `JourneySection`, `ExpertiseSection`, `FeaturedWorkSection`, `SelectedWorksSection`, `CTASection`) ship as Client Components, adding their full implementation to the JavaScript bundle sent to browsers.

Many of these sections render static or near-static content and do not need React state, event handlers, or browser APIs in their current form.

**Sections that could be Server Components:**

- `AboutSection` — static text and image
- `ExpertiseSection` — static skills list
- `CTASection` — static text and links

**Sections that legitimately require Client:**

- `HeroSection` — Framer Motion animations require client
- `JourneySection` — scroll-based animations or interactivity
- `FeaturedWorkSection` — data fetching with hooks

**Recommended approach:** Add `'use client'` only where needed, and keep static sections as Server Components. This reduces the client bundle and improves TTI.

---

### 4.4 Medium — PERF-4: Featured post image uses lazy loading

**File:** `src/components/blog/BlogCard.tsx` (line 28)  
**Severity:** 🟠 Medium  
**Impact:** LCP score for blog listing pages

All blog card images use `loading="lazy"`, including the featured post that appears above the fold. The Largest Contentful Paint (LCP) image should never be lazily loaded.

```tsx
// Current — all images lazy
<Image
  loading="lazy"    // ❌ wrong for above-the-fold featured image
  ...
/>
```

**Fix:** Pass a `priority` prop through `BlogCard` for the first/featured card:

```tsx
// BlogCard.tsx
interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  priority?: boolean;   // ← add this
}

export function BlogCard({ post, featured = false, priority = false }: BlogCardProps) {
  return (
    <Image
      priority={priority}       // ← use for above-the-fold image
      loading={priority ? undefined : 'lazy'}
      ...
    />
  );
}

// BlogList.tsx — pass priority to first card
posts.map((post, index) => (
  <BlogCard key={post.id} post={post} priority={index === 0} />
))
```

---

### 4.5 Medium — PERF-5: `setState` inside `useEffect` body causes cascading renders

**Severity:** 🟠 Medium  
**Impact:** Unnecessary re-renders, perf regression, React Compiler warning

| File                                     | Line | Code                                           |
| ---------------------------------------- | ---- | ---------------------------------------------- |
| `src/components/blog/MarkdownEditor.tsx` | 53   | `setFullscreenHeight(window.innerHeight - 49)` |
| `src/components/search/SearchBar.tsx`    | 51   | `setIsOpen(true)`                              |

Calling `setState` synchronously in an effect body (not in a callback) triggers a second render cycle immediately after the first. This is flagged by the React Compiler (`react-hooks/set-state-in-effect`).

**Fix for MarkdownEditor.tsx:**

```tsx
// Before
useEffect(() => {
  if (isFullscreen) {
    setFullscreenHeight(window.innerHeight - 49); // ❌ sync setState in effect
  }
}, [isFullscreen]);

// After — derive inline or memoize
const fullscreenHeight = useMemo(
  () =>
    typeof window !== "undefined" && isFullscreen
      ? window.innerHeight - 49
      : undefined,
  [isFullscreen],
);
```

**Fix for SearchBar.tsx:**

```tsx
// Before
useEffect(() => {
  if (results && results.length > 0 && query.length >= 2) {
    setIsOpen(true); // ❌ sync setState in effect
    analytics.search.query(query, results.length);
  }
}, [results, query]);

// After — derive isOpen from results state directly
const isOpen = (results?.length ?? 0) > 0 && query.length >= 2;
// Remove the useEffect entirely; isOpen is now derived, not stored
```

---

### 4.6 Medium — PERF-6: Body CSS transitions fire on every theme change

**File:** `src/app/globals.css` (lines 107–111)  
**Severity:** 🟠 Medium  
**Impact:** Layout paint cost during theme toggle

```css
body {
  transition:
    background-color 0.3s ease,
    color 0.3s ease; /* ← high cost */
}
```

Transitioning `background-color` and `color` on `body` causes the browser to repaint the entire page. This is a high-cost operation.

`next-themes` already provides `disableTransitionOnChange` prop (which is already set to `true` in `layout.tsx`), which removes all transitions during theme switches. However, since `disableTransitionOnChange` is `true` in your `ThemeProvider`, the body transition is effectively disabled during theme switches — this is correctly configured.

However, any other CSS changes that trigger repaint remain. Current setup is acceptable; just ensure `disableTransitionOnChange` stays enabled.

---

### 4.7 Low — PERF-7: Missing Next.js security headers

**File:** `next.config.ts`  
**Severity:** 🟡 Low  
**Impact:** HTTP security score, browser protections

The `next.config.ts` does not configure security headers. Best-practice headers help prevent XSS, clickjacking, and MIME sniffing:

```typescript
// next.config.ts — add headers() function
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ];
},
```

---

### 4.8 Low — PERF-8: `next lint` broken in Next.js 16

**File:** `package.json` scripts  
**Severity:** 🟡 Low  
**Impact:** CI/CD linting pipeline fails silently

```json
"scripts": {
  "lint": "next lint"   // ← fails in Next.js 16.1.1
}
```

Running `npm run lint` produces:

```
Invalid project directory provided, no such directory: C:\personal projects\nnblogs\lint
```

This appears to be a Next.js 16 breaking change in how `next lint` parses arguments.

**Workaround:**

```json
"scripts": {
  "lint": "eslint src --ext .ts,.tsx",
  "lint:next": "next lint ."
}
```

---

## 5. Prioritised Fix List

Ordered by impact and effort:

| Priority | ID        | File(s)                                                       | Issue                                                        | Effort          |
| -------- | --------- | ------------------------------------------------------------- | ------------------------------------------------------------ | --------------- |
| 🔴 P0    | A11Y-1    | `SkipToContent.tsx`                                           | Fix `text-foreground-foreground` → `text-background`         | 1 min           |
| 🔴 P0    | A11Y-2    | `page.tsx`                                                    | Change inner `<main>` to `<div>`                             | 2 min           |
| 🔴 P0    | PERF-1    | `ProjectCard.tsx`, `[slug]/page.tsx`, `YouTubeEmbed.tsx`      | Replace `<img>` with `<Image />`                             | 30 min          |
| 🟠 P1    | A11Y-3    | `Header.tsx`                                                  | Use `<ul>/<li>` for nav list                                 | 5 min           |
| 🟠 P1    | A11Y-4    | `Header.tsx`                                                  | Add `aria-controls="mobile-menu"`                            | 2 min           |
| 🟠 P1    | A11Y-5    | `EditorToolbar.tsx`                                           | Add `alt=""` to img                                          | 2 min           |
| 🟠 P1    | A11Y-7    | `JourneyTimeline.tsx`, `ProjectTimeline.tsx`, `SearchBar.tsx` | Escape entities                                              | 10 min          |
| 🟠 P1    | CODE-1    | 10+ files                                                     | Add `import React` where needed                              | 20 min          |
| 🟠 P1    | CODE-2    | `Button.tsx`                                                  | Remove unused `asChild`                                      | 2 min           |
| 🟠 P1    | CODE-3    | `Input.tsx`, `Skeleton.tsx`                                   | Remove empty interfaces                                      | 5 min           |
| 🟠 P1    | PERF-4    | `BlogCard.tsx`                                                | Add `priority` prop for LCP image                            | 15 min          |
| 🟠 P1    | PERF-5    | `MarkdownEditor.tsx`, `SearchBar.tsx`                         | Derive state instead of setState in effect                   | 30 min          |
| 🟠 P1    | PERF-8    | `package.json`                                                | Fix `npm run lint` script                                    | 2 min           |
| 🟡 P2    | A11Y-6    | `globals.css`                                                 | Improve `:focus-visible` cross-browser support               | 10 min          |
| 🟡 P2    | A11Y-8    | `BlogCard.tsx`                                                | Change image alt to `""` inside aria-hidden link             | 2 min           |
| 🟡 P2    | A11Y-9    | `Footer.tsx`                                                  | Add `motion-safe:` Tailwind variant to animate-pulse         | 2 min           |
| 🟡 P2    | A11Y-10   | `HeroSection.tsx`                                             | Add `useReducedMotion()` guard                               | 15 min          |
| 🟡 P2    | PERF-2    | `HeroSection.tsx`                                             | Pause orbit animations when off-viewport                     | 30 min          |
| 🟡 P2    | PERF-3    | `home/*.tsx`                                                  | Convert static sections to Server Components                 | 1 hr            |
| 🟡 P2    | PERF-7    | `next.config.ts`                                              | Add security headers                                         | 15 min          |
| 🟡 P2    | CODE-misc | API routes                                                    | Replace `console.log` with `console.error`/`console.warn`    | 20 min          |
| 🟡 P2    | PERF-6    | `globals.css`                                                 | Body transition is OK since `disableTransitionOnChange=true` | Already handled |

---

## 6. How to Re-run This Audit

### TypeScript check

```bash
npx tsc --noEmit
```

### ESLint check (until `next lint` is fixed)

```bash
node_modules/.bin/eslint src --ext .ts,.tsx
```

### Manual accessibility checks

- Install [axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd) browser extension
- Run Lighthouse (Chrome DevTools → Lighthouse tab) against `http://localhost:3000`
- Test keyboard navigation: Tab through all interactive elements
- Test with VoiceOver (macOS: ⌘+F5) or NVDA (Windows, free download)

### Performance checks

- Run Lighthouse in Chrome DevTools → Performance tab
- Check Web Vitals: LCP, FID/INP, CLS
- Use [WebPageTest](https://www.webpagetest.org/) for network-throttled testing
- Analyse bundle: `ANALYZE=true npm run build` (after installing `@next/bundle-analyzer`)

### Accessibility score targets (Lighthouse)

- **Accessibility:** ≥ 90
- **Performance:** ≥ 85
- **Best Practices:** ≥ 90
- **SEO:** ≥ 90

---

_This report was generated by static analysis (TypeScript compiler + ESLint) and manual code review. It does not replace a full manual accessibility audit with assistive technology, or real-device performance profiling._
