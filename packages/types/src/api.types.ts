/**
 * Shared API response wrappers
 */

import { PaginationMeta } from './pagination.types';

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface WorkspaceMeResponse {
  workspaceId: string;
  userId: string;
  role: string;
  permissions: string[];
}
