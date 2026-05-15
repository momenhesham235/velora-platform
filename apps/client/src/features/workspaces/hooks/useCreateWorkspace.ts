import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceKeys } from '@/services/api/query-keys';
import { workspacesApi } from '../api/workspaces.api';
import type { CreateWorkspaceInput } from '../types';

/**
 * Create a new workspace.
 */
export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceInput) =>
      workspacesApi.createWorkspace(data),
    onSuccess: () => {
      // Invalidate workspace list to refetch
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}
