import { Workspace, IWorkspaceDocument } from './workspace.model';
import { User } from '@modules/auth/auth.model';
import {
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
  AddMemberDTO,
  UpdateMemberRoleDTO,
  WorkspaceMemberResponse,
} from './workspace.types';
import { WorkspaceRole } from '@velora/types';
import { ApiError } from '@core/ApiError';
import { logger } from '@core/logger';
import { RBACService } from '@core/rbac/rbac.service';
import { getRolePermissions, canManageRole } from '@core/rbac/permissions';
import { invalidateWorkspaceMembership } from '@infrastructure/cache/membership-cache';
import { PaginatedResponse } from '@velora/types';
import { AuditService } from '@modules/audit/audit.service';
import { AuditAction } from '@modules/audit/audit.model';
import { NotificationService } from '@modules/notifications/notification.service';

export class WorkspaceService {
  static async createWorkspace(
    userId: string,
    data: CreateWorkspaceDTO
  ): Promise<IWorkspaceDocument> {
    const workspace = await Workspace.create({
      name: data.name,
      description: data.description,
      ownerId: userId,
      members: [
        {
          userId,
          role: WorkspaceRole.OWNER,
          joinedAt: new Date(),
        },
      ],
    });

    await AuditService.log({
      workspaceId: workspace._id.toString(),
      actorId: userId,
      action: AuditAction.WORKSPACE_CREATED,
      resourceType: 'workspace',
      resourceId: workspace._id.toString(),
    });

    logger.info(`Workspace created: ${workspace.name} by user ${userId}`);
    return workspace;
  }

  static async getUserWorkspaces(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<IWorkspaceDocument>> {
    const skip = (page - 1) * limit;
    const filter = { 'members.userId': userId };

    const [items, total] = await Promise.all([
      Workspace.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      Workspace.countDocuments(filter),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async getWorkspaceById(
    workspaceId: string,
    userId: string
  ): Promise<IWorkspaceDocument> {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    const isMember = workspace.members.some((m) => m.userId === userId);
    if (!isMember) {
      throw ApiError.forbidden('You do not have access to this workspace');
    }

    return workspace;
  }

  static async getWorkspaceMe(workspaceId: string, userId: string) {
    const role = await RBACService.getUserWorkspaceRole(workspaceId, userId);

    if (!role) {
      throw ApiError.forbidden('You are not a member of this workspace');
    }

    return {
      workspaceId,
      userId,
      role,
      permissions: getRolePermissions(role),
    };
  }

  static async updateWorkspace(
    workspaceId: string,
    _userId: string,
    data: UpdateWorkspaceDTO
  ): Promise<IWorkspaceDocument> {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    if (data.name !== undefined) workspace.name = data.name;
    if (data.description !== undefined) workspace.description = data.description;

    await workspace.save();

    await AuditService.log({
      workspaceId,
      actorId: _userId,
      action: AuditAction.WORKSPACE_UPDATED,
      resourceType: 'workspace',
      resourceId: workspaceId,
    });

    logger.info(`Workspace updated: ${workspace.name}`);
    return workspace;
  }

  static async deleteWorkspace(
    workspaceId: string,
    userId: string
  ): Promise<void> {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    if (workspace.ownerId !== userId) {
      throw ApiError.forbidden('Only workspace owner can delete workspace');
    }

    await AuditService.log({
      workspaceId,
      actorId: userId,
      action: AuditAction.WORKSPACE_DELETED,
      resourceType: 'workspace',
      resourceId: workspaceId,
    });

    await Workspace.findByIdAndDelete(workspaceId);
    invalidateWorkspaceMembership(workspaceId);
    logger.info(`Workspace deleted: ${workspace.name} by user ${userId}`);
  }

  static async addMember(
    workspaceId: string,
    requesterId: string,
    data: AddMemberDTO
  ): Promise<IWorkspaceDocument> {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    const requesterRole = await RBACService.getUserWorkspaceRole(
      workspaceId,
      requesterId
    );
    if (!requesterRole) {
      throw ApiError.forbidden('You are not a member of this workspace');
    }

    const targetRole = data.role || WorkspaceRole.MEMBER;
    if (targetRole === WorkspaceRole.OWNER) {
      throw ApiError.badRequest('Cannot assign owner role via invite');
    }

    if (!canManageRole(requesterRole, targetRole)) {
      throw ApiError.forbidden(
        'You cannot assign a role equal to or higher than your own'
      );
    }

    const userExists = await User.findById(data.userId);
    if (!userExists) {
      throw ApiError.notFound('User not found');
    }

    const existingMember = workspace.members.find(
      (m) => m.userId === data.userId
    );
    if (existingMember) {
      throw ApiError.conflict('User is already a member of this workspace');
    }

    workspace.members.push({
      userId: data.userId,
      role: targetRole,
      joinedAt: new Date(),
    });

    await workspace.save();
    invalidateWorkspaceMembership(workspaceId);

    await AuditService.log({
      workspaceId,
      actorId: requesterId,
      action: AuditAction.MEMBER_ADDED,
      resourceType: 'member',
      resourceId: data.userId,
      metadata: { role: targetRole },
    });

    await NotificationService.create({
      userId: data.userId,
      workspaceId,
      title: 'Workspace invitation',
      message: `You were added to workspace "${workspace.name}"`,
      type: 'workspace.invite',
    });

    logger.info(
      `Member added to workspace ${workspace.name}: ${data.userId} by ${requesterId}`
    );

    return workspace;
  }

  static async removeMember(
    workspaceId: string,
    _requesterId: string,
    userIdToRemove: string
  ): Promise<IWorkspaceDocument> {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    if (workspace.ownerId === userIdToRemove) {
      throw ApiError.badRequest('Cannot remove workspace owner');
    }

    const memberIndex = workspace.members.findIndex(
      (m) => m.userId === userIdToRemove
    );
    if (memberIndex === -1) {
      throw ApiError.notFound('User is not a member of this workspace');
    }

    workspace.members.splice(memberIndex, 1);
    await workspace.save();
    invalidateWorkspaceMembership(workspaceId);

    await AuditService.log({
      workspaceId,
      actorId: _requesterId,
      action: AuditAction.MEMBER_REMOVED,
      resourceType: 'member',
      resourceId: userIdToRemove,
    });

    logger.info(
      `Member removed from workspace ${workspace.name}: ${userIdToRemove}`
    );

    return workspace;
  }

  static async updateMemberRole(
    workspaceId: string,
    requesterId: string,
    userIdToUpdate: string,
    data: UpdateMemberRoleDTO
  ): Promise<IWorkspaceDocument> {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    if (workspace.ownerId === userIdToUpdate) {
      throw ApiError.badRequest('Cannot change workspace owner role');
    }

    if (data.role === WorkspaceRole.OWNER) {
      throw ApiError.badRequest('Cannot assign owner role');
    }

    const requesterRole = await RBACService.getUserWorkspaceRole(
      workspaceId,
      requesterId
    );
    if (!requesterRole) {
      throw ApiError.forbidden('You are not a member of this workspace');
    }

    const member = workspace.members.find((m) => m.userId === userIdToUpdate);
    if (!member) {
      throw ApiError.notFound('User is not a member of this workspace');
    }

    if (!canManageRole(requesterRole, member.role)) {
      throw ApiError.forbidden('You cannot manage this member');
    }

    if (!canManageRole(requesterRole, data.role)) {
      throw ApiError.forbidden(
        'You cannot assign a role equal to or higher than your own'
      );
    }

    member.role = data.role;
    await workspace.save();
    invalidateWorkspaceMembership(workspaceId);

    await AuditService.log({
      workspaceId,
      actorId: requesterId,
      action: AuditAction.MEMBER_ROLE_UPDATED,
      resourceType: 'member',
      resourceId: userIdToUpdate,
      metadata: { role: data.role },
    });

    logger.info(
      `Member role updated in workspace ${workspace.name}: ${userIdToUpdate} to ${data.role}`
    );

    return workspace;
  }

  static async getWorkspaceMembers(
    workspaceId: string,
    userId: string
  ): Promise<WorkspaceMemberResponse[]> {
    const workspace = await this.getWorkspaceById(workspaceId, userId);

    const memberIds = workspace.members.map((m) => m.userId);
    const users = await User.find({ _id: { $in: memberIds } });

    return workspace.members.map((member) => {
      const user = users.find((u) => u._id.toString() === member.userId);
      return {
        userId: member.userId,
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        role: member.role,
        joinedAt: member.joinedAt,
      };
    });
  }
}
