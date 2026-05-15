/**
 * Wire-level shapes for the workspaces feature.
 *
 * IMPORTANT: these must match the server DTO in @velora/types (when published)
 * or `apps/server/src/modules/workspaces/workspaces.types.ts`. The agreed
 * convention is: Mongo ObjectIds are serialized to `string`, never raw.
 *
 * Form input shapes (CreateWorkspaceInput / UpdateWorkspaceInput) come from
 * the Zod schemas in `./schemas` — keep them out of this file so the runtime
 * schema stays the single source of truth.
 */

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  userId: string;
  workspaceId: string;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

/** Paginated list envelope (independent from the outer ApiResponse). */
export interface WorkspaceListResult {
  items: Workspace[];
  total: number;
  page: number;
  limit: number;
}
