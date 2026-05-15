export interface TaskListFilters {
  projectId?: string;
  workspaceId?: string;
  assigneeId?: string;
  status?: 'todo' | 'in_progress' | 'done' | 'blocked';
  search?: string;
  page?: number;
  limit?: number;
}

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TaskListFilters = {}) =>
    [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  /** Comments on a specific task. */
  comments: (taskId: string) => [...taskKeys.detail(taskId), 'comments'] as const,
};
