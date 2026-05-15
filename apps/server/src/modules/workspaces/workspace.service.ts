import { Workspace, IWorkspaceDocument } from './workspace.model';
import { User } from '@modules/auth/auth.model';
import {
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
  AddMemberDTO,
  UpdateMemberRoleDTO,
  WorkspaceRole,
  WorkspaceMemberResponse,
} from './workspace.types';
import { ApiError } from '@core/ApiError';
import { logger } from '@core/logger';

/**
 * Workspace Service
 *
 * Contains all business logic for workspace operations
 */

export class WorkspaceService {
  /**
   * Create a new workspace
   */
  static async createWorkspace(
    userId: string,
    data: CreateWorkspaceDTO
  ): Promise<IWorkspaceDocument> {
    const { name, description } = data;

    // Create workspace with owner
    const workspace = await Workspace.create({
      name,
      description,
      ownerId: userId,
      members: [
        {
          userId,
          role: WorkspaceRole.OWNER,
          joinedAt: new Date(),
        },
      ],
    });

    logger.info(`Workspace created: ${workspace.name} by user ${userId}`);

    return workspace;
  }

  /**
   * Get all workspaces for a user
   */
  static async getUserWorkspaces(userId: string): Promise<IWorkspaceDocument[]> {
    const workspaces = await Workspace.find({
      'members.userId': userId,
    }).sort({ updatedAt: -1 });

    return workspaces;
  }

  /**
   * Get workspace by ID
   */
  static async getWorkspaceById(
    workspaceId: string,
    userId: string
  ): Promise<IWorkspaceDocument> {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    // Check if user is a member
    const isMember = workspace.members.some(
      (member) => member.userId === userId
    );

    if (!isMember) {
      throw ApiError.forbidden('You do not have access to this workspace');
    }

    return workspace;
  }

  /**
   * Update workspace
   */
  static async updateWorkspace(
    workspaceId: string,
    userId: string,
    data: UpdateWorkspaceDTO
  ): Promise<IWorkspaceDocument> {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    // Check if user is owner or admin
    const member = workspace.members.find((m) => m.userId === userId);
    if (
      !member ||
      (member.role !== WorkspaceRole.OWNER && member.role !== WorkspaceRole.ADMIN)
    ) {
      throw ApiError.forbidden(
        'Only workspace owners and admins can update workspace'
      );
    }

    // Update fields
    if (data.name !== undefined) {
      workspace.name = data.name;
    }
    if (data.description !== undefined) {
      workspace.description = data.description;
    }

    await workspace.save();

    logger.info(`Workspace updated: ${workspace.name} by user ${userId}`);

    return workspace;
  }

  /**
   * Delete workspace
   */
  static async deleteWorkspace(
    workspaceId: string,
    userId: string
  ): Promise<void> {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    // Only owner can delete workspace
    if (workspace.ownerId !== userId) {
      throw ApiError.forbidden('Only workspace owner can delete workspace');
    }

    await Workspace.findByIdAndDelete(workspaceId);

    logger.info(`Workspace deleted: ${workspace.name} by user ${userId}`);
  }

  /**
   * Add member to workspace
   */
  static async addMember(
    workspaceId: string,
    requesterId: string,
    data: AddMemberDTO
  ): Promise<IWorkspaceDocument> {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    // Check if requester is owner or admin
    const requester = workspace.members.find((m) => m.userId === requesterId);
    if (
      !requester ||
      (requester.role !== WorkspaceRole.OWNER &&
        requester.role !== WorkspaceRole.ADMIN)
    ) {
      throw ApiError.forbidden(
        'Only workspace owners and admins can add members'
      );
    }

    // Check if user exists
    const userExists = await User.findById(data.userId);
    if (!userExists) {
      throw ApiError.notFound('User not found');
    }

    // Check if user is already a member
    const existingMember = workspace.members.find(
      (m) => m.userId === data.userId
    );
    if (existingMember) {
      throw ApiError.conflict('User is already a member of this workspace');
    }

    // Add member
    workspace.members.push({
      userId: data.userId,
      role: data.role || WorkspaceRole.MEMBER,
      joinedAt: new Date(),
    });

    await workspace.save();

    logger.info(
      `Member added to workspace ${workspace.name}: ${data.userId} by ${requesterId}`
    );

    return workspace;
  }

  /**
   * Remove member from workspace
   */
  static async removeMember(
    workspaceId: string,
    requesterId: string,
    userIdToRemove: string
  ): Promise<IWorkspaceDocument> {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    // Cannot remove owner
    if (workspace.ownerId === userIdToRemove) {
      throw ApiError.badRequest('Cannot remove workspace owner');
    }

    // Check if requester is owner or admin
    const requester = workspace.members.find((m) => m.userId === requesterId);
    if (
      !requester ||
      (requester.role !== WorkspaceRole.OWNER &&
        requester.role !== WorkspaceRole.ADMIN)
    ) {
      throw ApiError.forbidden(
        'Only workspace owners and admins can remove members'
      );
    }

    // Check if user is a member
    const memberIndex = workspace.members.findIndex(
      (m) => m.userId === userIdToRemove
    );
    if (memberIndex === -1) {
      throw ApiError.notFound('User is not a member of this workspace');
    }

    // Remove member
    workspace.members.splice(memberIndex, 1);
    await workspace.save();

    logger.info(
      `Member removed from workspace ${workspace.name}: ${userIdToRemove} by ${requesterId}`
    );

    return workspace;
  }

  /**
   * Update member role
   */
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

    // Cannot change owner role
    if (workspace.ownerId === userIdToUpdate) {
      throw ApiError.badRequest('Cannot change workspace owner role');
    }

    // Only owner can change roles
    if (workspace.ownerId !== requesterId) {
      throw ApiError.forbidden('Only workspace owner can change member roles');
    }

    // Find member
    const member = workspace.members.find((m) => m.userId === userIdToUpdate);
    if (!member) {
      throw ApiError.notFound('User is not a member of this workspace');
    }

    // Update role
    member.role = data.role;
    await workspace.save();

    logger.info(
      `Member role updated in workspace ${workspace.name}: ${userIdToUpdate} to ${data.role} by ${requesterId}`
    );

    return workspace;
  }

  /**
   * Get workspace members with user details
   */
  static async getWorkspaceMembers(
    workspaceId: string,
    userId: string
  ): Promise<WorkspaceMemberResponse[]> {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw ApiError.notFound('Workspace not found');
    }

    // Check if user is a member
    const isMember = workspace.members.some((m) => m.userId === userId);
    if (!isMember) {
      throw ApiError.forbidden('You do not have access to this workspace');
    }

    // Get user details for all members
    const memberIds = workspace.members.map((m) => m.userId);
    const users = await User.find({ _id: { $in: memberIds } });

    // Map members with user details
    const membersWithDetails: WorkspaceMemberResponse[] = workspace.members.map(
      (member) => {
        const user = users.find((u) => u._id.toString() === member.userId);
        return {
          userId: member.userId,
          email: user?.email || '',
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          role: member.role,
          joinedAt: member.joinedAt,
        };
      }
    );

    return membersWithDetails;
  }

  /**
   * Check if user has specific role in workspace
   */
  static async checkUserRole(
    workspaceId: string,
    userId: string,
    requiredRoles: WorkspaceRole[]
  ): Promise<boolean> {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return false;
    }

    const member = workspace.members.find((m) => m.userId === userId);
    if (!member) {
      return false;
    }

    return requiredRoles.includes(member.role);
  }
}
