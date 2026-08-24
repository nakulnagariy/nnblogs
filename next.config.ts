import type { NextConfig } from "next";

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
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
  ].join(" "),

  // Tailwind / component libraries inject inline styles.
  // Keystatic's admin UI (/keystatic) loads Inter directly from Google
  // Fonts rather than using next/font like the rest of the app does.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

  // next/font self-hosts Google Fonts for the main site; fonts.gstatic.com
  // is where the stylesheet above actually points for the font files.
  "font-src 'self' https://fonts.gstatic.com",

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
  ].join(" "),

  // API/WebSocket connections
  [
    "connect-src",
    "'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://www.google-analytics.com",
    "https://www.googletagmanager.com",
    "https://api.github.com",
  ].join(" "),

  // YouTube iframes
  [
    "frame-src",
    "https://www.youtube.com",
    "https://www.youtube-nocookie.com",
  ].join(" "),

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

export default nextConfig;
