# Accessibility Rules

## WCAG 2.1 AA Compliance

This project strives for **WCAG 2.1 Level AA** compliance as a minimum standard.

## Semantic HTML

### ✅ DO: Use semantic elements

```typescript
// ✅ GOOD: Semantic structure
<article>
  <header>
    <h1>Post Title</h1>
    <time dateTime="2026-02-18">February 18, 2026</time>
  </header>

  <main>
    <p>Content goes here...</p>
  </main>

  <footer>
    <nav aria-label="Post navigation">
      <a href="/prev">Previous</a>
      <a href="/next">Next</a>
    </nav>
  </footer>
</article>

// ✅ GOOD: Proper heading hierarchy
<main>
  <h1>Page Title</h1>
  <section>
    <h2>Section Title</h2>
    <h3>Subsection</h3>
  </section>
</main>

// ✅ GOOD: Landmark regions
<header>Site Header</header>
<nav aria-label="Main navigation">...</nav>
<main>Main Content</main>
<aside>Sidebar</aside>
<footer>Site Footer</footer>
```

### ❌ DON'T: Use non-semantic elements

```typescript
// ❌ BAD: div soup
<div class="button" onClick={handleClick}>
  Click me
</div>

// ❌ BAD: Skipping heading levels
<h1>Title</h1>
<h3>Should be h2</h3>

// ❌ BAD: No semantic structure
<div class="header">...</div>
<div class="content">...</div>
<div class="footer">...</div>
```

## ARIA Attributes

### ✅ DO: Use ARIA appropriately

```typescript
// ✅ GOOD: Button with icon (needs label)
<button
  type="button"
  aria-label="Close dialog"
  onClick={onClose}
>
  <X className="h-4 w-4" />
</button>

// ✅ GOOD: Custom dropdown
<div
  role="listbox"
  aria-label="Select category"
  aria-expanded={isOpen}
  aria-activedescendant={activeId}
>
  <div role="option" aria-selected={selected}>
    Option 1
  </div>
</div>

// ✅ GOOD: Loading state
<div role="status" aria-live="polite" aria-busy={isLoading}>
  {isLoading ? 'Loading...' : 'Content loaded'}
</div>

// ✅ GOOD: Error announcement
<div role="alert" aria-live="assertive">
  {error && <p>{error.message}</p>}
</div>

// ✅ GOOD: Hidden decorative content
<div aria-hidden="true">
  <DecorativeIcon />
</div>
```

### ❌ DON'T: Misuse ARIA

```typescript
// ❌ BAD: Redundant ARIA
<button role="button">Click</button> // button already has role

// ❌ BAD: Incorrect roles
<div role="button">Should be actual button</div>

// ❌ BAD: Missing required ARIA
<div role="tab" aria-selected={selected}>
  {/* Missing aria-controls */}
</div>
```

## Form Accessibility

### ✅ DO: Create accessible forms

```typescript
// ✅ GOOD: Proper labels
<form>
  <label htmlFor="email">
    Email Address
    <input
      id="email"
      type="email"
      name="email"
      required
      aria-required="true"
      aria-describedby="email-help"
    />
  </label>
  <span id="email-help" className="text-sm text-muted-foreground">
    We'll never share your email
  </span>

  {errors.email && (
    <span role="alert" className="text-destructive">
      {errors.email.message}
    </span>
  )}
</form>

// ✅ GOOD: Fieldset for related inputs
<fieldset>
  <legend>Contact Information</legend>

  <label htmlFor="name">Name</label>
  <input id="name" type="text" />

  <label htmlFor="email">Email</label>
  <input id="email" type="email" />
</fieldset>

// ✅ GOOD: Radio group
<fieldset>
  <legend>Choose category</legend>
  <div>
    <input type="radio" id="tech" name="category" value="tech" />
    <label htmlFor="tech">Technology</label>
  </div>
  <div>
    <input type="radio" id="design" name="category" value="design" />
    <label htmlFor="design">Design</label>
  </div>
</fieldset>
```

### ❌ DON'T: Create inaccessible forms

```typescript
// ❌ BAD: No label
<input type="text" placeholder="Enter name" /> // Placeholder isn't a label

// ❌ BAD: onClick on non-interactive element
<div onClick={handleSubmit}>Submit</div> // Use button

// ❌ BAD: No error association
<input type="email" />
<span>Invalid email</span> // Not connected to input
```

## Keyboard Navigation

### ✅ DO: Support keyboard interaction

```typescript
// ✅ GOOD: Keyboard-accessible dropdown
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
    }
  };

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      onKeyDown={handleKeyDown}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      Select Option
    </button>
  );
}

// ✅ GOOD: Skip to main content
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
<main id="main-content">
  {/* Content */}
</main>
```

### ❌ DON'T: Break keyboard navigation

```typescript
// ❌ BAD: tabIndex on non-interactive
<div tabIndex={0} onClick={handleClick}>
  {/* Should be a button */}
</div>

// ❌ BAD: Positive tabIndex
<input tabIndex={5} /> // Breaks natural order

// ❌ BAD: No keyboard handling
<div onClick={handleClick}>Click</div> // No onKeyDown
```

## Focus Management

### ✅ DO: Manage focus properly

```typescript
// ✅ GOOD: Focus trap in modal
import { useRef, useEffect } from 'react';

function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const previousActiveElement = document.activeElement;
      modalRef.current?.focus();

      return () => {
        (previousActiveElement as HTMLElement)?.focus();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      tabIndex={-1}
    >
      <h2 id="dialog-title">Modal Title</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}

// ✅ GOOD: Visible focus indicator
// globals.css
* :focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}
```

### ❌ DON'T: Hide or break focus

```typescript
// ❌ BAD: Removing focus outline
button {
  outline: none; // Makes keyboard navigation impossible
}

// ❌ BAD: Not restoring focus after modal
function Modal({ onClose }: Props) {
  return (
    <div>
      <button onClick={onClose}>Close</button>
    </div>
  );
  // Focus lost when modal closes
}
```

## Color Contrast

### ✅ DO: Ensure sufficient contrast

```css
/* ✅ GOOD: WCAG AA compliant (4.5:1 minimum for normal text) */
.text-primary {
  color: hsl(222, 47%, 11%); /* Dark blue on white: 12:1 */
}

.text-muted {
  color: hsl(215, 16%, 47%); /* Gray on white: 4.6:1 */
}

/* ✅ GOOD: Buttons have clear contrast */
.button-primary {
  background: hsl(222, 47%, 11%);
  color: hsl(0, 0%, 100%);
  /* 12:1 contrast ratio */
}

/* ✅ GOOD: Links are distinguishable */
a {
  color: hsl(221, 83%, 53%); /* Blue, 4.5:1 on white */
  text-decoration: underline; /* Not just color */
}
```

### ❌ DON'T: Use poor contrast

```css
/* ❌ BAD: Insufficient contrast */
.text-light-gray {
  color: #ccc; /* 2.8:1 on white - fails WCAG AA */
}

/* ❌ BAD: Links only differentiated by color */
a {
  color: blue;
  text-decoration: none; /* Colorblind users can't tell */
}
```

## Images & Media

### ✅ DO: Provide text alternatives

```typescript
// ✅ GOOD: Descriptive alt text
<Image
  src="/blog-cover.jpg"
  alt="Developer coding at desk with external monitor showing code editor"
  width={1200}
  height={600}
/>

// ✅ GOOD: Decorative image (empty alt)
<Image
  src="/decorative-pattern.svg"
  alt=""
  aria-hidden="true"
  width={100}
  height={100}
/>

// ✅ GOOD: Complex image with long description
<figure>
  <Image
    src="/architecture-diagram.png"
    alt="System architecture diagram"
    width={800}
    height={600}
    aria-describedby="arch-description"
  />
  <figcaption id="arch-description">
    Detailed description: The diagram shows three layers...
  </figcaption>
</figure>

// ✅ GOOD: Video with captions
<video controls>
  <source src="/video.mp4" type="video/mp4" />
  <track kind="captions" src="/captions.vtt" srcLang="en" label="English" />
</video>
```

### ❌ DON'T: Skip alt text

```typescript
// ❌ BAD: Missing alt
<img src="/photo.jpg" />

// ❌ BAD: Generic alt text
<img src="/team-photo.jpg" alt="image" />
<img src="/chart.png" alt="chart" />

// ❌ BAD: Alt text duplicates nearby text
<a href="/blog/post-title">
  <img src="/thumbnail.jpg" alt="Post Title" />
  Post Title
</a>
```

## Screen Reader Support

### ✅ DO: Optimize for screen readers

```typescript
// ✅ GOOD: Screen reader only text
<span className="sr-only">Search</span>
<MagnifyingGlassIcon />

// CSS for sr-only
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

// ✅ GOOD: Progress indicator
<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Upload progress"
>
  <div style={{ width: `${progress}%` }} />
</div>

// ✅ GOOD: Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {notification && <p>{notification.message}</p>}
</div>
```

## Link Text

### ✅ DO: Use descriptive links

```typescript
// ✅ GOOD: Descriptive link text
<Link href="/blog/nextjs-guide">
  Read our complete guide to Next.js 14
</Link>

// ✅ GOOD: Button with clear purpose
<button onClick={handleDelete} aria-label={`Delete post "${post.title}"`}>
  <TrashIcon />
</button>
```

### ❌ DON'T: Use vague link text

```typescript
// ❌ BAD: "Click here" links
<a href="/guide">Click here</a> to read more

// ❌ BAD: Same link text for different targets
<a href="/post-1">Read more</a>
<a href="/post-2">Read more</a> // Screen reader hears "Read more, Read more"

// ✅ GOOD: Unique link text
<a href="/post-1">Read more about Next.js</a>
<a href="/post-2">Read more about TypeScript</a>
```

## Responsive Design & Zoom

### ✅ DO: Support zoom and scaling

```html
<!-- ✅ GOOD: Proper viewport meta -->
<meta name="viewport" content="width=device-width, initial-scale=1" />

<!-- ✅ GOOD: Allow user scaling -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, user-scalable=yes"
/>
```

```css
/* ✅ GOOD: Use relative units */
.text {
  font-size: 1rem; /* 16px, scales with zoom */
  line-height: 1.5;
  margin: 1.5rem 0;
}

/* ✅ GOOD: Touch target size (WCAG 2.1) */
button {
  min-width: 44px;
  min-height: 44px;
  padding: 0.75rem 1.5rem;
}
```

### ❌ DON'T: Restrict zoom

```html
<!-- ❌ BAD: Disabling zoom -->
<meta name="viewport" content="width=device-width, user-scalable=no" />
<meta name="viewport" content="width=device-width, maximum-scale=1" />
```

## Strict Rules

1. **Use semantic HTML** - header, nav, main, article, aside, footer
2. **Provide alt text** - for all meaningful images
3. **Use proper labels** - htmlFor on all form labels
4. **Support keyboard** - all interactive elements accessible via keyboard
5. **Manage focus** - trap focus in modals, restore after closing
6. **Ensure contrast** - minimum 4.5:1 for normal text (WCAG AA)
7. **Use ARIA appropriately** - when semantic HTML isn't enough
8. **Descriptive link text** - no "click here" or "read more"
9. **Visible focus indicators** - never remove outline without replacement
10. **Allow zoom** - never disable user-scalable
11. **Announce changes** - use aria-live for dynamic content
12. **Test with screen reader** - NVDA, JAWS, or VoiceOver
