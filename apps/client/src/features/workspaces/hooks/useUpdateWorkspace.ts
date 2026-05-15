import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workspacesApi } from '../api/workspaces.api';
import { workspaceKeys } from '@/services/api/query-keys';
import type { UpdateWorkspaceInput } from '../schemas/workspace.schema';
import type { Workspace } from '../types';

interface Variables {
  id: string;
  input: UpdateWorkspaceInput;
}

interface MutationContext {
  previousDetail: Workspace | undefined;
}

/**
 * Update a workspace with optimistic UI.
 *
 * The pattern, in three beats:
 *  1. `onMutate`  — cancel in-flight refetches for the affected detail key
 *                   (else they'd race with the optimistic value), snapshot the
 *                   current cached detail, then write the optimistic copy.
 *  2. `onError`   — restore the snapshot. Toast/error surfacing is the
 *                   caller's job (`mutation.error` is an ApiError).
 *  3. `onSettled` — invalidate detail + lists so server truth replaces the
 *                   optimistic copy regardless of outcome.
 *
 * Note: list-view optimism is intentionally NOT done here. Doing it correctly
 * means patching every cached `workspaceKeys.list(filters)` shape, which is
 * surface area for bugs vs. the win of "list shows the new name 200ms early".
 * If we later add it, encapsulate it behind `queryClient.setQueriesData`.
 */
export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation<Workspace, unknown, Variables, MutationContext>({
    mutationFn: ({ id, input }) => workspacesApi.update(id, input),

    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: workspaceKeys.detail(id) });

      const previousDetail = queryClient.getQueryData<Workspace>(
        workspaceKeys.detail(id),
      );

      if (previousDetail) {
        queryClient.setQueryData<Workspace>(workspaceKeys.detail(id), {
          ...previousDetail,
          ...input,
        });
      }

      return { previousDetail };
    },

    onError: (_err, { id }, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(
          workspaceKeys.detail(id),
          context.previousDetail,
        );
      }
    },

    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}
