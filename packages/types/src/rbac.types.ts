/**
 * Shared RBAC Types
 * 
 * Role-Based Access Control types shared between frontend and backend
 */

import { WorkspaceRole } from './workspace.types';

/**
 * Permission Actions
 * Defines all possible actions in the system
 */
export enum Permission {
  // Workspace permissions
  WORKSPACE_VIEW = 'workspace:view',
  WORKSPACE_UPDATE = 'workspace:update',
  WORKSPACE_DELETE = 'workspace:delete',
  WORKSPACE_MANAGE_MEMBERS = 'workspace:manage_members',
  
  // Project permissions
  PROJECT_VIEW = 'project:view',
  PROJECT_CREATE = 'project:create',
  PROJECT_UPDATE = 'project:update',
  PROJECT_DELETE = 'project:delete',
  
  // Task permissions
  TASK_VIEW = 'task:view',
  TASK_CREATE = 'task:create',
  TASK_UPDATE = 'task:update',
  TASK_DELETE = 'task:delete',
  TASK_ASSIGN = 'task:assign',
  
  // Member permissions
  MEMBER_VIEW = 'member:view',
  MEMBER_INVITE = 'member:invite',
  MEMBER_REMOVE = 'member:remove',
  MEMBER_UPDATE_ROLE = 'member:update_role',
}

/**
 * Role Permission Map
 * Defines which permissions each role has
 */
export type RolePermissions = {
  [key in WorkspaceRole]: Permission[];
};

/**
 * Permission Check Result
 */
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Workspace Context
 * Contains user's role and workspace information for permission checks
 */
export interface WorkspaceContext {
  workspaceId: string;
  userId: string;
  userRole: WorkspaceRole;
}
