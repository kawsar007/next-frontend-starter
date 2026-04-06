/**
 * Redux store — combines RTK Query APIs with Redux slices.
 *
 * Thunk middleware is included by default via getDefaultMiddleware().
 * This powers the resetAppState() thunk.
 *
 * Adding a new API slice:
 *  1. Import it here
 *  2. Add its reducer to the reducer map
 *  3. Add its middleware
 *  4. Add api.util.resetApiState() to resetAppState.ts
 */
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@services/api/authApi';
import { userApi } from '@services/api/userApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
