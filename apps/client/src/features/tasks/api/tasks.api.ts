import { http } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { normalizeEntity, normalizeEntities } from '@/shared/utils/serialize';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '@velora/types';

type TaskDoc = Task & { _id?: string };

export interface TaskListParams {
  projectId?: string;
  page?: number;
  limit?: number;
}

export const tasksApi = {
  list: async (
    workspaceId: string,
    params?: TaskListParams
  ): Promise<Task[]> => {
    const raw = await http.get<TaskDoc[]>(
      API_ENDPOINTS.WORKSPACES.TASKS(workspaceId),
      { params }
    );
    return normalizeEntities(raw) as unknown as Task[];
  },

  getById: async (workspaceId: string, taskId: string): Promise<Task> => {
    const raw = await http.get<TaskDoc>(
      API_ENDPOINTS.WORKSPACES.TASK_BY_ID(workspaceId, taskId)
    );
    return normalizeEntity(raw) as unknown as Task;
  },

  create: async (workspaceId: string, data: CreateTaskDTO): Promise<Task> => {
    const raw = await http.post<TaskDoc, CreateTaskDTO>(
      API_ENDPOINTS.WORKSPACES.TASKS(workspaceId),
      data
    );
    return normalizeEntity(raw) as unknown as Task;
  },

  update: async (
    workspaceId: string,
    taskId: string,
    data: UpdateTaskDTO
  ): Promise<Task> => {
    const raw = await http.patch<TaskDoc, UpdateTaskDTO>(
      API_ENDPOINTS.WORKSPACES.TASK_BY_ID(workspaceId, taskId),
      data
    );
    return normalizeEntity(raw) as unknown as Task;
  },

  delete: (workspaceId: string, taskId: string): Promise<void> =>
    http.delete<void>(API_ENDPOINTS.WORKSPACES.TASK_BY_ID(workspaceId, taskId)),
};
