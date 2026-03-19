# Copilot Instructions for NNBlogs

## Project Overview
This is a personal blog website built with Next.js 14, TypeScript, Tailwind CSS, Supabase, and Clerk authentication.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Markdown**: Marked + Highlight.js

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (main)/            # Main public routes
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── blog/             # Blog-specific components
│   ├── github/           # GitHub integration components
│   └── layout/           # Layout components
├── lib/                   # Utility libraries
│   ├── supabase/         # Supabase client and queries
│   ├── clerk/            # Clerk configuration
│   └── utils/            # Helper functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── styles/               # Global styles
```

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use React Query for server state management
- Follow the App Router conventions for routing
- Use server components where possible, client components when needed

### Naming Conventions
- Components: PascalCase (e.g., `BlogCard.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `usePosts.ts`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Types: PascalCase with descriptive names (e.g., `BlogPost`, `User`)

### Database Operations
- Use Supabase client from `@/lib/supabase/client`
- Server-side queries should use the server client
- Client-side queries should use the browser client
- Always handle errors gracefully

### Authentication
- Clerk handles all authentication
- Protected routes use Clerk middleware
- Admin routes require specific user roles

### Styling
- Use Tailwind CSS utility classes
- Custom components use `cn()` utility for class merging
- Consistent spacing and typography using Tailwind config

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
GITHUB_USERNAME=
GITHUB_TOKEN=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
OPENAI_API_KEY=
```

## Common Tasks

### Adding a new blog post
1. Navigate to admin dashboard
2. Click "New Post"
3. Fill in title, content (markdown), category, and tags
4. Upload featured image if needed
5. Publish or save as draft

### Adding a new page
1. Create a new folder in `src/app/(main)/`
2. Add `page.tsx` file
3. Implement the page component

### Adding a new API route
1. Create folder in `src/app/api/`
2. Add `route.ts` file
3. Export HTTP method handlers (GET, POST, etc.)
