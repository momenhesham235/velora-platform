/**
 * Workspace types — shared enums/DTOs from @velora/types with JSON-serialized dates.
 */
import type {
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
  AddMemberDTO,
  UpdateMemberRoleDTO,
} from '@velora/types';

export {
  WorkspaceRole,
  Permission,
} from '@velora/types';

export type { WorkspaceMeResponse } from '@velora/types';

export interface WorkspaceMember {
  userId: string;
  role: import('@velora/types').WorkspaceRole;
  joinedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: WorkspaceMember[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMemberDetail {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: import('@velora/types').WorkspaceRole;
  joinedAt: string;
}

export type CreateWorkspaceInput = CreateWorkspaceDTO;
export type UpdateWorkspaceInput = UpdateWorkspaceDTO;
export type AddMemberInput = AddMemberDTO;
export type UpdateMemberRoleInput = UpdateMemberRoleDTO;
