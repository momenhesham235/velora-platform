/**
 * RBAC Service
 * 
 * Core service for permission checking and workspace role resolution
 */

import { Workspace } from '@modules/workspaces/workspace.model';
import { WorkspaceRole, Permission, WorkspaceContext } from '@velora/types';
import { roleHasPermission, canManageRole } from './permissions';
import { ApiError } from '@core/ApiError';
import { logger } from '@core/logger';
import {
  getCachedRole,
  setCachedRole,
} from '@infrastructure/cache/membership-cache';

export class RBACService {
  /**
   * Get user's role in a workspace
   * Returns null if user is not a member
   */
  static async getUserWorkspaceRole(
    workspaceId: string,
    userId: string
  ): Promise<WorkspaceRole | null> {
    const cached = getCachedRole(workspaceId, userId);
    if (cached !== undefined) {
      return cached;
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      setCachedRole(workspaceId, userId, null);
      return null;
    }

    const member = workspace.members.find((m) => m.userId === userId);
    const role = member ? member.role : null;
    setCachedRole(workspaceId, userId, role);
    return role;
  }

  /**
   * Get workspace context for a user
   * Throws error if user is not a member
   */
  static async getWorkspaceContext(
    workspaceId: string,
    userId: string
  ): Promise<WorkspaceContext> {
    const role = await this.getUserWorkspaceRole(workspaceId, userId);
    
    if (!role) {
      throw ApiError.forbidden('You are not a member of this workspace');
    }
    
    return {
      workspaceId,
      userId,
      userRole: role,
    };
  }

  /**
   * Check if user has a specific permission in a workspace
   */
  static async hasPermission(
    workspaceId: string,
    userId: string,
    permission: Permission
  ): Promise<boolean> {
    try {
      const role = await this.getUserWorkspaceRole(workspaceId, userId);
      
      if (!role) {
        return false;
      }
      
      return roleHasPermission(role, permission);
    } catch (error) {
      logger.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Check if user has any of the specified permissions
   */
  static async hasAnyPermission(
    workspaceId: string,
    userId: string,
    permissions: Permission[]
  ): Promise<boolean> {
    try {
      const role = await this.getUserWorkspaceRole(workspaceId, userId);
      
      if (!role) {
        return false;
      }
      
      return permissions.some((permission) =>
        roleHasPermission(role, permission)
      );
    } catch (error) {
      logger.error('Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Check if user has all of the specified permissions
   */
  static async hasAllPermissions(
    workspaceId: string,
    userId: string,
    permissions: Permission[]
  ): Promise<boolean> {
    try {
      const role = await this.getUserWorkspaceRole(workspaceId, userId);
      
      if (!role) {
        return false;
      }
      
      return permissions.every((permission) =>
        roleHasPermission(role, permission)
      );
    } catch (error) {
      logger.error('Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Require permission - throws error if user doesn't have it
   */
  static async requirePermission(
    workspaceId: string,
    userId: string,
    permission: Permission
  ): Promise<void> {
    const hasPermission = await this.hasPermission(
      workspaceId,
      userId,
      permission
    );
    
    if (!hasPermission) {
      throw ApiError.forbidden(
        `You do not have permission to perform this action (${permission})`
      );
    }
  }

  /**
   * Require any of the specified permissions
   */
  static async requireAnyPermission(
    workspaceId: string,
    userId: string,
    permissions: Permission[]
  ): Promise<void> {
    const hasPermission = await this.hasAnyPermission(
      workspaceId,
      userId,
      permissions
    );
    
    if (!hasPermission) {
      throw ApiError.forbidden(
        'You do not have permission to perform this action'
      );
    }
  }

  /**
   * Require all of the specified permissions
   */
  static async requireAllPermissions(
    workspaceId: string,
    userId: string,
    permissions: Permission[]
  ): Promise<void> {
    const hasPermission = await this.hasAllPermissions(
      workspaceId,
      userId,
      permissions
    );
    
    if (!hasPermission) {
      throw ApiError.forbidden(
        'You do not have all required permissions to perform this action'
      );
    }
  }

  /**
   * Check if user can manage another user's role
   */
  static async canManageMember(
    workspaceId: string,
    actorUserId: string,
    targetUserId: string
  ): Promise<boolean> {
    const actorRole = await this.getUserWorkspaceRole(workspaceId, actorUserId);
    const targetRole = await this.getUserWorkspaceRole(workspaceId, targetUserId);
    
    if (!actorRole || !targetRole) {
      return false;
    }
    
    return canManageRole(actorRole, targetRole);
  }

  /**
   * Require ability to manage a member
   */
  static async requireCanManageMember(
    workspaceId: string,
    actorUserId: string,
    targetUserId: string
  ): Promise<void> {
    const canManage = await this.canManageMember(
      workspaceId,
      actorUserId,
      targetUserId
    );
    
    if (!canManage) {
      throw ApiError.forbidden(
        'You do not have permission to manage this member'
      );
    }
  }

  /**
   * Check if user has a specific role in workspace
   */
  static async hasRole(
    workspaceId: string,
    userId: string,
    role: WorkspaceRole
  ): Promise<boolean> {
    const userRole = await this.getUserWorkspaceRole(workspaceId, userId);
    return userRole === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  static async hasAnyRole(
    workspaceId: string,
    userId: string,
    roles: WorkspaceRole[]
  ): Promise<boolean> {
    const userRole = await this.getUserWorkspaceRole(workspaceId, userId);
    return userRole ? roles.includes(userRole) : false;
  }

  /**
   * Require specific role
   */
  static async requireRole(
    workspaceId: string,
    userId: string,
    role: WorkspaceRole
  ): Promise<void> {
    const hasRole = await this.hasRole(workspaceId, userId, role);
    
    if (!hasRole) {
      throw ApiError.forbidden(
        `This action requires ${role} role in the workspace`
      );
    }
  }

  /**
   * Require any of the specified roles
   */
  static async requireAnyRole(
    workspaceId: string,
    userId: string,
    roles: WorkspaceRole[]
  ): Promise<void> {
    const hasRole = await this.hasAnyRole(workspaceId, userId, roles);
    
    if (!hasRole) {
      throw ApiError.forbidden(
        `This action requires one of the following roles: ${roles.join(', ')}`
      );
    }
  }
}
