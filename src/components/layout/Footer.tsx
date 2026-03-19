import Link from 'next/link';
import { Github, Linkedin, Mail, Rss } from 'lucide-react';

const explore = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Videos', href: '/videos' },
  { name: 'Projects', href: '/projects' },
  { name: 'About', href: '/about' },
];

const connect = [
  { name: 'GitHub', href: 'https://github.com/nakulnagariya', icon: Github },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/nakulnagariya', icon: Linkedin },
  { name: 'RSS Feed', href: '/feed.xml', icon: Rss },
  { name: 'Email', href: 'mailto:nakul@example.com', icon: Mail },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-6 max-w-6xl py-16">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_auto] gap-12 pb-12 border-b border-border/40">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4 max-w-xs">
            {/* NN monogram */}
            <Link href="/" aria-label="Home" className="inline-flex items-center gap-0 select-none w-fit">
              <span className="text-2xl font-black tracking-tighter leading-none text-foreground">N</span>
              <span className="w-1.5 h-1.5 rounded-full bg-foreground mx-0.5 mb-2.5 shrink-0" />
              <span className="text-2xl font-black tracking-tighter leading-none text-foreground">N</span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Crafting digital experiences with precision and soul.
              Full-Stack AI Native Engineer &amp; Content Creator.
            </p>

            {/* Available badge */}
            <div className="inline-flex items-center gap-2 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
              <span className="text-xs text-muted-foreground font-mono">Available for new projects</span>
            </div>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground">Explore</p>
            <ul className="flex flex-col gap-2">
              {explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground">Connect</p>
            <ul className="flex flex-col gap-2">
              {connect.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Email copy */}
            <p className="text-xs font-mono text-muted-foreground mt-1">
              nakul@example.com
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-6 text-xs text-muted-foreground font-mono">
          <span>© {new Date().getFullYear()} Nakul Nagariya. All rights reserved.</span>
          <span>Designed &amp; Built by&nbsp;<span className="text-foreground">Nakul N.</span></span>
        </div>

      </div>
    </footer>
  );
}
