import { z } from 'zod';

/**
 * Workspace schemas — runtime validation + the source of truth for
 * `CreateWorkspaceInput` / `UpdateWorkspaceInput`. Forms use `zodResolver`
 * with these directly; types are inferred via `z.infer<typeof ...>`.
 *
 * Keep field constraints aligned with backend Zod schemas — when the server
 * tightens validation, copy the rule here so the form errors before a wasted
 * round-trip.
 */

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createWorkspaceSchema = z.object({
  name: z
    .string({ required_error: 'Workspace name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),

  /** Optional — server generates a slug from `name` when omitted. */
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug cannot exceed 50 characters')
    .regex(SLUG_PATTERN, 'Use lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('').transform(() => undefined)),

  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

/** All fields optional — PATCH semantics. */
export const updateWorkspaceSchema = createWorkspaceSchema.partial();

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
