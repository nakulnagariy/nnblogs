# Refactor Skill

## Purpose

Improve code maintainability, readability, and organization without changing behavior or breaking public interfaces.

## Triggers

- "refactor"
- "improve code quality"
- "clean up code"
- "extract component"
- "simplify code"

## Input Requirements

- **target**: File(s) or function(s) to refactor
- **reason**: Optional reason for refactoring (complexity, duplication, etc.)
- **constraints**: Any specific constraints (preserve API, keep behavior identical)

## Execution Steps

### 1. Analyze Current Code

- Read target file(s) completely
- Identify code smells:
  - Functions > 50 lines
  - Nested conditionals > 3 levels
  - Duplicated code blocks
  - Magic numbers
  - Unclear variable names
  - Mixed concerns
  - God objects/components

### 2. Identify Refactoring Opportunities

Categorize by type:

- **Extract Function**: Break large functions into smaller ones
- **Extract Component**: Split large components
- **Rename**: Improve clarity of names
- **Remove Duplication**: DRY up repeated code
- **Simplify Logic**: Reduce complexity
- **Type Strengthening**: Improve TypeScript types

### 3. Plan Refactoring

- Determine order (safest changes first)
- Identify tests that cover this code
- Note public API boundaries (cannot change)
- Plan for backward compatibility

### 4. Execute Refactoring

Apply transformations systematically:

1. Extract constants from magic numbers
2. Rename for clarity
3. Extract helper functions
4. Simplify conditionals
5. Remove duplication
6. Add types where needed

### 5. Verify Behavior Preserved

- Run existing tests
- Verify TypeScript compilation
- Check no runtime errors
- Confirm public API unchanged

## Output Format

```markdown
# Refactoring Report: [Component/Function Name]

## Summary

- **Complexity Before**: High/Medium/Low
- **Complexity After**: High/Medium/Low
- **Lines Changed**: X added, Y removed
- **Public API Changed**: Yes/No
- **Tests Updated**: Yes/No/N/A

## Issues Identified

### 1. Function Too Long

**Location**: `components/BlogEditor.tsx`, lines 45-120  
**Issue**: `handleSubmit` function is 75 lines  
**Impact**: Hard to read, difficult to test

### 2. Code Duplication

**Location**: Multiple files  
**Issue**: Date formatting logic repeated in 5 places  
**Impact**: Maintenance burden, inconsistency risk

### 3. Magic Numbers

**Location**: `lib/utils.ts`, line 23  
**Issue**: Hardcoded `200` without explanation  
**Impact**: Unclear intent

## Refactoring Changes

### Change 1: Extract Function

**Before**:
\`\`\`typescript
function handleSubmit(data: FormData) {
// 75 lines of mixed validation, transformation, and API calls
if (!data.title) throw new Error('Title required');
if (data.title.length < 3) throw new Error('Title too short');
// ... 70 more lines
}
\`\`\`

**After**:
\`\`\`typescript
function handleSubmit(data: FormData) {
validatePost(data);
const transformed = transformPostData(data);
return savePost(transformed);
}

function validatePost(data: FormData) {
if (!data.title) throw new Error('Title required');
if (data.title.length < 3) throw new Error('Title too short');
// All validation logic here
}

function transformPostData(data: FormData): Post {
return {
title: data.title.trim(),
slug: slugify(data.title),
// transformation logic
};
}
\`\`\`

**Justification**: Separates concerns, improves testability, increases readability

---

### Change 2: Extract Utility Function

**Before**:
\`\`\`typescript
// In BlogCard.tsx
const formatted = new Date(post.created_at).toLocaleDateString('en-US', {
year: 'numeric',
month: 'short',
day: 'numeric',
});

// In PostPage.tsx
const formatted = new Date(post.created_at).toLocaleDateString('en-US', {
year: 'numeric',
month: 'short',
day: 'numeric',
});

// Repeated 3 more times...
\`\`\`

**After**:
\`\`\`typescript
// In lib/utils.ts
export function formatDate(date: Date | string): string {
const dateObj = typeof date === 'string' ? new Date(date) : date;
return dateObj.toLocaleDateString('en-US', {
year: 'numeric',
month: 'short',
day: 'numeric',
});
}

// In components
import { formatDate } from '@/lib/utils';
const formatted = formatDate(post.created_at);
\`\`\`

**Justification**: DRY principle, single source of truth, easier to maintain

---

### Change 3: Replace Magic Number

**Before**:
\`\`\`typescript
const excerpt = content.substring(0, 200);
\`\`\`

**After**:
\`\`\`typescript
const EXCERPT_LENGTH = 200;
const excerpt = content.substring(0, EXCERPT_LENGTH);
\`\`\`

**Justification**: Self-documenting, easier to change, clearer intent

## Impact Analysis

### Positive Impacts

- ✅ Improved readability (McCabe complexity reduced from 15 to 5)
- ✅ Better testability (can test validation separately)
- ✅ Reduced duplication (5 → 1 date formatting implementation)
- ✅ Easier maintenance (change date format in one place)

### Risks Mitigated

- No public API changes
- All existing tests pass
- TypeScript compilation succeeds
- No runtime errors introduced

### Test Coverage

- Existing tests: All passing
- New tests needed: None (behavior unchanged)
- Test updates: None required

## Files Changed

- `components/BlogEditor.tsx` - Refactored handleSubmit
- `lib/utils.ts` - Added formatDate helper
- `components/BlogCard.tsx` - Use formatDate
- `components/PostPage.tsx` - Use formatDate

## Next Steps

1. Review refactored code
2. Verify tests pass: `npm test`
3. Verify type check: `npm run type-check`
4. Merge changes

## Verification Commands

\`\`\`bash

# Run tests

npm test

# Type check

npm run type-check

# Lint

npm run lint

# Build

npm run build
\`\`\`
```

## Constraints

- **NO breaking changes** to public APIs
- **NO behavior changes** - functionality must remain identical
- **Preserve test coverage** - all tests must still pass
- **No new dependencies** - unless absolutely necessary and justified
- **Backward compatibility** - if public API must change, provide migration path

## Safety Checks

Before completing refactoring:

- [ ] All existing tests pass
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] No new console errors/warnings
- [ ] Public API unchanged (or migration provided)
- [ ] Manual testing completed
- [ ] Code review ready

## Refactoring Patterns

### Extract Function

When: Function > 50 lines or does multiple things

### Extract Component

When: Component > 300 lines or renders multiple concepts

### Replace Magic Number

When: Numeric literals without obvious meaning

### Simplify Conditional

When: Nested if-else > 3 levels

### Replace Loop with Method

When: forEach/map/filter more expressive

### Extract Variable

When: Complex expression used multiple times

### Rename

When: Name doesn't clearly express intent

## Anti-Patterns to Avoid

- ❌ Over-abstraction (introducing unnecessary complexity)
- ❌ Premature optimization
- ❌ Breaking working code without tests
- ❌ Changing behavior "while we're at it"
- ❌ Refactoring without understanding

## Example Usage

**User**: "Refactor the BlogEditor component, it's too complex"

**Skill Output**:

1. Analyzes BlogEditor.tsx
2. Identifies large functions, duplication
3. Proposes extractions and simplifications
4. Shows before/after code
5. Verifies tests still pass
6. Provides impact analysis and verification steps
