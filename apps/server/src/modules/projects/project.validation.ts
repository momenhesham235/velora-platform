import { z } from 'zod';

export const projectValidation = {
  create: z.object({
    params: z.object({ workspaceId: z.string().min(1) }),
    body: z.object({
      name: z.string().min(2).max(200).trim(),
      description: z.string().max(2000).trim().optional(),
    }),
  }),
  update: z.object({
    params: z.object({
      workspaceId: z.string().min(1),
      id: z.string().min(1),
    }),
    body: z.object({
      name: z.string().min(2).max(200).trim().optional(),
      description: z.string().max(2000).trim().optional(),
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
