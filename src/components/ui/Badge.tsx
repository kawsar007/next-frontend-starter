import { cn } from '@/lib/utils';
import type { Role, UserStatus } from '@/types';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'admin' | 'super';

const variants: Record<BadgeVariant, string> = {
  default:     'bg-muted text-muted-foreground',
  success:     'bg-success/15 text-success border border-success/30',
  warning:     'bg-warning/15 text-warning border border-warning/30',
  destructive: 'bg-destructive/15 text-destructive border border-destructive/30',
  info:        'bg-info/15 text-info border border-info/30',
  admin:       'bg-primary/15 text-primary border border-primary/30',
  super:       'bg-purple-500/15 text-purple-400 border border-purple-500/30',
};

interface BadgeProps { variant?: BadgeVariant; className?: string; children: React.ReactNode; }

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}

export function RoleBadge({ role }: { role: Role }) {
  const map: Record<Role, { label: string; variant: BadgeVariant }> = {
    USER:        { label: 'User',        variant: 'default' },
    ADMIN:       { label: 'Admin',       variant: 'admin' },
    SUPER_ADMIN: { label: 'Super Admin', variant: 'super' },
  };
  const { label, variant } = map[role] ?? { label: role, variant: 'default' };
  return <Badge variant={variant}>{label}</Badge>;
}

export function StatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, { label: string; variant: BadgeVariant }> = {
    ACTIVE:   { label: 'Active',   variant: 'success' },
    INACTIVE: { label: 'Inactive', variant: 'warning' },
    BANNED:   { label: 'Banned',   variant: 'destructive' },
  };
  const { label, variant } = map[status] ?? { label: status, variant: 'default' };
  return <Badge variant={variant}>{label}</Badge>;
}
