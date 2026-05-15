import { http } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import type { WorkspaceListFilters } from '@/services/api/query-keys';
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from '../schemas/workspace.schema';
import type { Workspace, WorkspaceListResult } from '../types';

/**
 * Workspace HTTP surface.
 *
 * Every function returns the unwrapped `data` from the backend envelope or
 * throws an `ApiError` (handled centrally by the response interceptor). No
 * try/catch needed here — TanStack's onError will receive the ApiError.
 */
export const workspacesApi = {
  list: (filters: WorkspaceListFilters = {}) =>
    http.get<WorkspaceListResult>(API_ENDPOINTS.WORKSPACES.BASE, {
      params: filters,
    }),

  get: (id: string) =>
    http.get<Workspace>(API_ENDPOINTS.WORKSPACES.BY_ID(id)),

  create: (input: CreateWorkspaceInput) =>
    http.post<Workspace, CreateWorkspaceInput>(
      API_ENDPOINTS.WORKSPACES.BASE,
      input,
    ),

  update: (id: string, input: UpdateWorkspaceInput) =>
    http.patch<Workspace, UpdateWorkspaceInput>(
      API_ENDPOINTS.WORKSPACES.BY_ID(id),
      input,
    ),

  delete: (id: string) =>
    http.delete<void>(API_ENDPOINTS.WORKSPACES.BY_ID(id)),
};
