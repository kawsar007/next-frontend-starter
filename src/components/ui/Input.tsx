import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?:  string;
  suffix?: ReactNode;
  prefix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, suffix, prefix, type = 'text', ...props }, ref) => (
    <div className="mt-1.5">
      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3 flex items-center text-muted-foreground pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full h-10 rounded-md border bg-input px-3 py-2 text-sm text-foreground',
            'placeholder:text-muted-foreground',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus:ring-destructive',
            !error && 'border-border hover:border-muted-foreground',
            prefix && 'pl-9',
            suffix && 'pr-10',
            className,
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-2 flex items-center text-muted-foreground">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  ),
);
Input.displayName = 'Input';
