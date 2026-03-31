import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProfileSkeleton } from '@/components/skeletons';
import { ProfileView }     from '@/components/profile/ProfileView';

export const metadata: Metadata = { title: 'Profile' };

export default function ProfilePage() {
  return (
    <div className="max-w-2xl space-y-6 animate-fade-up">
      <div>
        <h2 className="font-display text-3xl text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your account information.</p>
      </div>
      <Suspense fallback={<div className="card p-6"><ProfileSkeleton /></div>}>
        <ProfileView />
      </Suspense>
    </div>
  );
}
