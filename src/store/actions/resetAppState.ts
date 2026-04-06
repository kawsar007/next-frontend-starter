/**
 * resetAppState — atomic logout / session-clear thunk.
 *
 * ROOT CAUSE OF THE DATA LEAK:
 * ─────────────────────────────
 * The previous logout only called:
 *   dispatch(clearCredentials())   ← clears authSlice
 *   tokenStore.clearAll()          ← clears cookies
 *
 * It did NOT call api.util.resetApiState().
 * RTK Query caches (userApi, authApi) are stored in Redux and
 * persist across login sessions. When User B logs in after User A,
 * the old cache is still there and components render it immediately —
 * before any role guards have a chance to evaluate.
 * A page reload fixes it only because it creates a fresh Redux store.
 *
 * THE FIX:
 * ─────────
 * One thunk that does ALL of the following atomically:
 *   1. authApi.util.resetApiState()  → clear auth API cache
 *   2. userApi.util.resetApiState()  → clear user API cache  ← THE MISSING PIECE
 *   3. clearCredentials()            → clear auth Redux slice
 *   4. tokenStore.clearAll()         → remove JWT cookies
 *   5. useUIStore.getState().reset   → close modals, reset UI
 *
 * SCALABILITY:
 * ─────────────
 * As you add more RTK Query API slices, add them here:
 *   dispatch(postApi.util.resetApiState());
 *   dispatch(analyticsApi.util.resetApiState());
 * This single file is the only place that needs updating.
 */
import { tokenStore } from '@/lib/token';
import { authApi } from '@services/api/authApi';
import { userApi } from '@services/api/userApi';
import type { AppDispatch } from '@store/index';
import { clearCredentials } from '@store/slices/authSlice';
import { useUIStore } from '@store/uiStore';

export function resetAppState() {
  return (dispatch: AppDispatch): void => {
    // ── 1 & 2: Purge ALL RTK Query caches ──────────────────────
    // This is the critical step that prevents cross-session data leaks.
    // resetApiState() removes every cached query and mutation result
    // from the Redux store — equivalent to starting with a fresh store.
    dispatch(authApi.util.resetApiState());
    dispatch(userApi.util.resetApiState());

    // ── 3: Clear auth Redux slice ───────────────────────────────
    dispatch(clearCredentials());

    // ── 4: Remove JWT cookies ───────────────────────────────────
    tokenStore.clearAll();

    // ── 5: Reset Zustand UI state ───────────────────────────────
    // Access Zustand store imperatively (no hook needed outside React)
    const { closeModal, setSidebarOpen } = useUIStore.getState();
    closeModal();
    setSidebarOpen(true);
  };
}