/**
 * Providers — client-side provider tree.
 * Intentionally split from RootLayout (Server Component) so providers
 * don't force the entire tree into a client bundle.
 */
'use client';

import { useRef } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from '@store/index';
import { AuthHydrator } from '@/components/auth/AuthHydrator';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      {/* Hydrate auth state from cookies on first render */}
      <AuthHydrator />
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background:  'hsl(220 14% 11%)',
            color:       'hsl(40 15% 90%)',
            border:      '1px solid hsl(220 12% 20%)',
            borderRadius: '0.5rem',
            fontFamily:  'var(--font-sans)',
            fontSize:    '0.875rem',
          },
          success: { iconTheme: { primary: 'hsl(145 60% 48%)', secondary: 'hsl(220 16% 8%)' } },
          error:   { iconTheme: { primary: 'hsl(0 72% 58%)',   secondary: 'hsl(220 16% 8%)' } },
        }}
      />
    </ReduxProvider>
  );
}
