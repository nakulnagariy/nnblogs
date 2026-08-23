import { Github, Linkedin, Mail } from 'lucide-react';

const socials = [
  { icon: Github, href: 'https://github.com/nakulnagariya', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/nakulnagariya', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:nakul@example.com', label: 'Email' },
];

export function HeroSection() {
  return (
    <section className="border-b border-border/40">
      <div className="container mx-auto px-6 py-16 md:py-20 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Nakul Nagariya</h1>
        <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
          Full-stack engineer. I write about the things I build.
        </p>
        <div className="mt-6 flex items-center gap-4">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={label}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon className="w-4.5 h-4.5" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
