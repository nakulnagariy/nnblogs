'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, Github, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/providers/SupabaseProvider';
import { createClient } from '@/lib/supabase/client';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Blog', href: '/blog' },
  { name: 'Videos', href: '/videos' },
  { name: 'Projects', href: '/projects' },
  { name: 'About', href: '/about' },
];

/** Stylised NN monogram — two interlocked letterforms with a primary accent dot */
function NNLogo() {
  return (
    <span className="inline-flex items-center gap-0 select-none" aria-hidden="true">
      {/* First N */}
      <span className="text-xl font-black tracking-tighter leading-none text-foreground">
        N
      </span>
      {/* Accent separator dot */}
      <span className="w-1.5 h-1.5 rounded-full bg-foreground mx-0.5 mb-2 shrink-0" />
      {/* Second N */}
      <span className="text-xl font-black tracking-tighter leading-none text-foreground">
        N
      </span>
    </span>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-3 z-40 w-full">
      <div className="container mx-auto px-6 max-w-6xl">
        <nav
          className="flex h-12 items-center justify-between px-5 rounded-full border border-border/50 bg-background/80 backdrop-blur-md shadow-sm"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
            aria-label="Nakul Nagariya — home"
          >
            <NNLogo />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm px-3 py-1.5 rounded-full transition-colors',
                    pathname === item.href
                      ? 'text-foreground font-medium bg-muted'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/search"
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </Link>

            <a
              href="https://github.com/nakulnagariya"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="GitHub profile"
            >
              <Github className="w-4 h-4" />
            </a>

            <div className="pl-1">
              <ThemeToggle />
            </div>

            {user ? (
              <button
                onClick={handleSignOut}
                className="ml-1 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="ml-1 text-xs font-medium px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </nav>

        <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      </div>
    </header>
  );
}
