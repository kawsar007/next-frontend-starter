'use client';

import { Avatar } from '@/components/ui/Avatar';
import { useAppSelector } from '@store/hooks';
import { selectCurrentUser } from '@store/slices/authSlice';
import { useUIStore } from '@store/uiStore';
import { Bell, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../shared/ThemeToggle';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users',
  '/profile': 'Profile',
};

export function Topbar() {
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const { toggleSidebar } = useUIStore();

  const title = PAGE_TITLES[pathname] ?? PAGE_TITLES[`/${pathname.split('/')[1]}`] ?? 'Dashboard';

  return (
    <header
      className="h-16 flex items-center gap-4 px-6 border-b border-border shrink-0 bg-surface"
    >
      {/* Mobile hamburger */}
      <button
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
        className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground
          hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Menu size={18} />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-xl text-foreground truncate">{title}</h1>
      </div>

      {/* Right-side controls */}
      <div className="flex items-center gap-1">
        {/* Notification bell */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-md text-muted-foreground hover:text-foreground
            hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Divider */}
        <div className="h-6 w-px bg-border mx-1" />

        {/* User avatar */}
        <Avatar user={user ?? undefined} size="sm" />
      </div>
    </header>
  );
}
