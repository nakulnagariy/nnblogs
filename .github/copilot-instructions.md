# GitHub Copilot Instructions for NNBlogs

## Core Stack

- Next.js 16.1.1 (App Router), React 19.2.3, TypeScript 5, Tailwind CSS v4.
- Database & Auth: Supabase + Supabase Auth. Do NOT generate Clerk code.

## Code Generation Preferences

- Always prefer Clean Architecture patterns (UI → Service → Data).
- Default to React Server Components. Only output `'use client'` when active UI state or browser hooks are required.
- Use strict TypeScript definitions; completely avoid the `any` type.
- Use the `cn()` utility function for merging conditional Tailwind CSS classes.

## Query Rules

- Client Component reads: Wrap queries using TanStack Query hooks.
- Public data reads: Use the public anon client `lib/supabase/client.ts`.
- Server/Admin operations: Use the service role client `lib/supabase/server.ts`. Never expose this client to frontend components.
