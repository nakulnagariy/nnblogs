# Testing Skill

## Purpose

Generate comprehensive tests for new or untested code, following AAA pattern and Testing Library best practices.

## Triggers

- "add tests"
- "write tests"
- "test coverage"
- "generate tests"
- "create unit tests"

## Input Requirements

- **target**: File(s) or component(s) to test
- **type**: Unit, integration, or both
- **coverage_goal**: Optional target coverage percentage

## Execution Steps

### 1. Analyze Target Code

- Read target file completely
- Identify:
  - Public exports (functions, components, hooks)
  - Input parameters and types
  - Return values
  - Side effects (API calls, state changes)
  - Edge cases
  - Error conditions

### 2. Determine Test Strategy

**For Components**:

- Rendering tests
- User interaction tests
- Props validation
- State management tests
- Accessibility checks

**For Functions**:

- Happy path tests
- Edge case tests
- Error handling tests
- Boundary conditions

**For Hooks**:

- State changes
- Side effects
- Dependency updates

**For API Routes**:

- Request handling
- Response formats
- Authentication
- Error responses

### 3. Set Up Test Environment

- Import necessary testing utilities
- Create mocks for dependencies:
  - Supabase
  - Clerk authentication
  - External APIs
  - React Query
- Set up test wrappers (QueryClient, providers)

### 4. Write Tests Following AAA Pattern

For each test case:

- **Arrange**: Set up test data, render components
- **Act**: Trigger the behavior
- **Assert**: Verify the outcome

### 5. Cover Edge Cases

- Empty inputs
- Null/undefined values
- Maximum values
- Invalid inputs
- Error conditions
- Loading states
- Authentication states

### 6. Verify Coverage

- Run tests
- Check coverage report
- Identify gaps
- Add missing tests

## Output Format

```markdown
# Test Suite: [Component/Function Name]

## Coverage Summary

- **Lines**: 95%
- **Functions**: 100%
- **Branches**: 90%
- **Statements**: 95%

## Test File Created

`[filename].test.tsx` or `[filename].test.ts`

## Tests Written

### 1. Component Rendering Tests

- ✅ Renders with required props
- ✅ Renders with optional props
- ✅ Renders children correctly
- ✅ Applies className properly

### 2. User Interaction Tests

- ✅ Handles click events
- ✅ Handles form submission
- ✅ Validates user input
- ✅ Updates on user interaction

### 3. State Management Tests

- ✅ Initial state is correct
- ✅ State updates on action
- ✅ Side effects triggered correctly

### 4. Error Handling Tests

- ✅ Displays error message
- ✅ Handles API errors
- ✅ Validates input

### 5. Edge Case Tests

- ✅ Handles empty data
- ✅ Handles null values
- ✅ Handles loading state
- ✅ Handles unauthenticated user

## Complete Test File

\`\`\`typescript
// components/BlogCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BlogCard } from './BlogCard';
import type { Post } from '@/types';

const mockPost: Post = {
id: 'test-id-1',
title: 'Test Post',
slug: 'test-post',
excerpt: 'Test excerpt',
created_at: '2026-02-18T10:00:00Z',
author_id: 'author-1',
category: 'tech',
tags: ['testing'],
views: 100,
published: true,
};

describe('BlogCard', () => {
describe('Rendering', () => {
it('renders post title', () => {
render(<BlogCard post={mockPost} />);
expect(screen.getByText('Test Post')).toBeInTheDocument();
});

    it('renders post excerpt', () => {
      render(<BlogCard post={mockPost} />);
      expect(screen.getByText('Test excerpt')).toBeInTheDocument();
    });

    it('renders formatted date', () => {
      render(<BlogCard post={mockPost} />);
      expect(screen.getByText('Feb 18, 2026')).toBeInTheDocument();
    });

    it('renders category badge', () => {
      render(<BlogCard post={mockPost} />);
      expect(screen.getByText('tech')).toBeInTheDocument();
    });

    it('renders view count', () => {
      render(<BlogCard post={mockPost} />);
      expect(screen.getByText('100 views')).toBeInTheDocument();
    });

});

describe('Navigation', () => {
it('links to post detail page', () => {
render(<BlogCard post={mockPost} />);
const link = screen.getByRole('link');
expect(link).toHaveAttribute('href', '/blog/test-post');
});

    it('navigates on card click', async () => {
      const user = userEvent.setup();
      render(<BlogCard post={mockPost} />);

      const link = screen.getByRole('link');
      await user.click(link);

      // Verify navigation (with mocked router)
      expect(mockPush).toHaveBeenCalledWith('/blog/test-post');
    });

});

describe('Edge Cases', () => {
it('renders without excerpt', () => {
const postWithoutExcerpt = { ...mockPost, excerpt: '' };
render(<BlogCard post={postWithoutExcerpt} />);
expect(screen.queryByText('Test excerpt')).not.toBeInTheDocument();
});

    it('handles missing category', () => {
      const postWithoutCategory = { ...mockPost, category: undefined };
      render(<BlogCard post={postWithoutCategory} />);
      expect(screen.queryByRole('badge')).not.toBeInTheDocument();
    });

    it('handles zero views', () => {
      const postWithZeroViews = { ...mockPost, views: 0 };
      render(<BlogCard post={postWithZeroViews} />);
      expect(screen.getByText('0 views')).toBeInTheDocument();
    });

});

describe('Accessibility', () => {
it('has accessible link text', () => {
render(<BlogCard post={mockPost} />);
const link = screen.getByRole('link', { name: /test post/i });
expect(link).toBeInTheDocument();
});

    it('has proper article structure', () => {
      render(<BlogCard post={mockPost} />);
      const article = screen.getByRole('article');
      expect(article).toBeInTheDocument();
    });

});

describe('Styling', () => {
it('applies hover styles', () => {
const { container } = render(<BlogCard post={mockPost} />);
const card = container.firstChild as HTMLElement;
expect(card).toHaveClass('hover:shadow-lg');
});

    it('applies custom className', () => {
      const { container } = render(
        <BlogCard post={mockPost} className="custom-class" />
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class');
    });

});
});
\`\`\`

## Mock Setup

\`\`\`typescript
// **mocks**/supabase.ts
import { vi } from 'vitest';

export const mockSupabase = {
from: vi.fn(() => ({
select: vi.fn().mockReturnThis(),
eq: vi.fn().mockReturnThis(),
single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
})),
};

vi.mock('@/lib/supabase/client', () => ({
createClient: () => mockSupabase,
}));
\`\`\`

## Running Tests

\`\`\`bash

# Run all tests

npm test

# Run specific test file

npm test BlogCard.test.tsx

# Run with coverage

npm test -- --coverage

# Watch mode

npm test -- --watch
\`\`\`

## Coverage Report

Current coverage:

- Lines: 95% (145/153)
- Functions: 100% (12/12)
- Branches: 90% (18/20)
- Statements: 95% (140/147)

Uncovered lines:

- Line 45: Error catch block (rare error case)
- Line 87-89: Deep conditional branch

Recommendation: Coverage is excellent. Uncovered lines are edge cases that can be addressed in future iterations.
```

## Test Patterns

### Component Tests

```typescript
describe('Component', () => {
  it('renders correctly', () => {
    render(<Component {...props} />);
    expect(screen.getByText('Expected')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Component onClick={handleClick} />);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Tests

```typescript
describe("useCustomHook", () => {
  it("returns initial state", () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.value).toBe(initialValue);
  });

  it("updates state on action", () => {
    const { result } = renderHook(() => useCustomHook());
    act(() => {
      result.current.setValue(newValue);
    });
    expect(result.current.value).toBe(newValue);
  });
});
```

### API Route Tests

```typescript
describe("GET /api/posts", () => {
  it("returns posts with pagination", async () => {
    const request = new NextRequest("http://localhost/api/posts?page=1");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("data");
    expect(data.data).toBeInstanceOf(Array);
  });
});
```

## Constraints

- **Follow AAA pattern** - Arrange, Act, Assert
- **Test behavior, not implementation** - avoid testing internal details
- **Mock external dependencies** - Supabase, APIs, etc.
- **Maintain fast tests** - tests should run quickly
- **Write descriptive test names** - clear what is being tested
- **Cover edge cases** - not just happy path

## Quality Checklist

- [ ] All public functions/components tested
- [ ] Happy path covered
- [ ] Edge cases covered
- [ ] Error handling tested
- [ ] Loading states tested
- [ ] Authentication states tested
- [ ] Accessibility verified
- [ ] Tests are deterministic (no flaky tests)
- [ ] Mocks properly set up
- [ ] Coverage meets threshold (70%+)

## Example Usage

**User**: "Add tests for the usePosts hook"

**Skill Output**: Analyzes `usePosts.ts`, generates comprehensive test file covering query execution, loading states, error handling, refetching, and pagination. Includes proper React Query mock setup and provides full test file with AAA pattern.
