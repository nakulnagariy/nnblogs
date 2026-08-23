import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { GoogleAnalytics } from '@/components/analytics';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { SkipToContent } from '@/components/ui/SkipToContent';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'NNBlogs';
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Personal blog by Nakul Nagariya';
const siteTitle = `${siteName} - Personal Blog`;

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: ['blog', 'web development', 'programming', 'technology'],
  authors: [{ name: 'Nakul Nagariya' }],
  creator: 'Nakul Nagariya',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="data-nn-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <GoogleAnalytics />
            <SkipToContent />
            <SiteChrome>{children}</SiteChrome>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
