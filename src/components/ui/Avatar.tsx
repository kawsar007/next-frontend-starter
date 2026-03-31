import { cn, getInitials } from '@/lib/utils';
import type { User } from '@/types';

interface AvatarProps {
  user?: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'username'>>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };

export function Avatar({ user, size = 'md', className }: AvatarProps) {
  const initials = getInitials(user?.firstName, user?.lastName, user?.email ?? user?.username);
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-mono font-semibold shrink-0 select-none',
        sizes[size],
        className,
      )}
      style={{ background: 'hsl(38 92% 58% / 0.15)', color: 'hsl(38 92% 58%)' }}
    >
      {initials}
    </div>
  );
}
