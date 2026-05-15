export interface ProjectListFilters {
  workspaceId?: string;
  status?: 'active' | 'archived';
  search?: string;
  page?: number;
  limit?: number;
}

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: ProjectListFilters = {}) =>
    [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};
