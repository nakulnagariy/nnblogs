import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { SupabaseProvider } from '@/components/providers/SupabaseProvider';
import { createSessionClient } from '@/lib/supabase/server';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { GoogleAnalytics } from '@/components/analytics';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SkipToContent } from '@/components/ui/SkipToContent';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'NNBlogs';
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  'Personal blog, projects, and interview-prep notes by Nakul Nagariya';
const siteTitle = `${siteName} - Personal Blog & Portfolio`;

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: ['blog', 'portfolio', 'web development', 'programming', 'technology'],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <SupabaseProvider initialUser={user}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <GoogleAnalytics />
              <SkipToContent />
              <div className="flex min-h-screen flex-col">
                <Header />
                <main id="main-content" className="flex-1" tabIndex={-1}>
                  {children}
                </main>
                <Footer />
              </div>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </SupabaseProvider>
  );
}
