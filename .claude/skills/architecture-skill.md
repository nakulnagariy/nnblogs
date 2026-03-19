# Architecture Review Skill

## Purpose

Evaluate codebase against defined architectural patterns and identify violations of layer separation, component usage, and dependency rules.

## Triggers

- "review architecture"
- "analyze structure"
- "validate layering"
- "check architecture"
- "evaluate structure"

## Input Requirements

- **files**: Array of file paths to review (or entire codebase)
- **focus**: Optional specific area (e.g., "Server Components", "API routes", "database layer")

## Execution Steps

### 1. Analyze Component Structure

- Identify all React components
- Check for `'use client'` directive
- Classify as Server or Client Component
- Verify appropriate usage based on purpose:
  - **Server**: Static content, data fetching, SEO pages
  - **Client**: Interactive UI, hooks, browser APIs, state management

### 2. Validate Layer Separation

Check dependency flow:

```
UI Layer (components/*)
  ↓ Can import
Service Layer (lib/*)
  ↓ Can import
Data Layer (lib/supabase/*)
```

Violations to detect:

- Data layer importing from UI layer
- Circular dependencies between layers
- Business logic in components
- UI components in lib/\* files

### 3. Check File Organization

- Route files in correct locations (`app/*`)
- Components grouped by domain
- API routes follow resource-based naming
- Utilities in `lib/*`
- Types in `types/*`

### 4. Validate State Management

- Server state uses React Query
- Local state uses useState/useReducer
- No global state for server data
- Props not drilled > 3 levels deep

### 5. Check Database Access Patterns

- Server Components/API routes use server client
- Client Components use browser client
- Queries centralized in `lib/supabase/queries.ts`
- No direct Supabase calls in components

### 6. Authentication Validation

- Protected routes use Clerk middleware
- API routes check authentication
- No client-side auth bypass
- User IDs from auth, not client input

## Output Format

```markdown
# Architecture Review Report

## Summary

- **Files Analyzed**: X
- **Issues Found**: Y
- **Risk Level**: Low/Medium/High

## Server vs Client Components

### ✅ Correct Usage

- `components/BlogCard.tsx` - Client Component (interactive)
- `app/blog/page.tsx` - Server Component (data fetching)

### ⚠️ Issues Found

#### High Priority

1. **File**: `app/posts/page.tsx`
   - **Issue**: Client Component fetching data client-side
   - **Rule Violated**: Should be Server Component with direct data access
   - **Recommendation**: Remove 'use client', migrate to async Server Component
   - **Code Location**: Lines 10-25

#### Medium Priority

2. **File**: `components/Header.tsx`
   - **Issue**: Entire header marked as Client but only search is interactive
   - **Recommendation**: Split into ServerHeader + ClientSearch
   - **Estimated Impact**: Reduce JS bundle by ~15KB

## Layer Violations

### ⚠️ Issues Found

1. **File**: `lib/supabase/queries.ts`
   - **Issue**: Imports UI component `Toast`
   - **Rule Violated**: Data layer importing from UI layer
   - **Recommendation**: Remove UI import, return error instead
   - **Lines**: 45

## State Management

### ✅ Correct Usage

- React Query for server state
- useState for local UI state

### ⚠️ Issues Found

None

## Database Access

### ✅ Correct Usage

- Queries centralized in queries.ts
- Proper client usage

### ⚠️ Issues Found

None

## Authentication

### ✅ Correct Usage

- Middleware protecting admin routes
- API routes checking auth

### ⚠️ Issues Found

None

## Recommendations

### Immediate Actions (High Priority)

1. Convert `app/posts/page.tsx` to Server Component
2. Remove UI import from `lib/supabase/queries.ts`

### Future Improvements (Medium Priority)

1. Split `Header.tsx` into Server + Client components
2. Add authentication check to `/api/posts` DELETE endpoint

### Best Practices Reinforcement

- Continue using Server Components by default
- Keep components focused and small
- Maintain strict layer separation

## Risk Assessment

**Overall Risk Level**: Medium

**Reasoning**: Most architecture is sound, but client-side data fetching in posts page could impact performance and SEO. UI import in data layer could cause bundling issues.

## Next Steps

1. Address high-priority issues first
2. Run tests after changes
3. Verify bundle size hasn't increased
4. Re-run architecture review
```

## Constraints

- **No breaking changes** to public APIs
- **Preserve functionality** while improving structure
- **Document reasons** for each issue flagged
- **Prioritize by impact** (High/Medium/Low)

## Validation Checklist

Before completing skill:

- [ ] All layers checked for violations
- [ ] Server vs Client usage validated
- [ ] State management patterns verified
- [ ] Database access patterns checked
- [ ] Authentication flows validated
- [ ] Recommendations are actionable
- [ ] Risk level justified with reasoning

## Example Usage

**User**: "Review architecture of the blog components"

**Skill Output**: Analyzes all files in `components/blog/`, checks for Server/Client component usage, validates imports, checks state management, produces structured report with findings and recommendations.

## Automation Potential

This skill can run automatically:

- On PR creation
- Before major releases
- Weekly as part of code quality checks
