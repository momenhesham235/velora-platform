import { useQuery } from '@tanstack/react-query';
import { workspaceKeys } from '@/services/api/query-keys';
import { workspacesApi } from '../api/workspaces.api';

/**
 * Get all workspaces for the current user.
 */
export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: () => workspacesApi.getUserWorkspaces(),
  });
}
