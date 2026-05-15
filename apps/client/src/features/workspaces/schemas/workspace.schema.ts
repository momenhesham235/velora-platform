import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z
    .string({ required_error: 'Workspace name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export const updateWorkspaceSchema = createWorkspaceSchema.partial();

export type CreateWorkspaceFormInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceFormInput = z.infer<typeof updateWorkspaceSchema>;
