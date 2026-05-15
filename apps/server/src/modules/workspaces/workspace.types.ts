/**
 * Workspace Module Types
 * 
 * TypeScript interfaces and types for the workspace module
 */

export enum WorkspaceRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export interface IWorkspaceMember {
  userId: string;
  role: WorkspaceRole;
  joinedAt: Date;
}

export interface IWorkspace {
  _id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: IWorkspaceMember[];
  createdAt: Date;
  updatedAt: Date;
}

// DTOs
export interface CreateWorkspaceDTO {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceDTO {
  name?: string;
  description?: string;
}

export interface AddMemberDTO {
  userId: string;
  role?: WorkspaceRole;
}

export interface UpdateMemberRoleDTO {
  role: WorkspaceRole;
}

// Response types
export interface WorkspaceResponse {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: {
    userId: string;
    role: WorkspaceRole;
    joinedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMemberResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: WorkspaceRole;
  joinedAt: Date;
}
