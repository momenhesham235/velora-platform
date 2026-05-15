import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskKeys } from '@/services/api/query-keys';
import { tasksApi } from '../api/tasks.api';

export function useDeleteTask(workspaceId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => tasksApi.delete(workspaceId!, taskId),
    onSuccess: () => {
      if (workspaceId) {
        queryClient.invalidateQueries({
          queryKey: taskKeys.lists(),
        });
      }
    },
  });
}
