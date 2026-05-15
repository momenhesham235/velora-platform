/**
 * RBAC Middleware
 * 
 * Express middleware for workspace-scoped permission checking
 */

import { Request, Response, NextFunction } from 'express';
import { Permission, WorkspaceRole } from '@velora/types';
import { RBACService } from './rbac.service';
import { ApiError } from '@core/ApiError';

/**
 * Extract workspace ID from request
 * Checks params (workspaceId, id), body, and query in that order
 */
function extractWorkspaceId(req: Request): string | null {
  return (
    req.params.workspaceId ||
    req.params.id ||  // Support :id parameter for workspace routes
    req.body.workspaceId ||
    req.query.workspaceId as string ||
    null
  );
}

/**
 * Middleware to require specific permission in workspace
 * 
 * Usage: requirePermission(Permission.PROJECT_CREATE)
 */
export function requirePermission(permission: Permission) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const workspaceId = extractWorkspaceId(req);
      if (!workspaceId) {
        throw ApiError.badRequest('Workspace ID is required');
      }

      await RBACService.requirePermission(
        workspaceId,
        req.user.id,
        permission
      );

      // Attach workspace context to request for later use
      req.workspaceContext = await RBACService.getWorkspaceContext(
        workspaceId,
        req.user.id
      );

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware to require any of the specified permissions
 * 
 * Usage: requireAnyPermission([Permission.PROJECT_UPDATE, Permission.PROJECT_DELETE])
 */
export function requireAnyPermission(permissions: Permission[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const workspaceId = extractWorkspaceId(req);
      if (!workspaceId) {
        throw ApiError.badRequest('Workspace ID is required');
      }

      await RBACService.requireAnyPermission(
        workspaceId,
        req.user.id,
        permissions
      );

      req.workspaceContext = await RBACService.getWorkspaceContext(
        workspaceId,
        req.user.id
      );

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware to require all of the specified permissions
 * 
 * Usage: requireAllPermissions([Permission.PROJECT_UPDATE, Permission.TASK_ASSIGN])
 */
export function requireAllPermissions(permissions: Permission[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const workspaceId = extractWorkspaceId(req);
      if (!workspaceId) {
        throw ApiError.badRequest('Workspace ID is required');
      }

      await RBACService.requireAllPermissions(
        workspaceId,
        req.user.id,
        permissions
      );

      req.workspaceContext = await RBACService.getWorkspaceContext(
        workspaceId,
        req.user.id
      );

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware to require specific workspace role
 * 
 * Usage: requireWorkspaceRole(WorkspaceRole.ADMIN)
 */
export function requireWorkspaceRole(role: WorkspaceRole) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const workspaceId = extractWorkspaceId(req);
      if (!workspaceId) {
        throw ApiError.badRequest('Workspace ID is required');
      }

      await RBACService.requireRole(workspaceId, req.user.id, role);

      req.workspaceContext = await RBACService.getWorkspaceContext(
        workspaceId,
        req.user.id
      );

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware to require any of the specified workspace roles
 * 
 * Usage: requireAnyWorkspaceRole([WorkspaceRole.OWNER, WorkspaceRole.ADMIN])
 */
export function requireAnyWorkspaceRole(roles: WorkspaceRole[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const workspaceId = extractWorkspaceId(req);
      if (!workspaceId) {
        throw ApiError.badRequest('Workspace ID is required');
      }

      await RBACService.requireAnyRole(workspaceId, req.user.id, roles);

      req.workspaceContext = await RBACService.getWorkspaceContext(
        workspaceId,
        req.user.id
      );

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware to ensure user is a workspace member
 * Attaches workspace context to request
 * 
 * Usage: requireWorkspaceMember()
 */
export function requireWorkspaceMember() {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const workspaceId = extractWorkspaceId(req);
      if (!workspaceId) {
        throw ApiError.badRequest('Workspace ID is required');
      }

      req.workspaceContext = await RBACService.getWorkspaceContext(
        workspaceId,
        req.user.id
      );

      next();
    } catch (error) {
      next(error);
    }
  };
}
