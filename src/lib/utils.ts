import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import type { ApiError } from '@/types';

/** Merge Tailwind class names safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format date string to readable form. */
export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '—';
  try {
    return format(new Date(dateStr), 'MMM d, yyyy');
  } catch {
    return '—';
  }
}

/** Relative time, e.g. "3 hours ago". */
export function timeAgo(dateStr: string | undefined | null): string {
  if (!dateStr) return '—';
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return '—';
  }
}

/** Extract a human-readable message from an RTK Query / Axios error. */
export function extractErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred';
  if (typeof error === 'string') return error;

  // RTK Query FetchBaseQueryError
  const e = error as { data?: ApiError; status?: number; message?: string; error?: string };

  if (e?.data?.message) {
    return Array.isArray(e.data.message)
      ? e.data.message[0]
      : e.data.message;
  }
  if (e?.message) return e.message;
  if (e?.error)   return e.error;
  return 'An unexpected error occurred';
}

/** Generate initials from a name. */
export function getInitials(first?: string, last?: string, email?: string): string {
  if (first && last)  return `${first[0]}${last[0]}`.toUpperCase();
  if (first)          return first.slice(0, 2).toUpperCase();
  if (email)          return email.slice(0, 2).toUpperCase();
  return '??';
}

/** Capitalise the first letter. */
export function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Role display badge variant. */
export function roleVariant(role: string): 'default' | 'admin' | 'super' {
  if (role === 'SUPER_ADMIN') return 'super';
  if (role === 'ADMIN')       return 'admin';
  return 'default';
}
