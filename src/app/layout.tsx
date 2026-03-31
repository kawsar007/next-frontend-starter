/**
 * Root Layout — the single HTML shell for the entire application.
 * Providers are lazy-loaded in a separate Client Component to keep
 * the root server component lean.
 */
import type { Metadata, Viewport } from 'next';
import { Providers } from '@/components/shared/Providers';
import '@/styles/globals.css';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Enterprise Dashboard';

export const metadata: Metadata = {
  title:       { default: APP_NAME, template: `%s | ${APP_NAME}` },
  description: 'Production-ready enterprise dashboard built with Next.js 15',
  robots:      { index: false, follow: false }, // private app
};

export const viewport: Viewport = {
  themeColor: '#0e1117',
  width:      'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
