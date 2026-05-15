import { http } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { normalizeEntity, normalizeEntities } from '@/shared/utils/serialize';
import type {
  Project,
  CreateProjectDTO,
  UpdateProjectDTO,
} from '@velora/types';

type ProjectDoc = Project & { _id?: string };

export const projectsApi = {
  list: async (workspaceId: string): Promise<Project[]> => {
    const raw = await http.get<ProjectDoc[]>(
      API_ENDPOINTS.WORKSPACES.PROJECTS(workspaceId)
    );
    return normalizeEntities(raw) as unknown as Project[];
  },

  getById: async (workspaceId: string, projectId: string): Promise<Project> => {
    const raw = await http.get<ProjectDoc>(
      API_ENDPOINTS.WORKSPACES.PROJECT_BY_ID(workspaceId, projectId)
    );
    return normalizeEntity(raw) as unknown as Project;
  },

  create: async (
    workspaceId: string,
    data: CreateProjectDTO
  ): Promise<Project> => {
    const raw = await http.post<ProjectDoc, CreateProjectDTO>(
      API_ENDPOINTS.WORKSPACES.PROJECTS(workspaceId),
      data
    );
    return normalizeEntity(raw) as unknown as Project;
  },

  update: async (
    workspaceId: string,
    projectId: string,
    data: UpdateProjectDTO
  ): Promise<Project> => {
    const raw = await http.patch<ProjectDoc, UpdateProjectDTO>(
      API_ENDPOINTS.WORKSPACES.PROJECT_BY_ID(workspaceId, projectId),
      data
    );
    return normalizeEntity(raw) as unknown as Project;
  },

  delete: (workspaceId: string, projectId: string): Promise<void> =>
    http.delete<void>(
      API_ENDPOINTS.WORKSPACES.PROJECT_BY_ID(workspaceId, projectId)
    ),
};
