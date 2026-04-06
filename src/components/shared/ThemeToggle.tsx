
/**
 * ThemeToggle — accessible button that cycles: dark → light → system → dark.
 *
 * Design:
 *  - Animated icon swap (Sun ↔ Moon ↔ Monitor) with CSS scale+opacity
 *  - Shows current resolved theme via tooltip / aria-label
 *  - Zero layout shift — fixed width/height container
 *  - Fully keyboard-accessible (role="button", aria-label updates)
 *
 * Usage: drop anywhere — already consumes ThemeProvider context.
 */
'use client';

import { cn } from '@/lib/utils';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type ThemeValue = 'dark' | 'light' | 'system';

const CYCLE: ThemeValue[] = ['dark', 'light', 'system'];

const THEME_META: Record<ThemeValue, { icon: React.ElementType; label: string }> = {
  dark: { icon: Moon, label: 'Switch to light mode' },
  light: { icon: Sun, label: 'Switch to system mode' },
  system: { icon: Monitor, label: 'Switch to dark mode' },
};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  // Avoid hydration mismatch — render placeholder until mounted
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const current = (theme ?? 'dark') as ThemeValue;
  const { icon: Icon, label } = THEME_META[current] ?? THEME_META.dark;

  const cycle = () => {
    const idx = CYCLE.indexOf(current);
    const next = CYCLE[(idx + 1) % CYCLE.length];
    setTheme(next);
  };

  if (!mounted) {
    // Render an invisible placeholder to prevent layout shift
    return (
      <div
        className={cn(
          'h-9 w-9 rounded-md',
          className,
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      onClick={cycle}
      aria-label={label}
      title={label}
      className={cn(
        'relative h-9 w-9 rounded-md',
        'flex items-center justify-center',
        'text-muted-foreground hover:text-foreground',
        'hover:bg-muted',
        'transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background',
        className,
      )}
    >
      {/* Animated icon — scale in on mount / theme change */}
      <span
        key={current}            /* key forces remount → re-triggers animation */
        className="absolute inset-0 flex items-center justify-center animate-theme-icon"
        style={{
          animation: 'theme-icon 200ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        }}
      >
        <Icon size={16} strokeWidth={1.8} />
      </span>
    </button>
  );
}