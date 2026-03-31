import type { Metadata } from 'next';
import { Suspense } from 'react';
import { UserTableSkeleton } from '@/components/skeletons';
import { UsersView }         from '@/components/users/UsersView';

export const metadata: Metadata = { title: 'Users' };

export default function UsersPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="font-display text-3xl text-foreground">Users</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage user accounts, roles, and permissions.
        </p>
      </div>
      <Suspense fallback={
        <div className="card overflow-hidden"><UserTableSkeleton /></div>
      }>
        <UsersView />
      </Suspense>
    </div>
  );
}
