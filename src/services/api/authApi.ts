/**
 * authApi — RTK Query endpoints for authentication.
 * Covers: register, login, refresh, logout.
 */
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './baseQuery';
import { tokenStore } from '@/lib/token';
import { setCredentials, clearCredentials } from '@store/slices/authSlice';
import type {
  ApiResponse,
  LoginCredentials,
  RegisterCredentials,
  UserWithTokens,
  AuthTokens,
  User,
} from '@/types';

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
          // error handled by component
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
          dispatch(clearCredentials());
          tokenStore.clearAll();
        }
      },
    }),

    /** POST /auth/logout */
    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        // Optimistic: clear immediately, revert only if network error but logout is best-effort
        dispatch(clearCredentials());
        tokenStore.clearAll();
        try { await queryFulfilled; } catch { /* best effort */ }
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
