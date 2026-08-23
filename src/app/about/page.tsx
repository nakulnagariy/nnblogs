import Link from 'next/link';
import { Github, Linkedin, Mail, Rss, ArrowUpRight } from 'lucide-react';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { JourneyTimeline } from '@/components/about/JourneyTimeline';
import { GitHubReposList } from '@/components/github';
import { getPinnedRepos } from '@/lib/github';

const stack = [
  'TypeScript', 'React', 'Next.js', 'Node.js',
  'Tailwind CSS', 'PostgreSQL', 'Supabase', 'Vercel',
  'Python', 'Docker', 'AWS', 'Redis',
];

const socials = [
  { label: 'GitHub', href: 'https://github.com/nakulnagariya', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/nakulnagariya', icon: Linkedin },
  { label: 'RSS Feed', href: '/feed.xml', icon: Rss },
  { label: 'Email', href: 'mailto:nakul@example.com', icon: Mail },
];

export default async function AboutPage() {
  const repos = await getPinnedRepos();

  return (
    <>
      <ScrollProgress position="top" />

      <div className="container mx-auto px-6 max-w-6xl">

        {/* Page header */}
        <header className="pt-24 pb-12 border-b border-border/40">
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">
            About
          </p>

          <div className="flex flex-col sm:flex-row sm:items-start gap-8">
            {/* Monogram avatar */}
            <div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-border/60 flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <span className="inline-flex items-center gap-0 select-none">
                <span className="text-xl font-black tracking-tighter text-foreground">N</span>
                <span className="w-1.5 h-1.5 rounded-full bg-foreground mx-0.5 mb-2 shrink-0" />
                <span className="text-xl font-black tracking-tighter text-foreground">N</span>
              </span>
            </div>

            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
                Nakul Nagariya
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Full-Stack AI Native Engineer &amp; Content Creator. I build digital products
                with precision and craft — and write about what I learn along the way.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-5">
                <div className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground font-mono">Available for work</span>
                </div>
                <div className="flex items-center gap-1">
                  {socials.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Story */}
        <section className="py-12 border-b border-border/40">
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-8">
            Story
          </p>
          <div className="space-y-5 text-[1.05rem] leading-relaxed text-foreground/90 max-w-3xl">
            <p>
              Welcome to my corner of the internet. I started this blog to share my journey as
              a developer and document the things I learn. Whether it&apos;s a new framework, a
              system design pattern, or a random AI discovery — you&apos;ll find it here.
            </p>
            <p>
              I believe in learning in public and sharing knowledge with the community. Every
              post is written with the hope that it might help someone else facing the same
              challenge.
            </p>
            <p>
              I specialise in full-stack web development, with a focus on React, Next.js, and
              AI-native applications. I&apos;m also passionate about developer experience, open
              source, and building tools that make developers&apos; lives easier.
            </p>
          </div>
        </section>

        {/* Stack */}
        <section className="py-12 border-b border-border/40">
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-8">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full text-sm border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Projects (GitHub) */}
        {repos.length > 0 && (
          <section className="py-12 border-b border-border/40">
            <div className="flex items-end justify-between mb-8">
              <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                Projects
              </p>
              <a
                href="https://github.com/nakulnagariya?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                All Repos
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            <GitHubReposList repos={repos} />
          </section>
        )}

        {/* CTA */}
        <section className="py-12 border-b border-border/40">
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-8">
            Working Together
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
            <Link
              href="/blog"
              className="group flex items-center justify-between p-5 rounded-xl border border-border/60 hover:border-foreground/30 transition-colors"
            >
              <div>
                <p className="font-semibold text-sm mb-1">Read the Blog</p>
                <p className="text-xs text-muted-foreground">Tutorials &amp; insights</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
            <a
              href="mailto:nakul@example.com"
              className="group flex items-center justify-between p-5 rounded-xl border border-border/60 hover:border-foreground/30 transition-colors"
            >
              <div>
                <p className="font-semibold text-sm mb-1">Say Hello</p>
                <p className="text-xs text-muted-foreground">nakul@example.com</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          </div>
        </section>
      </div>

      {/* Journey timeline */}
      <div className="pb-16">
        <div className="container mx-auto px-6 max-w-6xl pt-12">
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-12">
            Journey
          </p>
        </div>
        <JourneyTimeline />
      </div>
    </>
  );
}
