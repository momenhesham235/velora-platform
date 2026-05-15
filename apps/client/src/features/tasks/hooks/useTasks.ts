import { useQuery } from '@tanstack/react-query';
import { taskKeys } from '@/services/api/query-keys';
import { tasksApi, type TaskListParams } from '../api/tasks.api';

export function useTasks(
  workspaceId: string | null,
  filters?: Omit<TaskListParams, 'page' | 'limit'>
) {
  return useQuery({
    queryKey: taskKeys.list({
      workspaceId: workspaceId ?? undefined,
      projectId: filters?.projectId,
    }),
    queryFn: () => tasksApi.list(workspaceId!, filters),
    enabled: !!workspaceId,
  });
}
