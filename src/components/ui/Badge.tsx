import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
        {
          'bg-foreground text-background': variant === 'default',
          'bg-muted text-muted-foreground': variant === 'secondary',
          'border border-border/60 bg-background text-foreground': variant === 'outline',
          'bg-destructive/10 text-destructive border border-destructive/30': variant === 'destructive',
        },
        className
      )}
      {...props}
    />
  );
}
