import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Directives are defined separately for readability
const cspDirectives = [
  "default-src 'self'",

  // Next.js requires unsafe-inline for its inline scripts (hydration).
  // Without nonce-based CSP this is unavoidable.
  // Clerk, Google Analytics, and YouTube also inject scripts.
  [
    "script-src",
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://clerk.com",
    "https://*.clerk.accounts.dev",
    "https://*.clerk.com",
    "https://challenges.cloudflare.com", // Clerk bot protection
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
  ].join(" "),

  // Tailwind / component libraries inject inline styles
  "style-src 'self' 'unsafe-inline'",

  // next/font self-hosts Google Fonts — no external font CDN needed
  "font-src 'self'",

  // Images from allowed external hosts
  [
    "img-src",
    "'self'",
    "data:",
    "blob:",
    "https://avatars.githubusercontent.com",
    "https://images.unsplash.com",
    "https://*.supabase.co",
    "https://i.ytimg.com",
    "https://img.youtube.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://img.clerk.com", // Clerk user avatar images
  ].join(" "),

  // API/WebSocket connections
  [
    "connect-src",
    "'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://clerk.com",
    "https://*.clerk.accounts.dev",
    "https://*.clerk.com",
    "https://www.google-analytics.com",
    "https://www.googletagmanager.com",
    "https://api.github.com",
    "https://*.sentry.io",        // Sentry error reporting
    "https://*.ingest.sentry.io",
  ].join(" "),

  // YouTube and Clerk auth iframes
  [
    "frame-src",
    "https://www.youtube.com",
    "https://www.youtube-nocookie.com",
    "https://accounts.clerk.dev",
    "https://*.clerk.accounts.dev",
    "https://challenges.cloudflare.com",
  ].join(" "),

  // Clerk uses blob: URLs to spawn web workers (auth + CAPTCHA)
  "worker-src 'self' blob:",

  // Block Flash/plugins entirely
  "object-src 'none'",

  // Prevent clickjacking (same as X-Frame-Options: DENY but more flexible)
  "frame-ancestors 'none'",

  // Prevent base tag hijacking
  "base-uri 'self'",

  // Restrict form submissions to same origin
  "form-action 'self'",

  // Upgrade HTTP requests to HTTPS
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  poweredByHeader: false,
  compress: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: cspDirectives },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // HSTS: enforce HTTPS for 1 year, include subdomains
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },

  env: {
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
};

export default withSentryConfig(nextConfig, {
  // Sentry organisation and project (set in CI/CD env vars)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only upload source maps when SENTRY_AUTH_TOKEN is present (production builds)
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Suppress verbose Sentry CLI output
  silent: !process.env.CI,

  // Automatically tree-shake Sentry debug code in production
  disableLogger: true,

  // Upload source maps to Sentry and hide them from the browser bundle
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
