import { useQuery } from '@tanstack/react-query';
import { workspacesApi } from '../api/workspaces.api';
import { workspaceKeys } from '@/services/api/query-keys';

/**
 * Fetch a single workspace by id.
 *
 * Disabled when `id` is falsy so the hook is safe to call before a route
 * param has resolved (e.g. during route transitions).
 */
export function useWorkspace(id: string | undefined) {
  return useQuery({
    queryKey: id ? workspaceKeys.detail(id) : workspaceKeys.detail('__none__'),
    queryFn: () => workspacesApi.get(id as string),
    enabled: !!id,
  });
}
