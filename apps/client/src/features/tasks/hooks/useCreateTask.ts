import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskKeys } from '@/services/api/query-keys';
import { tasksApi } from '../api/tasks.api';
import type { CreateTaskDTO } from '@velora/types';

export function useCreateTask(workspaceId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDTO) => tasksApi.create(workspaceId!, data),
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
