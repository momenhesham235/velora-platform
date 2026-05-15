import { z } from 'zod';
import { TaskStatus } from './task.model';

export const taskValidation = {
  create: z.object({
    params: z.object({ workspaceId: z.string().min(1) }),
    body: z.object({
      projectId: z.string().min(1),
      title: z.string().min(1).max(500).trim(),
      description: z.string().max(5000).trim().optional(),
      assigneeId: z.string().optional(),
      status: z.nativeEnum(TaskStatus).optional(),
    }),
  }),
  update: z.object({
    params: z.object({
      workspaceId: z.string().min(1),
      id: z.string().min(1),
    }),
    body: z.object({
      title: z.string().min(1).max(500).trim().optional(),
      description: z.string().max(5000).trim().optional(),
      status: z.nativeEnum(TaskStatus).optional(),
      assigneeId: z.string().optional(),
    }),
  }),
  getById: z.object({
    params: z.object({
      workspaceId: z.string().min(1),
      id: z.string().min(1),
    }),
  }),
  list: z.object({
    params: z.object({ workspaceId: z.string().min(1) }),
    query: z.object({
      projectId: z.string().optional(),
      page: z.coerce.number().int().min(1).optional().default(1),
      limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    }),
  }),
  delete: z.object({
    params: z.object({
      workspaceId: z.string().min(1),
      id: z.string().min(1),
    }),
  }),
};
