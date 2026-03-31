/**
 * Redux store — combines RTK Query APIs with Redux slices.
 * Configured with persistence middleware for auth state hydration.
 */
import { configureStore } from '@reduxjs/toolkit';
import { authApi }  from '@services/api/authApi';
import { userApi }  from '@services/api/userApi';
import authReducer  from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth:                authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
