'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 dark:bg-black/90 backdrop-blur-sm z-[55] md:hidden animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        id="mobile-menu"
        className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-background border-l border-gray-200 dark:border-gray-700 shadow-2xl z-[60] md:hidden animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/40 bg-background">
          <span id="mobile-menu-title" className="text-lg font-bold text-foreground">
            Menu
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-11 w-11 hover:bg-muted/60 border border-border/60 rounded-lg"
            aria-label="Close menu"
          >
            <X className="h-7 w-7 text-foreground stroke-[2.5]" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-4.5rem)] bg-background" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center px-4 py-3.5 text-base font-medium rounded-lg transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-ring',
                pathname === item.href
                  ? 'bg-foreground text-background'
                  : 'text-foreground hover:bg-muted/60'
              )}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
