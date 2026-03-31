import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = { title: 'Sign In' };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left — branding panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(135deg, hsl(220 16% 6%) 0%, hsl(220 14% 10%) 100%)',
        }}
      >
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(hsl(38 92% 58%) 1px, transparent 1px), linear-gradient(90deg, hsl(38 92% 58%) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glow */}
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(38 92% 58% / 0.12) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'hsl(38 92% 58%)' }}
            >
              <span className="font-display text-sm font-bold" style={{ color: 'hsl(220 16% 8%)' }}>E</span>
            </div>
            <span className="font-display text-lg text-foreground/90">Enterprise</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1
            className="font-display text-5xl leading-tight"
            style={{ color: 'hsl(40 15% 90%)' }}
          >
            Built for teams<br />
            <em className="not-italic" style={{ color: 'hsl(38 92% 58%)' }}>that ship.</em>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'hsl(220 10% 55%)' }}>
            A complete management dashboard — users, roles, and data —<br />
            all in one place.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          {[['99.9%', 'Uptime SLA'], ['< 50ms', 'API Latency'], ['SOC 2', 'Compliant']].map(
            ([val, label]) => (
              <div key={label}>
                <p className="font-mono text-xl font-medium" style={{ color: 'hsl(38 92% 58%)' }}>{val}</p>
                <p className="text-xs mt-1" style={{ color: 'hsl(220 10% 45%)' }}>{label}</p>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Right — form */}
      <div
        className="flex-1 flex items-center justify-center p-6"
        style={{ background: 'hsl(var(--background))' }}
      >
        <div className="w-full max-w-sm">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
