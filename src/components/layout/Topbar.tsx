'use client';

import { Menu, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@store/uiStore';
import { useAppSelector } from '@store/hooks';
import { selectCurrentUser } from '@store/slices/authSlice';
import { Avatar } from '@/components/ui/Avatar';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users':     'Users',
  '/profile':   'Profile',
};

export function Topbar() {
  const pathname    = usePathname();
  const user        = useAppSelector(selectCurrentUser);
  const { toggleSidebar } = useUIStore();

  const title = PAGE_TITLES[pathname] ?? PAGE_TITLES[`/${pathname.split('/')[1]}`] ?? 'Dashboard';

  return (
    <header
      className="h-16 flex items-center gap-4 px-6 border-b border-border shrink-0"
      style={{ background: 'hsl(var(--surface))' }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Menu size={18} />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="font-display text-xl text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>
        <Avatar user={user ?? undefined} size="sm" />
      </div>
    </header>
  );
}
