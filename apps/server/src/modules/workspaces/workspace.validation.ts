import { z } from 'zod';
import { WorkspaceRole } from '@velora/types';

const assignableMemberRoles = [
  WorkspaceRole.ADMIN,
  WorkspaceRole.MEMBER,
  WorkspaceRole.VIEWER,
] as const;

/**
 * Workspace Validation Schemas
 * 
 * Zod schemas for validating workspace requests
 */

export const workspaceValidation = {
  /**
   * Create workspace validation
   */
  create: z.object({
    body: z.object({
      name: z
        .string({ required_error: 'Workspace name is required' })
        .min(2, 'Workspace name must be at least 2 characters')
        .max(100, 'Workspace name cannot exceed 100 characters')
        .trim(),
      description: z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .trim()
        .optional(),
    }),
  }),

  /**
   * Update workspace validation
   */
  update: z.object({
    params: z.object({
      id: z.string({ required_error: 'Workspace ID is required' }),
    }),
    body: z.object({
      name: z
        .string()
        .min(2, 'Workspace name must be at least 2 characters')
        .max(100, 'Workspace name cannot exceed 100 characters')
        .trim()
        .optional(),
      description: z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .trim()
        .optional(),
    }),
  }),

  /**
   * Get workspace by ID validation
   */
  getById: z.object({
    params: z.object({
      id: z.string({ required_error: 'Workspace ID is required' }),
    }),
  }),

  /**
   * Delete workspace validation
   */
  delete: z.object({
    params: z.object({
      id: z.string({ required_error: 'Workspace ID is required' }),
    }),
  }),

  /**
   * Add member validation
   */
  addMember: z.object({
    params: z.object({
      id: z.string({ required_error: 'Workspace ID is required' }),
    }),
    body: z.object({
      userId: z.string({ required_error: 'User ID is required' }),
      role: z
        .enum(assignableMemberRoles, {
          errorMap: () => ({
            message: 'Role must be admin, member, or viewer',
          }),
        })
        .optional()
        .default(WorkspaceRole.MEMBER),
    }),
  }),

  /**
   * Remove member validation
   */
  removeMember: z.object({
    params: z.object({
      id: z.string({ required_error: 'Workspace ID is required' }),
      userId: z.string({ required_error: 'User ID is required' }),
    }),
  }),

  /**
   * Update member role validation
   */
  updateMemberRole: z.object({
    params: z.object({
      id: z.string({ required_error: 'Workspace ID is required' }),
      userId: z.string({ required_error: 'User ID is required' }),
    }),
    body: z.object({
      role: z.enum(assignableMemberRoles, {
        errorMap: () => ({
          message: 'Role must be admin, member, or viewer',
        }),
      }),
    }),
  }),

  /**
   * List workspaces with pagination
   */
  list: z.object({
    query: z.object({
      page: z.coerce.number().int().min(1).optional().default(1),
      limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    }),
  }),
};
