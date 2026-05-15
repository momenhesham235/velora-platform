import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceKeys } from '@/services/api/query-keys';
import { workspacesApi } from '../api/workspaces.api';

/**
 * Delete a workspace.
 */
export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) =>
      workspacesApi.deleteWorkspace(workspaceId),
    onSuccess: () => {
      // Invalidate workspace list
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}
