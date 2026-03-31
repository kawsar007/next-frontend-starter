/**
 * authSlice — Redux slice for authentication state.
 * Stores the current user profile and token references.
 * Source of truth is cookies (tokens) + this slice (user metadata).
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthTokens, Role, User } from '@/types';

interface AuthState {
  user: Pick<User, 'id' | 'email' | 'username' | 'role'> | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user:            null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        user: Pick<User, 'id' | 'email' | 'username' | 'role'>;
        tokens: AuthTokens;
      }>,
    ) {
      state.user            = action.payload.user;
      state.isAuthenticated = true;
    },
    clearCredentials(state) {
      state.user            = null;
      state.isAuthenticated = false;
    },
    updateUser(state, action: PayloadAction<Partial<Pick<User, 'email' | 'username' | 'role'>>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setCredentials, clearCredentials, updateUser } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser   = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUserRole      = (state: { auth: AuthState }): Role | null =>
  state.auth.user?.role ?? null;
