'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Add .theme-ready after mount so CSS transitions only fire on
  // user-initiated toggles, never on the initial page load paint.
  useEffect(() => {
    const t = requestAnimationFrame(() => {
      document.documentElement.classList.add('theme-ready');
    });
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={true}
      disableTransitionOnChange={false}
      storageKey="enterprise-theme"
    >
      {children}
    </NextThemesProvider>
  );
}