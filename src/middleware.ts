import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/blog(.*)',
  '/videos(.*)',
  '/projects(.*)',
  '/about',
  '/search',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/posts(.*)',
  '/api/videos(.*)',
  '/api/search(.*)',
  '/api/github(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Public routes don't require authentication
  if (isPublicRoute(req)) {
    return;
  }

  // Admin routes require admin role (you can customize this)
  if (isAdminRoute(req)) {
    await auth.protect();
    // Add admin role check here if needed
  }

  // All other routes require authentication
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
