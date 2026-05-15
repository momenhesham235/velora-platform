import { http } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import type {
  Workspace,
  WorkspaceMemberDetail,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  AddMemberInput,
  UpdateMemberRoleInput,
} from '../types';

/**
 * Workspaces feature API.
 *
 * Each call returns the unwrapped `data` payload, or throws ApiError.
 */
export const workspacesApi = {
  /**
   * Create a new workspace
   */
  createWorkspace: (data: CreateWorkspaceInput): Promise<Workspace> =>
    http.post<Workspace, CreateWorkspaceInput>(
      API_ENDPOINTS.WORKSPACES.BASE,
      data
    ),

  /**
   * Get all workspaces for current user
   */
  getUserWorkspaces: (): Promise<Workspace[]> =>
    http.get<Workspace[]>(API_ENDPOINTS.WORKSPACES.BASE),

  /**
   * Get workspace by ID
   */
  getWorkspaceById: (id: string): Promise<Workspace> =>
    http.get<Workspace>(API_ENDPOINTS.WORKSPACES.BY_ID(id)),

  /**
   * Update workspace
   */
  updateWorkspace: (
    id: string,
    data: UpdateWorkspaceInput
  ): Promise<Workspace> =>
    http.patch<Workspace, UpdateWorkspaceInput>(
      API_ENDPOINTS.WORKSPACES.BY_ID(id),
      data
    ),

  /**
   * Delete workspace
   */
  deleteWorkspace: (id: string): Promise<void> =>
    http.delete<void>(API_ENDPOINTS.WORKSPACES.BY_ID(id)),

  /**
   * Get workspace members
   */
  getWorkspaceMembers: (workspaceId: string): Promise<WorkspaceMemberDetail[]> =>
    http.get<WorkspaceMemberDetail[]>(
      API_ENDPOINTS.WORKSPACES.MEMBERS(workspaceId)
    ),

  /**
   * Add member to workspace
   */
  addMember: (workspaceId: string, data: AddMemberInput): Promise<Workspace> =>
    http.post<Workspace, AddMemberInput>(
      API_ENDPOINTS.WORKSPACES.MEMBERS(workspaceId),
      data
    ),

  /**
   * Remove member from workspace
   */
  removeMember: (workspaceId: string, userId: string): Promise<Workspace> =>
    http.delete<Workspace>(
      API_ENDPOINTS.WORKSPACES.MEMBER_BY_ID(workspaceId, userId)
    ),

  /**
   * Update member role
   */
  updateMemberRole: (
    workspaceId: string,
    userId: string,
    data: UpdateMemberRoleInput
  ): Promise<Workspace> =>
    http.patch<Workspace, UpdateMemberRoleInput>(
      API_ENDPOINTS.WORKSPACES.MEMBER_BY_ID(workspaceId, userId),
      data
    ),
};
