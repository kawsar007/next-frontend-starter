import { cn } from '@/lib/utils';

function SkeletonBox({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />;
}

export function UserTableSkeleton() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-border">
          <SkeletonBox className="w-9 h-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <SkeletonBox className="h-3.5 w-32" />
            <SkeletonBox className="h-3 w-44" />
          </div>
          <SkeletonBox className="h-5 w-16 rounded-full" />
          <SkeletonBox className="h-5 w-14 rounded-full" />
          <SkeletonBox className="h-3.5 w-20" />
          <SkeletonBox className="h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card p-6 space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-3.5 w-24" />
        <SkeletonBox className="h-8 w-8 rounded-lg" />
      </div>
      <SkeletonBox className="h-8 w-16" />
      <SkeletonBox className="h-3 w-28" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5">
        <SkeletonBox className="w-20 h-20 rounded-full" />
        <div className="space-y-2">
          <SkeletonBox className="h-5 w-40" />
          <SkeletonBox className="h-4 w-52" />
          <SkeletonBox className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonBox className="h-3 w-20" />
            <SkeletonBox className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
