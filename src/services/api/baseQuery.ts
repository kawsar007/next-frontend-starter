/**
 * customBaseQuery — RTK Query base query with JWT refresh + full session teardown.
 *
 * Security improvement: when token refresh fails, we now call resetAppState()
 * instead of just clearCredentials(), ensuring ALL RTK Query caches are wiped.
 */
import { isTokenExpired, tokenStore } from '@/lib/token';
import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { resetAppState } from '@store/actions/resetAppState';
import type { AppDispatch } from '@store/index';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const token = tokenStore.getAccess();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

/** Mutex — prevents concurrent refresh storms */
let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshTokens(): Promise<boolean> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const json = await res.json();
    const tokens = json?.data;
    if (!tokens?.accessToken || !tokens?.refreshToken) return false;

    tokenStore.setTokenPair(tokens.accessToken, tokens.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Pre-emptive refresh if access token expires within 30s
  const accessToken = tokenStore.getAccess();
  if (accessToken && isTokenExpired(accessToken)) {
    if (!refreshPromise) {
      refreshPromise = tryRefreshTokens().finally(() => { refreshPromise = null; });
    }
    await refreshPromise;
  }

  let result = await rawBaseQuery(args, api, extraOptions);

  // On 401 → attempt refresh once, then retry
  if (result.error?.status === 401) {
    if (!refreshPromise) {
      refreshPromise = tryRefreshTokens().finally(() => { refreshPromise = null; });
    }
    const refreshed = await refreshPromise;

    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // ✅ FIX: resetAppState wipes all caches, not just clearCredentials
      (api.dispatch as AppDispatch)(resetAppState());
    }
  }

  return result;
};