import { Request, Response, NextFunction } from 'express';
import { WorkspaceService } from './workspace.service';
import { ResponseUtil } from '@core/response';
import { asyncHandler } from '@middlewares/asyncHandler';
import {
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
  AddMemberDTO,
  UpdateMemberRoleDTO,
} from './workspace.types';

/**
 * Workspace Controller
 * 
 * Handles HTTP requests for workspace endpoints
 * Delegates business logic to WorkspaceService
 */

export class WorkspaceController {
  /**
   * Create a new workspace
   * POST /api/workspaces
   */
  static createWorkspace = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      const data: CreateWorkspaceDTO = req.body;

      const workspace = await WorkspaceService.createWorkspace(userId, data);

      return ResponseUtil.created(
        res,
        'Workspace created successfully',
        workspace
      );
    }
  );

  /**
   * Get all workspaces for current user
   * GET /api/workspaces
   */
  static getUserWorkspaces = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const result = await WorkspaceService.getUserWorkspaces(
        userId,
        page,
        limit
      );

      return ResponseUtil.success(
        res,
        'Workspaces retrieved successfully',
        result.items,
        200,
        result.meta
      );
    }
  );

  /**
   * Get current user's role and permissions in workspace
   * GET /api/workspaces/:id/me
   */
  static getWorkspaceMe = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      const { id } = req.params;

      const me = await WorkspaceService.getWorkspaceMe(id, userId);

      return ResponseUtil.success(
        res,
        'Workspace context retrieved successfully',
        me
      );
    }
  );

  /**
   * Get workspace by ID
   * GET /api/workspaces/:id
   */
  static getWorkspaceById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      const { id } = req.params;

      const workspace = await WorkspaceService.getWorkspaceById(id, userId);

      return ResponseUtil.success(
        res,
        'Workspace retrieved successfully',
        workspace
      );
    }
  );

  /**
   * Update workspace
   * PATCH /api/workspaces/:id
   */
  static updateWorkspace = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      const { id } = req.params;
      const data: UpdateWorkspaceDTO = req.body;

      const workspace = await WorkspaceService.updateWorkspace(
        id,
        userId,
        data
      );

      return ResponseUtil.success(
        res,
        'Workspace updated successfully',
        workspace
      );
    }
  );

  /**
   * Delete workspace
   * DELETE /api/workspaces/:id
   */
  static deleteWorkspace = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      const { id } = req.params;

      await WorkspaceService.deleteWorkspace(id, userId);

      return ResponseUtil.success(res, 'Workspace deleted successfully');
    }
  );

  /**
   * Add member to workspace
   * POST /api/workspaces/:id/members
   */
  static addMember = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      const { id } = req.params;
      const data: AddMemberDTO = req.body;

      const workspace = await WorkspaceService.addMember(id, userId, data);

      return ResponseUtil.success(
        res,
        'Member added successfully',
        workspace
      );
    }
  );

  /**
   * Remove member from workspace
   * DELETE /api/workspaces/:id/members/:userId
   */
  static removeMember = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const requesterId = req.user!.id;
      const { id, userId } = req.params;

      const workspace = await WorkspaceService.removeMember(
        id,
        requesterId,
        userId
      );

      return ResponseUtil.success(
        res,
        'Member removed successfully',
        workspace
      );
    }
  );

  /**
   * Update member role
   * PATCH /api/workspaces/:id/members/:userId
   */
  static updateMemberRole = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const requesterId = req.user!.id;
      const { id, userId } = req.params;
      const data: UpdateMemberRoleDTO = req.body;

      const workspace = await WorkspaceService.updateMemberRole(
        id,
        requesterId,
        userId,
        data
      );

      return ResponseUtil.success(
        res,
        'Member role updated successfully',
        workspace
      );
    }
  );

  /**
   * Get workspace members
   * GET /api/workspaces/:id/members
   */
  static getWorkspaceMembers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;
      const { id } = req.params;

      const members = await WorkspaceService.getWorkspaceMembers(id, userId);

      return ResponseUtil.success(
        res,
        'Workspace members retrieved successfully',
        members
      );
    }
  );
}
