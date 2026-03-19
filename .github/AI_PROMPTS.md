# AI Agent Prompts for NNBlogs Development

## Quick Reference Prompts

### Creating a New Blog Post Component
```
Create a new blog post component that displays [feature]. 
Follow the existing pattern in src/components/blog/.
Use Tailwind CSS for styling and TypeScript for types.
```

### Adding a New API Endpoint
```
Create a new API endpoint at /api/[name] that [functionality].
Use the existing pattern in src/app/api/.
Include error handling and type safety.
```

### Database Schema Changes
```
I need to add a new table for [feature].
Update supabase/schema.sql with the table definition.
Add corresponding TypeScript types in src/types/index.ts.
Create query functions in src/lib/supabase/queries.ts.
```

### New Page Creation
```
Create a new page at /[route] that [functionality].
Use server components where possible.
Include proper metadata for SEO.
Follow the existing layout patterns.
```

### Component Styling
```
Style this component using Tailwind CSS.
Follow the design system defined in globals.css.
Ensure responsive design for mobile and desktop.
Support dark mode using the existing CSS variables.
```

## Feature Implementation Prompts

### Add Newsletter Subscription
```
Add a newsletter subscription feature:
1. Create a Supabase table for subscribers
2. Create an API endpoint to handle subscriptions
3. Create a subscription form component
4. Add the form to the footer
```

### Add Comments System
```
Implement a comments system for blog posts:
1. Create a comments table in Supabase
2. Create API endpoints for CRUD operations
3. Create comment components (list, form, item)
4. Add to blog post pages
5. Require authentication to comment
```

### Add Admin Dashboard
```
Create an admin dashboard at /admin:
1. Protected by Clerk authentication
2. List all posts/videos with edit/delete
3. Create new content forms
4. Analytics overview
```

### Add RSS Feed
```
Create an RSS feed at /rss.xml:
1. Generate XML from blog posts
2. Include title, description, link, pubDate
3. Add link in header for feed discovery
```

## Debugging Prompts

### Fix Build Errors
```
I'm getting a build error: [error message]
Please analyze the error and suggest a fix.
Consider TypeScript types, missing imports, and server/client component issues.
```

### Optimize Performance
```
Analyze the [component/page] for performance issues.
Suggest optimizations for:
- Bundle size
- Rendering performance
- Data fetching
- Image optimization
```

### Debug Database Query
```
This Supabase query isn't working as expected:
[query code]
Expected: [expected result]
Actual: [actual result]
```

## Best Practices Reminders

When implementing features, always:
1. Use TypeScript types
2. Handle loading and error states
3. Follow existing code patterns
4. Add proper error messages
5. Consider mobile responsiveness
6. Support dark mode
7. Use React Query for server state
8. Keep components small and focused
