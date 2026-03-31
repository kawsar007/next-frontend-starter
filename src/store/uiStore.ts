/**
 * uiStore — Zustand store for client-side UI state.
 *
 * Responsibilities:
 *  - Sidebar open/collapsed
 *  - Active modal (type + payload)
 *  - Global loading overlay
 *
 * Kept deliberately small; server state lives in RTK Query.
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// ── Modal ─────────────────────────────────────────────────────
export type ModalType = 'create-user' | 'edit-user' | 'delete-user' | 'view-user' | null;

interface ModalState {
  type:    ModalType;
  payload: unknown;
}

// ── Full UI State ─────────────────────────────────────────────
interface UIState {
  // Sidebar
  sidebarOpen:     boolean;
  sidebarCollapsed: boolean;
  toggleSidebar:   () => void;
  setSidebarOpen:  (open: boolean) => void;
  toggleCollapse:  () => void;

  // Modal
  modal:      ModalState;
  openModal:  (type: ModalType, payload?: unknown) => void;
  closeModal: () => void;

  // Global loading
  isLoading:  boolean;
  setLoading: (v: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // ── Sidebar ─────────────────────────────────────────────
      sidebarOpen:     true,
      sidebarCollapsed: false,
      toggleSidebar:   () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen:  (open) => set({ sidebarOpen: open }),
      toggleCollapse:  () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // ── Modal ────────────────────────────────────────────────
      modal:      { type: null, payload: null },
      openModal:  (type, payload = null) => set({ modal: { type, payload } }),
      closeModal: () => set({ modal: { type: null, payload: null } }),

      // ── Loading ──────────────────────────────────────────────
      isLoading:  false,
      setLoading: (v) => set({ isLoading: v }),
    }),
    { name: 'ui-store' },
  ),
);
