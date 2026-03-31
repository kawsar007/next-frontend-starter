/**
 * customBaseQuery — RTK Query base query with automatic JWT refresh.
 *
 * Flow:
 *  1. Attach access token from cookie to every request.
 *  2. On 401 → try to refresh using the refresh token.
 *  3. On refresh success → retry the original request with the new token.
 *  4. On refresh failure → clear tokens and dispatch logout.
 */
import { isTokenExpired, tokenStore } from '@/lib/token';
import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { clearCredentials } from '@store/slices/authSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

/** Raw base query — no retry logic. */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const token = tokenStore.getAccess();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

/** Mutex to serialise concurrent refresh attempts. */
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
  // Pre-emptively refresh if access token is about to expire
  const accessToken = tokenStore.getAccess();
  if (accessToken && isTokenExpired(accessToken)) {
    if (!refreshPromise) {
      refreshPromise = tryRefreshTokens().finally(() => {
        refreshPromise = null;
      });
    }
    await refreshPromise;
  }

  let result = await rawBaseQuery(args, api, extraOptions);

  // On 401 → attempt refresh once then retry
  if (result.error?.status === 401) {
    if (!refreshPromise) {
      refreshPromise = tryRefreshTokens().finally(() => {
        refreshPromise = null;
      });
    }
    const refreshed = await refreshPromise;

    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      tokenStore.clearAll();
      api.dispatch(clearCredentials());
    }
  }

  return result;
};
