/**
 * Dashboard Page — Server Component with streaming.
 * Stats cards stream in independently so the page is never blocked.
 */
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { StatCardSkeleton } from '@/components/skeletons';
import { DashboardStats }   from '@/components/dashboard/DashboardStats';
import { RecentUsers }      from '@/components/dashboard/RecentUsers';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Hero greeting */}
      <div>
        <h2 className="font-display text-3xl text-foreground">Good morning.</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening in your workspace today.
        </p>
      </div>

      {/* Stats — each card streams independently */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
        }
      >
        <DashboardStats />
      </Suspense>

      {/* Recent users table */}
      <Suspense fallback={
        <div className="card p-6">
          <div className="skeleton h-4 w-32 mb-4 rounded" />
          <div className="skeleton h-48 w-full rounded" />
        </div>
      }>
        <RecentUsers />
      </Suspense>
    </div>
  );
}
