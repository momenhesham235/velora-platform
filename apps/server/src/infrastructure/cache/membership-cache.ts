import { WorkspaceRole } from '@velora/types';

interface CacheEntry {
  role: WorkspaceRole;
  expiresAt: number;
}

const TTL_MS = 60_000;
const cache = new Map<string, CacheEntry>();

function cacheKey(workspaceId: string, userId: string): string {
  return `${workspaceId}:${userId}`;
}

export function getCachedRole(
  workspaceId: string,
  userId: string
): WorkspaceRole | null | undefined {
  const entry = cache.get(cacheKey(workspaceId, userId));
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(cacheKey(workspaceId, userId));
    return undefined;
  }
  return entry.role;
}

export function setCachedRole(
  workspaceId: string,
  userId: string,
  role: WorkspaceRole | null
): void {
  if (role === null) {
    cache.delete(cacheKey(workspaceId, userId));
    return;
  }
  cache.set(cacheKey(workspaceId, userId), {
    role,
    expiresAt: Date.now() + TTL_MS,
  });
}

export function invalidateWorkspaceMembership(workspaceId: string): void {
  const prefix = `${workspaceId}:`;
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

export function clearMembershipCache(): void {
  cache.clear();
}
