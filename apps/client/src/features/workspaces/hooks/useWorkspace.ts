import { useQuery } from '@tanstack/react-query';
import { workspaceKeys } from '@/services/api/query-keys';
import { workspacesApi } from '../api/workspaces.api';

/**
 * Get a single workspace by ID.
 */
export function useWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceId),
    queryFn: () => workspacesApi.getWorkspaceById(workspaceId),
    enabled: !!workspaceId,
  });
}
