/**
 * Access-token storage.
 *
 * The REFRESH token is intentionally NOT handled here — it lives in an
 * httpOnly cookie set by the server (see auth.controller.ts on the backend).
 * That keeps it out of JS reach and out of XSS scope. The client only ever
 * holds the short-lived access token in memory + localStorage so the user
 * survives a tab reload without paying a refresh round-trip.
 *
 * This module is a thin, framework-free abstraction so the axios layer can
 * read/write tokens without coupling to Zustand, React, or anything UI.
 */

const ACCESS_TOKEN_KEY = 'velora.access_token';

/** In-memory cache avoids a localStorage read on every request. */
let cachedAccessToken: string | null = null;

function readFromStorage(): string | null {
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    // SSR / privacy mode / storage disabled
    return null;
  }
}

export const tokenService = {
  getAccessToken(): string | null {
    if (cachedAccessToken !== null) return cachedAccessToken;
    cachedAccessToken = readFromStorage();
    return cachedAccessToken;
  },

  setAccessToken(token: string): void {
    cachedAccessToken = token;
    try {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch {
      // ignore — in-memory copy still works for the session
    }
  },

  clearAccessToken(): void {
    cachedAccessToken = null;
    try {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    } catch {
      // ignore
    }
  },

  /**
   * Best-effort JWT expiry check. Returns false if the token is missing,
   * unparseable, or expired. Useful for skipping requests we already know
   * will 401 — NOT a security boundary (the server is).
   */
  isAccessTokenValid(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    try {
      const [, payload] = token.split('.');
      const decoded = JSON.parse(atob(payload)) as { exp?: number };
      if (!decoded.exp) return false;
      return Date.now() < decoded.exp * 1000;
    } catch {
      return false;
    }
  },
};

export type TokenService = typeof tokenService;
