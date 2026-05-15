import { z } from 'zod';
import { TaskStatus } from '@velora/types';

export const createTaskSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title is required')
    .max(500, 'Title cannot exceed 500 characters'),
  description: z
    .string()
    .trim()
    .max(5000, 'Description cannot exceed 5000 characters')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  status: z.nativeEnum(TaskStatus).optional(),
});

export type CreateTaskFormInput = z.infer<typeof createTaskSchema>;
