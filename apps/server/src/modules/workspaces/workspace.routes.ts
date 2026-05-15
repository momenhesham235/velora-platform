import { Router } from 'express';
import { WorkspaceController } from './workspace.controller';
import { workspaceValidation } from './workspace.validation';
import { validate } from '@middlewares/validate.middleware';
import { authenticate } from '@middlewares/auth.middleware';

/**
 * Workspace Routes
 * 
 * Defines all workspace-related endpoints
 */

const router = Router();

// All workspace routes require authentication
router.use(authenticate);

/**
 * @openapi
 * /api/workspaces:
 *   post:
 *     tags:
 *       - Workspaces
 *     summary: Create a new workspace
 *     description: Create a new workspace. The authenticated user becomes the owner.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: My Workspace
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: A workspace for my team
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Workspace created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Workspace'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  validate(workspaceValidation.create),
  WorkspaceController.createWorkspace
);

/**
 * @openapi
 * /api/workspaces:
 *   get:
 *     tags:
 *       - Workspaces
 *     summary: Get all user workspaces
 *     description: Retrieve all workspaces where the authenticated user is a member.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Workspaces retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Workspaces retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Workspace'
 *       401:
 *         description: Unauthorized
 */
router.get('/', WorkspaceController.getUserWorkspaces);

/**
 * @openapi
 * /api/workspaces/{id}:
 *   get:
 *     tags:
 *       - Workspaces
 *     summary: Get workspace by ID
 *     description: Retrieve a specific workspace by ID. User must be a member.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workspace ID
 *     responses:
 *       200:
 *         description: Workspace retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Workspace retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Workspace'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a member
 *       404:
 *         description: Workspace not found
 */
router.get(
  '/:id',
  validate(workspaceValidation.getById),
  WorkspaceController.getWorkspaceById
);

/**
 * @openapi
 * /api/workspaces/{id}:
 *   patch:
 *     tags:
 *       - Workspaces
 *     summary: Update workspace
 *     description: Update workspace details. Only owners and admins can update.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workspace ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Updated Workspace Name
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Workspace updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not owner or admin
 *       404:
 *         description: Workspace not found
 */
router.patch(
  '/:id',
  validate(workspaceValidation.update),
  WorkspaceController.updateWorkspace
);

/**
 * @openapi
 * /api/workspaces/{id}:
 *   delete:
 *     tags:
 *       - Workspaces
 *     summary: Delete workspace
 *     description: Delete a workspace. Only the owner can delete.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workspace ID
 *     responses:
 *       200:
 *         description: Workspace deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not owner
 *       404:
 *         description: Workspace not found
 */
router.delete(
  '/:id',
  validate(workspaceValidation.delete),
  WorkspaceController.deleteWorkspace
);

/**
 * @openapi
 * /api/workspaces/{id}/members:
 *   get:
 *     tags:
 *       - Workspaces
 *     summary: Get workspace members
 *     description: Retrieve all members of a workspace with their details.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workspace ID
 *     responses:
 *       200:
 *         description: Members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Workspace members retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WorkspaceMember'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a member
 *       404:
 *         description: Workspace not found
 */
router.get(
  '/:id/members',
  validate(workspaceValidation.getById),
  WorkspaceController.getWorkspaceMembers
);

/**
 * @openapi
 * /api/workspaces/{id}/members:
 *   post:
 *     tags:
 *       - Workspaces
 *     summary: Add member to workspace
 *     description: Add a new member to the workspace. Only owners and admins can add members.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workspace ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               role:
 *                 type: string
 *                 enum: [owner, admin, member]
 *                 default: member
 *                 example: member
 *     responses:
 *       200:
 *         description: Member added successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not owner or admin
 *       404:
 *         description: Workspace or user not found
 *       409:
 *         description: User already a member
 */
router.post(
  '/:id/members',
  validate(workspaceValidation.addMember),
  WorkspaceController.addMember
);

/**
 * @openapi
 * /api/workspaces/{id}/members/{userId}:
 *   delete:
 *     tags:
 *       - Workspaces
 *     summary: Remove member from workspace
 *     description: Remove a member from the workspace. Only owners and admins can remove members. Cannot remove owner.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workspace ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to remove
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       400:
 *         description: Cannot remove owner
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not owner or admin
 *       404:
 *         description: Workspace or member not found
 */
router.delete(
  '/:id/members/:userId',
  validate(workspaceValidation.removeMember),
  WorkspaceController.removeMember
);

/**
 * @openapi
 * /api/workspaces/{id}/members/{userId}:
 *   patch:
 *     tags:
 *       - Workspaces
 *     summary: Update member role
 *     description: Change a member's role in the workspace. Only the owner can change roles. Cannot change owner's role.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workspace ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [owner, admin, member]
 *                 example: admin
 *     responses:
 *       200:
 *         description: Member role updated successfully
 *       400:
 *         description: Cannot change owner role
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not owner
 *       404:
 *         description: Workspace or member not found
 */
router.patch(
  '/:id/members/:userId',
  validate(workspaceValidation.updateMemberRole),
  WorkspaceController.updateMemberRole
);

export default router;
