# NNBlogs - Design System & Style Guide

**Purpose:** Define consistent visual language across the platform

**Scope:** Colors, typography, spacing, component states, animations

---

## 🎨 Color Palette

### Light Mode
| Usage | Color | Hex | CSS Variable |
|-------|-------|-----|--------------|
| Background | White | `#FFFFFF` | `--background` |
| Text Primary | Almost Black | `#0F172A` | `--foreground` |
| Text Secondary | Gray 600 | `#4B5563` | `--muted-foreground` |
| Accent (Primary) | Blue 600 | `#2563EB` | `--primary` |
| Accent Light | Blue 50 | `#EFF6FF` | `--primary-light` |
| Border | Gray 200 | `#E5E7EB` | `--border` |
| Background Secondary | Gray 50 | `#F9FAFB` | `--secondary` |
| Success | Green 600 | `#16A34A` | `--success` |
| Warning | Amber 600 | `#D97706` | `--warning` |
| Error | Red 600 | `#DC2626` | `--error` |

### Dark Mode
| Usage | Color | Hex | CSS Variable |
|-------|-------|-----|--------------|
| Background | Dark Navy | `#0F172A` | `--background` |
| Text Primary | Almost White | `#F5F5F5` | `--foreground` |
| Text Secondary | Gray 400 | `#9CA3AF` | `--muted-foreground` |
| Accent (Primary) | Blue 400 | `#60A5FA` | `--primary` |
| Accent Light | Blue 900 | `#1E3A8A` | `--primary-light` |
| Border | Gray 700 | `#374151` | `--border` |
| Background Secondary | Gray 800 | `#1F2937` | `--secondary` |
| Success | Green 400 | `#4ADE80` | `--success` |
| Warning | Amber 400 | `#FBBF24` | `--warning` |
| Error | Red 400 | `#F87171` | `--error` |

---

## 🔤 Typography

### Font Stack
```css
/* Headings */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Body */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Code/Monospace */
font-family: 'Fira Code', 'Courier New', monospace;
```

### Scale & Sizes

| Type | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| H1 | 48px / 2.5rem | 700 | 1.2 (57.6px) | Page titles, hero |
| H2 | 36px / 2.25rem | 700 | 1.25 (45px) | Section titles |
| H3 | 24px / 1.5rem | 600 | 1.33 (32px) | Subsection titles |
| H4 | 20px / 1.25rem | 600 | 1.4 (28px) | Card titles |
| Body Large | 18px / 1.125rem | 400 | 1.6 (28.8px) | Intro text, blog body |
| Body | 16px / 1rem | 400 | 1.6 (25.6px) | Standard body text |
| Body Small | 14px / 0.875rem | 400 | 1.5 (21px) | Secondary text |
| Caption | 12px / 0.75rem | 400 | 1.4 (16.8px) | Labels, meta info |
| Code Block | 14px / 0.875rem | 400 | 1.5 (21px) | Code snippets |

### Mobile Adjustments
```
H1: 32px (mobile) → 48px (desktop)
H2: 24px (mobile) → 36px (desktop)
Body: 14px (mobile) → 16px (desktop)
```

---

## 📏 Spacing System

Consistent 4px-based spacing scale:

```
2px   = 0.125rem
4px   = 0.25rem
8px   = 0.5rem
12px  = 0.75rem
16px  = 1rem    ← Base unit
24px  = 1.5rem
32px  = 2rem
48px  = 3rem
64px  = 4rem
80px  = 5rem
96px  = 6rem
```

### Common Spacing Patterns
- **Component padding:** 16px (internal), 24px (large)
- **Content margins:** 24px (between sections)
- **Page padding:** 16px (mobile), 32px (desktop)
- **Card spacing:** 16px padding, 8px gap between items

---

## 🛠️ Component Library

### Button Variants

#### Primary Button
```
Light Mode:
- Background: #2563EB (Blue 600)
- Text: White
- Padding: 10px 16px (medium), 8px 12px (small)
- Border Radius: 6px
- Border: none

Dark Mode:
- Background: #60A5FA (Blue 400)
- Text: #0F172A
```

**States:**
- **Default:** Solid background
- **Hover:** Darker shade (Blue 700 light / Blue 500 dark)
- **Active:** Even darker, slight shadow
- **Disabled:** 50% opacity, cursor: not-allowed
- **Loading:** Spinner inside, onClick disabled

#### Secondary Button
```
Light Mode:
- Background: #F3F4F6 (Gray 100)
- Text: #0F172A
- Border: 1px solid #E5E7EB

Dark Mode:
- Background: #1F2937 (Gray 800)
- Text: #F5F5F5
- Border: 1px solid #374151
```

#### Ghost Button (Minimal)
```
- Background: transparent
- Text: Accent color (#2563EB light / #60A5FA dark)
- Border: none
- Hover: Background with opacity
```

---

### Cards

#### Default Card
```
Light Mode:
- Background: #FFFFFF
- Border: 1px solid #E5E7EB
- Border Radius: 8px
- Box Shadow: 0 1px 2px rgba(0,0,0,0.05)
- Padding: 20px

Dark Mode:
- Background: #1F2937
- Border: 1px solid #374151
- Shadow: 0 1px 2px rgba(0,0,0,0.2)
```

#### Card States
- **Hover:** Slight shadow increase, subtle scale (1.01x)
- **Active:** Border color changes to accent
- **Focused:** 2px focused border

---

### Input Fields

#### Text Input
```
Light Mode:
- Background: #FFFFFF
- Border: 1px solid #E5E7EB
- Border Radius: 6px
- Padding: 10px 12px
- Font Size: 16px

Dark Mode:
- Background: #111827
- Border: 1px solid #374151
```

**States:**
- **Default:** Gray border
- **Focused:** 2px accent border, box-shadow
- **Filled:** Border accent color
- **Error:** Red 600 border
- **Disabled:** Opacity 50%, cursor: not-allowed

---

### Badge / Tag

```
Light Mode:
- Background: #EFF6FF (Blue light)
- Text: #2563EB (Blue 600)
- Padding: 4px 8px
- Border Radius: 4px
- Font Size: 12px

Variants:
- Primary (blue): Use for categories
- Gray: Use for secondary tags
- Success/Warning/Error: For status
```

---

### Spinner / Loading

```
- Diameter: 24px (default), 16px (small), 32px (large)
- Color: Accent (Primary)
- Animation: Rotating 360deg, 1s duration, linear
- SVG-based with dark/light mode support
```

---

### Modal / Dialog

```
Light Mode:
- Overlay: rgba(0,0,0,0.5) backdrop
- Content: White, shadow, 8px radius

Dark Mode:
- Overlay: rgba(0,0,0,0.7)
- Content: #1F2937, shadow
```

**Layout:**
- Header: Title + close button
- Body: Content (padding: 24px)
- Footer: Action buttons (right-aligned)

---

## 🎬 Animations & Transitions

### Standard Easing
```css
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Durations
```
Fast:     150ms (button hover)
Standard: 300ms (modal open, nav expand)
Slow:     500ms (page transitions, toast)
```

### Common Patterns

#### Button Hover
```css
transition: all 150ms ease-out;
transform: translateY(-2px);
box-shadow: 0 4px 6px rgba(0,0,0,0.1);
```

#### Fade In
```css
animation: fadeIn 300ms ease-out;
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

#### Slide In (Mobile Menu)
```css
animation: slideInFromRight 300ms ease-out;
@keyframes slideInFromRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
```

---

## ♿ Accessibility Standards

### Color Contrast
- **Text on background:** Minimum 4.5:1 (WCAG AA)
- **Large text (18px+):** Minimum 3:1
- **UI components:** Minimum 3:1

**Examples:**
- Blue 600 (#2563EB) on white: 5.4:1 ✅
- Blue 400 (#60A5FA) on dark navy: 5.1:1 ✅

### Focus States
```css
/* All interactive elements */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### Touch Targets
- Minimum 44x44px for all clickable elements
- Padding around small targets if needed

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 Responsive Breakpoints

```
Mobile:    0px - 639px   (default, stack everything)
Tablet:    640px - 1023px (2-column layouts)
Desktop:   1024px+       (full-width, multi-column)

Tailwind shortcuts to use:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px
```

---

## 🌓 Dark Mode Implementation

### CSS Variables Approach (Recommended)

```css
/* Light mode (default) */
:root {
  --background: #FFFFFF;
  --foreground: #0F172A;
  --primary: #2563EB;
  /* ... rest of colors */
}

/* Dark mode */
[data-theme="dark"] {
  --background: #0F172A;
  --foreground: #F5F5F5;
  --primary: #60A5FA;
  /* ... rest of colors */
}
```

### Usage in Components
```tsx
<div className="bg-background text-foreground" />
<button className="bg-primary text-white dark:bg-primary dark:text-foreground" />
```

### System Preference Detection
```tsx
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

---

## 📐 Component Grid

Common breakdowns for layouts:

### Row Layouts
- **Full width:** 1 column
- **Sidebar + Content:** 300px sidebar + 1fr content
- **Two Equal:** 1fr + 1fr (gap: 24px)
- **Three Equal:** 1fr + 1fr + 1fr (gap: 24px)

### Admin Grid
```
| Sidebar (240px) | Main Content (1fr) |
|                 |                     |
```

### Landing Page Grid
```
| Content (max-width: 1200px, centered) |
```

---

## 🔍 Visual Hierarchy

1. **Most Important:** H1, accent color, bold
2. **Important:** H2, H3, slightly larger
3. **Standard:** Body text, regular weight
4. **Secondary:** Small text, muted color
5. **De-emphasized:** Disabled state, lower opacity

---

## ✅ Design System Checklist

Before implementation:
- [ ] All colors meet WCAG AA contrast
- [ ] All fonts load correctly
- [ ] Spacing is consistent (4px grid)
- [ ] Components have all states defined
- [ ] Dark mode colors defined
- [ ] Animations respect prefers-reduced-motion
- [ ] Touch targets are 44x44px minimum
- [ ] Focus states visible on all interactive elements
