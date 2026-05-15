/**
 * Auth query keys.
 *
 * `me()` is the canonical key for the current-user query — read by useAuth,
 * seeded by login/register, removed on logout.
 */
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};
