/**
 * RBAC Permission Definitions
 * 
 * Defines the permission model for workspace-based access control
 */

import { Permission, RolePermissions } from '@velora/types';
import { WorkspaceRole } from '@velora/types';

/**
 * Role-Permission Mapping
 * 
 * Defines which permissions each workspace role has
 * Follows the principle of least privilege
 */
export const ROLE_PERMISSIONS: RolePermissions = {
  [WorkspaceRole.OWNER]: [
    // Full access to everything
    Permission.WORKSPACE_VIEW,
    Permission.WORKSPACE_UPDATE,
    Permission.WORKSPACE_DELETE,
    Permission.WORKSPACE_MANAGE_MEMBERS,
    
    Permission.PROJECT_VIEW,
    Permission.PROJECT_CREATE,
    Permission.PROJECT_UPDATE,
    Permission.PROJECT_DELETE,
    
    Permission.TASK_VIEW,
    Permission.TASK_CREATE,
    Permission.TASK_UPDATE,
    Permission.TASK_DELETE,
    Permission.TASK_ASSIGN,
    
    Permission.MEMBER_VIEW,
    Permission.MEMBER_INVITE,
    Permission.MEMBER_REMOVE,
    Permission.MEMBER_UPDATE_ROLE,
  ],
  
  [WorkspaceRole.ADMIN]: [
    // Management access (cannot delete workspace or change owner)
    Permission.WORKSPACE_VIEW,
    Permission.WORKSPACE_UPDATE,
    Permission.WORKSPACE_MANAGE_MEMBERS,
    
    Permission.PROJECT_VIEW,
    Permission.PROJECT_CREATE,
    Permission.PROJECT_UPDATE,
    Permission.PROJECT_DELETE,
    
    Permission.TASK_VIEW,
    Permission.TASK_CREATE,
    Permission.TASK_UPDATE,
    Permission.TASK_DELETE,
    Permission.TASK_ASSIGN,
    
    Permission.MEMBER_VIEW,
    Permission.MEMBER_INVITE,
    Permission.MEMBER_REMOVE,
  ],
  
  [WorkspaceRole.MEMBER]: [
    // Contributor access
    Permission.WORKSPACE_VIEW,
    
    Permission.PROJECT_VIEW,
    Permission.PROJECT_CREATE,
    
    Permission.TASK_VIEW,
    Permission.TASK_CREATE,
    Permission.TASK_UPDATE,
    
    Permission.MEMBER_VIEW,
  ],
  
  [WorkspaceRole.VIEWER]: [
    // Read-only access
    Permission.WORKSPACE_VIEW,
    Permission.PROJECT_VIEW,
    Permission.TASK_VIEW,
    Permission.MEMBER_VIEW,
  ],
};

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(
  role: WorkspaceRole,
  permission: Permission
): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: WorkspaceRole): Permission[] {
  return ROLE_PERMISSIONS[role];
}

/**
 * Check if a role can perform an action on another role
 * (e.g., for member management)
 */
export function canManageRole(
  actorRole: WorkspaceRole,
  targetRole: WorkspaceRole
): boolean {
  const roleHierarchy = {
    [WorkspaceRole.OWNER]: 4,
    [WorkspaceRole.ADMIN]: 3,
    [WorkspaceRole.MEMBER]: 2,
    [WorkspaceRole.VIEWER]: 1,
  };
  
  return roleHierarchy[actorRole] > roleHierarchy[targetRole];
}
