/**
 * Root Layout — the single HTML shell for the entire application.
 * Providers are lazy-loaded in a separate Client Component to keep
 * the root server component lean.
 */
import { Providers } from '@/components/shared/Providers';
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Enterprise Dashboard';

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s | ${APP_NAME}` },
  description: 'Production-ready enterprise dashboard built with Next.js 15',
  robots: { index: false, follow: false }, // private app
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0e1117' },
    { media: '(prefers-color-scheme: light)', color: '#f7f7f7' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const FOUC_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('enterprise-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored === 'dark' || ((!stored || stored === 'system') && prefersDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch(e) {}
})();
`.trim();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          dangerouslySetInnerHTML is intentional — this MUST be a synchronous
          inline script (not async, not deferred) so it runs before the first
          paint and before React hydration, eliminating FOUC entirely.
        */}
        <script dangerouslySetInnerHTML={{ __html: FOUC_SCRIPT }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
