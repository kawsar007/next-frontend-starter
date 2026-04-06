'use client';

import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { resetAppState } from '@/store/actions/resetAppState';
import { useLogoutMutation } from '@services/api/authApi';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectCurrentUser } from '@store/slices/authSlice';
import { useUIStore } from '@store/uiStore';
import {
  ChevronLeft, ChevronRight,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const { sidebarCollapsed, toggleCollapse, sidebarOpen, setSidebarOpen } = useUIStore();

  const [logoutMutation] = useLogoutMutation();
  const [logout] = useLogoutMutation();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch { /* best-effort */
      dispatch(resetAppState());
    } finally {
      toast.success('Signed out');
      router.push('/auth/login');
      router.refresh(); // Force Next.js to re-run middleware / clear RSC cache
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed lg:relative z-30 h-full flex flex-col',
          'bg-surface border-r border-border',
          'transition-all duration-300 ease-in-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'w-16' : 'w-60',
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary"
          >
            <span className="font-display text-xs font-bold text-primary-foreground">E</span>
          </div>
          {!sidebarCollapsed && (
            <span className="font-display text-base text-foreground truncate">Enterprise</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                title={sidebarCollapsed ? label : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                  'transition-all duration-150',
                  active
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon size={18} className="shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{label}</span>}
                {active && !sidebarCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: user info + logout + collapse */}
        <div className="border-t border-border p-3 space-y-2 shrink-0">
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? 'Sign out' : undefined}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              'text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors',
            )}
          >
            <LogOut size={16} className="shrink-0" />
            {!sidebarCollapsed && 'Sign out'}
          </button>

          {!sidebarCollapsed && user && (
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <Avatar user={user} size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground truncate">{user.role}</p>
              </div>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={toggleCollapse}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex w-full items-center justify-center py-1.5 rounded-md
              text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </aside>
    </>
  );
}
