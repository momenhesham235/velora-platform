import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workspacesApi } from '../api/workspaces.api';
import { workspaceKeys } from '@/services/api/query-keys';
import type { CreateWorkspaceInput } from '../schemas/workspace.schema';
import type { Workspace } from '../types';

/**
 * Create a workspace.
 *
 * Invalidation surface: ONLY `workspaceKeys.lists()` — every cached list view
 * refetches, but any open detail pages (`workspaceKeys.detail(id)`) keep their
 * data. We also seed the detail cache with the newly-created workspace so
 * navigating to it after create has zero-latency.
 */
export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWorkspaceInput) => workspacesApi.create(input),

    onSuccess: (created: Workspace) => {
      queryClient.setQueryData(workspaceKeys.detail(created.id), created);
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}
