import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceKeys } from '@/services/api/query-keys';
import { workspacesApi } from '../api/workspaces.api';
import type { UpdateWorkspaceInput } from '../types';

/**
 * Update a workspace.
 */
export function useUpdateWorkspace(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWorkspaceInput) =>
      workspacesApi.updateWorkspace(workspaceId, data),
    onSuccess: () => {
      // Invalidate both the detail and list
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.detail(workspaceId),
      });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}
