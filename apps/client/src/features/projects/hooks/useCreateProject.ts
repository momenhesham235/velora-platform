import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectKeys } from '@/services/api/query-keys';
import { projectsApi } from '../api/projects.api';
import type { CreateProjectDTO } from '@velora/types';

export function useCreateProject(workspaceId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectDTO) =>
      projectsApi.create(workspaceId!, data),
    onSuccess: () => {
      if (workspaceId) {
        queryClient.invalidateQueries({
          queryKey: projectKeys.list({ workspaceId }),
        });
      }
    },
  });
}
