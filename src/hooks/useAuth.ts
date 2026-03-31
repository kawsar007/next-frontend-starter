'use client';

import { useAppSelector } from '@store/hooks';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectUserRole,
} from '@store/slices/authSlice';

export function useAuth() {
  const user            = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role            = useAppSelector(selectUserRole);

  return {
    user,
    isAuthenticated,
    role,
    isAdmin: role === 'ADMIN' || role === 'SUPER_ADMIN',
    isSuper: role === 'SUPER_ADMIN',
  };
}
