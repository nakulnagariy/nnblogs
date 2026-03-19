# Testing Rules

## Testing Framework

- **Test Runner**: Vitest (fast, Vite-powered)
- **Component Testing**: @testing-library/react
- **Matchers**: @testing-library/jest-dom
- **Coverage**: vitest/coverage

## Test File Organization

```
src/
├── components/
│   ├── BlogCard.tsx
│   └── BlogCard.test.tsx        # Co-located with component
├── hooks/
│   ├── usePosts.ts
│   └── usePosts.test.ts
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
└── app/
    └── api/
        └── posts/
            ├── route.ts
            └── route.test.ts
```

### ✅ DO: Follow naming conventions

- **Test files**: `*.test.ts` or `*.test.tsx`
- **Test suites**: Group tests in `describe()` blocks
- **Test names**: Clear, descriptive, action-based

```typescript
// BlogCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlogCard } from './BlogCard';

describe('BlogCard', () => {
  it('renders post title', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('displays formatted date', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText('Feb 18, 2026')).toBeInTheDocument();
  });

  it('navigates to post on click', async () => {
    const user = userEvent.setup();
    render(<BlogCard post={mockPost} />);

    await user.click(screen.getByRole('link'));
    expect(window.location.pathname).toBe('/blog/test-slug');
  });
});
```

## AAA Pattern (Arrange, Act, Assert)

### ✅ DO: Structure tests with AAA

```typescript
it('increments counter when button is clicked', async () => {
  // Arrange: Set up test data and render
  const user = userEvent.setup();
  render(<Counter initialCount={0} />);

  // Act: Perform the action
  const button = screen.getByRole('button', { name: /increment/i });
  await user.click(button);

  // Assert: Verify the result
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### ❌ DON'T: Mix AAA sections

```typescript
// ❌ BAD: Unclear structure
it('saves post', async () => {
  render(<PostForm />);
  const input = screen.getByLabelText('Title');
  expect(input).toBeInTheDocument(); // Don't assert in arrange
  await user.type(input, 'Test');
  const button = screen.getByRole('button');
  expect(button).toBeEnabled(); // Don't assert in act
  await user.click(button);
  expect(screen.getByText('Saved')).toBeInTheDocument();
});
```

## Component Testing

### Testing Library Best Practices

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ GOOD: Query by role, label, text (in priority order)
const button = screen.getByRole("button", { name: /submit/i });
const input = screen.getByLabelText(/email/i);
const heading = screen.getByRole("heading", { name: /title/i });
const text = screen.getByText(/welcome/i);

// ❌ BAD: Query by test ID (use as last resort)
const element = screen.getByTestId("submit-button");

// ❌ BAD: Query by className
const element = screen.getByClassName("btn-primary");
```

### Wrapping Components with Providers

```typescript
// Create test wrapper utility
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

// Use in tests
it('fetches and displays posts', async () => {
  render(<PostsList />, { wrapper: createWrapper() });

  await waitFor(() => {
    expect(screen.getByText('Post Title')).toBeInTheDocument();
  });
});
```

### Async Testing

```typescript
// ✅ GOOD: Use waitFor for async updates
it('loads and displays data', async () => {
  render(<AsyncComponent />);

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  // Assert data is displayed
  expect(screen.getByText('Data loaded')).toBeInTheDocument();
});

// ✅ GOOD: Use findBy for async queries (combines waitFor + getBy)
it('displays error message', async () => {
  render(<ComponentWithError />);

  const errorMessage = await screen.findByText(/error occurred/i);
  expect(errorMessage).toBeInTheDocument();
});
```

## Mocking

### Mock Supabase

```typescript
// __mocks__/supabase.ts
import { vi } from "vitest";

export const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    insert: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    update: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    delete: vi.fn().mockResolvedValue({ error: null }),
  })),
  rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
};

// In test file
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabase,
}));
```

### Mock Clerk Authentication

```typescript
// __mocks__/clerk.ts
import { vi } from "vitest";

export const mockAuth = {
  userId: "test-user-id",
  sessionId: "test-session-id",
  protect: vi.fn().mockResolvedValue(undefined),
};

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(() => mockAuth),
}));
```

### Mock fetch and APIs

```typescript
// Setup global fetch mock
beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('fetches posts from API', async () => {
  // Arrange
  const mockPosts = [{ id: '1', title: 'Test' }];
  (global.fetch as any).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: mockPosts }),
  });

  // Act
  render(<PostsList />);

  // Assert
  await waitFor(() => {
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  expect(global.fetch).toHaveBeenCalledWith('/api/posts');
});
```

### Mock React Query

```typescript
// Create custom hook wrapper for testing
import { renderHook, waitFor } from "@testing-library/react";

it("fetches posts with useQuery", async () => {
  const wrapper = createWrapper();

  const { result } = renderHook(() => usePosts(), { wrapper });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toHaveLength(3);
});
```

## Unit Testing Utilities

```typescript
// lib/utils.test.ts
import { describe, it, expect } from "vitest";
import { cn, formatDate, slugify } from "./utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges class names", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("handles conditional classes", () => {
      expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
    });

    it("resolves Tailwind conflicts", () => {
      expect(cn("p-4", "p-6")).toBe("p-6");
    });
  });

  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2026-02-18");
      expect(formatDate(date)).toBe("Feb 18, 2026");
    });
  });

  describe("slugify", () => {
    it("converts string to slug", () => {
      expect(slugify("Hello World!")).toBe("hello-world");
    });

    it("handles special characters", () => {
      expect(slugify("Test & Demo @ 2026")).toBe("test-demo-2026");
    });
  });
});
```

## API Route Testing

```typescript
// app/api/posts/route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { NextRequest } from "next/server";

describe("/api/posts", () => {
  describe("GET", () => {
    it("returns posts with pagination", async () => {
      // Arrange
      const request = new NextRequest("http://localhost:3000/api/posts?page=1");

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toHaveProperty("data");
      expect(data).toHaveProperty("total");
      expect(data).toHaveProperty("page");
    });

    it("filters by category", async () => {
      // Arrange
      const request = new NextRequest(
        "http://localhost:3000/api/posts?category=tech",
      );

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(data.data.every((post: any) => post.category === "tech")).toBe(
        true,
      );
    });
  });

  describe("POST", () => {
    it("creates new post", async () => {
      // Arrange
      const postData = { title: "Test", content: "Content" };
      const request = new NextRequest("http://localhost:3000/api/posts", {
        method: "POST",
        body: JSON.stringify(postData),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data).toHaveProperty("id");
      expect(data.title).toBe("Test");
    });

    it("returns 401 when not authenticated", async () => {
      // Arrange
      vi.mocked(auth).mockReturnValueOnce({ userId: null });
      const request = new NextRequest("http://localhost:3000/api/posts", {
        method: "POST",
        body: JSON.stringify({}),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(401);
    });
  });
});
```

## Test Coverage

### Coverage Thresholds

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: [
        "node_modules/",
        ".next/",
        "**/*.config.ts",
        "**/*.test.ts",
        "**/*.test.tsx",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});
```

### ✅ DO: Test critical paths

- **Core business logic** - always test
- **API routes** - all endpoints
- **Custom hooks** - especially stateful ones
- **Utility functions** - pure functions
- **Complex components** - forms, interactive UI

### ❌ DON'T: Over-test

- **Simple presentational components** - if just rendering props
- **Third-party library wrappers** - trust the library
- **Configuration files** - no logic to test

## Test Data

### Create test fixtures

```typescript
// __fixtures__/posts.ts
export const mockPost = {
  id: "test-id-1",
  title: "Test Post",
  slug: "test-post",
  content: "Test content",
  excerpt: "Test excerpt",
  published: true,
  created_at: "2026-02-18T10:00:00Z",
  updated_at: "2026-02-18T10:00:00Z",
  author_id: "author-1",
  category: "tech",
  tags: ["testing", "jest"],
  views: 100,
};

export const mockPosts = [
  mockPost,
  { ...mockPost, id: "test-id-2", title: "Second Post" },
  { ...mockPost, id: "test-id-3", title: "Third Post" },
];
```

## Strict Rules

1. **Write tests for new features** - no untested logic
2. **Use AAA pattern** - Arrange, Act, Assert
3. **Query by accessibility** - role, label, text (not test IDs)
4. **Mock external dependencies** - Supabase, Clerk, fetch
5. **Test user behavior** - not implementation details
6. **Handle async properly** - use waitFor, findBy
7. **Maintain coverage** - minimum 70% threshold
8. **Co-locate tests** - next to the code being tested
9. **Keep tests focused** - one assertion concept per test
10. **Run tests before commits** - ensure passing tests
