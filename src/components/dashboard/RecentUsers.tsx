'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGetUsersQuery } from '@services/api/userApi';
import { Avatar }       from '@/components/ui/Avatar';
import { RoleBadge, StatusBadge } from '@/components/ui/Badge';
import { timeAgo }      from '@/lib/utils';
import { UserTableSkeleton } from '@/components/skeletons';

export function RecentUsers() {
  const { data, isLoading } = useGetUsersQuery({ page: 1, limit: 5 });
  const users = data?.data?.data ?? [];

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h3 className="font-display text-lg text-foreground">Recent Users</h3>
        <Link href="/users"
          className="text-xs text-primary hover:underline underline-offset-4 flex items-center gap-1">
          View all <ArrowRight size={12} />
        </Link>
      </div>

      {isLoading ? (
        <UserTableSkeleton />
      ) : users.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">No users found</div>
      ) : (
        <div>
          {users.map((user) => (
            <div key={user.id}
              className="flex items-center gap-4 px-6 py-3.5 border-b border-border last:border-0
                hover:bg-surface-2/50 transition-colors">
              <Avatar user={user} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <RoleBadge role={user.role} />
              <StatusBadge status={user.status} />
              <p className="text-xs text-muted-foreground hidden sm:block shrink-0">
                {timeAgo(user.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
