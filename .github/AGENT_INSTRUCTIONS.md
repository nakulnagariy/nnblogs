# AI Development Agent Instructions

This document provides instructions for AI coding assistants working on the NNBlogs project.

## Project Context

NNBlogs is a personal blog website built with:
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase** for database
- **Clerk** for authentication
- **React Query** for server state

## Code Standards

### TypeScript
- Use strict mode
- Define interfaces/types for all data structures
- Avoid `any` type - use `unknown` if type is truly unknown
- Export types from `src/types/index.ts`

### React Components
- Use functional components with hooks
- Prefer server components, use `'use client'` only when needed
- Keep components small and focused
- Use named exports for components

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- Types: in `src/types/`

### Styling
- Use Tailwind CSS utility classes
- Use `cn()` utility for conditional classes
- Follow the design system in `globals.css`

## Database Operations

### Queries
```typescript
// Client-side (browser)
import { supabase } from '@/lib/supabase/client';

// Server-side
import { supabaseAdmin } from '@/lib/supabase/server';
```

### Adding New Tables
1. Add SQL to `supabase/schema.sql`
2. Add TypeScript types to `src/types/index.ts`
3. Add queries to `src/lib/supabase/queries.ts`
4. Create hooks in `src/hooks/`

## API Routes

Location: `src/app/api/`

Pattern:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Handle request
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Message' }, { status: 500 });
  }
}
```

## Authentication

Protected routes use Clerk middleware (`src/middleware.ts`).

Check auth in API routes:
```typescript
import { auth } from '@clerk/nextjs/server';

const { userId } = await auth();
if (!userId) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## Common Tasks

### Add a New Page
1. Create folder in `src/app/`
2. Add `page.tsx` with default export
3. Add metadata export if needed

### Add a New Component
1. Create in appropriate `src/components/` subfolder
2. Export from the folder's `index.ts`
3. Import using `@/components/...`

### Add a New Hook
1. Create in `src/hooks/`
2. Prefix with `use`
3. Use React Query for server state

### Add Database Feature
1. Update `supabase/schema.sql`
2. Add types to `src/types/index.ts`
3. Add queries to `src/lib/supabase/queries.ts`
4. Create React Query hook

## Testing Changes

```bash
npm run dev     # Start dev server
npm run build   # Check for build errors
npm run lint    # Check for lint errors
```

## Environment Variables

Required variables are in `.env.local.example`. Never commit actual values.

## Deployment

- See `docs/AWS_DEPLOYMENT.md` for AWS options
- Vercel is the simplest option for Next.js
