import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'hsl(220 16% 8%)' }}>
      <div className="text-center space-y-6 max-w-sm">
        <p className="font-mono text-8xl font-bold" style={{ color: 'hsl(38 92% 58% / 0.25)' }}>404</p>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display', fontSize: '1.75rem', color: 'hsl(40 15% 90%)' }}>
            Page not found
          </h2>
          <p className="text-sm mt-2" style={{ color: 'hsl(220 10% 55%)' }}>
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
        <Link href="/dashboard"
          className="inline-flex items-center px-5 h-10 rounded-md text-sm font-medium"
          style={{ background: 'hsl(38 92% 58%)', color: 'hsl(220 16% 8%)' }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
