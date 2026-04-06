/**
 * Providers — client-side provider tree.
 * Intentionally split from RootLayout (Server Component) so providers
 * don't force the entire tree into a client bundle.
 */
'use client';

import { AuthHydrator } from '@/components/auth/AuthHydrator';
import { store } from '@store/index';
import { Toaster } from 'react-hot-toast';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from './ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ReduxProvider store={store}>
        {/* Hydrate auth state from cookies on first render */}
        <AuthHydrator />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              // CSS variables resolve correctly in both themes
              background: 'hsl(var(--surface))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'calc(var(--radius) + 2px)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
              boxShadow: '0 8px 32px hsl(0 0% 0% / 0.12)',
            },
            success: {
              iconTheme: {
                primary: 'hsl(var(--success))',
                secondary: 'hsl(var(--surface))',
              },
            },
            error: {
              iconTheme: {
                primary: 'hsl(var(--destructive))',
                secondary: 'hsl(var(--surface))',
              },
            },
          }}
        />
      </ReduxProvider>
    </ThemeProvider>
  );
}
