import { Permission } from '@velora/types';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/services/api/client';
import { workspaceKeys } from '@/services/api/query-keys/workspace.keys';
import type { WorkspaceMeResponse } from '@velora/types';

async function fetchWorkspaceMe(
  workspaceId: string
): Promise<WorkspaceMeResponse> {
  return http.get<WorkspaceMeResponse>(`/workspaces/${workspaceId}/me`);
}

export function useWorkspacePermissions(workspaceId: string | null) {
  return useQuery({
    queryKey: workspaceKeys.me(workspaceId ?? ''),
    queryFn: () => fetchWorkspaceMe(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 60_000,
  });
}

export function usePermission(
  workspaceId: string | null,
  permission: Permission
): boolean {
  const { data } = useWorkspacePermissions(workspaceId);
  return data?.permissions.includes(permission) ?? false;
}
