import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceKeys } from '@/services/api/query-keys';
import { workspacesApi } from '../api/workspaces.api';
import type { AddMemberInput, UpdateMemberRoleInput } from '../types';

/**
 * Get workspace members.
 */
export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: workspaceKeys.members(workspaceId),
    queryFn: () => workspacesApi.getWorkspaceMembers(workspaceId),
    enabled: !!workspaceId,
  });
}

/**
 * Add a member to workspace.
 */
export function useAddMember(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddMemberInput) =>
      workspacesApi.addMember(workspaceId, data),
    onSuccess: () => {
      // Invalidate members and workspace detail
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.members(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.detail(workspaceId),
      });
    },
  });
}

/**
 * Remove a member from workspace.
 */
export function useRemoveMember(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      workspacesApi.removeMember(workspaceId, userId),
    onSuccess: () => {
      // Invalidate members and workspace detail
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.members(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.detail(workspaceId),
      });
    },
  });
}

/**
 * Update member role.
 */
export function useUpdateMemberRole(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateMemberRoleInput }) =>
      workspacesApi.updateMemberRole(workspaceId, userId, data),
    onSuccess: () => {
      // Invalidate members and workspace detail
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.members(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.detail(workspaceId),
      });
    },
  });
}
