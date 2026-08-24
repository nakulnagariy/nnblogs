import Link from 'next/link';
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { GitHubReposList } from '@/components/github';
import { getPinnedRepos } from '@/lib/github';

const stack = [
  'TypeScript', 'React', 'Next.js', 'Node.js',
  'Tailwind CSS', 'PostgreSQL', 'Python', 'Docker', 'AWS', 'Redis',
];

const socials = [
  { label: 'GitHub', href: 'https://github.com/nakulnagariya', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/nakulnagariya', icon: Linkedin },
  { label: 'Email', href: 'mailto:nakul@example.com', icon: Mail },
];

export default async function AboutPage() {
  const repos = await getPinnedRepos();

  return (
    <div className="container mx-auto px-6 max-w-3xl">

      {/* Page header */}
      <header className="pt-24 pb-10 border-b border-border/40">
        <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">
          About
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Nakul Nagariya</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
          Full-stack engineer. I build things and write about what I learn along the way.
        </p>
        <div className="flex items-center gap-1 mt-5 -ml-2">
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
      </header>

      {/* Story */}
      <section className="py-12 border-b border-border/40">
        <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-8">
          Story
        </p>
        <div className="space-y-5 text-[1.05rem] leading-relaxed text-foreground/90">
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

      {/* Contact */}
      <section className="py-12">
        <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-8">
          Get in Touch
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
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
  );
}
