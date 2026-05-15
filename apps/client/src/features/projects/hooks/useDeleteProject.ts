import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectKeys } from '@/services/api/query-keys';
import { projectsApi } from '../api/projects.api';

export function useDeleteProject(workspaceId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) =>
      projectsApi.delete(workspaceId!, projectId),
    onSuccess: () => {
      if (workspaceId) {
        queryClient.invalidateQueries({
          queryKey: projectKeys.list({ workspaceId }),
        });
      }
    },
  });
}
