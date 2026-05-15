import { useQuery } from '@tanstack/react-query';
import { projectKeys } from '@/services/api/query-keys';
import { projectsApi } from '../api/projects.api';

export function useProjects(workspaceId: string | null) {
  return useQuery({
    queryKey: projectKeys.list({ workspaceId: workspaceId ?? undefined }),
    queryFn: () => projectsApi.list(workspaceId!),
    enabled: !!workspaceId,
  });
}
