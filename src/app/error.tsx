'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'hsl(220 16% 8%)' }}>
      <div className="max-w-md w-full text-center space-y-5 p-10 rounded-2xl border"
        style={{ background: 'hsl(220 14% 11%)', borderColor: 'hsl(220 12% 20%)' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
          style={{ background: 'hsl(0 72% 58% / 0.1)' }}>
          <AlertTriangle size={24} style={{ color: 'hsl(0 72% 58%)' }} />
        </div>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display', fontSize: '1.5rem', color: 'hsl(40 15% 90%)' }}>
            Something went wrong
          </h2>
          <p className="text-sm mt-2" style={{ color: 'hsl(220 10% 55%)' }}>
            {error.message || 'An unexpected error occurred.'}
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => window.location.href = '/dashboard'}
            className="px-4 h-9 rounded-md text-sm border"
            style={{ borderColor: 'hsl(220 12% 20%)', color: 'hsl(40 15% 90%)' }}>
            Go home
          </button>
          <button onClick={reset}
            className="px-4 h-9 rounded-md text-sm font-medium"
            style={{ background: 'hsl(38 92% 58%)', color: 'hsl(220 16% 8%)' }}>
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
