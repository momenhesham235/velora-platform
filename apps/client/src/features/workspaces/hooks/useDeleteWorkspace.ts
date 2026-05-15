import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workspacesApi } from '../api/workspaces.api';
import { workspaceKeys } from '@/services/api/query-keys';
import type { Workspace, WorkspaceListResult } from '../types';

interface MutationContext {
  /** Snapshot of every list-cache entry we touched, keyed by stringified queryKey. */
  snapshots: Array<{ key: readonly unknown[]; data: WorkspaceListResult }>;
}

/**
 * Delete a workspace with optimistic removal across every cached list view.
 *
 * `setQueriesData` lets us patch all `workspaceKeys.list(filters)` entries
 * regardless of filter — much cleaner than manually iterating known filter
 * combinations. On error we restore each snapshot.
 *
 * We also `removeQueries` for the detail key so any stale detail-page cache
 * is discarded — if a user later navigates back to the URL, they'll see the
 * proper 404/error path rather than a ghost from cache.
 */
export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string, MutationContext>({
    mutationFn: (id: string) => workspacesApi.delete(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: workspaceKeys.lists() });

      const snapshots: MutationContext['snapshots'] = [];

      queryClient.setQueriesData<WorkspaceListResult>(
        { queryKey: workspaceKeys.lists() },
        (current, query) => {
          if (!current) return current;
          snapshots.push({ key: query.queryKey, data: current });
          return {
            ...current,
            items: current.items.filter((w: Workspace) => w.id !== id),
            total: Math.max(0, current.total - 1),
          };
        },
      );

      return { snapshots };
    },

    onError: (_err, _id, context) => {
      context?.snapshots.forEach(({ key, data }) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSettled: (_data, _err, id) => {
      queryClient.removeQueries({ queryKey: workspaceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}
