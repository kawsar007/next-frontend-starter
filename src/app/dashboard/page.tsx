/**
 * Dashboard Page — Server Component with streaming.
 * Stats cards stream in independently so the page is never blocked.
 */
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentUsers } from '@/components/dashboard/RecentUsers';
import { StatCardSkeleton } from '@/components/skeletons';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Dashboard' };

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export default function DashboardPage() {
  const greeting = getGreeting();
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Hero greeting */}
      <div>
        <h2 className="font-display text-3xl text-foreground">{greeting}.</h2>
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
