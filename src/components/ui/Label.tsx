import { type LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Label({ className, children, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('block text-xs font-medium text-muted-foreground uppercase tracking-wide', className)}
      {...props}
    >
      {children}
    </label>
  );
}
