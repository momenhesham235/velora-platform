/**
 * User query keys.
 *
 * Hierarchy pattern (Linear/Notion-style) so we can invalidate at any level:
 *  - userKeys.all          → drop every user query
 *  - userKeys.lists()      → drop every list view, keep detail caches
 *  - userKeys.list(filters)→ drop just the matching filtered list
 *  - userKeys.detail(id)   → drop one user's detail page
 */

export interface UserListFilters {
  workspaceId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserListFilters = {}) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
