'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render theme-aware UI after hydration to avoid server/client mismatch.
  // next-themes populates `theme` synchronously on the client, so checking
  // `resolvedTheme` alone is not a reliable mount guard.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration-mismatch guard, see comment above
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  // Render a static placeholder that matches the server output exactly
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-9 h-9 hover:bg-muted/60"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-5 w-5 text-foreground" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="w-9 h-9 relative hover:bg-muted/60"
      aria-label={`Current theme: ${theme}. Click to cycle through themes.`}
      title={`Theme: ${theme} (click to cycle)`}
    >
      {theme === 'light' && <Sun className="h-5 w-5 transition-all text-foreground" />}
      {theme === 'dark' && <Moon className="h-5 w-5 transition-all text-foreground" />}
      {theme === 'system' && <Monitor className="h-5 w-5 transition-all text-foreground" />}
    </Button>
  );
}
