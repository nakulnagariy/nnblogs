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

export const metadata: Metadata = {
  title: {
    default: 'NNBlogs - Personal Blog & Portfolio',
    template: '%s | NNBlogs',
  },
  description: 'A personal blog showcasing articles, videos, and projects. Built with Next.js, TypeScript, and modern web technologies.',
  keywords: ['blog', 'portfolio', 'web development', 'programming', 'technology'],
  authors: [{ name: 'Nakul Nagariya' }],
  creator: 'Nakul Nagariya',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'NNBlogs',
    title: 'NNBlogs - Personal Blog & Portfolio',
    description: 'A personal blog showcasing articles, videos, and projects.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NNBlogs - Personal Blog & Portfolio',
    description: 'A personal blog showcasing articles, videos, and projects.',
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
