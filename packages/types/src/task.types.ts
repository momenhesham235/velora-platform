/**
 * Shared task types
 */

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export interface CreateTaskDTO {
  projectId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  status?: TaskStatus;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assigneeId?: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
