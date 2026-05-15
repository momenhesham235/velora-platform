/**
 * Auth Events
 *
 * Tiny typed pub/sub that lets the networking layer signal auth state changes
 * without importing React, react-router, or Zustand.
 *
 * Producers: response refresh interceptor (after refresh succeeds or fails).
 * Consumers: Zustand auth store (mirrors state) and a thin <AuthSync/> React
 *            component that handles navigation / toast / queryClient.clear().
 *
 * Why a custom bus instead of a global EventTarget or RxJS:
 * - Strongly typed payloads per event — `session:refreshed` carries the new
 *   access token, `session:expired` carries the reason.
 * - Zero deps, ~30 LOC, easy to mock in tests.
 * - Synchronous semantics — listeners fire before the rejected promise reaches
 *   React, so the UI never renders a stale "authenticated" frame.
 */

export type AuthEventMap = {
  /** Refresh failed or no session — app should drop to logged-out state. */
  'session:expired': { reason: 'refresh-failed' | 'no-session' | 'forced-logout' };
  /** A new access token was issued (login or silent refresh). */
  'session:refreshed': { accessToken: string };
};

type EventName = keyof AuthEventMap;
type Listener<E extends EventName> = (payload: AuthEventMap[E]) => void;
// Internal-only generic-erased listener so we can stash differently-typed
// listeners in a single Map without TS complaining about variance.
type AnyListener = (payload: AuthEventMap[EventName]) => void;

const buses = new Map<EventName, Set<AnyListener>>();

export const authEvents = {
  on<E extends EventName>(event: E, listener: Listener<E>): () => void {
    let set = buses.get(event);
    if (!set) {
      set = new Set<AnyListener>();
      buses.set(event, set);
    }
    set.add(listener as AnyListener);
    return () => set!.delete(listener as AnyListener);
  },

  emit<E extends EventName>(event: E, payload: AuthEventMap[E]): void {
    const set = buses.get(event);
    if (!set) return;
    // Snapshot so a listener can unsubscribe synchronously without mutating
    // the iterating set.
    for (const listener of [...set]) {
      try {
        (listener as Listener<E>)(payload);
      } catch (err) {
        // A misbehaving subscriber must never break the auth flow.
        // eslint-disable-next-line no-console
        console.error('[authEvents]', event, 'listener threw:', err);
      }
    }
  },
};
