/**
 * AuthHydrator — runs once on mount to hydrate Redux auth state
 * from the access token stored in cookies (set during login).
 *
 * This bridges the gap between the cookie-based session and
 * Redux in-memory state after a hard refresh.
 */
'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@store/hooks';
import { setCredentials } from '@store/slices/authSlice';
import { tokenStore, decodeToken, isTokenExpired } from '@/lib/token';

export function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = tokenStore.getAccess();
    if (!accessToken || isTokenExpired(accessToken)) return;

    const payload = decodeToken(accessToken);
    if (!payload || payload.type !== 'access') return;

    dispatch(
      setCredentials({
        user: {
          id:       payload.sub,
          email:    payload.email,
          username: payload.email.split('@')[0],
          role:     payload.role,
        },
        tokens: {
          accessToken,
          refreshToken: tokenStore.getRefresh() ?? '',
        },
      }),
    );
  }, [dispatch]);

  return null;
}
