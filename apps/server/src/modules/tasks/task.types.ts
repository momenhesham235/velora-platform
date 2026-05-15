import { TaskStatus } from './task.model';

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
