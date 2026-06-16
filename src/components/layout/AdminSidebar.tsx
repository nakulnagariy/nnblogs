'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Video, FolderGit2, BarChart3, ArrowUpRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const nav = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Posts', href: '/admin/posts', icon: FileText },
  { name: 'Videos', href: '/admin/videos', icon: Video },
  { name: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

function NNMark() {
  return (
    <span className="inline-flex items-center gap-0 select-none" aria-hidden="true">
      <span className="text-base font-black tracking-tighter leading-none">N</span>
      <span className="w-1 h-1 rounded-full bg-foreground mx-0.5 mb-1.5 shrink-0" />
      <span className="text-base font-black tracking-tighter leading-none">N</span>
    </span>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <aside className="hidden md:flex flex-col w-52 shrink-0 min-h-screen border-r border-border/40 bg-background">
      {/* Top: logo */}
      <div className="flex items-center gap-3 px-5 h-14 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2 group" aria-label="Back to site">
          <NNMark />
          <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
            Admin
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 p-3 pt-4" aria-label="Admin navigation">
        {nav.map(({ name, href, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={name}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-foreground text-background font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: view site + user */}
      <div className="p-3 pt-0 flex flex-col gap-2 border-t border-border/40">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          View site
        </a>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors w-full"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
