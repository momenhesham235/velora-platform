import { useQuery } from '@tanstack/react-query';
import { workspacesApi } from '../api/workspaces.api';
import {
  workspaceKeys,
  type WorkspaceListFilters,
} from '@/services/api/query-keys';

/**
 * List workspaces with optional filters.
 *
 * Cache key includes the filter object so each unique filter combination has
 * its own cache entry — no cross-filter contamination, and `placeholderData`
 * trickery for paginated UX can be layered on later.
 */
export function useWorkspaces(filters: WorkspaceListFilters = {}) {
  return useQuery({
    queryKey: workspaceKeys.list(filters),
    queryFn: () => workspacesApi.list(filters),
  });
}
