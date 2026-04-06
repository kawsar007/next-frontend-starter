/**
 * authApi — RTK Query endpoints for authentication.
 *
 * Security fix applied:
 *  logout.onQueryStarted now dispatches resetAppState() instead of
 *  clearCredentials() alone. This ensures ALL RTK Query caches
 *  are wiped when a session ends, preventing data leaks between users.
 */
import { tokenStore } from '@/lib/token';
import type {
  ApiResponse,
  AuthTokens,
  LoginCredentials,
  RegisterCredentials,
  User,
  UserWithTokens,
} from '@/types';
import { createApi } from '@reduxjs/toolkit/query/react';
import { resetAppState } from '@store/actions/resetAppState';
import { setCredentials } from '@store/slices/authSlice';
import { customBaseQuery } from './baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({

    /** POST /auth/register */
    register: builder.mutation<ApiResponse<{ user: Partial<User> }>, RegisterCredentials>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),

    /** POST /auth/login */
    login: builder.mutation<ApiResponse<UserWithTokens>, LoginCredentials>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { user, tokens } = data.data;
          tokenStore.setTokenPair(tokens.accessToken, tokens.refreshToken);
          dispatch(setCredentials({ user, tokens }));
        } catch {
          // errors handled in component
        }
      },
    }),

    /** POST /auth/refresh */
    refreshTokens: builder.mutation<ApiResponse<AuthTokens>, { refreshToken: string }>({
      query: (body) => ({ url: '/auth/refresh', method: 'POST', body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          tokenStore.setTokenPair(data.data.accessToken, data.data.refreshToken);
        } catch {
          // Refresh failed → full session teardown
          dispatch(resetAppState());
        }
      },
    }),

    /** POST /auth/logout */
    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        // ✅ FIX: dispatch resetAppState() — clears ALL caches + auth + cookies
        // This is optimistic (fires before server responds) — logout is best-effort.
        dispatch(resetAppState());
        try { await queryFulfilled; } catch { /* server error doesn't re-login user */ }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokensMutation,
  useLogoutMutation,
} = authApi;
