export interface WorkspaceListFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export const workspaceKeys = {
  all: ['workspaces'] as const,
  lists: () => [...workspaceKeys.all, 'list'] as const,
  list: (filters: WorkspaceListFilters = {}) =>
    [...workspaceKeys.lists(), filters] as const,
  details: () => [...workspaceKeys.all, 'detail'] as const,
  detail: (id: string) => [...workspaceKeys.details(), id] as const,
  /** Members of a specific workspace — invalidates separately from the workspace itself. */
  members: (workspaceId: string) =>
    [...workspaceKeys.detail(workspaceId), 'members'] as const,
};
