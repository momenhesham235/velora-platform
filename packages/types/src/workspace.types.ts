/**
 * Shared Workspace Types
 * 
 * These types MUST match between frontend and backend
 */

/**
 * Workspace Role Enum
 * Defines the hierarchy of roles within a workspace
 */
export enum WorkspaceRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

/**
 * Workspace Member
 * Represents a user's membership in a workspace
 */
export interface WorkspaceMember {
  userId: string;
  role: WorkspaceRole;
  joinedAt: Date;
}

/**
 * Workspace Entity
 */
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: WorkspaceMember[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create Workspace DTO
 */
export interface CreateWorkspaceDTO {
  name: string;
  description?: string;
}

/**
 * Update Workspace DTO
 */
export interface UpdateWorkspaceDTO {
  name?: string;
  description?: string;
}

/**
 * Add Member DTO
 */
export interface AddMemberDTO {
  userId: string;
  role?: WorkspaceRole;
}

/**
 * Update Member Role DTO
 */
export interface UpdateMemberRoleDTO {
  role: WorkspaceRole;
}

/**
 * Workspace Response
 */
export interface WorkspaceResponse {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: WorkspaceMember[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Workspace Member Response (with user details)
 */
export interface WorkspaceMemberResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: WorkspaceRole;
  joinedAt: Date;
}
