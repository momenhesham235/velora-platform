/**
 * Wire-level shapes for the workspaces feature.
 *
 * IMPORTANT: these must match the server DTO in @velora/types (when published)
 * or `apps/server/src/modules/workspaces/workspace.types.ts`. The agreed
 * convention is: Mongo ObjectIds are serialized to `string`, never raw.
 *
 * Form input shapes (CreateWorkspaceInput / UpdateWorkspaceInput) come from
 * the Zod schemas in `./schemas` — keep them out of this file so the runtime
 * schema stays the single source of truth.
 */

export enum WorkspaceRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export interface WorkspaceMember {
  userId: string;
  role: WorkspaceRole;
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
  role: WorkspaceRole;
  joinedAt: string;
}

// DTOs
export interface CreateWorkspaceInput {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
}

export interface AddMemberInput {
  userId: string;
  role?: WorkspaceRole;
}

export interface UpdateMemberRoleInput {
  role: WorkspaceRole;
}
