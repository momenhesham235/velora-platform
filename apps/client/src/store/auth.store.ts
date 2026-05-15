import { create } from 'zustand';

/**
 * Auth client state.
 *
 * Holds ONLY two things:
 *  - `accessToken`  : in-memory mirror of `tokenService` so React components
 *                     re-render when the token changes (storage events alone
 *                     don't fire in the same tab).
 *  - `bootstrapped` : becomes true after <AuthSync/> has finished its initial
 *                     storage probe. Until then, the app shouldn't decide that
 *                     a missing token means "logged out" — it just means
 *                     "we haven't checked yet".
 *
 * The User object lives in TanStack Query (`authKeys.me()`), NOT here. Storing
 * user data twice (Zustand + Query cache) would create a sync hazard.
 */

interface AuthState {
  accessToken: string | null;
  bootstrapped: boolean;
  setAccessToken: (token: string | null) => void;
  setBootstrapped: () => void;
  /** Local-only signout — clears store state. Server cookie clear happens via /auth/logout. */
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  bootstrapped: false,

  setAccessToken: (token) => set({ accessToken: token }),
  setBootstrapped: () => set({ bootstrapped: true }),
  signOut: () => set({ accessToken: null }),
}));

/**
 * Non-React access (for code outside the component tree — interceptors,
 * tests, ad-hoc utilities). Prefer `useAuthStore(selector)` inside components.
 */
export const authStore = {
  getState: useAuthStore.getState,
  setState: useAuthStore.setState,
  subscribe: useAuthStore.subscribe,
};
