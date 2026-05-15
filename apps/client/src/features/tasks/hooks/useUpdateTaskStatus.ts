import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskKeys } from '@/services/api/query-keys';
import { tasksApi } from '../api/tasks.api';
import type { TaskStatus } from '@velora/types';

export function useUpdateTaskStatus(workspaceId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      status,
    }: {
      taskId: string;
      status: TaskStatus;
      projectId: string;
    }) => tasksApi.update(workspaceId!, taskId, { status }),
    onSuccess: (_task, variables) => {
      if (workspaceId) {
        queryClient.invalidateQueries({
          queryKey: taskKeys.list({
            workspaceId,
            projectId: variables.projectId,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: taskKeys.list({ workspaceId }),
        });
      }
    },
  });
}
